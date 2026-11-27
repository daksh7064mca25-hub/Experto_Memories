"use client";

import React from "react";
import {
  WebsiteSectionData,
  WebsiteProjectData,
  ThemeId,
  PolaroidPhoto,
  ReasonHeart,
  PromiseCard,
  ApologyCoupon,
} from "@/types/website";
import { Plus, Trash2, Image as ImageIcon, Sparkles, Heart, Music } from "lucide-react";
import { MediaUploader } from "./MediaUploader";

interface Props {
  project: WebsiteProjectData;
  selectedSection: WebsiteSectionData | null;
  onUpdateProject: (updates: Partial<WebsiteProjectData>) => void;
  onUpdateSectionConfig: (sectionId: string, newConfig: Record<string, any>) => void;
}

export function SectionControls({
  project,
  selectedSection,
  onUpdateProject,
  onUpdateSectionConfig,
}: Props) {
  if (!selectedSection) {
    // Project-wide settings
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-rose-950 mb-1">
            General Website Settings
          </h3>
          <p className="text-xs text-rose-800/70">
            Basic details and audio background for this apology gift.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              value={project.recipientName}
              onChange={(e) => onUpdateProject({ recipientName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              value={project.senderName}
              onChange={(e) => onUpdateProject({ senderName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdateProject({ title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Public Slug (URL: /gift/{project.slug})
            </label>
            <input
              type="text"
              value={project.slug}
              onChange={(e) => onUpdateProject({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs font-mono text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="pt-4 border-t border-rose-100">
            <h4 className="font-serif font-bold text-sm text-rose-950 mb-2">
              Background Music
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs text-rose-900 font-medium">
                <input
                  type="checkbox"
                  checked={project.audioSettings?.enabled ?? true}
                  onChange={(e) =>
                    onUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-pink-500 focus:ring-pink-400"
                />
                <span>Enable Background Audio Widget</span>
              </label>

              <div>
                <MediaUploader
                  label="Background Audio Track"
                  currentUrl={project.audioSettings?.backgroundMusicUrl || ""}
                  onUploadSuccess={(url) =>
                    onUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        backgroundMusicUrl: url,
                        enabled: true,
                      },
                    })
                  }
                  accept="audio/*"
                  projectSlug={project.slug}
                  helpText="Upload an MP3/WAV file or paste a direct audio link below."
                />
                <input
                  type="text"
                  value={project.audioSettings?.backgroundMusicUrl || ""}
                  onChange={(e) =>
                    onUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        backgroundMusicUrl: e.target.value,
                      },
                    })
                  }
                  placeholder="Or paste https://.../music.mp3"
                  className="w-full mt-2 px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Track Title</label>
                <input
                  type="text"
                  value={project.audioSettings?.title || ""}
                  onChange={(e) =>
                    onUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="Gentle Piano Lullaby"
                  className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { type, config } = selectedSection;

  const update = (patch: Record<string, any>) => {
    onUpdateSectionConfig(selectedSection.id, { ...config, ...patch });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-rose-100 pb-3">
        <span className="text-[10px] font-mono font-bold uppercase text-rose-500 tracking-wider">
          Section Editor
        </span>
        <h3 className="font-serif font-bold text-lg text-rose-950">{selectedSection.title}</h3>
      </div>

      {/* ENVELOPE CONTROLS */}
      {type === "envelope" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Teaser Text
            </label>
            <input
              type="text"
              value={config.teaserText || ""}
              onChange={(e) => update({ teaserText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              value={config.buttonText || ""}
              onChange={(e) => update({ buttonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Top Stamp Tag
            </label>
            <input
              type="text"
              value={config.stampText || ""}
              onChange={(e) => update({ stampText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
        </div>
      )}

      {/* READY CHECK CONTROLS */}
      {type === "ready_check" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Question</label>
            <input
              type="text"
              value={config.question || ""}
              onChange={(e) => update({ question: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Accept Button Text
            </label>
            <input
              type="text"
              value={config.acceptButtonText || ""}
              onChange={(e) => update({ acceptButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Wait Button Text
            </label>
            <input
              type="text"
              value={config.waitButtonText || ""}
              onChange={(e) => update({ waitButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Wait Reassurance Message
            </label>
            <textarea
              rows={3}
              value={config.waitMessage || ""}
              onChange={(e) => update({ waitMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
        </div>
      )}

      {/* LETTER CONTROLS */}
      {type === "letter" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Salutation</label>
            <input
              type="text"
              value={config.salutation || ""}
              onChange={(e) => update({ salutation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-rose-900">
                Letter Paragraphs ({config.paragraphs?.length || 0})
              </label>
              <button
                type="button"
                onClick={() =>
                  update({ paragraphs: [...(config.paragraphs || []), "New heartfelt paragraph..."] })
                }
                className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Paragraph
              </button>
            </div>

            <div className="space-y-2">
              {(config.paragraphs || []).map((p: string, idx: number) => (
                <div key={idx} className="relative">
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const next = [...config.paragraphs];
                      next[idx] = e.target.value;
                      update({ paragraphs: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs pr-7"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = config.paragraphs.filter((_: any, i: number) => i !== idx);
                      update({ paragraphs: next });
                    }}
                    title="Remove paragraph"
                    className="absolute top-2 right-2 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Signoff</label>
            <input
              type="text"
              value={config.signoff || ""}
              onChange={(e) => update({ signoff: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-rose-900 font-medium">
            <input
              type="checkbox"
              checked={config.enableTypewriter ?? true}
              onChange={(e) => update({ enableTypewriter: e.target.checked })}
              className="rounded text-pink-500 focus:ring-pink-400"
            />
            <span>Enable Typewriter Animation Effect</span>
          </label>
        </div>
      )}

      {/* MEMORIES SCRAPBOOK CONTROLS */}
      {type === "memories" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-rose-900">
                Polaroid Photos ({config.photos?.length || 0})
              </label>
              <button
                type="button"
                onClick={() =>
                  update({
                    photos: [
                      ...(config.photos || []),
                      {
                        id: `photo-${Date.now()}`,
                        url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
                        caption: "Another sweet memory together",
                        date: "Special Date",
                        rotation: -2,
                      },
                    ],
                  })
                }
                className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Photo
              </button>
            </div>

            {(config.photos || []).map((photo: PolaroidPhoto, idx: number) => (
              <div
                key={photo.id || idx}
                className="p-3 rounded-xl bg-pink-50/60 border border-pink-200 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-900">Photo #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = config.photos.filter((_: any, i: number) => i !== idx);
                      update({ photos: next });
                    }}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div>
                  <MediaUploader
                    label={`Upload Photo #${idx + 1}`}
                    currentUrl={photo.url}
                    onUploadSuccess={(url) => {
                      const next = [...config.photos];
                      next[idx] = { ...photo, url };
                      update({ photos: next });
                    }}
                    accept="image/*"
                    projectSlug={project.slug}
                    helpText="Upload a JPEG, PNG or WebP image"
                  />
                  <input
                    type="text"
                    value={photo.url}
                    onChange={(e) => {
                      const next = [...config.photos];
                      next[idx] = { ...photo, url: e.target.value };
                      update({ photos: next });
                    }}
                    placeholder="Or paste direct image URL"
                    className="w-full mt-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Caption</label>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx] = { ...photo, caption: e.target.value };
                        update({ photos: next });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Date</label>
                    <input
                      type="text"
                      value={photo.date || ""}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx] = { ...photo, date: e.target.value };
                        update({ photos: next });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROMISES CONTROLS */}
      {type === "promises" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-rose-900">
                Sealed Promises ({config.promises?.length || 0})
              </label>
              <button
                type="button"
                onClick={() =>
                  update({
                    promises: [
                      ...(config.promises || []),
                      {
                        id: `promise-${Date.now()}`,
                        title: "My New Promise",
                        description: "I promise to always be there for you.",
                        sealColor: "#f43f5e",
                      },
                    ],
                  })
                }
                className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Promise
              </button>
            </div>

            {(config.promises || []).map((p: PromiseCard, idx: number) => (
              <div
                key={p.id || idx}
                className="p-3 rounded-xl bg-pink-50/60 border border-pink-200 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-900">Promise #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = config.promises.filter((_: any, i: number) => i !== idx);
                      update({ promises: next });
                    }}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Title</label>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => {
                      const next = [...config.promises];
                      next[idx] = { ...p, title: e.target.value };
                      update({ promises: next });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Commitment</label>
                  <textarea
                    rows={2}
                    value={p.description}
                    onChange={(e) => {
                      const next = [...config.promises];
                      next[idx] = { ...p, description: e.target.value };
                      update({ promises: next });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COUPON BOOK CONTROLS */}
      {type === "coupon_book" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Description</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>

          {/* 6. REDEMPTION LIMIT SETTING */}
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1.5">
              How many coupons can your recipient redeem?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 1, label: "1 special wish" },
                { value: 2, label: "2 special wishes" },
              ].map((opt) => {
                const isSelected = (config.maxRedemptions ?? 2) === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    data-testid={`coupon-limit-option-${opt.value}`}
                    onClick={() => update({ maxRedemptions: opt.value })}
                    className={`p-2.5 rounded-xl border text-xs font-serif text-center transition-all ${
                      isSelected
                        ? "bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs ring-1 ring-rose-400"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5">
              Your recipient can choose any {(config.maxRedemptions ?? 2) === 1 ? "1 voucher" : "2 vouchers"} from the entire collection.
            </p>
          </div>

          {/* COUPONS LIST */}
          <div className="space-y-3 pt-2 border-t border-pink-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-rose-900">
                Coupons ({config.coupons?.length || 0})
              </label>
              <button
                type="button"
                onClick={() =>
                  update({
                    coupons: [
                      ...(config.coupons || []),
                      {
                        id: `coupon-${Date.now()}`,
                        title: "New Wish Voucher",
                        description: "A special wish granted anytime you ask.",
                        iconName: "Heart",
                        expiryText: "Never Expires",
                        code: `WISH-${(config.coupons?.length || 0) + 1}`,
                      },
                    ],
                  })
                }
                className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Coupon
              </button>
            </div>

            {(config.coupons || []).map((c: ApologyCoupon, idx: number) => (
              <div
                key={c.id || idx}
                className="p-3 rounded-xl bg-pink-50/60 border border-pink-200 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-900">Coupon #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = config.coupons.filter((_: any, i: number) => i !== idx);
                      update({ coupons: next });
                    }}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Title</label>
                  <input
                    type="text"
                    value={c.title || ""}
                    onChange={(e) => {
                      const next = [...config.coupons];
                      next[idx] = { ...c, title: e.target.value };
                      update({ coupons: next });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Description</label>
                  <textarea
                    rows={2}
                    value={c.description || ""}
                    onChange={(e) => {
                      const next = [...config.coupons];
                      next[idx] = { ...c, description: e.target.value };
                      update({ coupons: next });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCRATCH CARD CONTROLS */}
      {type === "scratch_card" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Secret Surprise Message
            </label>
            <textarea
              rows={3}
              value={config.secretMessage || ""}
              onChange={(e) => update({ secretMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Secret Subtext</label>
            <input
              type="text"
              value={config.secretSubtext || ""}
              onChange={(e) => update({ secretSubtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
        </div>
      )}

      {/* FINAL APOLOGY CONTROLS */}
      {type === "final_apology" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Apology Message</label>
            <textarea
              rows={3}
              value={config.message || ""}
              onChange={(e) => update({ message: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Accept Button Text
            </label>
            <input
              type="text"
              value={config.acceptButtonText || ""}
              onChange={(e) => update({ acceptButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Need Time Button Text
            </label>
            <input
              type="text"
              value={config.pauseButtonText || ""}
              onChange={(e) => update({ pauseButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}

