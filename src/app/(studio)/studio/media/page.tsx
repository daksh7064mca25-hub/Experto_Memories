"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image as ImageIcon,
  Music,
  Video,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface UploadedMediaItem {
  id: string;
  url: string;
  key?: string;
  type: "image" | "audio" | "video";
  name: string;
  size: string;
  date: string;
}

const SAMPLE_MEDIA: UploadedMediaItem[] = [
  {
    id: "media-sample-1",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    type: "image",
    name: "Coffee_date_smile.jpg",
    size: "420 KB",
    date: "Sample",
  },
  {
    id: "media-sample-2",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    type: "image",
    name: "Rainy_walk_umbrella.jpg",
    size: "380 KB",
    date: "Sample",
  },
  {
    id: "media-sample-3",
    url: "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
    type: "audio",
    name: "Gentle_piano_bg.mp3",
    size: "1.2 MB",
    date: "Sample",
  },
];

export default function MediaLibraryPage() {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>(SAMPLE_MEDIA);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/media/upload", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
          setMediaList(data.media);
        } else {
          setMediaList(SAMPLE_MEDIA);
        }
      }
    } catch (err) {
      console.error("Failed to load media assets:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchMedia();
    });
  }, [fetchMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();

        formData.append("file", file);
        formData.append("projectSlug", "general");

        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || `Upload failed (${res.status})`);
        }

        const newItem: UploadedMediaItem = {
          id: data.asset?.key || `media-${Date.now()}-${i}`,
          key: data.asset?.key,
          url: data.asset?.secureUrl || data.asset?.publicUrl,
          type: data.asset?.mediaType || "image",
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          date: "Just now",
        };

        setMediaList((prev) => [newItem, ...prev.filter((m) => !m.id.startsWith("media-sample-"))]);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload file. Please verify your connection.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const deleteMedia = async (id: string, key?: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      if (key || !id.startsWith("media-sample-")) {
        await fetch("/api/media/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, key }),
          credentials: "include",
        });
      }
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete media error:", err);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-rose-950">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-rose-800/80 mt-1">
            Upload and organize photographs, background music, and audio narration clips stored securely in Cloudflare R2.
          </p>
        </div>

        {/* Upload Trigger Button */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-full font-serif font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-400/30 transition-all hover:scale-105 active:scale-95 w-fit min-h-[44px]">
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span>{isUploading ? "Uploading to R2..." : "Upload Media"}</span>
          <input
            type="file"
            multiple
            accept="image/*,audio/*,video/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-rose-800/60">
          <Loader2 size={32} className="animate-spin text-rose-500 mb-3" />
          <p className="text-sm">Loading media assets...</p>
        </div>
      ) : (
        /* Media Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 rounded-2xl overflow-hidden border border-rose-200/80 shadow-md flex flex-col justify-between group"
            >
              {/* Visual Preview */}
              <div className="relative aspect-square w-full bg-rose-50 flex items-center justify-center overflow-hidden">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : item.type === "audio" ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                      <Music size={26} />
                    </div>
                    <audio controls src={item.url} className="w-48 h-8 mt-2" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-rose-400">
                    <Video size={36} />
                  </div>
                )}
              </div>

              {/* Media Information */}
              <div className="p-4">
                <h3 className="font-serif font-bold text-sm text-rose-950 truncate mb-0.5">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-rose-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.id, item.url)}
                    className="inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-950 font-medium"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMedia(item.id, item.key)}
                    title="Remove from library"
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
