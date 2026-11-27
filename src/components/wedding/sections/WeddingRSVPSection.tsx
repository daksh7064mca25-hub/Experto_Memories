"use client";

import React, { useState } from "react";
import { WeddingRSVPConfig, WeddingEventData } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Mail, CheckCircle2, Send, Users, Sparkles, Heart } from "lucide-react";

interface Props {
  config: WeddingRSVPConfig;
  theme: WeddingThemeStyles;
  events?: WeddingEventData[];
  projectSlug: string;
  previewMode?: boolean;
}

export const WeddingRSVPSection: React.FC<Props> = ({
  config,
  theme,
  events = [],
  projectSlug,
  previewMode = false,
}) => {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    attendanceStatus: "attending" as "attending" | "declined",
    guestCount: 2,
    attendingEvents: events.map((e) => e.title),
    dietaryNotes: "",
    personalBlessing: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleEvent = (eventTitle: string) => {
    setFormData((prev) => {
      const exists = prev.attendingEvents.includes(eventTitle);
      const updated = exists
        ? prev.attendingEvents.filter((t) => t !== eventTitle)
        : [...prev.attendingEvents, eventTitle];
      return { ...prev, attendingEvents: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.guestName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (previewMode) {
        // Simulate in preview
        await new Promise((r) => setTimeout(r, 600));
        setIsSubmitted(true);
        setIsSubmitting(false);
        return;
      }

      const res = await fetch(`/api/gift/${projectSlug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug,
          ...formData,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit RSVP. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto" id="rsvp-section">
      {/* Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <Mail size={13} className="text-[#D4AF37]" />
          <span>Guest Attendance</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {config.headline || "Will You Celebrate With Us?"}
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {config.subtext}
        </p>
        {config.rsvpDeadlineText && (
          <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mt-2">
            {config.rsvpDeadlineText}
          </p>
        )}
      </div>

      {/* Form Card or Success Confirmation */}
      <div className={`rounded-3xl p-6 sm:p-10 border shadow-2xl relative ${theme.cardBg} ${theme.cardBorder}`}>
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className={`font-serif text-2xl font-bold mb-2 ${theme.textPrimary}`}>
              RSVP Received with Gratitude!
            </h3>
            <p className={`text-sm max-w-md mx-auto leading-relaxed mb-6 ${theme.textSecondary}`}>
              {config.confirmationMessage ||
                "Thank you for confirming your presence. Our families eagerly await the joy of celebrating this sacred union with you!"}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-[#D4AF37] hover:underline"
            >
              Submit another response or update details
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attendance Choice */}
            <div>
              <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${theme.textMuted}`}>
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendanceStatus: "attending" })}
                  className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                    formData.attendanceStatus === "attending"
                      ? "bg-[#D4AF37] text-[#2E0B14] border-[#D4AF37] shadow-md"
                      : "bg-white/5 border-white/10 text-[#E6D9C8] hover:bg-white/10"
                  }`}
                >
                  <Sparkles size={14} className="shrink-0" />
                  <span className="truncate">Joyfully Accept</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendanceStatus: "declined" })}
                  className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                    formData.attendanceStatus === "declined"
                      ? "bg-stone-700 text-white border-stone-500 shadow-md"
                      : "bg-white/5 border-white/10 text-[#E6D9C8] hover:bg-white/10"
                  }`}
                >
                  <span className="truncate">Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* Guest Name */}
            <div>
              <label htmlFor="guestName" className={`block text-xs uppercase tracking-wider font-semibold mb-1.5 ${theme.textMuted}`}>
                Full Name *
              </label>
              <input
                id="guestName"
                type="text"
                required
                placeholder="e.g. Ramesh & Priya Mehta"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guestEmail" className={`block text-xs uppercase tracking-wider font-semibold mb-1.5 ${theme.textMuted}`}>
                  Email Address
                </label>
                <input
                  id="guestEmail"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>
              <div>
                <label htmlFor="guestPhone" className={`block text-xs uppercase tracking-wider font-semibold mb-1.5 ${theme.textMuted}`}>
                  Phone / WhatsApp
                </label>
                <input
                  id="guestPhone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>
            </div>

            {/* Only if attending: guest count and event checkboxes */}
            {formData.attendanceStatus === "attending" && (
              <>
                {/* Guest Count */}
                <div>
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-1.5 ${theme.textMuted}`}>
                    Number of Guests Attending
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.guestCount}
                      onChange={(e) =>
                        setFormData({ ...formData, guestCount: Math.max(1, parseInt(e.target.value) || 1) })
                      }
                      className="w-24 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-center font-bold text-base focus:outline-none focus:border-[#D4AF37]"
                    />
                    <span className="text-xs text-[#E6D9C8]/80">
                      Including yourself and accompanying family members
                    </span>
                  </div>
                </div>

                {/* Events attending checkboxes */}
                {events.length > 0 && (
                  <div>
                    <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${theme.textMuted}`}>
                      Which events will you grace with your presence?
                    </label>
                    <div className="space-y-2">
                      {events.map((evt, idx) => {
                        const checked = formData.attendingEvents.includes(evt.title);
                        return (
                          <div
                            key={evt.id || idx}
                            onClick={() => toggleEvent(evt.title)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              checked
                                ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#FAF7F2]"
                                : "bg-black/20 border-white/10 text-stone-400 hover:bg-black/30"
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-serif">{evt.title}</span>
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                                checked
                                  ? "bg-[#D4AF37] border-[#D4AF37] text-[#2E0B14]"
                                  : "border-stone-500"
                              }`}
                            >
                              {checked && <CheckCircle2 size={14} className="stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dietary Notes */}
                {config.enableMealPreferences && (
                  <div>
                    <label htmlFor="dietaryNotes" className={`block text-xs uppercase tracking-wider font-semibold mb-1.5 ${theme.textMuted}`}>
                      Dietary Preferences / Food Allergies
                    </label>
                    <input
                      id="dietaryNotes"
                      type="text"
                      placeholder="e.g. Jain Vegetarian, Vegan, Nut allergy, etc."
                      value={formData.dietaryNotes}
                      onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>
                )}
              </>
            )}

            {/* Personal Blessing Note */}
            {config.enableBlessings && (
              <div>
                <label htmlFor="personalBlessing" className={`block text-xs uppercase tracking-wider font-semibold mb-1.5 ${theme.textMuted}`}>
                  A Blessing or Warm Wishes for the Couple
                </label>
                <textarea
                  id="personalBlessing"
                  rows={3}
                  placeholder="Write a heartfelt blessing for Aarav & Roshni..."
                  value={formData.personalBlessing}
                  onChange={(e) => setFormData({ ...formData, personalBlessing: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
                />
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/50 p-3 rounded-xl border border-rose-800">
                {errorMsg}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-base font-serif font-bold transition flex items-center justify-center gap-2 cursor-pointer ${theme.buttonPrimary}`}
            >
              {isSubmitting ? (
                <span>Submitting Your Response...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send RSVP to Families</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
