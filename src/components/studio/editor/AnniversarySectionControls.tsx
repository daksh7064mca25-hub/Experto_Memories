"use client";

import React from "react";
import {
  WebsiteSectionData,
  WebsiteProjectData,
  AnniversaryThemeId,
  TimelineMilestone,
  PolaroidPhoto,
  QuizQuestion,
  ConstellationStar,
  AnniversaryLoveNote,
  BucketListItem,
  AnniversaryMemoryMatchCard,
  AnniversaryPromiseCardItem,
  AnniversaryWheelOption,
} from "@/types/website";
import {
  Plus,
  Trash2,
  Heart,
  Sparkles,
  Image as ImageIcon,
  Music,
  HelpCircle,
  Star,
  Calendar,
  BookmarkCheck,
  Gift,
  MessageSquare,
  Upload,
  Check,
  ShieldCheck,
  Moon,
} from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import { parseWhatsAppChatExport } from "@/lib/whatsapp-parser";

interface Props {
  project: WebsiteProjectData;
  selectedSection: WebsiteSectionData | null;
  onUpdateProject: (updates: Partial<WebsiteProjectData>) => void;
  onUpdateSectionConfig: (sectionId: string, newConfig: Record<string, any>) => void;
}

export function AnniversarySectionControls({
  project,
  selectedSection,
  onUpdateProject,
  onUpdateSectionConfig,
}: Props) {
  // 1. General Project Settings
  if (!selectedSection) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-rose-950 mb-1 flex items-center gap-2">
            <span>💍 Anniversary Settings</span>
          </h3>
          <p className="text-xs text-rose-800/70">
            Core couple details, milestone dates and celebration background audio.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Partner 1 Name
              </label>
              <input
                type="text"
                value={project.partner1Name || project.recipientName}
                onChange={(e) =>
                  onUpdateProject({
                    partner1Name: e.target.value,
                    recipientName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Partner 2 Name
              </label>
              <input
                type="text"
                value={project.partner2Name || project.senderName}
                onChange={(e) =>
                  onUpdateProject({
                    partner2Name: e.target.value,
                    senderName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Anniversary Date
              </label>
              <input
                type="text"
                value={project.anniversaryDate || ""}
                onChange={(e) => onUpdateProject({ anniversaryDate: e.target.value })}
                placeholder="e.g. October 14th"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Years Together
              </label>
              <input
                type="number"
                min="0"
                value={project.yearsTogether ?? 1}
                onChange={(e) => onUpdateProject({ yearsTogether: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
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
              onChange={(e) =>
                onUpdateProject({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
              }
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs font-mono text-rose-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="pt-4 border-t border-rose-100">
            <h4 className="font-serif font-bold text-sm text-rose-950 mb-2 flex items-center gap-1.5">
              <Music size={14} className="text-rose-500" />
              <span>Background Floating Vinyl Player</span>
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
                <span>Enable Audio Player Pill</span>
              </label>

              <MediaUploader
                label="Upload MP3 Soundtrack"
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
                  placeholder="Golden Acoustic Melody"
                  className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Artist</label>
                <input
                  type="text"
                  value={project.audioSettings?.artist || ""}
                  onChange={(e) =>
                    onUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        artist: e.target.value,
                      },
                    })
                  }
                  placeholder="Romantic Piano Strings"
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
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-400 block mb-1">
          {type}
        </span>
        <h3 className="font-serif font-bold text-lg text-rose-950">
          {selectedSection.title}
        </h3>
      </div>

      {/* SECTION 0: WAX SEAL ENVELOPE OPENING */}
      {type === "anniversary_envelope" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Top Headline
            </label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              placeholder="A Celebration of Our Love"
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Envelope Teaser Quote
            </label>
            <textarea
              rows={2}
              value={config.teaserText || ""}
              onChange={(e) => update({ teaserText: e.target.value })}
              placeholder="Every love story is beautiful, but ours is my absolute favorite."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Wax Seal Initial / Emblem
              </label>
              <input
                type="text"
                maxLength={4}
                value={config.waxSealInitial || ""}
                onChange={(e) => update({ waxSealInitial: e.target.value })}
                placeholder="❤️ or S"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Open Button Text
              </label>
              <input
                type="text"
                value={config.buttonText || ""}
                onChange={(e) => update({ buttonText: e.target.value })}
                placeholder="Open Your Surprise"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: INTRODUCTION */}
      {type === "anniversary_intro" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Subheadline / Teaser
            </label>
            <textarea
              rows={2}
              value={config.subheadline || ""}
              onChange={(e) => update({ subheadline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Personal Romantic Message (Optional)
            </label>
            <textarea
              rows={2}
              value={config.personalMessage || ""}
              onChange={(e) => update({ personalMessage: e.target.value })}
              placeholder="A sweet personal message for your partner..."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <MediaUploader
            label="Hero Couple Photograph"
            currentUrl={config.couplePhotoUrl}
            projectSlug={project.slug}
            onUploadSuccess={(url) => update({ couplePhotoUrl: url })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Couple Names Display
              </label>
              <input
                type="text"
                value={config.coupleNames || ""}
                onChange={(e) => update({ coupleNames: e.target.value })}
                placeholder="Olivia & Liam"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Anniversary Date
              </label>
              <input
                type="text"
                value={config.anniversaryDate || ""}
                onChange={(e) => update({ anniversaryDate: e.target.value })}
                placeholder="October 14th"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Years Together Pill
              </label>
              <input
                type="text"
                value={config.yearsTogetherText || ""}
                onChange={(e) => update({ yearsTogetherText: e.target.value })}
                placeholder="3 Beautiful Years"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
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
                placeholder="Take Me Back To Us ❤️"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TIMELINE */}
      {type === "anniversary_timeline" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Milestones ({(config.milestones || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const ms: TimelineMilestone[] = config.milestones || [];
                  const newM: TimelineMilestone = {
                    id: `m-${Date.now()}`,
                    title: "New Chapter",
                    date: "Milestone Date",
                    description: "Describe this special moment...",
                    tag: "Memory",
                    photos: [],
                  };
                  update({ milestones: [...ms, newM] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Milestone
              </button>
            </div>

            {(config.milestones || []).map((m: TimelineMilestone, idx: number) => (
              <div
                key={m.id || idx}
                className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/60">
                  <span className="text-[11px] font-serif font-bold text-rose-800">
                    Milestone #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.milestones || []).filter((_: any, i: number) => i !== idx);
                      update({ milestones: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-100 transition-colors"
                    title="Delete Milestone"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Title</label>
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => {
                        const next = [...config.milestones];
                        next[idx].title = e.target.value;
                        update({ milestones: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Date</label>
                    <input
                      type="text"
                      value={m.date}
                      onChange={(e) => {
                        const next = [...config.milestones];
                        next[idx].date = e.target.value;
                        update({ milestones: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Tag / Badge</label>
                  <input
                    type="text"
                    value={m.tag || ""}
                    onChange={(e) => {
                      const next = [...config.milestones];
                      next[idx].tag = e.target.value;
                      update({ milestones: next });
                    }}
                    placeholder="e.g. First Date, The Spark"
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Story / Description</label>
                  <textarea
                    rows={3}
                    value={m.description}
                    onChange={(e) => {
                      const next = [...config.milestones];
                      next[idx].description = e.target.value;
                      update({ milestones: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950 resize-y min-h-[72px]"
                  />
                </div>

                <MediaUploader
                  label="Milestone Photo"
                  currentUrl={m.photos?.[0]}
                  projectSlug={project.slug}
                  onUploadSuccess={(url) => {
                    const next = [...config.milestones];
                    next[idx].photos = url ? [url] : [];
                    update({ milestones: next });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: GALLERY */}
      {type === "anniversary_gallery" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Polaroid Photos ({(config.photos || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const pts: PolaroidPhoto[] = config.photos || [];
                  const newP: PolaroidPhoto = {
                    id: `photo-${Date.now()}`,
                    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
                    caption: "Caption this memory...",
                    date: "Summer",
                    rotation: (pts.length % 2 === 0 ? -2 : 2),
                  };
                  update({ photos: [...pts, newP] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Photo
              </button>
            </div>

            {(config.photos || []).map((p: PolaroidPhoto, idx: number) => (
              <div
                key={p.id || idx}
                className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/60">
                  <span className="text-[11px] font-serif font-bold text-rose-800">
                    Polaroid Photo #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.photos || []).filter((_: any, i: number) => i !== idx);
                      update({ photos: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-100 transition-colors"
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
                    <label className="block text-[10px] text-stone-500 mb-0.5">Handwritten Caption</label>
                    <input
                      type="text"
                      value={p.caption}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx].caption = e.target.value;
                        update({ photos: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950 font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Date Stamp</label>
                    <input
                      type="text"
                      value={p.date || ""}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx].date = e.target.value;
                        update({ photos: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950 font-serif"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: COUPLE QUIZ */}
      {type === "anniversary_quiz" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Questions ({(config.questions || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const qs: QuizQuestion[] = config.questions || [];
                  const newQ: QuizQuestion = {
                    id: `q-${Date.now()}`,
                    question: "Who said 'I love you' first?",
                    options: ["Partner 1", "Partner 2", "Both together!", "The cat did"],
                    correctAnswerIndex: 0,
                    explanation: "Remember that sweet moment?",
                  };
                  update({ questions: [...qs, newQ] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Question
              </button>
            </div>

            {(config.questions || []).map((q: QuizQuestion, idx: number) => (
              <div
                key={q.id || idx}
                className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/60">
                  <span className="text-[11px] font-serif font-bold text-rose-800">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.questions || []).filter((_: any, i: number) => i !== idx);
                      update({ questions: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-100 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">
                    Question #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const next = [...config.questions];
                      next[idx].question = e.target.value;
                      update({ questions: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-stone-500">
                    Choices (Select Radio for Correct Answer):
                  </label>
                  {(q.options || []).map((opt: string, optIdx: number) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id || idx}`}
                        checked={q.correctAnswerIndex === optIdx}
                        onChange={() => {
                          const next = [...config.questions];
                          next[idx].correctAnswerIndex = optIdx;
                          update({ questions: next });
                        }}
                        className="text-pink-500 focus:ring-pink-400"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...config.questions];
                          const newOpts = [...next[idx].options];
                          newOpts[optIdx] = e.target.value;
                          next[idx].options = newOpts;
                          update({ questions: next });
                        }}
                        className="flex-1 px-2 py-1 rounded bg-white border border-pink-200 text-xs text-rose-950"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Sweet Explanation</label>
                  <input
                    type="text"
                    value={q.explanation || ""}
                    onChange={(e) => {
                      const next = [...config.questions];
                      next[idx].explanation = e.target.value;
                      update({ questions: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Celebration Message Upon Completion
              </label>
              <textarea
                rows={2}
                value={config.passingScoreMessage || ""}
                onChange={(e) => update({ passingScoreMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: CONSTELLATION */}
      {type === "anniversary_constellation" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Celestial Stars ({(config.stars || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const ss: ConstellationStar[] = config.stars || [];
                  const newS: ConstellationStar = {
                    id: `star-${Date.now()}`,
                    label: "Our Star",
                    xPercent: Math.floor(Math.random() * 70) + 15,
                    yPercent: Math.floor(Math.random() * 70) + 15,
                    memoryTitle: "A Cosmic Memory",
                    memoryText: "Tap this star to recall...",
                    memoryDate: "Always",
                  };
                  update({ stars: [...ss, newS] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Star
              </button>
            </div>

            {(config.stars || []).map((s: ConstellationStar, idx: number) => (
              <div
                key={s.id || idx}
                className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/60">
                  <span className="text-[11px] font-serif font-bold text-rose-800">
                    Constellation Star #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.stars || []).filter((_: any, i: number) => i !== idx);
                      update({ stars: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-100 transition-colors"
                    title="Delete Star"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Star Label</label>
                    <input
                      type="text"
                      value={s.label}
                      onChange={(e) => {
                        const next = [...config.stars];
                        next[idx].label = e.target.value;
                        update({ stars: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Date Pill</label>
                    <input
                      type="text"
                      value={s.memoryDate || ""}
                      onChange={(e) => {
                        const next = [...config.stars];
                        next[idx].memoryDate = e.target.value;
                        update({ stars: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">X Position % (10-90)</label>
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={s.xPercent}
                      onChange={(e) => {
                        const next = [...config.stars];
                        next[idx].xPercent = Number(e.target.value);
                        update({ stars: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Y Position % (10-90)</label>
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={s.yPercent}
                      onChange={(e) => {
                        const next = [...config.stars];
                        next[idx].yPercent = Number(e.target.value);
                        update({ stars: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Memory Card Headline</label>
                  <input
                    type="text"
                    value={s.memoryTitle}
                    onChange={(e) => {
                      const next = [...config.stars];
                      next[idx].memoryTitle = e.target.value;
                      update({ stars: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Memory Story Content</label>
                  <textarea
                    rows={2}
                    value={s.memoryText}
                    onChange={(e) => {
                      const next = [...config.stars];
                      next[idx].memoryText = e.target.value;
                      update({ stars: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: LOVE NOTES */}
      {type === "anniversary_love_notes" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Love Reasons ({(config.notes || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const ns: AnniversaryLoveNote[] = config.notes || [];
                  const newN: AnniversaryLoveNote = {
                    id: `note-${Date.now()}`,
                    title: "Reason to adore you",
                    content: "Because of your pure heart...",
                    iconName: "Heart",
                  };
                  update({ notes: [...ns, newN] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Reason
              </button>
            </div>

            {(config.notes || []).map((n: AnniversaryLoveNote, idx: number) => (
              <div
                key={n.id || idx}
                className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/60">
                  <span className="text-[11px] font-serif font-bold text-rose-800">
                    Love Note #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.notes || []).filter((_: any, i: number) => i !== idx);
                      update({ notes: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-100 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-stone-500 mb-0.5">Card Title</label>
                    <input
                      type="text"
                      value={n.title}
                      onChange={(e) => {
                        const next = [...config.notes];
                        next[idx].title = e.target.value;
                        update({ notes: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Icon</label>
                    <select
                      value={n.iconName || "Heart"}
                      onChange={(e) => {
                        const next = [...config.notes];
                        next[idx].iconName = e.target.value;
                        update({ notes: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    >
                      <option value="Heart">Heart</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Home">Home</option>
                      <option value="Shield">Shield</option>
                      <option value="Sun">Sun</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Hidden Note Content</label>
                  <textarea
                    rows={2}
                    value={n.content}
                    onChange={(e) => {
                      const next = [...config.notes];
                      next[idx].content = e.target.value;
                      update({ notes: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: SOUNDTRACK */}
      {type === "anniversary_soundtrack" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Song Title</label>
              <input
                type="text"
                value={config.songTitle || ""}
                onChange={(e) => update({ songTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Artist</label>
              <input
                type="text"
                value={config.artist || ""}
                onChange={(e) => update({ artist: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>

          <MediaUploader
            label="Upload Vinyl Audio (MP3)"
            currentUrl={config.audioUrl}
            accept="audio/*"
            projectSlug={project.slug}
            onUploadSuccess={(url) => update({ audioUrl: url })}
          />

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Personal Story / Why this song matters
            </label>
            <textarea
              rows={3}
              value={config.personalExplanation || ""}
              onChange={(e) => update({ personalExplanation: e.target.value })}
              placeholder="Whenever this melody plays, I remember..."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
        </div>
      )}

      {/* SECTION 8: FUTURE LETTER */}
      {type === "anniversary_future_letter" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Wax Envelope Teaser
            </label>
            <input
              type="text"
              value={config.envelopeTeaser || ""}
              onChange={(e) => update({ envelopeTeaser: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Letter Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Letter Paragraphs (Separate each paragraph with a blank line)
            </label>
            <textarea
              rows={5}
              value={Array.isArray(config.letterBody) ? config.letterBody.join("\n\n") : config.letterBody || ""}
              onChange={(e) =>
                update({
                  letterBody: e.target.value.split("\n\n").filter(Boolean),
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 font-serif leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Sign-off</label>
            <input
              type="text"
              value={config.signoff || ""}
              onChange={(e) => update({ signoff: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 font-serif"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Future Promises ({(config.promises || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const ps: string[] = config.promises || [];
                  update({ promises: [...ps, "I promise to..."] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Promise
              </button>
            </div>

            {(config.promises || []).map((p: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={p}
                  onChange={(e) => {
                    const next = [...config.promises];
                    next[idx] = e.target.value;
                    update({ promises: next });
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 font-serif"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = (config.promises || []).filter((_: any, i: number) => i !== idx);
                    update({ promises: next });
                  }}
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 9: BUCKET LIST */}
      {type === "anniversary_bucket_list" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Couple Adventures ({(config.items || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const its: BucketListItem[] = config.items || [];
                  const newIt: BucketListItem = {
                    id: `b-${Date.now()}`,
                    title: "Our next dream adventure",
                    category: "Adventure",
                  };
                  update({ items: [...its, newIt] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Adventure
              </button>
            </div>

            {(config.items || []).map((it: BucketListItem, idx: number) => (
              <div
                key={it.id || idx}
                className="p-3 rounded-xl border border-pink-200 bg-pink-50/30 flex items-center gap-2"
              >
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={it.title}
                    onChange={(e) => {
                      const next = [...config.items];
                      next[idx].title = e.target.value;
                      update({ items: next });
                    }}
                    placeholder="Bucket list dream..."
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                  />
                  <input
                    type="text"
                    value={it.category}
                    onChange={(e) => {
                      const next = [...config.items];
                      next[idx].category = e.target.value;
                      update({ items: next });
                    }}
                    placeholder="Category (e.g. Travel, Romance)"
                    className="w-32 px-2 py-1 rounded bg-white border border-pink-200 text-[10px] text-stone-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = (config.items || []).filter((_: any, i: number) => i !== idx);
                    update({ items: next });
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 10: FINALE */}
      {type === "anniversary_finale" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Final Heartfelt Message
            </label>
            <textarea
              rows={3}
              value={config.finalMessage || ""}
              onChange={(e) => update({ finalMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 font-serif leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Anniversary Date Display
            </label>
            <input
              type="text"
              value={config.anniversaryDate || ""}
              onChange={(e) => update({ anniversaryDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Question Text
              </label>
              <input
                type="text"
                value={config.questionText || ""}
                onChange={(e) => update({ questionText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
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
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950 font-serif"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-rose-100 space-y-3">
            <h4 className="text-xs font-bold text-rose-950">Celebration Modal Settings</h4>
            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Celebration Title</label>
              <input
                type="text"
                value={config.celebrationTitle || ""}
                onChange={(e) => update({ celebrationTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Celebration Message</label>
              <textarea
                rows={2}
                value={config.celebrationMessage || ""}
                onChange={(e) => update({ celebrationMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION: LIVE RELATIONSHIP COUNTER */}
      {type === "anniversary_counter" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Relationship Start Date
            </label>
            <input
              type="text"
              placeholder="e.g. October 14, 2021"
              value={config.relationshipStartDate || project.relationshipStartDate || ""}
              onChange={(e) => {
                update({ relationshipStartDate: e.target.value });
                onUpdateProject({ relationshipStartDate: e.target.value });
              }}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
            <span className="text-[10px] text-stone-500 mt-0.5 block">
              Format: Month DD, YYYY (e.g. October 14, 2021). Seconds and total days are calculated live.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Next Anniversary Date (For Countdown)
            </label>
            <input
              type="text"
              placeholder="e.g. October 14, 2025"
              value={config.nextAnniversaryDate || ""}
              onChange={(e) => update({ nextAnniversaryDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
        </div>
      )}

      {/* SECTION: WHERE IT ALL BEGAN */}
      {type === "anniversary_first_met" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Date Met</label>
              <input
                type="text"
                value={config.dateText || ""}
                onChange={(e) => update({ dateText: e.target.value })}
                placeholder="October 14, 2021"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Location</label>
              <input
                type="text"
                value={config.location || ""}
                onChange={(e) => update({ location: e.target.value })}
                placeholder="Corner Coffee Roasters"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Meeting Story</label>
            <textarea
              rows={4}
              value={config.storyText || ""}
              onChange={(e) => update({ storyText: e.target.value })}
              placeholder="Describe the moment your eyes met..."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <MediaUploader
            label="First Meeting Photo (Optional)"
            currentUrl={config.photoUrl}
            accept="image/*"
            projectSlug={project.slug}
            onUploadSuccess={(url) => update({ photoUrl: url })}
          />
        </div>
      )}

      {/* SECTION: THEN VS NOW */}
      {type === "anniversary_then_now" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Then Label</label>
              <input
                type="text"
                value={config.thenLabel || ""}
                onChange={(e) => update({ thenLabel: e.target.value })}
                placeholder="THEN (2021)"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Now Label</label>
              <input
                type="text"
                value={config.nowLabel || ""}
                onChange={(e) => update({ nowLabel: e.target.value })}
                placeholder="NOW (TODAY)"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>
          <MediaUploader
            label="Upload 'Then' (Earlier) Photograph"
            currentUrl={config.thenPhotoUrl}
            projectSlug={project.slug}
            onUploadSuccess={(url) => update({ thenPhotoUrl: url })}
          />
          <MediaUploader
            label="Upload 'Now' (Recent) Photograph"
            currentUrl={config.nowPhotoUrl}
            projectSlug={project.slug}
            onUploadSuccess={(url) => update({ nowPhotoUrl: url })}
          />
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Story / Note</label>
            <textarea
              rows={2}
              value={config.storyText || ""}
              onChange={(e) => update({ storyText: e.target.value })}
              placeholder="A reflection on how your love has grown..."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
        </div>
      )}

      {/* SECTION: REASONS I CHOOSE YOU */}
      {type === "anniversary_reasons" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Reason Cards ({(config.reasons || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const rs = config.reasons || [];
                  const newR = {
                    id: `r-${Date.now()}`,
                    title: "New Reason",
                    description: "Why I choose you every single day...",
                    emoji: "❤️",
                  };
                  update({ reasons: [...rs, newR] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Reason
              </button>
            </div>

            {(config.reasons || []).map((r: any, idx: number) => (
              <div
                key={r.id || idx}
                className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2 relative"
              >
                <div className="flex items-center justify-between pb-1 border-b border-pink-200/60">
                  <span className="text-[11px] font-serif font-bold text-rose-800">
                    Reason #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.reasons || []).filter((_: any, i: number) => i !== idx);
                      update({ reasons: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete Reason"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-3">
                    <label className="block text-[10px] text-stone-500 mb-0.5">Card Title</label>
                    <input
                      type="text"
                      value={r.title}
                      onChange={(e) => {
                        const next = [...config.reasons];
                        next[idx].title = e.target.value;
                        update({ reasons: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950 font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Emoji</label>
                    <input
                      type="text"
                      value={r.emoji || "❤️"}
                      onChange={(e) => {
                        const next = [...config.reasons];
                        next[idx].emoji = e.target.value;
                        update({ reasons: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Description</label>
                  <textarea
                    rows={2}
                    value={r.description}
                    onChange={(e) => {
                      const next = [...config.reasons];
                      next[idx].description = e.target.value;
                      update({ reasons: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-stone-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: THE LOVE MUSEUM */}
      {type === "anniversary_museum" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950">
                Museum Exhibits ({(config.exhibits || []).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const exs = config.exhibits || [];
                  const newEx = {
                    id: `ex-${Date.now()}`,
                    title: "New Exhibit",
                    date: "Date / Season",
                    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
                    description: "Curator notes on this precious moment...",
                    tag: "Memory",
                  };
                  update({ exhibits: [...exs, newEx] });
                }}
                className="text-[11px] flex items-center gap-1 font-serif font-bold text-rose-600 hover:text-rose-700 bg-pink-100/60 px-2.5 py-1 rounded-lg"
              >
                <Plus size={12} /> Add Exhibit
              </button>
            </div>

            {(config.exhibits || []).map((ex: any, idx: number) => (
              <div
                key={ex.id || idx}
                className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2 relative"
              >
                <div className="flex items-center justify-between pb-1 border-b border-pink-200/60">
                  <span className="text-[11px] font-serif font-bold text-rose-800">
                    Exhibit #{idx + 1}: {ex.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (config.exhibits || []).filter((_: any, i: number) => i !== idx);
                      update({ exhibits: next });
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete Exhibit"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Exhibit Title</label>
                    <input
                      type="text"
                      value={ex.title}
                      onChange={(e) => {
                        const next = [...config.exhibits];
                        next[idx].title = e.target.value;
                        update({ exhibits: next });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950 font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-0.5">Date / Tag</label>
                    <input
                      type="text"
                      value={ex.date || ""}
                      onChange={(e) => {
                        const next = [...config.exhibits];
                        next[idx].date = e.target.value;
                        update({ exhibits: next });
                      }}
                      placeholder="e.g. October 2022"
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-rose-950"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Exhibit Photograph"
                  currentUrl={ex.photoUrl}
                  projectSlug={project.slug}
                  onUploadSuccess={(url) => {
                    const next = [...config.exhibits];
                    next[idx].photoUrl = url;
                    update({ exhibits: next });
                  }}
                />

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Exhibit Plaque Description</label>
                  <textarea
                    rows={2}
                    value={ex.description}
                    onChange={(e) => {
                      const next = [...config.exhibits];
                      next[idx].description = e.target.value;
                      update({ exhibits: next });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-pink-200 text-xs text-stone-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* SECTION: MEMORY MATCH MINI-GAME */}
      {type === "anniversary_memory_match" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Win Title</label>
              <input
                type="text"
                value={config.winTitle || ""}
                onChange={(e) => update({ winTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Win Message</label>
              <input
                type="text"
                value={config.winMessage || ""}
                onChange={(e) => update({ winMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-rose-900">
                Memory Cards (Pairs automatically created)
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentCards = config.cards || [];
                  const newCard: AnniversaryMemoryMatchCard = {
                    id: `c-${Date.now()}`,
                    label: "New Memory",
                    iconOrImageUrl: "🌸",
                    type: "icon",
                  };
                  update({ cards: [...currentCards, newCard] });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add Card
              </button>
            </div>

            <div className="space-y-2">
              {(config.cards || []).map((card: AnniversaryMemoryMatchCard, idx: number) => (
                <div
                  key={card.id || idx}
                  className="p-3 rounded-xl bg-pink-50/50 border border-pink-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    maxLength={2}
                    value={card.iconOrImageUrl}
                    onChange={(e) => {
                      const next = [...config.cards];
                      next[idx].iconOrImageUrl = e.target.value;
                      update({ cards: next });
                    }}
                    className="w-10 px-1 py-1.5 text-center text-sm rounded-lg bg-white border border-pink-200"
                    title="Emoji Icon"
                  />
                  <input
                    type="text"
                    value={card.label}
                    onChange={(e) => {
                      const next = [...config.cards];
                      next[idx].label = e.target.value;
                      update({ cards: next });
                    }}
                    placeholder="Memory Name"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white border border-pink-200 text-rose-950"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = config.cards.filter((_: any, i: number) => i !== idx);
                      update({ cards: next });
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-white"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: SCRATCH TO REVEAL */}
      {type === "anniversary_scratch" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Foil Cover Title</label>
              <input
                type="text"
                value={config.coverTitle || ""}
                onChange={(e) => update({ coverTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Foil Subtitle</label>
              <input
                type="text"
                value={config.coverSubtitle || ""}
                onChange={(e) => update({ coverSubtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Secret Surprise Message (Revealed by scratching)
            </label>
            <textarea
              rows={3}
              value={config.secretMessage || ""}
              onChange={(e) => update({ secretMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Special Couple Photograph (Revealed under scratch foil)
            </label>
            <MediaUploader
              label="Upload Favourite Memory Photo"
              currentUrl={config.photoUrl || config.secretPhotoUrl}
              projectSlug={project.slug}
              accept="image/*"
              onUploadSuccess={(url: string) => update({ photoUrl: url, secretPhotoUrl: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Photo Caption / Memory Note
            </label>
            <input
              type="text"
              value={config.photoCaption || ""}
              onChange={(e) => update({ photoCaption: e.target.value })}
              placeholder="The day that became my favorite chapter in our story."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
        </div>
      )}

      {/* SECTION: VOWS & PROMISES */}
      {type === "anniversary_promises" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-rose-900">Promise Cards</label>
              <button
                type="button"
                onClick={() => {
                  const currentPromises = config.promises || [];
                  const newPromise: AnniversaryPromiseCardItem = {
                    id: `p-${Date.now()}`,
                    title: "A New Promise",
                    promise: "I promise to always be by your side through every season of life.",
                    icon: "💍",
                  };
                  update({ promises: [...currentPromises, newPromise] });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add Promise
              </button>
            </div>

            <div className="space-y-3">
              {(config.promises || []).map((item: AnniversaryPromiseCardItem, idx: number) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-xl bg-pink-50/50 border border-pink-200 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={item.icon || "💍"}
                      onChange={(e) => {
                        const next = [...config.promises];
                        next[idx].icon = e.target.value;
                        update({ promises: next });
                      }}
                      className="w-10 px-1 py-1.5 text-center text-sm rounded-lg bg-white border border-pink-200"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...config.promises];
                        next[idx].title = e.target.value;
                        update({ promises: next });
                      }}
                      placeholder="Promise Title"
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white border border-pink-200 text-rose-950 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = config.promises.filter((_: any, i: number) => i !== idx);
                        update({ promises: next });
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-white"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={item.promise}
                    onChange={(e) => {
                      const next = [...config.promises];
                      next[idx].promise = e.target.value;
                      update({ promises: next });
                    }}
                    placeholder="Full vow text..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-pink-200 text-stone-800"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: WHATSAPP CHAT INSIGHTS */}
      {type === "anniversary_whatsapp" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          {/* In-Browser WhatsApp Chat Export Parser */}
          <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-950">
              <MessageSquare size={14} className="text-rose-500" />
              <span>Import WhatsApp Chat Export (.txt)</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Export your chat without media from WhatsApp on your phone, then select the <code className="bg-pink-50 px-1 py-0.5 rounded text-rose-800">.txt</code> file below. It is analyzed 100% in your browser. Zero messages or private text are sent to our server.
            </p>

            <input
              type="file"
              accept=".txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  const text = event.target?.result as string;
                  if (text) {
                    const parsedMetrics = parseWhatsAppChatExport(
                      text,
                      project.partner1Name || project.recipientName,
                      project.partner2Name || project.senderName
                    );
                    update({ metrics: parsedMetrics });
                  }
                };
                reader.readAsText(file);
              }}
              className="w-full text-xs text-rose-950 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600 cursor-pointer"
            />

            {/* Current Metrics Overview */}
            {config.metrics && (
              <div className="mt-3 p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs space-y-1">
                <span className="font-semibold text-rose-900 block">Calculated Insights:</span>
                <p>• Total Messages: <strong>{config.metrics.totalMessages.toLocaleString()}</strong></p>
                <p>• {config.metrics.partner1Name}: <strong>{config.metrics.partner1Messages.toLocaleString()}</strong></p>
                <p>• {config.metrics.partner2Name}: <strong>{config.metrics.partner2Messages.toLocaleString()}</strong></p>
                <p>• Love Emojis Sent: <strong>{config.metrics.loveEmojisCount.toLocaleString()}</strong></p>
                <p>• Peak Chat Day: <strong>{config.metrics.mostActiveDay}</strong></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION: ANNIVERSARY GIFT SPIN WHEEL */}
      {type === "anniversary_spin_wheel" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              placeholder="The Anniversary Prize Wheel"
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              placeholder="Whatever it lands on, I owe you! Give it a spin to claim your romantic treat."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-rose-900">
                Wheel Prize Options ({((config.options as AnniversaryWheelOption[]) || []).length})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentOpts = (config.options as AnniversaryWheelOption[]) || [];
                  const newOption: AnniversaryWheelOption = {
                    id: `opt-${Date.now()}`,
                    label: "New Romantic Gift",
                    description: "Valid anytime for a special romantic treat.",
                    color: "#C46879",
                  };
                  update({ options: [...currentOpts, newOption] });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                <Plus size={12} />
                <span>Add Prize</span>
              </button>
            </div>

            <div className="space-y-3">
              {((config.options as AnniversaryWheelOption[]) || []).map((opt, oIdx) => (
                <div
                  key={opt.id || oIdx}
                  className="p-3 rounded-2xl bg-pink-50/40 border border-pink-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const next = [...(config.options as AnniversaryWheelOption[])];
                        next[oIdx] = { ...next[oIdx], label: e.target.value };
                        update({ options: next });
                      }}
                      placeholder="Prize Label (e.g. Candlelight Dinner)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 font-semibold text-rose-950"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (config.options as AnniversaryWheelOption[]).filter((_, i) => i !== oIdx);
                        update({ options: next });
                      }}
                      className="p-1 text-rose-400 hover:text-rose-600 transition-colors"
                      aria-label="Delete prize"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={opt.description || ""}
                    onChange={(e) => {
                      const next = [...(config.options as AnniversaryWheelOption[])];
                      next[oIdx] = { ...next[oIdx], description: e.target.value };
                      update({ options: next });
                    }}
                    placeholder="Prize description and redemption details..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-pink-200 text-rose-900"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Footer Note</label>
            <input
              type="text"
              value={config.footerNote || ""}
              onChange={(e) => update({ footerNote: e.target.value })}
              placeholder="Redeemable with unlimited hugs and smiles whenever you wish."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
        </div>
      )}

      {/* SECTION: THE MOON ON THE DAY WE MET */}
      {type === "anniversary_moon" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ""}
              onChange={(e) => update({ headline: e.target.value })}
              placeholder="The Moon on the Day We Met"
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">Subtext</label>
            <textarea
              rows={2}
              value={config.subtext || ""}
              onChange={(e) => update({ subtext: e.target.value })}
              placeholder="The exact astronomical phase of the moon shining above the night our story began."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Meeting Date (Astronomical Calculation)
              </label>
              <input
                type="text"
                value={config.meetingDate || ""}
                onChange={(e) => update({ meetingDate: e.target.value })}
                placeholder="October 14, 2021"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Meeting Location</label>
              <input
                type="text"
                value={config.location || ""}
                onChange={(e) => update({ location: e.target.value })}
                placeholder="Corner Coffee Roasters in the rain"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Personal Romantic Message
            </label>
            <textarea
              rows={3}
              value={config.personalMessage || ""}
              onChange={(e) => update({ personalMessage: e.target.value })}
              placeholder="Under this exact sky, the universe aligned and brought you into my life..."
              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs text-rose-950"
            />
          </div>
        </div>
      )}
    </div>
  );
}
