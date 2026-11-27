"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  UploadCloud,
  X,
  Sparkles,
  Calendar,
  User,
  Music,
  FileText,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  ShieldCheck,
  Send,
} from "lucide-react";

interface UploadedMedia {
  id?: string;
  url: string;
  key?: string;
  caption?: string;
  type: "image" | "video" | "audio";
  bytes?: number;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

export default function PersonalizePage({
  params,
}: {
  params?: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();

  let idFromProps = "";
  if (params) {
    if (typeof (params as any).then === "function") {
      const resolved = use(params as Promise<{ id: string }>);
      if (resolved && resolved.id) idFromProps = resolved.id;
    } else if (typeof params === "object" && (params as any).id) {
      idFromProps = (params as any).id;
    }
  }

  const orderId =
    idFromProps ||
    (typeof routeParams?.id === "string"
      ? routeParams.id
      : Array.isArray(routeParams?.id)
      ? routeParams.id[0]
      : "") ||
    "";

  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [step, setStep] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [occasionDate, setOccasionDate] = useState("");
  const [relationshipStartDate, setRelationshipStartDate] = useState("");
  const [yearsTogether, setYearsTogether] = useState<number | "">("");
  const [letter, setLetter] = useState("");
  const [audioTrackUrl, setAudioTrackUrl] = useState("");
  const [mediaItems, setMediaItems] = useState<UploadedMedia[]>([]);

  // Apology-specific promises
  const [promises, setPromises] = useState<Array<{ title: string; description: string }>>([
    { title: "Better Communication", description: "I promise to actively listen without getting defensive." },
    { title: "More Quality Time", description: "I promise to put away distractions and give you my full attention." },
  ]);

  // Autosave State
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 1. Fetch Order Data & Current Draft
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/orders/${orderId}/personalize?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load order details");
        }

        const o = data.order;
        setOrderData(o);

        // Prepopulate with existing draft or customer names
        const p = o.personalization || {};
        setRecipientName(p.recipientName || o.customer?.name || "");
        setSenderName(p.senderName || "");
        setPartner1Name(p.partner1Name || p.recipientName || "");
        setPartner2Name(p.partner2Name || p.senderName || "");
        setOccasionDate(p.occasionDate || "");
        setRelationshipStartDate(p.relationshipStartDate || "");
        setYearsTogether(p.yearsTogether !== undefined ? p.yearsTogether : "");
        setLetter(p.letter || "");
        setAudioTrackUrl(p.audioTrackUrl || "");

        if (Array.isArray(p.promises) && p.promises.length > 0) {
          setPromises(p.promises);
        }

        // Combine mediaAssets and personalization.mediaItems
        const existingMedia = p.mediaItems || [];
        setMediaItems(existingMedia);

        if (o.orderStatus === "in_review" || o.orderStatus === "completed") {
          setSubmitted(true);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (orderId && token) {
      loadData();
    } else {
      setError("Order access token is missing. Please use the link sent to your email or order page.");
      setLoading(false);
    }
  }, [orderId, token]);

