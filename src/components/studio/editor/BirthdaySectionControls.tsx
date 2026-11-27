"use client";

import React, { useState } from "react";
import {
  WebsiteSectionData,
  WebsiteProjectData,
  BirthdayBalloonWish,
  PolaroidPhoto,
  BirthdaySurpriseItem,
  BirthdaySurpriseCategory,
  BirthdaySurpriseIcon,
  BirthdayGameConfig,
  BirthdayScratchReward,
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
  Heart,
  Coffee,
  Plane,
  Star,
  Compass,
  Smile,
  Ticket,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  AlertCircle,
  RotateCcw,
  Check,
  Shuffle,
  Sliders,
} from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import {
  BIRTHDAY_RELATIONSHIPS,
  getBirthdaySurprisePresets,
  normalizeBirthdayRelationship,
  getDefaultCustomReward,
  getDefaultRandomRewards,
} from "@/config/birthday-surprises";

interface Props {
  project: WebsiteProjectData;
  selectedSection: WebsiteSectionData | null;
  onUpdateProject: (updates: Partial<WebsiteProjectData>) => void;
  onUpdateSectionConfig: (sectionId: string, newConfig: Record<string, any>) => void;
}

function generateSurpriseId(): string {
  return `surprise-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
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
              Recipient Relationship
            </label>
            <select
              value={normalizeBirthdayRelationship(project.recipientType || "general")}
              onChange={(e) => onUpdateProject({ recipientType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {BIRTHDAY_RELATIONSHIPS.map((rel) => (
                <option key={rel.id} value={rel.id}>
                  {rel.label} ({rel.description})
                </option>
              ))}
            </select>
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
        <BirthdayGameEditorControls
          config={config}
          project={project}
          update={update}
          onUpdateProject={onUpdateProject}
        />
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

function BirthdayGameEditorControls({
  config,
  project,
  update,
  onUpdateProject,
}: {
  config: BirthdayGameConfig | any;
  project: WebsiteProjectData;
  update: (newConfig: Record<string, any>) => void;
  onUpdateProject: (updates: Partial<WebsiteProjectData>) => void;
}) {
  const currentRel = config.relationship || project.recipientType || "general";
  const normalizedRel = normalizeBirthdayRelationship(currentRel);

  const mode: "custom" | "random" = config.mode === "random" ? "random" : "custom";

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPresetsLibrary, setShowPresetsLibrary] = useState(false);
  const [showPresetConfirm, setShowPresetConfirm] = useState(false);

  // 1. Resolve customReward with fallback
  const customReward: BirthdayScratchReward = React.useMemo(() => {
    if (config.customReward && config.customReward.title) {
      return config.customReward;
    }
    if (Array.isArray(config.surprises) && config.surprises.length > 0) {
      const first = config.surprises[0];
      return {
        id: first.id || "custom-reward-1",
        title: first.title || "Special Birthday Surprise ✨",
        description: first.description || "",
        redemptionInstructions:
          first.redemptionInstructions || "Show this card to the sender anytime to claim your surprise!",
        icon: first.icon || "gift",
        badge: first.badge || "Special Surprise",
        category: first.category || "experience",
        enabled: true,
      };
    }
    return getDefaultCustomReward(normalizedRel);
  }, [config.customReward, config.surprises, normalizedRel]);

  // 2. Resolve randomRewards with fallback
  const randomRewards: BirthdayScratchReward[] = React.useMemo(() => {
    if (Array.isArray(config.randomRewards) && config.randomRewards.length > 0) {
      return config.randomRewards;
    }
    if (Array.isArray(config.surprises) && config.surprises.length > 0) {
      return config.surprises.map((s: BirthdaySurpriseItem, idx: number) => ({
        id: s.id || `candidate-${idx}`,
        title: s.title || `Surprise #${idx + 1}`,
        description: s.description || "",
        redemptionInstructions:
          s.redemptionInstructions || "Show this card to the sender anytime to claim your surprise!",
        icon: s.icon || "gift",
        badge: s.badge || "Special Treat",
        category: s.category || "experience",
        enabled: s.enabled !== false,
      }));
    }
    return getDefaultRandomRewards(normalizedRel);
  }, [config.randomRewards, config.surprises, normalizedRel]);

  // Curated presets for currently selected relationship
  const relationshipPresets = getBirthdaySurprisePresets(normalizedRel);

  // Sync helpers to keep backward compatibility with legacy fields
  const syncCustomReward = (updated: BirthdayScratchReward) => {
    const legacyItem: BirthdaySurpriseItem = {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      redemptionInstructions: updated.redemptionInstructions,
      badge: updated.badge,
      icon: updated.icon,
      category: updated.category,
      enabled: true,
      order: 0,
    };
    update({
      mode: "custom",
      customReward: updated,
      surprises: [legacyItem],
      scratchMessage: updated.title,
      secretGiftText: updated.badge || updated.description,
    });
  };

  const syncRandomRewards = (
    updatedList: BirthdayScratchReward[],
    previewId?: string
  ) => {
    const legacyItems: BirthdaySurpriseItem[] = updatedList.map((r, i) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      redemptionInstructions: r.redemptionInstructions,
      badge: r.badge,
      icon: r.icon,
      category: r.category,
      enabled: r.enabled !== false,
      order: i,
    }));
    const primary = updatedList.find((r) => r.enabled !== false) || updatedList[0];
    update({
      mode: "random",
      randomRewards: updatedList,
      previewRewardId: previewId !== undefined ? previewId : config.previewRewardId,
      surprises: legacyItems,
      scratchMessage: primary?.title || config.scratchMessage,
      secretGiftText: primary?.badge || primary?.description || config.secretGiftText,
    });
  };

  // Mode Switcher
  const handleModeChange = (newMode: "custom" | "random") => {
    if (newMode === "custom") {
      update({
        mode: "custom",
        customReward,
        previewRewardId: undefined,
        surprises: [
          {
            id: customReward.id,
            title: customReward.title,
            description: customReward.description,
            redemptionInstructions: customReward.redemptionInstructions,
            badge: customReward.badge,
            icon: customReward.icon,
            category: customReward.category,
            enabled: true,
            order: 0,
          },
        ],
        scratchMessage: customReward.title,
        secretGiftText: customReward.badge || customReward.description,
      });
    } else {
      syncRandomRewards(randomRewards);
    }
  };

  const handleRelationshipChange = (newRel: string) => {
    update({ relationship: newRel });
    onUpdateProject({ recipientType: newRel });
  };

  // Preset Applicator
  const handleApplyPresetToCustom = (preset: BirthdaySurpriseItem) => {
    const updated: BirthdayScratchReward = {
      ...customReward,
      title: preset.title,
      description: preset.description || "",
      redemptionInstructions:
        preset.redemptionInstructions || "Show this card to the sender anytime to claim your surprise!",
      badge: preset.badge,
      icon: preset.icon,
      category: preset.category,
    };
    syncCustomReward(updated);
    setShowPresetsLibrary(false);
  };

  const handleResetRandomToPresets = () => {
    const presets = getDefaultRandomRewards(normalizedRel);
    syncRandomRewards(presets, presets[0]?.id);
    setShowPresetConfirm(false);
    setShowPresetsLibrary(false);
  };

  // Mode B Candidate Handlers
  const handleAddCandidate = () => {
    const newId = `candidate-${Date.now()}`;
    const newCandidate: BirthdayScratchReward = {
      id: newId,
      title: "New Birthday Surprise ✨",
      description: "A memorable reward or activity redeemable anytime!",
      redemptionInstructions: "Show this screen to the sender to claim!",
      badge: "Custom Surprise",
      icon: "gift",
      category: "experience",
      enabled: true,
    };
    const updated = [...randomRewards, newCandidate];
    syncRandomRewards(updated, newId);
    setExpandedId(newId);
  };

  const handleUpdateCandidate = (id: string, patch: Partial<BirthdayScratchReward>) => {
    const updated = randomRewards.map((r) => (r.id === id ? { ...r, ...patch } : r));
    syncRandomRewards(updated);
  };

  const handleDeleteCandidate = (id: string) => {
    if (randomRewards.length <= 1) {
      alert("At least one candidate reward must remain in the pool.");
      return;
    }
    const filtered = randomRewards.filter((r) => r.id !== id);
    const nextPreviewId =
      config.previewRewardId === id ? filtered[0]?.id : config.previewRewardId;
    syncRandomRewards(filtered, nextPreviewId);
    if (expandedId === id) setExpandedId(null);
  };

  const handleMoveCandidate = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= randomRewards.length) return;
    const reordered = [...randomRewards];
    [reordered[index], reordered[targetIdx]] = [reordered[targetIdx], reordered[index]];
    syncRandomRewards(reordered);
  };

  const handleToggleCandidate = (id: string) => {
    const updated = randomRewards.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    syncRandomRewards(updated);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header & Text Controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-amber-900 mb-1">Section Headline</label>
          <input
            type="text"
            value={config.headline || ""}
            onChange={(e) => update({ headline: e.target.value })}
            placeholder="e.g. Your Birthday Surprise! 🎁"
            className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-amber-900 mb-1">Subtext Instructions</label>
          <input
            type="text"
            value={config.subtext || ""}
            onChange={(e) => update({ subtext: e.target.value })}
            placeholder="e.g. Rub or drag your finger across the golden foil to reveal your gift!"
            className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* 2. Recipient Relationship Selector */}
      <div className="p-3.5 bg-gradient-to-r from-amber-50/80 to-pink-50/80 rounded-2xl border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-serif font-bold text-amber-950">
            Recipient Relationship
          </label>
          <span className="text-[10px] text-amber-800/70 font-mono">
            Personalizes idea suggestions
          </span>
        </div>
        <select
          value={normalizedRel}
          onChange={(e) => handleRelationshipChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-xs"
        >
          {BIRTHDAY_RELATIONSHIPS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label} — {r.description}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Mode Switcher (Mode A: Custom vs Mode B: Random) */}
      <div className="p-3.5 bg-white rounded-2xl border border-amber-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-serif font-bold text-amber-950">
            Scratch Surprise Mode
          </label>
          <span className="text-[10px] text-amber-700 font-medium">Single scratch experience</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Mode A Button */}
          <button
            type="button"
            onClick={() => handleModeChange("custom")}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
              mode === "custom"
                ? "bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-400"
                : "bg-stone-50/60 border-stone-200 hover:bg-stone-100/70"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Gift size={13} className={mode === "custom" ? "text-amber-600" : "text-stone-500"} />
              <span className={`text-xs font-serif font-bold ${mode === "custom" ? "text-amber-950" : "text-stone-700"}`}>
                Custom Surprise
              </span>
            </div>
            <p className="text-[10px] text-stone-500 leading-tight">
              You choose the exact surprise revealed to the recipient.
            </p>
          </button>

          {/* Mode B Button */}
          <button
            type="button"
            onClick={() => handleModeChange("random")}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
              mode === "random"
                ? "bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-400"
                : "bg-stone-50/60 border-stone-200 hover:bg-stone-100/70"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Shuffle size={13} className={mode === "random" ? "text-amber-600" : "text-stone-500"} />
              <span className={`text-xs font-serif font-bold ${mode === "random" ? "text-amber-950" : "text-stone-700"}`}>
                Random Surprise
              </span>
            </div>
            <p className="text-[10px] text-stone-500 leading-tight">
              Add multiple candidates; 1 chosen upon opening, rest stay secret.
            </p>
          </button>
        </div>
      </div>

      {/* 4. MODE A: Custom Surprise Editor */}
      {mode === "custom" && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-1.5">
                <Gift size={15} className="text-amber-500" />
                <span className="text-xs font-serif font-bold text-amber-950">
                  Custom Surprise Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetsLibrary(!showPresetsLibrary)}
                className="inline-flex items-center gap-1 text-[11px] font-serif font-semibold text-amber-700 hover:text-amber-900 hover:underline"
              >
                <Sparkles size={11} className="text-amber-500" />
                <span>{showPresetsLibrary ? "Hide Ideas" : "Inspiration Ideas"}</span>
              </button>
            </div>

            {/* Ideas library drawer */}
            {showPresetsLibrary && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2 animate-in fade-in duration-200">
                <div className="text-[11px] font-semibold text-amber-950">
                  Pick an idea for {BIRTHDAY_RELATIONSHIPS.find((r) => r.id === normalizedRel)?.label}:
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {relationshipPresets.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-white border border-amber-200/70 hover:border-amber-400 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-xs text-amber-950 truncate">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-[10px] text-stone-500 truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyPresetToCustom(item)}
                        className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-serif font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                      >
                        Use This
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Surprise Title */}
            <div>
              <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                Reward Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customReward.title}
                onChange={(e) => syncCustomReward({ ...customReward, title: e.target.value })}
                placeholder="e.g. Full Day Pampering & Spa Pass 💆‍♀️"
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs text-amber-950 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                Reward Description / Personal Note
              </label>
              <textarea
                rows={2}
                value={customReward.description || ""}
                onChange={(e) => syncCustomReward({ ...customReward, description: e.target.value })}
                placeholder="e.g. Today is all about you! Relax, unwind, and let me take care of every detail."
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Redemption Instructions */}
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1">
              <label className="block text-[11px] font-semibold text-amber-950">
                How to Redeem / Claim Instructions <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customReward.redemptionInstructions || ""}
                onChange={(e) =>
                  syncCustomReward({ ...customReward, redemptionInstructions: e.target.value })
                }
                placeholder="e.g. Screenshot or show this screen to me anytime this year to claim!"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[10px] text-amber-800/80">
                Displayed in a dedicated instructions box on the revealed surprise card.
              </p>
            </div>

            {/* Icon & Badge */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Surprise Icon
                </label>
                <select
                  value={customReward.icon || "gift"}
                  onChange={(e) =>
                    syncCustomReward({
                      ...customReward,
                      icon: e.target.value as BirthdaySurpriseIcon,
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="gift">Gift 🎁</option>
                  <option value="heart">Heart 💖</option>
                  <option value="sparkles">Sparkles ✨</option>
                  <option value="cake">Cake 🎂</option>
                  <option value="coffee">Coffee ☕</option>
                  <option value="trophy">Trophy 🏆</option>
                  <option value="plane">Plane ✈️</option>
                  <option value="star">Star 🌟</option>
                  <option value="music">Music 🎵</option>
                  <option value="compass">Compass 🧭</option>
                  <option value="smile">Smile 😊</option>
                  <option value="ticket">Ticket 🎟️</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Category Badge (Pill)
                </label>
                <input
                  type="text"
                  value={customReward.badge || ""}
                  onChange={(e) => syncCustomReward({ ...customReward, badge: e.target.value })}
                  placeholder="e.g. VIP Treat, Pampering"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODE B: Random Surprise Editor */}
      {mode === "random" && (
        <div className="space-y-4">
          {/* Explanation Callout */}
          <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/90 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-serif font-bold text-amber-950">
              <Shuffle size={13} className="text-amber-600" />
              <span>How Random Mode Works</span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              Define multiple potential surprises below. When the recipient opens their gift, exactly
              <strong> ONE</strong> surprise is selected and permanently revealed to them. All
              unselected options are completely concealed and never leaked in client-side code.
            </p>
          </div>

          {/* In-Editor Live Card Outcome Preview Bar */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                <Eye size={13} className="text-amber-600" />
                <span>In-Editor Outcome Preview</span>
              </span>
              {config.previewRewardId && (
                <button
                  type="button"
                  onClick={() => update({ previewRewardId: undefined })}
                  className="text-[10px] font-semibold text-stone-500 hover:text-stone-800 hover:underline"
                >
                  Exit Preview (Test Foil)
                </button>
              )}
            </div>
            <p className="text-[10px] text-stone-500">
              Select any candidate below to see how its revealed card looks in the live canvas:
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {randomRewards.map((r, idx) => {
                const isSelected = config.previewRewardId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => update({ previewRewardId: r.id })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all border shrink-0 ${
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                    } ${!r.enabled ? "opacity-40 line-through" : ""}`}
                    title={`Preview ${r.title}`}
                  >
                    #{idx + 1} {r.title.slice(0, 16)}...
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candidate Pool Header & Actions */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h4 className="font-serif font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <Gift size={13} className="text-amber-500" />
                <span>Candidate Surprises Pool ({randomRewards.length})</span>
              </h4>
              <p className="text-[10px] text-amber-800/70">
                {randomRewards.filter((r) => r.enabled !== false).length} active options in pool
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPresetConfirm(true)}
                className="text-[10px] font-serif font-semibold text-rose-700 hover:text-rose-900 hover:underline"
              >
                Reset Presets
              </button>
              <button
                type="button"
                onClick={handleAddCandidate}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-serif font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-transform hover:scale-105"
              >
                <Plus size={13} />
                <span>Add Option</span>
              </button>
            </div>
          </div>

          {/* Reset Confirmation Prompt */}
          {showPresetConfirm && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
              <p className="font-semibold text-rose-950">
                Replace all options with curated {BIRTHDAY_RELATIONSHIPS.find((r) => r.id === normalizedRel)?.label} ideas?
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetRandomToPresets}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowPresetConfirm(false)}
                  className="px-3 py-1 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Candidate List Cards */}
          <div className="space-y-2.5">
            {randomRewards.map((item, idx) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all ${
                    item.enabled !== false
                      ? "bg-white border-amber-200/90 shadow-xs"
                      : "bg-stone-50/70 border-stone-200 opacity-60"
                  }`}
                >
                  {/* Row Header */}
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Reorder Arrows */}
                      <div className="flex flex-col gap-0.5 text-stone-400 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCandidate(idx, "up")}
                          className="p-0.5 hover:text-amber-600 disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === randomRewards.length - 1}
                          onClick={() => handleMoveCandidate(idx, "down")}
                          className="p-0.5 hover:text-amber-600 disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>

                      {/* Title & Preview indicator */}
                      <div
                        className="min-w-0 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                          <span className="font-serif font-bold text-xs text-amber-950 truncate max-w-[180px] sm:max-w-[220px]">
                            {item.title}
                          </span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-mono text-stone-500">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleCandidate(item.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          item.enabled !== false
                            ? "text-emerald-700 hover:bg-emerald-50"
                            : "text-stone-400 hover:bg-stone-100"
                        }`}
                        title={item.enabled !== false ? "Active in random draw" : "Excluded from draw"}
                      >
                        {item.enabled !== false ? (
                          <Check size={14} className="stroke-[3]" />
                        ) : (
                          <EyeOff size={14} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                        title="Edit surprise details"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCandidate(item.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete candidate"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Form */}
                  {isExpanded && (
                    <div className="p-3.5 pt-1 border-t border-amber-100 space-y-3 bg-amber-50/20 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                          Reward Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateCandidate(item.id, { title: e.target.value })}
                          placeholder="e.g. VIP Chef Tasting Dinner 🍷"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                          Description / Note
                        </label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) =>
                            handleUpdateCandidate(item.id, { description: e.target.value })
                          }
                          placeholder="e.g. A 5-course romantic dinner at your favorite restaurant."
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                          Redemption Instructions <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.redemptionInstructions || ""}
                          onChange={(e) =>
                            handleUpdateCandidate(item.id, { redemptionInstructions: e.target.value })
                          }
                          placeholder="e.g. Show this screen to me anytime to claim!"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                            Category Badge
                          </label>
                          <input
                            type="text"
                            value={item.badge || ""}
                            onChange={(e) => handleUpdateCandidate(item.id, { badge: e.target.value })}
                            placeholder="e.g. Dining, Pampering"
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-950"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                            Icon
                          </label>
                          <select
                            value={item.icon || "gift"}
                            onChange={(e) =>
                              handleUpdateCandidate(item.id, {
                                icon: e.target.value as BirthdaySurpriseIcon,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-950"
                          >
                            <option value="gift">Gift 🎁</option>
                            <option value="heart">Heart 💖</option>
                            <option value="sparkles">Sparkles ✨</option>
                            <option value="cake">Cake 🎂</option>
                            <option value="coffee">Coffee ☕</option>
                            <option value="trophy">Trophy 🏆</option>
                            <option value="plane">Plane ✈️</option>
                            <option value="star">Star 🌟</option>
                            <option value="music">Music 🎵</option>
                            <option value="compass">Compass 🧭</option>
                            <option value="smile">Smile 😊</option>
                            <option value="ticket">Ticket 🎟️</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
