"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Music,
  Check,
  RotateCcw,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface MediaUploaderProps {
  label: string;
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  accept?: string;
  projectSlug?: string;
  helpText?: string;
}

type UploadStatus = "idle" | "uploading" | "retrying" | "success" | "error";

const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50 MB

export function MediaUploader({
  label,
  currentUrl,
  onUploadSuccess,
  accept = "image/*",
  projectSlug,
  helpText,
}: MediaUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAudio = accept.includes("audio");

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const executeUpload = async (file: File) => {
    setLastFile(file);
    setStatus("uploading");
    setProgress(0);
    setErrorMessage(null);
    setStatusText("Preparing file...");

    // 1. Client-Side Validation
    const maxSize = isAudio ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const limitMB = isAudio ? 50 : 25;
      setStatus("error");
      setErrorMessage(`File too large. Maximum allowed size is ${limitMB}MB.`);
      return;
    }

    const contentType = file.type || (isAudio ? "audio/mpeg" : "image/jpeg");

    // Create immediate local preview for images
    if (!isAudio && file.type.startsWith("image/")) {
      const blobUrl = URL.createObjectURL(file);
      setLocalPreview(blobUrl);
    }

    let finalUploadedUrl = "";
    let directUploadSucceeded = false;

    // 2. PATH A: Direct Cloudflare R2 Presigned Upload
    try {
      setStatusText("Requesting secure upload authorization...");
      const presignRes = await fetch("/api/media/r2-presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType,
          fileSize: file.size,
          folder: projectSlug || "studio",
          projectSlug: projectSlug || undefined,
          projectId: projectSlug || undefined,
        }),
      });

      if (presignRes.ok) {
        const presignData = await presignRes.json();
        if (presignData.uploadUrl && presignData.key) {
          setStatusText("Uploading to cloud storage...");

          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", presignData.uploadUrl, true);
            xhr.setRequestHeader("Content-Type", contentType);

            xhr.upload.onprogress = (evt) => {
              if (evt.lengthComputable) {
                const percent = Math.round((evt.loaded / evt.total) * 100);
                setProgress(percent);
                setStatusText(`Uploading... ${percent}%`);
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
              } else {
                reject(new Error(`Storage rejected upload (status ${xhr.status})`));
              }
            };

            xhr.onerror = () => {
              reject(new Error("Direct upload network/CORS error"));
            };

            xhr.send(file);
          });

          // Confirm asset registration in MongoDB
          setStatusText("Finalizing asset registration...");
          const confirmRes = await fetch("/api/media/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key: presignData.key,
              projectSlug: projectSlug || "general",
              contentType,
              fileSize: file.size,
            }),
          });

          if (confirmRes.ok) {
            const confirmData = await confirmRes.json();
            finalUploadedUrl = confirmData.asset?.secureUrl || presignData.publicUrl;
            directUploadSucceeded = true;
          } else {
            // Even if confirm had an issue, use presign publicUrl
            finalUploadedUrl = presignData.publicUrl;
            directUploadSucceeded = true;
          }
        }
      }
    } catch (directErr) {
      console.warn("Direct R2 upload encountered network/CORS block. Engaging secure server fallback:", directErr);
    }

    // If direct upload succeeded, finalize and return
    if (directUploadSucceeded && finalUploadedUrl) {
      setStatus("success");
      setStatusText("Upload complete!");
      onUploadSuccess(finalUploadedUrl);
      setTimeout(() => {
        setStatus("idle");
        setStatusText("");
        setLocalPreview(null);
      }, 1500);
      return;
    }

    // 3. PATH B: Resilient Server-Side Fallback (/api/media/upload)
    try {
      setStatus("retrying");
      setStatusText("Uploading via secure server fallback...");
      setProgress(50);

      const formData = new FormData();
      formData.append("file", file);
      if (projectSlug) {
        formData.append("projectSlug", projectSlug);
      }

      const uploadRes = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadRes.status === 401) {
        setStatus("error");
        setErrorMessage("Session expired. Please log in again to upload media.");
        setLocalPreview(null);
        return;
      }

      if (uploadRes.ok && uploadData.success && (uploadData.asset?.secureUrl || uploadData.asset?.publicUrl)) {
        const resolvedUrl = uploadData.asset.secureUrl || uploadData.asset.publicUrl;
        setProgress(100);
        setStatus("success");
        setStatusText("Upload complete!");
        onUploadSuccess(resolvedUrl);
        setTimeout(() => {
          setStatus("idle");
          setStatusText("");
          setLocalPreview(null);
        }, 1500);
        return;
      } else {
        throw new Error(uploadData.error || "Server upload was unable to store the file.");
      }
    } catch (fallbackErr: any) {
      console.error("Server upload fallback failed:", fallbackErr);
      setStatus("error");
      setErrorMessage(
        fallbackErr.message && !fallbackErr.message.includes("Failed to fetch")
          ? fallbackErr.message
          : "Network unavailable. Please verify your connection and retry."
      );
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await executeUpload(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRetry = () => {
    if (lastFile) {
      executeUpload(lastFile);
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClear = () => {
    onUploadSuccess("");
    setLocalPreview(null);
    setErrorMessage(null);
    setStatus("idle");
    setLastFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Determine which image to show: active upload preview or saved URL
  const displayImage = localPreview || currentUrl;

  return (
    <div className="space-y-2">
      {/* Label & Dynamic Status Header */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-stone-700">{label}</label>

        {status === "uploading" && (
          <span className="flex items-center gap-1.5 text-[10px] text-amber-600 font-medium">
            <Loader2 size={11} className="animate-spin text-amber-500" />
            <span>{statusText || "Uploading..."}</span>
          </span>
        )}

        {status === "retrying" && (
          <span className="flex items-center gap-1.5 text-[10px] text-blue-600 font-medium">
            <RefreshCw size={11} className="animate-spin text-blue-500" />
            <span>{statusText || "Retrying via server..."}</span>
          </span>
        )}

        {status === "success" && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
            <Check size={11} />
            <span>Upload complete!</span>
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {(status === "uploading" || status === "retrying") && progress > 0 && (
        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              status === "retrying" ? "bg-blue-500" : "bg-rose-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Media Card (When currentUrl exists OR localPreview is active) */}
      {displayImage ? (
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50/80 p-2.5 flex items-center gap-3 shadow-xs">
          {isAudio ? (
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
              <Music size={20} />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-stone-200 overflow-hidden shrink-0 relative border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt="Selected media"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for broken image links
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              {status === "uploading" && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-white" />
                </div>
              )}
            </div>
          )}

          <div className="flex-1 min-w-0 pr-14">
            <p className="text-[11px] font-mono text-stone-700 truncate">
              {lastFile ? lastFile.name : displayImage}
            </p>
            {status === "uploading" || status === "retrying" ? (
              <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                <Loader2 size={9} className="animate-spin" /> {statusText}
              </p>
            ) : (
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <Check size={10} /> Ready in gift
              </p>
            )}
          </div>

          {/* Action Buttons: Replace & Remove */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
            <button
              type="button"
              disabled={status === "uploading" || status === "retrying"}
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg bg-white/90 hover:bg-stone-200 text-stone-600 transition-colors shadow-2xs disabled:opacity-50"
              title="Replace media with new file"
            >
              <RotateCcw size={12} />
            </button>

            <button
              type="button"
              disabled={status === "uploading" || status === "retrying"}
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-white/90 hover:bg-rose-100 text-stone-600 hover:text-rose-600 transition-colors shadow-2xs disabled:opacity-50"
              title="Remove media"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone Card */
        <label
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
            status === "uploading" || status === "retrying"
              ? "border-amber-300 bg-amber-50/40 cursor-not-allowed"
              : status === "error"
              ? "border-rose-300 bg-rose-50/20 hover:border-rose-400"
              : "border-stone-200 hover:border-rose-400 bg-stone-50/50 hover:bg-rose-50/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={status === "uploading" || status === "retrying"}
            className="hidden"
          />

          {status === "uploading" || status === "retrying" ? (
            <Loader2 size={22} className="animate-spin text-amber-500" />
          ) : isAudio ? (
            <Music size={22} className="text-stone-400" />
          ) : (
            <Upload size={22} className="text-stone-400" />
          )}

          <span className="text-[11px] font-semibold text-stone-700">
            {status === "uploading" || status === "retrying"
              ? statusText
              : `Click to choose ${isAudio ? "audio (MP3, WAV)" : "photo (JPEG, PNG, WebP)"}`}
          </span>

          <span className="text-[10px] text-stone-400">
            {helpText || (isAudio ? "Max 50MB audio file" : "Max 25MB high-resolution image")}
          </span>
        </label>
      )}

      {/* Hidden File Input for Replace trigger */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={status === "uploading" || status === "retrying"}
        className="hidden"
      />

      {/* Error Message & Retry Container */}
      {status === "error" && errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-2 text-rose-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle size={13} className="text-rose-500 shrink-0" />
            <p className="text-[10px] font-medium leading-tight truncate">{errorMessage}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {lastFile && (
              <button
                type="button"
                onClick={handleRetry}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
              >
                <RefreshCw size={9} />
                <span>Retry Upload</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setErrorMessage(null);
              }}
              className="text-stone-400 hover:text-stone-600 p-1"
              title="Dismiss error"
            >
              <X size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
