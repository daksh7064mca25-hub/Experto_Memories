"use client";

import React from "react";
import {
  WebsiteProjectData,
  WebsiteSectionData,
  LoveInvitationConfig,
  LoveQuestionConfig,
  LoveReasonsConfig,
  LoveUniverseConfig,
  LovePuzzleConfig,
  LoveGalleryConfig,
  LoveLetterConfig,
  LoveSoundtrackConfig,
  LoveSurpriseConfig,
} from "@/types/website";
import { MediaUploader } from "./MediaUploader";
import { Plus, Trash2, Sparkles, Heart, Star, Music, Camera, Gift, Mail } from "lucide-react";

interface Props {
  project: WebsiteProjectData;
  selectedSection: WebsiteSectionData;
  onUpdateProject: (updates: Partial<WebsiteProjectData>) => void;
  onUpdateSectionConfig: (sectionId: string, newConfig: Record<string, any>) => void;
}

export function LoveSectionControls({
  project,
  selectedSection,
  onUpdateProject,
  onUpdateSectionConfig,
}: Props) {
  const { id: sectionId, type } = selectedSection;
  const config = selectedSection.config || {};

  const update = (patch: Record<string, any>) => {
    onUpdateSectionConfig(sectionId, { ...config, ...patch });
  };

  return (
    <div className="space-y-6 text-xs text-stone-800 font-sans pb-10">
      {/* 1. LOVE INVITATION */}
      {type === "love_invitation" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Confidential Badge Text</label>
            <input
              type="text"
              value={config.badgeText ?? "STRICTLY FOR YOUR EYES ONLY"}
              onChange={(e) => update({ badgeText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Invitation Headline</label>
            <input
              type="text"
              value={config.headline ?? "The Secret World of Us"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500 font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Introductory Message</label>
            <textarea
              rows={3}
              value={config.introMessage ?? ""}
              onChange={(e) => update({ introMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Wax Seal Prompt</label>
            <input
              type="text"
              value={config.sealText ?? "Break The Wax Seal 💌"}
              onChange={(e) => update({ sealText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Envelope Hint</label>
            <input
              type="text"
              value={config.hint ?? ""}
              onChange={(e) => update({ hint: e.target.value })}
              placeholder="e.g. Tap to enter our private world"
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      )}

      {/* 2. QUESTION FROM THE HEART */}
      {type === "love_question" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Section Headline</label>
            <input
              type="text"
              value={config.headline ?? "A Question From The Heart 💭"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Question Prompt</label>
            <input
              type="text"
              value={config.questionText ?? ""}
              onChange={(e) => update({ questionText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif font-bold text-rose-950"
            />
          </div>

          {/* Answers List */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-rose-950">Answer Choices ({(config.answers || []).length})</label>
              <button
                type="button"
                onClick={() => {
                  const current = config.answers || [];
                  const newAnswer = {
                    id: `ans-${Date.now()}`,
                    label: "A new sweet answer choice ✨",
                    responseTitle: "You chose this...",
                    responseMessage: "And my heart agrees with every word.",
                  };
                  update({ answers: [...current, newAnswer] });
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-600 hover:text-rose-800 font-bold"
              >
                <Plus size={12} /> Add Answer
              </button>
            </div>

            <div className="space-y-3">
              {(config.answers || []).map((ans: any, idx: number) => (
                <div key={ans.id || idx} className="p-3 bg-stone-50 rounded-2xl border border-rose-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-rose-700 font-bold">Option {String.fromCharCode(65 + idx)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = config.answers.filter((_: any, i: number) => i !== idx);
                        update({ answers: next });
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Remove answer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={ans.label}
                    onChange={(e) => {
                      const next = [...config.answers];
                      next[idx].label = e.target.value;
                      update({ answers: next });
                    }}
                    placeholder="Option text shown to recipient"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs"
                  />
                  <input
                    type="text"
                    value={ans.responseTitle || ""}
                    onChange={(e) => {
                      const next = [...config.answers];
                      next[idx].responseTitle = e.target.value;
                      update({ answers: next });
                    }}
                    placeholder="Response title (e.g. Exactly right...)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-serif"
                  />
                  <textarea
                    rows={2}
                    value={ans.responseMessage || ""}
                    onChange={(e) => {
                      const next = [...config.answers];
                      next[idx].responseMessage = e.target.value;
                      update({ answers: next });
                    }}
                    placeholder="Detailed response when this option is chosen"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-serif"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Final Loving Reveal</label>
            <textarea
              rows={2}
              value={config.finalReveal ?? ""}
              onChange={(e) => update({ finalReveal: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
            />
          </div>
        </div>
      )}

      {/* 3. REASONS I LOVE YOU */}
      {type === "love_reasons" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline ?? "Little Whispers of Why I Love You 🌹"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext ?? ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
            />
          </div>

          {/* Cards List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-rose-950">Love Cards ({(config.cards || []).length})</label>
              <button
                type="button"
                onClick={() => {
                  const current = config.cards || [];
                  const newCard = {
                    id: `rc-${Date.now()}`,
                    title: "A New Reason",
                    message: "Why I love you more each day...",
                    badge: `Reason #${current.length + 1}`,
                  };
                  update({ cards: [...current, newCard] });
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-600 hover:text-rose-800 font-bold"
              >
                <Plus size={12} /> Add Card
              </button>
            </div>

            <div className="space-y-4">
              {(config.cards || []).map((card: any, idx: number) => (
                <div key={card.id || idx} className="p-3.5 bg-stone-50 rounded-2xl border border-rose-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-rose-700 font-bold">Card #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = config.cards.filter((_: any, i: number) => i !== idx);
                        update({ cards: next });
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Remove card"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const next = [...config.cards];
                      next[idx].title = e.target.value;
                      update({ cards: next });
                    }}
                    placeholder="Card Title (e.g. The Way You Laugh)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-serif font-bold"
                  />

                  <textarea
                    rows={2}
                    value={card.message}
                    onChange={(e) => {
                      const next = [...config.cards];
                      next[idx].message = e.target.value;
                      update({ cards: next });
                    }}
                    placeholder="Secret message revealed on card tap"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs"
                  />

                  <MediaUploader
                    label="Optional Card Photo"
                    currentUrl={card.photoUrl}
                    projectSlug={project.slug}
                    onUploadSuccess={(url) => {
                      const next = [...config.cards];
                      next[idx].photoUrl = url || undefined;
                      update({ cards: next });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-rose-100">
            <label className="block text-xs font-semibold text-rose-950 mb-1">Final Grand Card Title</label>
            <input
              type="text"
              value={config.finalCardTitle ?? "And The Biggest Reason Of All..."}
              onChange={(e) => update({ finalCardTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Final Grand Card Message</label>
            <textarea
              rows={3}
              value={config.finalCardMessage ?? ""}
              onChange={(e) => update({ finalCardMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>
        </div>
      )}

      {/* 4. OUR LITTLE UNIVERSE */}
      {type === "love_universe" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-indigo-950 mb-1">Universe Headline</label>
            <input
              type="text"
              value={config.headline ?? "Our Little Universe 🌌"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs font-serif"
            />
          </div>

          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
            <h4 className="font-serif font-bold text-xs text-indigo-950 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
              <span>Center North Star (Core Promise)</span>
            </h4>
            <input
              type="text"
              value={config.centralStarTitle ?? "The North Star of My Life"}
              onChange={(e) => update({ centralStarTitle: e.target.value })}
              placeholder="Core Star Title"
              className="w-full px-2.5 py-1.5 rounded-lg border border-indigo-200 text-xs font-serif font-bold"
            />
            <textarea
              rows={3}
              value={config.centralStarStory ?? ""}
              onChange={(e) => update({ centralStarStory: e.target.value })}
              placeholder="Core Star Message revealed in modal"
              className="w-full px-2.5 py-1.5 rounded-lg border border-indigo-200 text-xs font-serif"
            />
            <MediaUploader
              label="Core Star Photo (Optional)"
              currentUrl={config.centralStarPhotoUrl}
              projectSlug={project.slug}
              onUploadSuccess={(url) => update({ centralStarPhotoUrl: url || undefined })}
            />
          </div>

          {/* Constellation Stars List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-indigo-950">Constellation Stars ({(config.stars || []).length})</label>
              <button
                type="button"
                onClick={() => {
                  const current = config.stars || [];
                  const newStar = {
                    id: `star-${Date.now()}`,
                    title: "A New Memory Star",
                    date: "Special Date",
                    story: "The story behind this star...",
                    x: Math.floor(Math.random() * 60) + 20,
                    y: Math.floor(Math.random() * 60) + 20,
                    size: "medium",
                    glowColor: "#f59e0b",
                  };
                  update({ stars: [...current, newStar] });
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-600 hover:text-indigo-800 font-bold"
              >
                <Plus size={12} /> Add Star
              </button>
            </div>

            <div className="space-y-4">
              {(config.stars || []).map((star: any, idx: number) => (
                <div key={star.id || idx} className="p-3 bg-stone-50 rounded-2xl border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-indigo-700 font-bold">Star #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = config.stars.filter((_: any, i: number) => i !== idx);
                        update({ stars: next });
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Remove star"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={star.title}
                    onChange={(e) => {
                      const next = [...config.stars];
                      next[idx].title = e.target.value;
                      update({ stars: next });
                    }}
                    placeholder="Memory Star Title"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-serif font-bold"
                  />

                  <input
                    type="text"
                    value={star.date || ""}
                    onChange={(e) => {
                      const next = [...config.stars];
                      next[idx].date = e.target.value;
                      update({ stars: next });
                    }}
                    placeholder="Date or Location (e.g. November 4th)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                  />

                  <textarea
                    rows={2}
                    value={star.story}
                    onChange={(e) => {
                      const next = [...config.stars];
                      next[idx].story = e.target.value;
                      update({ stars: next });
                    }}
                    placeholder="Memory story revealed on star tap"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs"
                  />

                  <MediaUploader
                    label="Optional Star Memory Photo"
                    currentUrl={star.photoUrl}
                    projectSlug={project.slug}
                    onUploadSuccess={(url) => {
                      const next = [...config.stars];
                      next[idx].photoUrl = url || undefined;
                      update({ stars: next });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. THE LOVE PUZZLE */}
      {type === "love_puzzle" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline ?? "The Love Puzzle 🧩"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Subtext / Instructions</label>
            <input
              type="text"
              value={config.subtext ?? ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Puzzle Completion Message</label>
            <textarea
              rows={2}
              value={config.completionMessage ?? ""}
              onChange={(e) => update({ completionMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Secret Reward Coupon Text</label>
            <textarea
              rows={2}
              value={config.secretRewardText ?? ""}
              onChange={(e) => update({ secretRewardText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Skip Button Label</label>
            <input
              type="text"
              value={config.skipButtonText ?? "Reveal Secret Surprise 🔓"}
              onChange={(e) => update({ skipButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* 6. OUR MEMORY GALLERY */}
      {type === "love_gallery" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline ?? "Moments Frozen In Our World 📸"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Subtext</label>
            <input
              type="text"
              value={config.subtext ?? ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
            />
          </div>

          {/* Photo List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-rose-950">Photographs ({(config.photos || []).length})</label>
              <button
                type="button"
                onClick={() => {
                  const current = config.photos || [];
                  const newPhoto = {
                    id: `gal-${Date.now()}`,
                    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
                    caption: "A beautiful memory of us.",
                    date: "Special Day",
                    location: "Our Spot",
                  };
                  update({ photos: [...current, newPhoto] });
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-600 hover:text-rose-800 font-bold"
              >
                <Plus size={12} /> Add Photo
              </button>
            </div>

            <div className="space-y-4">
              {(config.photos || []).map((photo: any, idx: number) => (
                <div key={photo.id || idx} className="p-3.5 bg-stone-50 rounded-2xl border border-rose-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-rose-700 font-bold">Photo #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = config.photos.filter((_: any, i: number) => i !== idx);
                        update({ photos: next });
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Remove photo"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <MediaUploader
                    label="Upload Photograph"
                    currentUrl={photo.url}
                    projectSlug={project.slug}
                    onUploadSuccess={(url) => {
                      const next = [...config.photos];
                      next[idx].url = url;
                      update({ photos: next });
                    }}
                  />

                  <input
                    type="text"
                    value={photo.caption || ""}
                    onChange={(e) => {
                      const next = [...config.photos];
                      next[idx].caption = e.target.value;
                      update({ photos: next });
                    }}
                    placeholder="Caption describing this moment"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-serif"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={photo.date || ""}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx].date = e.target.value;
                        update({ photos: next });
                      }}
                      placeholder="Date (e.g. Summer 2023)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={photo.location || ""}
                      onChange={(e) => {
                        const next = [...config.photos];
                        next[idx].location = e.target.value;
                        update({ photos: next });
                      }}
                      placeholder="Location (e.g. The Park)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. A LETTER FROM MY HEART */}
      {type === "love_letter" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline ?? "A Letter From My Heart 💌"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Wax Seal Stamp Word</label>
            <input
              type="text"
              value={config.waxSealText ?? "FOREVER"}
              onChange={(e) => update({ waxSealText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Salutation</label>
            <input
              type="text"
              value={config.salutation ?? `My Dearest ${project.recipientName},`}
              onChange={(e) => update({ salutation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif italic"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Full Letter Body</label>
            <p className="text-[10px] text-stone-500 mb-1">
              Separate paragraphs with an empty line. Take your time—this is where your heart speaks.
            </p>
            <textarea
              rows={8}
              value={config.letterBody ?? ""}
              onChange={(e) => update({ letterBody: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-rose-950 mb-1">Closing</label>
              <input
                type="text"
                value={config.closing ?? "With all my love and devotion,"}
                onChange={(e) => update({ closing: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif italic"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-950 mb-1">Signature</label>
              <input
                type="text"
                value={config.signature ?? project.senderName}
                onChange={(e) => update({ signature: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. OUR SOUNDTRACK */}
      {type === "love_soundtrack" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Track Title</label>
            <input
              type="text"
              value={project.audioSettings?.title ?? config.trackTitle ?? "Until I Found You (Acoustic)"}
              onChange={(e) => {
                update({ trackTitle: e.target.value });
                onUpdateProject({
                  audioSettings: {
                    ...project.audioSettings,
                    title: e.target.value,
                  },
                });
              }}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Artist Name</label>
            <input
              type="text"
              value={project.audioSettings?.artist ?? config.artistName ?? "The Secret World of Us"}
              onChange={(e) => {
                update({ artistName: e.target.value });
                onUpdateProject({
                  audioSettings: {
                    ...project.audioSettings,
                    artist: e.target.value,
                  },
                });
              }}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
            />
          </div>

          <MediaUploader
            label="Upload Custom Soundtrack (MP3 / WAV)"
            currentUrl={project.audioSettings?.backgroundMusicUrl}
            projectSlug={project.slug}
            accept="audio/*"
            onUploadSuccess={(url) => {
              update({ audioUrl: url });
              onUpdateProject({
                audioSettings: {
                  ...project.audioSettings,
                  backgroundMusicUrl: url,
                  enabled: true,
                },
              });
            }}
          />
        </div>
      )}

      {/* 9. THE FINAL SURPRISE */}
      {type === "love_surprise" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Headline</label>
            <input
              type="text"
              value={config.headline ?? "The Final Surprise 💖"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Surprise Title</label>
            <input
              type="text"
              value={config.surpriseTitle ?? "My Eternal Promise To You"}
              onChange={(e) => update({ surpriseTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif font-bold text-rose-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Surprise Body Text</label>
            <textarea
              rows={4}
              value={config.surpriseBody ?? ""}
              onChange={(e) => update({ surpriseBody: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif leading-relaxed"
            />
          </div>

          <MediaUploader
            label="Surprise Climax Photograph"
            currentUrl={config.photoUrl}
            projectSlug={project.slug}
            onUploadSuccess={(url) => update({ photoUrl: url || undefined })}
          />

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">Action Button Text</label>
            <input
              type="text"
              value={config.actionButtonText ?? "Send My Love Back ❤️"}
              onChange={(e) => update({ actionButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-950 mb-1">WhatsApp Pre-filled Love Message</label>
            <textarea
              rows={2}
              value={config.whatsappShareText ?? ""}
              onChange={(e) => update({ whatsappShareText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