  // 2. Draft Save Function
  const saveDraft = useCallback(
    async (silent = false) => {
      if (!orderId || !token || submitted) return;

      try {
        if (!silent) setSaveStatus("saving");

        const payload = {
          action: "draft",
          token,
          personalization: {
            recipientName,
            senderName,
            partner1Name,
            partner2Name,
            occasionDate,
            relationshipStartDate,
            yearsTogether: yearsTogether === "" ? undefined : Number(yearsTogether),
            letter,
            promises,
            audioTrackUrl,
            mediaItems: mediaItems.filter((m) => !m.uploading && m.url),
          },
        };

        const res = await fetch(`/api/orders/${orderId}/personalize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setSaveStatus("saved");
          setLastSaved(new Date());
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [
      orderId,
      token,
      submitted,
      recipientName,
      senderName,
      partner1Name,
      partner2Name,
      occasionDate,
      relationshipStartDate,
      yearsTogether,
      letter,
      promises,
      audioTrackUrl,
      mediaItems,
    ]
  );

  // 3. Debounced Autosave (1500ms after user types)
  useEffect(() => {
    if (loading || submitted) return;

    setSaveStatus("idle");
    const timer = setTimeout(() => {
      saveDraft(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    recipientName,
    senderName,
    partner1Name,
    partner2Name,
    occasionDate,
    relationshipStartDate,
    yearsTogether,
    letter,
    promises,
    audioTrackUrl,
    saveDraft,
    loading,
    submitted,
  ]);

  // 4. File Upload Handler (Direct to Cloudflare R2 via Presigned PUT)
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const isAudio = file.type.startsWith("audio/");
      const isVideo = file.type.startsWith("video/");
      const mediaType: "image" | "video" | "audio" = isAudio ? "audio" : isVideo ? "video" : "image";

      // Temporary local preview item
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const localPreviewUrl = URL.createObjectURL(file);

      const newMedia: UploadedMedia = {
        id: tempId,
        url: localPreviewUrl,
        type: mediaType,
        caption: "",
        bytes: file.size,
        uploading: true,
        progress: 10,
      };

      setMediaItems((prev) => [...prev, newMedia]);

      try {
        // Step A: Request Presigned URL from Server
        const presignRes = await fetch("/api/media/r2-presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            accessToken: token,
            filename: file.name,
            contentType: file.type || (isAudio ? "audio/mpeg" : "image/jpeg"),
            fileSize: file.size,
          }),
        });

        const presignData = await presignRes.json();
        if (!presignRes.ok) {
          throw new Error(presignData.error || "Failed to initiate upload");
        }

        // Step B: Direct PUT upload to Cloudflare R2 with progress
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignData.uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              setMediaItems((prev) =>
                prev.map((m) => (m.id === tempId ? { ...m, progress: percent } : m))
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`R2 upload rejected with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload to R2"));
          xhr.send(file);
        });

        // Step C: Record asset in MongoDB Atlas
        const recordRes = await fetch(`/api/orders/${orderId}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            key: presignData.key,
            url: presignData.publicUrl,
            mediaType,
            bytes: file.size,
            caption: "",
          }),
        });

        const recordData = await recordRes.json();
        if (!recordRes.ok) {
          throw new Error(recordData.error || "Failed to register media asset");
        }

        // Update with permanent URL and remove uploading flag
        setMediaItems((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  id: recordData.asset?.id || tempId,
                  url: presignData.publicUrl,
                  key: presignData.key,
                  uploading: false,
                  progress: 100,
                }
              : m
          )
        );

        if (isAudio) {
          setAudioTrackUrl(presignData.publicUrl);
        }
      } catch (err: any) {
        setMediaItems((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...m, uploading: false, error: err.message || "Upload failed" }
              : m
          )
        );
      }
    }
  };

  // 5. Remove Uploaded Media
  const handleRemoveMedia = async (media: UploadedMedia) => {
    if (!confirm("Are you sure you want to remove this photo?")) return;

    setMediaItems((prev) => prev.filter((m) => m.id !== media.id && m.url !== media.url));

    try {
      await fetch(`/api/orders/${orderId}/media`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          key: media.key,
          assetId: media.id,
        }),
      });
    } catch (e) {
      console.warn("Failed to delete media asset:", e);
    }
  };

  // 6. Final Submission
  const handleSubmitFinal = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        action: "submit",
        token,
        personalization: {
          recipientName,
          senderName,
          partner1Name,
          partner2Name,
          occasionDate,
          relationshipStartDate,
          yearsTogether: yearsTogether === "" ? undefined : Number(yearsTogether),
          letter,
          promises,
          audioTrackUrl,
          mediaItems: mediaItems.filter((m) => !m.uploading && m.url),
        },
      };

      const res = await fetch(`/api/orders/${orderId}/personalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check required fields.");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50/40 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto" />
          <p className="font-serif text-lg text-rose-950">Opening Personalization Portal...</p>
        </div>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="min-h-screen bg-rose-50/40 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-rose-950">Unable to Open Portal</h2>
          <p className="text-sm text-stone-600">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 text-white font-medium text-xs hover:bg-rose-600 transition-colors"
          >
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const occasion = orderData?.occasionType || "apology";
  const isAnnivOrLove = occasion === "anniversary" || occasion === "love";

  return (
    <div className="min-h-screen bg-rose-50/30 text-stone-900 font-sans pb-24">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/order/${orderId}?token=${encodeURIComponent(token)}`}
            className="p-2 rounded-full hover:bg-rose-50 text-rose-700 transition-colors"
            title="Back to Order Tracker"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-rose-950">
                ExpertoMemories
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold uppercase">
                {occasion}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 block">
              Order #{orderData?.orderNumber} &bull; {orderData?.productTitle}
            </span>
          </div>
        </div>

        {/* Autosave Status Indicator */}
        <div className="flex items-center gap-3 text-xs">
          {!submitted && (
            <div className="hidden sm:flex items-center gap-1.5 font-medium">
              {saveStatus === "saving" && (
                <span className="text-amber-600 flex items-center gap-1">
                  <Loader2 size={13} className="animate-spin" /> Saving draft...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Draft Saved
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} /> Save failed
                </span>
              )}
              {saveStatus === "idle" && lastSaved && (
                <span className="text-stone-400 text-[11px]">
                  Saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}

          {!submitted && (
            <button
              type="button"
              onClick={() => saveDraft(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              Save Now
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Success Screen if Submitted */}
        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-300/40">
              <Sparkles size={36} />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-rose-950">
                Memories Received!
              </h1>
              <p className="text-stone-600 text-sm max-w-lg mx-auto mt-2">
                Thank you! Your heartfelt message, special memories, and photographs have been synced directly to your private website project.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 max-w-md mx-auto text-xs text-rose-900 space-y-1">
              <span className="font-bold flex items-center justify-center gap-1.5">
                <ShieldCheck size={16} className="text-rose-600" /> What Happens Next?
              </span>
              <p>
                Our Studio design team is polishing the animations, typography, and music. Once ready, your private shareable link will be published!
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/order/${orderId}?token=${encodeURIComponent(token)}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-300/30 transition-all"
              >
                View Live Order Status
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
              >
                Edit Information
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Wizard Progress Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/80 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-950 mb-3">
                <span className="font-mono text-rose-600 uppercase tracking-wider text-[11px]">
                  STEP {step} OF 5
                </span>
                <span>
                  {step === 1 && "Recipient & Sender Details"}
                  {step === 2 && "Heartfelt Message / Letter"}
                  {step === 3 && "Meaningful Dates"}
                  {step === 4 && "Photographs & Music"}
                  {step === 5 && "Review & Confirm"}
                </span>
              </div>
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: RECIPIENT & SENDER */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-rose-950 flex items-center gap-2">
                    <User className="text-rose-500" size={24} /> Who is this special gift for?
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    These names will be personalized across the wax seal, opening envelope, and custom headline.
                  </p>
                </div>

                {isAnnivOrLove ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-800">
                        Partner 1 Name (e.g. Your Name) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={partner1Name}
                        onChange={(e) => setPartner1Name(e.target.value)}
                        placeholder="e.g. Rohan"
                        className="w-full text-xs p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-800">
                        Partner 2 Name (e.g. Their Name) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={partner2Name}
                        onChange={(e) => setPartner2Name(e.target.value)}
                        placeholder="e.g. Aditi"
                        className="w-full text-xs p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-800">
                        Recipient Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Priya"
                        className="w-full text-xs p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-800">
                        Your Name (Sender) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Rahul"
                        className="w-full text-xs p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (isAnnivOrLove && (!partner1Name.trim() || !partner2Name.trim())) {
                        alert("Please enter both partner names.");
                        return;
                      }
                      if (!isAnnivOrLove && (!recipientName.trim() || !senderName.trim())) {
                        alert("Please enter both recipient and sender names.");
                        return;
                      }
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-rose-300/30 transition-all"
                  >
                    <span>Next: Personal Message</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: HEARTFELT MESSAGE */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-rose-950 flex items-center gap-2">
                    <FileText className="text-rose-500" size={24} /> Your Heartfelt Letter
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {occasion === "apology"
                      ? "Write an honest, sincere letter explaining your feelings. Separate paragraphs with a blank line."
                      : "Write your special message, love letter, or celebration note. Separate paragraphs with a blank line."}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    Main Letter Content <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={8}
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    placeholder="Write from your heart here..."
                    className="w-full text-xs p-4 rounded-2xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20 font-serif leading-relaxed"
                  />
                  <div className="flex justify-between text-[11px] text-stone-600">
                    <span>Paragraphs will render with elegant typewriter styling</span>
                    <span>{letter.length} characters</span>
                  </div>
                </div>

                {/* Apology Promises Section if occasion is apology */}
                {occasion === "apology" && (
                  <div className="pt-4 border-t border-rose-100 space-y-3">
                    <label className="text-xs font-bold text-rose-950 block">
                      Promises for the Future (Optional)
                    </label>
                    {promises.map((prom, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 space-y-2">
                        <input
                          type="text"
                          value={prom.title}
                          onChange={(e) => {
                            const updated = [...promises];
                            updated[idx].title = e.target.value;
                            setPromises(updated);
                          }}
                          placeholder="Promise Title (e.g. Always Listen First)"
                          className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white"
                        />
                        <textarea
                          rows={2}
                          value={prom.description}
                          onChange={(e) => {
                            const updated = [...promises];
                            updated[idx].description = e.target.value;
                            setPromises(updated);
                          }}
                          placeholder="What does this promise mean to you?"
                          className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!letter.trim()) {
                        alert("Please write a short letter before proceeding.");
                        return;
                      }
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-rose-300/30 transition-all"
                  >
                    <span>Next: Important Dates</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: MEANINGFUL DATES */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-rose-950 flex items-center gap-2">
                    <Calendar className="text-rose-500" size={24} /> Meaningful Dates
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Highlighted in the journey countdown, timelines, and celebration fireworks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800">
                      {occasion === "anniversary"
                        ? "Anniversary Date"
                        : occasion === "birthday"
                        ? "Birthday Date"
                        : "Special Occasion Date"}
                    </label>
                    <input
                      type="text"
                      value={occasionDate}
                      onChange={(e) => setOccasionDate(e.target.value)}
                      placeholder="e.g. October 14th"
                      className="w-full text-xs p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                    />
                  </div>

                  {isAnnivOrLove && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-800">
                          Relationship Start Date (Optional)
                        </label>
                        <input
                          type="text"
                          value={relationshipStartDate}
                          onChange={(e) => setRelationshipStartDate(e.target.value)}
                          placeholder="e.g. October 14, 2021"
                          className="w-full text-xs p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-800">
                          Years Together (Optional)
                        </label>
                        <input
                          type="number"
                          value={yearsTogether}
                          onChange={(e) => setYearsTogether(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g. 3"
                          min="0"
                          max="100"
                          className="w-full text-xs p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(4);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-rose-300/30 transition-all"
                  >
                    <span>Next: Photographs & Music</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PHOTOS & MEDIA (DIRECT CLOUDFLARE R2 UPLOAD) */}
            {step === 4 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-rose-950 flex items-center gap-2">
                    <UploadCloud className="text-rose-500" size={24} /> Photographs & Music
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Upload couple photos, cherished snapshots, or your favorite background song directly to our secure media vault.
                  </p>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/30 rounded-2xl p-8 text-center cursor-pointer transition-colors"
                  onClick={() => document.getElementById("file-upload-input")?.click()}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    accept="image/*,audio/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <h4 className="font-serif font-bold text-base text-rose-950">
                    Click to browse or drag & drop files
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports JPG, PNG, WebP, MP3 &bull; Max 25MB per photo
                  </p>
                </div>

                {/* Uploaded Media Gallery */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Uploaded Memories ({mediaItems.length})
                  </h4>

                  {mediaItems.length === 0 ? (
                    <p className="text-xs text-stone-600 italic">No photographs uploaded yet. Please add at least 1 photo for your scrapbook.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mediaItems.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-3 rounded-2xl bg-rose-50/30 border border-rose-100 flex flex-col justify-between space-y-2 relative group"
                        >
                          {item.type === "image" ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                              <img
                                src={item.url}
                                alt="Memory"
                                className="w-full h-full object-cover"
                              />
                              {item.uploading && (
                                <div className="absolute inset-0 bg-stone-900/60 flex flex-col items-center justify-center text-white p-2">
                                  <Loader2 size={24} className="animate-spin mb-1 text-rose-400" />
                                  <span className="text-xs font-mono">{item.progress || 0}%</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-purple-50 text-purple-900 flex items-center gap-3">
                              <Music size={24} className="text-purple-600 shrink-0" />
                              <div className="flex-1 truncate">
                                <span className="font-bold text-xs block">Audio Track</span>
                                <audio controls src={item.url} className="w-full mt-2 h-7" />
                              </div>
                            </div>
                          )}

                          {/* Caption Input */}
                          <input
                            type="text"
                            value={item.caption || ""}
                            onChange={(e) => {
                              const updated = [...mediaItems];
                              updated[idx].caption = e.target.value;
                              setMediaItems(updated);
                            }}
                            placeholder="Add a sweet caption..."
                            className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white"
                          />

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(item)}
                            className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900/70 text-white hover:bg-rose-600 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (mediaItems.length === 0) {
                        alert("Please upload at least 1 memory photograph.");
                        return;
                      }
                      setStep(5);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-rose-300/30 transition-all"
                  >
                    <span>Next: Review & Confirm</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {step === 5 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-rose-950 flex items-center gap-2">
                    <CheckCircle2 className="text-rose-500" size={24} /> Review Your Personalization
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Confirm your details below. Once submitted, our studio team will craft and polish your digital gift website.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-rose-100">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 block">Recipient</span>
                      <span className="font-bold text-stone-900 text-sm">
                        {isAnnivOrLove ? `${partner1Name} & ${partner2Name}` : recipientName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 block">Sender</span>
                      <span className="font-bold text-stone-900 text-sm">{senderName || partner1Name}</span>
                    </div>
                  </div>

                  {occasionDate && (
                    <div className="pb-3 border-b border-rose-100">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 block">Occasion Date</span>
                      <span className="font-bold text-stone-900">{occasionDate}</span>
                    </div>
                  )}

                  <div className="pb-3 border-b border-rose-100">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 block">Letter Excerpt</span>
                    <p className="text-stone-700 italic font-serif mt-1 max-h-24 overflow-y-auto">
                      &ldquo;{letter}&rdquo;
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 block">Uploaded Photographs</span>
                    <span className="font-bold text-stone-900">{mediaItems.length} photos ready</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitFinal}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-300/40 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Confirm & Submit Personalization
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
