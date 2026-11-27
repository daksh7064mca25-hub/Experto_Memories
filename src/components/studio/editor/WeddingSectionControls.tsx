"use client";

import React from "react";
import {
  WebsiteProjectData,
  WebsiteSectionData,
  WeddingOpeningConfig,
  WeddingCoupleConfig,
  WeddingCountdownConfig,
  WeddingEventsConfig,
  WeddingStoryConfig,
  WeddingGalleryConfig,
  WeddingRSVPConfig,
  WeddingTravelConfig,
  WeddingWishesConfig,
} from "@/types/website";
import { MediaUploader } from "./MediaUploader";
import { Plus, Trash2, Sparkles, Heart, Calendar, MapPin, Music, Camera, Compass } from "lucide-react";

interface Props {
  project: WebsiteProjectData;
  selectedSection: WebsiteSectionData;
  onUpdateProject: (updates: Partial<WebsiteProjectData>) => void;
  onUpdateSectionConfig: (sectionId: string, newConfig: Record<string, any>) => void;
}

export function WeddingSectionControls({
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
      {/* 1. ROYAL OPENING / DOOR CEREMONY */}
      {type === "wedding_opening" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Ceremonial Opening Reveal Style
            </label>
            <select
              value={config.revealStyle || "palace_doors"}
              onChange={(e) => update({ revealStyle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="mandap_garland">Traditional Hindu Mandir (Carved Temple, Bells &amp; Toran)</option>
              <option value="hindu_mandir">Sacred Vedic Mandir Entrance (Interactive Bells &amp; Diyas)</option>
              <option value="palace_doors">Royal Palace Doors (Rajasthani Carved Teak &amp; Brass)</option>
              <option value="phulkari_dhol">Punjabi Phulkari &amp; Dhol (Festive Beats)</option>
              <option value="sunrise_lotus">Sikh Sunrise Lotus (Golden Anand Karaj Unfold)</option>
              <option value="silk_parchment">Mughal Silk Farman (Emerald Jaali &amp; Tassels)</option>
              <option value="ribbon_arch">Cathedral Ribbon &amp; Stained Glass Arch</option>
              <option value="architectural_gatefold">Modern Minimalist Gatefold</option>
              <option value="blooming_petals">Botanical Garden Wildflower Petals</option>
              <option value="passport_boarding">Luxury Destination Passport &amp; Boarding Pass</option>
              <option value="velvet_wax_seal">Midnight Velvet &amp; Gold Wax Seal</option>
            </select>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("preview-opening"));
                }
              }}
              className="w-full mt-2.5 py-2.5 px-3 rounded-xl text-xs font-serif font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles size={14} className="text-amber-200 animate-pulse" />
              <span>Test Opening Animation 🎬</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Opening Cultural Motif / Emblem
            </label>
            <select
              value={config.culturalSymbol || "monogram"}
              onChange={(e) => update({ culturalSymbol: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="monogram">Royal Monogram Crest</option>
              <option value="kalash">Sacred Kalash &amp; Coconut</option>
              <option value="dhol">Celebration Dhol &amp; Phulkari</option>
              <option value="lotus">Sacred Golden Lotus</option>
              <option value="farman">Mughal Royal Farman Arch</option>
              <option value="ribbon">Silk Ribbon &amp; Cross</option>
              <option value="gatefold">Architectural Line Emblem</option>
              <option value="flower">Blooming Botanical Wildflower</option>
              <option value="passport">Golden Compass &amp; Destination Palm</option>
              <option value="waxseal">Luxury Gold Wax Seal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Religious / Sacred Blessing (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Sanskrit sloka, Quranic verse, Gurbani shabad, Bible verse, or family blessing"
              value={config.religiousBlessingText ?? ""}
              onChange={(e) => update({ religiousBlessingText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Sacred Blessing Eyebrow
            </label>
            <input
              type="text"
              value={config.eyebrow ?? ""}
              onChange={(e) => update({ eyebrow: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Royal Monogram (Center Seal)
            </label>
            <input
              type="text"
              placeholder="e.g. A & R"
              value={config.monogram ?? ""}
              onChange={(e) => update({ monogram: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-serif font-bold text-amber-700 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Opening Button Text
            </label>
            <input
              type="text"
              value={config.actionButtonText ?? ""}
              onChange={(e) => update({ actionButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Volume / Soundtrack Notice
            </label>
            <input
              type="text"
              placeholder="e.g. Turn up your volume for royal shehnai"
              value={config.audioNotice ?? ""}
              onChange={(e) => update({ audioNotice: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Custom 3D Model URL (.glb / .gltf)
            </label>
            <input
              type="text"
              placeholder="e.g. /models/hindu_temple.glb or R2 URL"
              value={config.modelUrl ?? ""}
              onChange={(e) => update({ modelUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <p className="text-[10px] text-stone-500 mt-1">
              Leave blank to use the built-in procedural PBR 3D mandir with carved pillars, double teak doors &amp; bells.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Cinematic Transition Video URL (.mp4 / .webm)
            </label>
            <input
              type="text"
              placeholder="e.g. /videos/temple_entrance.mp4 or R2 URL"
              value={config.transitionVideoUrl ?? ""}
              onChange={(e) => update({ transitionVideoUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <p className="text-[10px] text-stone-500 mt-1">
              Plays during door opening zoom into the sanctum before revealing the invitation.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Palace Hero Background Image URL
            </label>
            <input
              type="text"
              placeholder="e.g. /images/royal/palace_hero.jpg or uploaded image URL"
              value={config.heroBackgroundImageUrl ?? ""}
              onChange={(e) => update({ heroBackgroundImageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <p className="text-[10px] text-stone-500 mt-1">
              Royal palace or heritage haveli photograph displayed as the main wedding hero background.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Couple Names
            </label>
            <input
              type="text"
              value={config.coupleNames ?? ""}
              onChange={(e) => update({ coupleNames: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 font-serif font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Headline Banner
            </label>
            <input
              type="text"
              value={config.headline ?? ""}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Wedding Date &amp; City Tagline
            </label>
            <input
              type="text"
              value={config.weddingDateText ?? ""}
              onChange={(e) => update({ weddingDateText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Opening Button Text
            </label>
            <input
              type="text"
              value={config.actionButtonText ?? ""}
              onChange={(e) => update({ actionButtonText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* 2. THE COUPLE & FAMILIES */}
      {type === "wedding_couple" && (
        <div className="space-y-5">
          {/* GROOM */}
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3">
            <h4 className="font-serif font-bold text-amber-950 text-xs flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-600" />
              <span>Groom Profile</span>
            </h4>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Groom Name</label>
              <input
                type="text"
                value={config.groomName ?? ""}
                onChange={(e) => update({ groomName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Groom Parents / Lineage</label>
              <input
                type="text"
                placeholder="e.g. S/o Smt. Sunita & Shri Rajesh Kapoor"
                value={config.groomTitle ?? ""}
                onChange={(e) => update({ groomTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Groom Bio</label>
              <textarea
                rows={2}
                value={config.groomBio ?? ""}
                onChange={(e) => update({ groomBio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Groom Portrait</label>
              <MediaUploader
                currentUrl={config.groomPhotoUrl}
                onUploadSuccess={(url: string) => update({ groomPhotoUrl: url })}
                label="Upload Groom Photo"
              />
            </div>
          </div>

          {/* BRIDE */}
          <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200/60 space-y-3">
            <h4 className="font-serif font-bold text-rose-950 text-xs flex items-center gap-1.5">
              <Heart size={13} className="text-rose-600" />
              <span>Bride Profile</span>
            </h4>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bride Name</label>
              <input
                type="text"
                value={config.brideName ?? ""}
                onChange={(e) => update({ brideName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bride Parents / Lineage</label>
              <input
                type="text"
                placeholder="e.g. D/o Smt. Kavita & Shri Mahendra Sharma"
                value={config.brideTitle ?? ""}
                onChange={(e) => update({ brideTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bride Bio</label>
              <textarea
                rows={2}
                value={config.brideBio ?? ""}
                onChange={(e) => update({ brideBio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bride Portrait</label>
              <MediaUploader
                currentUrl={config.bridePhotoUrl}
                onUploadSuccess={(url: string) => update({ bridePhotoUrl: url })}
                label="Upload Bride Photo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Parents&apos; Collective Blessing Quote
            </label>
            <textarea
              rows={2}
              value={config.parentsBlessing ?? ""}
              onChange={(e) => update({ parentsBlessing: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>
        </div>
      )}

      {/* 3. AUSPICIOUS COUNTDOWN */}
      {type === "wedding_countdown" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Target Wedding Date &amp; Time
            </label>
            <input
              type="text"
              placeholder="e.g. 2026-12-14T18:00:00"
              value={config.targetDate ?? ""}
              onChange={(e) => update({ targetDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Venue City &amp; State
            </label>
            <input
              type="text"
              placeholder="e.g. Jaipur, Rajasthan, India"
              value={config.venueCity ?? ""}
              onChange={(e) => update({ venueCity: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">
              Google Calendar Add URL
            </label>
            <input
              type="text"
              value={config.calendarAddToGoogleUrl ?? ""}
              onChange={(e) => update({ calendarAddToGoogleUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-600"
            />
          </div>
        </div>
      )}

      {/* 4. SACRED CELEBRATIONS & EVENTS */}
      {type === "wedding_events" && (
        <div className="space-y-4">
          {/* CULTURAL CEREMONY CONFIGURATION (PUNJABI & SIKH TEMPLATES) */}
          {(project.weddingDetails?.collection === "punjabi" ||
            project.weddingDetails?.collection === "sikh" ||
            project.templateId?.includes("punjabi") ||
            project.templateId?.includes("sikh") ||
            Boolean(config.ceremonyType) ||
            Boolean(config.jaggoConfig)) && (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-300/80 space-y-4">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs pb-1 border-b border-amber-200">
                <Sparkles size={14} className="text-amber-600" />
                <span>Cultural Ceremony &amp; Sacred Rituals</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-900 mb-1">
                  Wedding Ceremony Tradition
                </label>
                <select
                  value={config.ceremonyType || "sikh"}
                  onChange={(e) => update({ ceremonyType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white font-medium"
                >
                  <option value="sikh">Option A — Sikh Anand Karaj (Four Sacred Laavan)</option>
                  <option value="hindu">Option B — Punjabi Hindu Vivah (Seven Sacred Pheras)</option>
                  <option value="custom">Option C — Custom / Other Sacred Union</option>
                </select>
                <p className="text-[10px] text-stone-500 mt-1">
                  {config.ceremonyType === "hindu"
                    ? "Renders festive marigold palette, floral mandap, sacred Agni/Pheras, Shubh Muhurat, and 7 Saptapadi explanation cards."
                    : config.ceremonyType === "custom"
                    ? "Renders a respectful, customized sacred ceremony presentation."
                    : "Renders serene ivory & gold palette, Gurdwara details, sacred Gurbani quotation, and 4 Sacred Laavan explanation cards."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    {config.ceremonyType === "hindu" ? "Mandap Venue Name" : config.ceremonyType === "custom" ? "Ceremony Venue" : "Gurdwara Sahib Name"}
                  </label>
                  <input
                    type="text"
                    placeholder={config.ceremonyType === "hindu" ? "e.g. The Heritage Mandap" : "e.g. Gurdwara Sri Guru Singh Sabha"}
                    value={config.ceremonyVenueName ?? ""}
                    onChange={(e) => update({ ceremonyVenueName: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    Ceremony Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 AM (Baraat) • 11:30 AM (Ceremony)"
                    value={config.ceremonyTime ?? ""}
                    onChange={(e) => update({ ceremonyTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Venue Full Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. GT Road, Amritsar, Punjab 143001"
                  value={config.ceremonyAddress ?? ""}
                  onChange={(e) => update({ ceremonyAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    Ceremony Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunday, December 21, 2026"
                    value={config.ceremonyDate ?? ""}
                    onChange={(e) => update({ ceremonyDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    Google Maps URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://maps.google.com/?q=..."
                    value={config.ceremonyMapsUrl ?? ""}
                    onChange={(e) => update({ ceremonyMapsUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              {config.ceremonyType === "hindu" && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                    Shubh Muhurat / Auspicious Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01:15 PM (Auspicious Lagna Muhurat)"
                    value={config.shubhMuhurat ?? ""}
                    onChange={(e) => update({ shubhMuhurat: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  {config.ceremonyType === "hindu" ? "Sacred Vedic Sloka / Blessing" : "Sacred Gurbani Shabad Quote"}
                </label>
                <textarea
                  rows={2}
                  placeholder="Sacred verse or blessing"
                  value={config.ceremonyReligiousQuote ?? ""}
                  onChange={(e) => update({ ceremonyReligiousQuote: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showRitualCardsToggle"
                  checked={
                    config.ceremonyType === "hindu"
                      ? config.showPherasExplanation !== false
                      : config.showLaavanExplanation !== false
                  }
                  onChange={(e) => {
                    if (config.ceremonyType === "hindu") {
                      update({ showPherasExplanation: e.target.checked });
                    } else {
                      update({ showLaavanExplanation: e.target.checked });
                    }
                  }}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="showRitualCardsToggle" className="text-xs text-stone-800 font-medium">
                  {config.ceremonyType === "hindu"
                    ? "Display Seven Sacred Pheras (Saptapadi) explanation cards"
                    : "Display Four Sacred Laavan explanation cards"}
                </label>
              </div>

              {/* INTERACTIVE JAGGO CELEBRATION SCENE */}
              <div className="pt-3 border-t border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>🪔 Interactive Jaggo Courtyard Scene</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={config.jaggoConfig?.enabled !== false}
                    onChange={(e) =>
                      update({
                        jaggoConfig: {
                          ...(config.jaggoConfig || {}),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>
                {config.jaggoConfig?.enabled !== false && (
                  <div className="space-y-2 pl-2 border-l-2 border-amber-300">
                    <input
                      type="text"
                      placeholder="Jaggo Scene Title"
                      value={config.jaggoConfig?.title ?? "Raat Jaggo Di • Courtyard Celebration"}
                      onChange={(e) =>
                        update({
                          jaggoConfig: {
                            ...(config.jaggoConfig || {}),
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Jaggo Description"
                      value={
                        config.jaggoConfig?.description ??
                        "Carry the glowing brass Jaggo on your head, sing boliya, and ignite the night with vibrant dhol beats!"
                      }
                      onChange={(e) =>
                        update({
                          jaggoConfig: {
                            ...(config.jaggoConfig || {}),
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              {/* BARAAT ARRIVAL SCENE */}
              <div className="pt-3 border-t border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>🐎 Shahi Baraat Arrival Scene</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={config.baraatConfig?.enabled !== false}
                    onChange={(e) =>
                      update({
                        baraatConfig: {
                          ...(config.baraatConfig || {}),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>
                {config.baraatConfig?.enabled !== false && (
                  <div className="space-y-2 pl-2 border-l-2 border-amber-300">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Baraat Scene Title"
                        value={config.baraatConfig?.title ?? "Shahi Baraat & Swagat"}
                        onChange={(e) =>
                          update({
                            baraatConfig: {
                              ...(config.baraatConfig || {}),
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Assembly Time (e.g. 10:30 AM onwards)"
                        value={config.baraatConfig?.time ?? "10:30 AM onwards"}
                        onChange={(e) =>
                          update({
                            baraatConfig: {
                              ...(config.baraatConfig || {}),
                              time: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Baraat Description"
                      value={
                        config.baraatConfig?.description ??
                        "The royal procession on the adorned steed with live dholis, bhangra dance, and warm Milni garland ceremony."
                      }
                      onChange={(e) =>
                        update({
                          baraatConfig: {
                            ...(config.baraatConfig || {}),
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">
              Wedding Functions ({(config.events || []).length})
            </span>
            <button
              type="button"
              onClick={() => {
                const newEvt = {
                  id: `evt-${Date.now()}`,
                  title: "New Wedding Celebration",
                  date: "December 14, 2026",
                  time: "07:00 PM onwards",
                  venueName: "Venue Name",
                  address: "Venue Full Address",
                  dressCode: "Festive Ethnic",
                  description: "Join us for music, celebration and feast.",
                };
                update({ events: [...(config.events || []), newEvt] });
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition"
            >
              <Plus size={13} />
              <span>Add Function</span>
            </button>
          </div>

          <div className="space-y-4">
            {(config.events || []).map((evt: any, idx: number) => (
              <div key={evt.id || idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-900 text-xs">
                    Event #{idx + 1}: {evt.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (config.events || []).filter((_: any, i: number) => i !== idx);
                      update({ events: updated });
                    }}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Function Title (e.g. Haldi & Phoolon Ki Holi)"
                  value={evt.title ?? ""}
                  onChange={(e) => {
                    const copy = [...config.events];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    update({ events: copy });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-medium"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Date"
                    value={evt.date ?? ""}
                    onChange={(e) => {
                      const copy = [...config.events];
                      copy[idx] = { ...copy[idx], date: e.target.value };
                      update({ events: copy });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Time"
                    value={evt.time ?? ""}
                    onChange={(e) => {
                      const copy = [...config.events];
                      copy[idx] = { ...copy[idx], time: e.target.value };
                      update({ events: copy });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Venue Name (e.g. Fairmont Jaipur)"
                  value={evt.venueName ?? ""}
                  onChange={(e) => {
                    const copy = [...config.events];
                    copy[idx] = { ...copy[idx], venueName: e.target.value };
                    update({ events: copy });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                />

                <input
                  type="text"
                  placeholder="Venue Full Address"
                  value={evt.address ?? ""}
                  onChange={(e) => {
                    const copy = [...config.events];
                    copy[idx] = { ...copy[idx], address: e.target.value };
                    update({ events: copy });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                />

                <input
                  type="text"
                  placeholder="Google Maps URL"
                  value={evt.googleMapsUrl ?? ""}
                  onChange={(e) => {
                    const copy = [...config.events];
                    copy[idx] = { ...copy[idx], googleMapsUrl: e.target.value };
                    update({ events: copy });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                />

                <input
                  type="text"
                  placeholder="Dress Code (e.g. Yellow Festive / Traditional)"
                  value={evt.dressCode ?? ""}
                  onChange={(e) => {
                    const copy = [...config.events];
                    copy[idx] = { ...copy[idx], dressCode: e.target.value };
                    update({ events: copy });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. LOVE STORY */}
      {type === "wedding_story" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Romantic Quote</label>
            <input
              type="text"
              value={config.quote ?? ""}
              onChange={(e) => update({ quote: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs italic"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Narrative Story Paragraphs</label>
            {(config.storyParagraphs || []).map((p: string, idx: number) => (
              <div key={idx} className="mb-2">
                <textarea
                  rows={2}
                  value={p}
                  onChange={(e) => {
                    const copy = [...config.storyParagraphs];
                    copy[idx] = e.target.value;
                    update({ storyParagraphs: copy });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PHOTO GALLERY */}
      {type === "wedding_gallery" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">
              Photos ({(config.photos || []).length})
            </span>
            <button
              type="button"
              onClick={() => {
                const newP = {
                  id: `wed-p-${Date.now()}`,
                  url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
                  caption: "A treasured moment",
                  category: "pre-wedding",
                };
                update({ photos: [...(config.photos || []), newP] });
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition"
            >
              <Plus size={13} />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="space-y-4">
            {(config.photos || []).map((photo: any, idx: number) => (
              <div key={photo.id || idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-stone-800">Photo #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (config.photos || []).filter((_: any, i: number) => i !== idx);
                      update({ photos: updated });
                    }}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <MediaUploader
                  currentUrl={photo.url}
                  onUploadSuccess={(url: string) => {
                    const copy = [...config.photos];
                    copy[idx] = { ...copy[idx], url };
                    update({ photos: copy });
                  }}
                  label={`Replace Photo #${idx + 1}`}
                />

                <input
                  type="text"
                  placeholder="Caption"
                  value={photo.caption ?? ""}
                  onChange={(e) => {
                    const copy = [...config.photos];
                    copy[idx] = { ...copy[idx], caption: e.target.value };
                    update({ photos: copy });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RSVP CONTROLS */}
      {type === "wedding_rsvp" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">RSVP Deadline Text</label>
            <input
              type="text"
              value={config.rsvpDeadlineText ?? ""}
              onChange={(e) => update({ rsvpDeadlineText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Confirmation Message</label>
            <textarea
              rows={2}
              value={config.confirmationMessage ?? ""}
              onChange={(e) => update({ confirmationMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="mealPref"
              checked={config.enableMealPreferences ?? true}
              onChange={(e) => update({ enableMealPreferences: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="mealPref" className="text-xs text-stone-700">
              Enable Dietary / Food Allergy field
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="blessings"
              checked={config.enableBlessings ?? true}
              onChange={(e) => update({ enableBlessings: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="blessings" className="text-xs text-stone-700">
              Enable Guest Blessings textarea
            </label>
          </div>
        </div>
      )}

      {/* 5. VENUE, LOCATION & GUEST HOSPITALITY */}
      {type === "wedding_travel" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Primary Celebration Venue Name</label>
            <input
              type="text"
              placeholder="e.g. The Mandap Hall, BrijRama Palace"
              value={config.venueName ?? ""}
              onChange={(e) => update({ venueName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Venue Full Address</label>
            <textarea
              rows={2}
              placeholder="e.g. Darbhanga Ghat, Varanasi, Uttar Pradesh 221001"
              value={config.venueAddress ?? ""}
              onChange={(e) => update({ venueAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Google Maps Direction URL</label>
            <input
              type="url"
              placeholder="https://maps.google.com/?q=..."
              value={config.googleMapsUrl ?? ""}
              onChange={(e) => update({ googleMapsUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div className="pt-2 border-t border-stone-200">
            <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">Travel &amp; Logistics Details</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Nearest Airport Details</label>
            <input
              type="text"
              value={config.nearestAirport ?? ""}
              onChange={(e) => update({ nearestAirport: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Nearest Railway Details</label>
            <input
              type="text"
              value={config.nearestRailway ?? ""}
              onChange={(e) => update({ nearestRailway: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Accommodations Information</label>
            <textarea
              rows={2}
              value={config.hotelAccommodations ?? ""}
              onChange={(e) => update({ hotelAccommodations: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Transfers &amp; Shuttles</label>
            <input
              type="text"
              value={config.shuttleNotes ?? ""}
              onChange={(e) => update({ shuttleNotes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-900 mb-1">Concierge Name</label>
              <input
                type="text"
                value={config.conciergeName ?? ""}
                onChange={(e) => update({ conciergeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-900 mb-1">Concierge Phone</label>
              <input
                type="text"
                value={config.conciergePhone ?? ""}
                onChange={(e) => update({ conciergePhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. REGISTRY & AUSPICIOUS SHAGUN */}
      {type === "wedding_registry" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Section Headline</label>
            <input
              type="text"
              value={config.headline ?? "Registry & Auspicious Shagun"}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Subtext / Intro</label>
            <input
              type="text"
              value={config.subtext ?? ""}
              onChange={(e) => update({ subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Gifting / Shagun Message</label>
            <textarea
              rows={2}
              value={config.message ?? ""}
              onChange={(e) => update({ message: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">UPI ID (Optional)</label>
            <input
              type="text"
              placeholder="e.g. shubh.vivah@upi"
              value={config.upiId ?? ""}
              onChange={(e) => update({ upiId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-900 mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank"
                value={config.bankName ?? ""}
                onChange={(e) => update({ bankName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-900 mb-1">Account Holder Name</label>
              <input
                type="text"
                placeholder="e.g. Vikram Iyer"
                value={config.accountHolder ?? ""}
                onChange={(e) => update({ accountHolder: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-900 mb-1">Account Number</label>
              <input
                type="text"
                placeholder="e.g. 50100234567890"
                value={config.accountNumber ?? ""}
                onChange={(e) => update({ accountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-900 mb-1">IFSC Code</label>
              <input
                type="text"
                placeholder="e.g. HDFC0001234"
                value={config.ifscCode ?? ""}
                onChange={(e) => update({ ifscCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Custom Note / Etiquette</label>
            <input
              type="text"
              placeholder="e.g. Traditional blessings &amp; shagun are warmly received. No boxed gifts, please."
              value={config.registryNote ?? ""}
              onChange={(e) => update({ registryNote: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>
        </div>
      )}

      {/* 9. WISHES & CLOSING */}
      {type === "wedding_wishes" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Family Signoff</label>
            <input
              type="text"
              placeholder="e.g. The Kapoor & Sharma Families"
              value={config.familySignoff ?? ""}
              onChange={(e) => update({ familySignoff: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-serif font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">Closing Blessings Note</label>
            <textarea
              rows={2}
              value={config.closingNote ?? ""}
              onChange={(e) => update({ closingNote: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-900 mb-1">WhatsApp Invite Share Message</label>
            <textarea
              rows={3}
              value={config.whatsappShareText ?? ""}
              onChange={(e) => update({ whatsappShareText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
