"use client";

import React from "react";
import {
  WebsiteSectionData,
  WebsiteProjectData,
  BirthdayBalloonWish,
  PolaroidPhoto,
} from "@/types/website";
import {
  Plus,
  Trash2,
  Sparkles,
  Cake,
  Image as ImageIcon,
  Music,
  Gift,
  Mail,
  Trophy,
} from "lucide-react";
import { MediaUploader } from "./MediaUploader";

interface Props {
  project: WebsiteProjectData;
  selectedSection: WebsiteSectionData | null;
  onUpdateProject: (updates: Partial<WebsiteProjectData>) => void;
  onUpdateSectionConfig: (sectionId: string, newConfig: Record<string, any>) => void;
}

export function BirthdaySectionControls({
  project,
  selectedSection,
  onUpdateProject,
  onUpdateSectionConfig,
}: Props) {
  // If no section is selected, show general Birthday project settings
  if (!selectedSection) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-amber-950 mb-1 flex items-center gap-2">
            <span>🎂 Birthday Wonderland Settings</span>
          </h3>
          <p className="text-xs text-amber-800/70">
            Configure superstar recipient details, milestone age, and celebratory soundtrack.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={project.recipientName}
                onChange={(e) => onUpdateProject({ recipientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">
                Sender Name
              </label>
              <input
                type="text"
                value={project.senderName}
                onChange={(e) => onUpdateProject({ senderName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">
                Birthday Date
              </label>
              <input
                type="text"
                placeholder="e.g. Today or Nov 25th"
                value={project.birthdayDate || ""}
                onChange={(e) => onUpdateProject({ birthdayDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">
                Age / Milestone (Years)
              </label>
              <input
                type="number"
                min="1"
                placeholder="25"
                value={project.age || ""}
                onChange={(e) => onUpdateProject({ age: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">
              Website Title
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdateProject({ title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="pt-4 border-t border-amber-100">
            <h4 className="font-serif font-bold text-sm text-amber-950 mb-2 flex items-center gap-1.5">
              <Music size={14} className="text-amber-500" />
              <span>Background Soundtrack</span>
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs text-amber-900 font-medium">
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
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Enable Celebratory Music Player</span>
              </label>

              <MediaUploader
                label="Upload Birthday Soundtrack (MP3)"
                currentUrl={project.audioSettings?.backgroundMusicUrl}
                accept="audio/*"
                projectSlug={project.slug}
                onUploadSuccess={(url) =>
                  onUpdateProject({
                    audioSettings: {
                      ...project.audioSettings,
                      backgroundMusicUrl: url,
                    },
                  })
                }
              />
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
      <div className="border-b border-amber-100 pb-3">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-500 block mb-1">
          {type}
        </span>
        <h3 className="font-serif font-bold text-lg text-amber-950">
          {selectedSection.title}
        </h3>
      </div>

      {/* SCENE 1: INVITATION */}
      {type === "birthday_invitation" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Opening Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Teaser Message</label>
            <textarea
              rows={2}
              value={config.teaserText || ""}
              onChange={(e) => update({ teaserText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Gift Box Prompt</label>
            <input
              type="text"
              value={config.envelopePrompt || ""}
              onChange={(e) => update({ envelopePrompt: e.target.value })}
              placeholder="Tap to Unbox Your Gift 🎁"
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
        </div>
      )}

      {/* SCENE 2: WELCOME */}
      {type === "birthday_welcome" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Welcome Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Celebratory Message</label>
            <textarea
              rows={3}
              value={config.subheadline || ""}
              onChange={(e) => update({ subheadline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Birthday Date Text</label>
              <input
                type="text"
                value={config.birthdayDate || ""}
                onChange={(e) => update({ birthdayDate: e.target.value })}
                placeholder="e.g. Today or November 25"
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Age Milestone</label>
              <input
                type="number"
                value={config.age || ""}
                onChange={(e) => update({ age: Number(e.target.value) })}
                placeholder="25"
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-amber-900 font-medium">
            <input
              type="checkbox"
              checked={config.showCountdown !== false}
              onChange={(e) => update({ showCountdown: e.target.checked })}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span>Show Countdown or Today Celebration Banner</span>
          </label>
        </div>
      )}

      {/* SCENE 3: BALLOONS */}
      {type === "birthday_balloons" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950">
                Floating Wish Balloons ({(config.balloons || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const bs = config.balloons || [];
                  const colors = ["#f43f5e", "#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];
                  const newB = {
                    id: `bal-${Date.now()}`,
                    color: colors[bs.length % colors.length],
                    message: "A secret wish written especially for you! 🌟",
                    author: "With Love",
                  };
                  update({ balloons: [...bs, newB] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-amber-700 hover:text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Balloon
              </button>
            </div>

            {(config.balloons || []).map((b: BirthdayBalloonWish, idx: number) => (
              <div
                key={b.id || idx}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2 relative"
              >
                <div className="flex items-center justify-between pb-1 border-b border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full shadow-xs"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="text-[11px] font-serif font-bold text-amber-900">
                      Balloon #{idx + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.balloons || []).filter((_: any, i: number) => i !== idx);
                      update({ balloons: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete Balloon"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Revealed Wish Text</label>
                  <textarea
                    rows={2}
                    value={b.message}
                    onChange={(e) => {
                      const next = [...config.balloons];
                      next[idx].message = e.target.value;
                      update({ balloons: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-amber-200 text-xs text-amber-950"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Author Tag (e.g. From Sarah)</label>
                  <input
                    type="text"
                    value={b.author || ""}
                    onChange={(e) => {
                      const next = [...config.balloons];
                      next[idx].author = e.target.value;
                      update({ balloons: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-amber-200 text-xs text-amber-950"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCENE 4: CAKE */}
      {type === "birthday_cake" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Subtext / Instructions</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Number of Candles (1-7)</label>
              <input
                type="number"
                min="1"
                max="7"
                value={config.candlesCount || 5}
                onChange={(e) => update({ candlesCount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Mic Blowing</label>
              <label className="flex items-center gap-1.5 pt-2 text-xs text-amber-900 font-medium">
                <input
                  type="checkbox"
                  checked={config.allowMicBlowing !== false}
                  onChange={(e) => update({ allowMicBlowing: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Allow Microphone</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 5: SCRAPBOOK */}
      {type === "birthday_scrapbook" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950">
                Scrapbook Polaroids ({(config.photos || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const pts = config.photos || [];
                  const newP: PolaroidPhoto = {
                    id: `photo-${Date.now()}`,
                    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
                    caption: "A joyful memory...",
                    date: "Special Date",
                    rotation: pts.length % 2 === 0 ? -2 : 2.5,
                  };
                  update({ photos: [...pts, newP] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-amber-700 hover:text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Polaroid
              </button>
            </div>

            {(config.photos || []).map((p: PolaroidPhoto, idx: number) => (
              <div
                key={p.id || idx}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2 relative"
              >
                <div className="flex items-center justify-between pb-1 border-b border-amber-200/60">
                  <span className="text-[11px] font-serif font-bold text-amber-900">
                    Polaroid #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.photos || []).filter((_: any, i: number) => i !== idx);
                      update({ photos: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete Photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <MediaUploader
                  label="Upload Polaroid Photo"
                  currentUrl={p.url}
                  projectSlug={project.slug}
                  onUploadSuccess={(url) => {
                    const next = [...config.photos];
                    next[idx].url = url;
                    update({ photos: next });
                  }}
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Caption</label>
                    <input
                      type="text"
                      value={p.caption}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx].caption = e.target.value;
                        update({ photos: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-amber-200 text-xs text-amber-950 font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Date / Tag</label>
                    <input
                      type="text"
                      value={p.date || ""}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx].date = e.target.value;
                        update({ photos: next });
                      }}
                      placeholder="e.g. May 2022"
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-amber-200 text-xs text-amber-950 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCENE 6: GAME */}
      {type === "birthday_game" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Game Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Secret Scratched Message</label>
            <textarea
              rows={3}
              value={config.scratchMessage || ""}
              onChange={(e) => update({ scratchMessage: e.target.value })}
              placeholder="The surprise message revealed when scratched..."
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Prize / Coupon Subtext</label>
            <input
              type="text"
              value={config.secretGiftText || ""}
              onChange={(e) => update({ secretGiftText: e.target.value })}
              placeholder="e.g. Redeemable with sender anytime! 🥂"
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
        </div>
      )}

      {/* SCENE 7: LETTER */}
      {type === "birthday_letter" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Envelope Title</label>
            <input
              type="text"
              value={config.envelopeTitle || ""}
              onChange={(e) => update({ envelopeTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Salutation</label>
            <input
              type="text"
              value={config.salutation || ""}
              onChange={(e) => update({ salutation: e.target.value })}
              placeholder="Dearest Ananya,"
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 font-serif"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Letter Paragraphs</label>
            <textarea
              rows={6}
              value={(config.letterBody || []).join("\n\n")}
              onChange={(e) =>
                update({
                  letterBody: e.target.value.split("\n\n").filter((p) => p.trim()),
                })
              }
              placeholder="Write your heartfelt letter here. Separate paragraphs with double enter..."
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 font-serif leading-relaxed"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Signoff</label>
              <input
                type="text"
                value={config.signoff || ""}
                onChange={(e) => update({ signoff: e.target.value })}
                placeholder="With all my love,"
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 font-serif"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Sender Name</label>
              <input
                type="text"
                value={config.senderName || ""}
                onChange={(e) => update({ senderName: e.target.value })}
                placeholder="Your Name"
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 font-serif"
              />
            </div>
          </div>
        </div>
      )}

      {/* SCENE 8: FINALE */}
      {type === "birthday_finale" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Finale Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Closing Birthday Wish</label>
            <textarea
              rows={3}
              value={config.finalMessage || ""}
              onChange={(e) => update({ finalMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950"
            />
          </div>
          <MediaUploader
            label="Commemorative Photo (Optional)"
            currentUrl={config.celebrationPhotoUrl}
            projectSlug={project.slug}
            onUploadSuccess={(url) => update({ celebrationPhotoUrl: url })}
          />
        </div>
      )}
    </div>
  );
}
