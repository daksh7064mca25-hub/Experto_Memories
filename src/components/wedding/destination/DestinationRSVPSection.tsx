"use client";

import React, { useState } from "react";
import { WeddingRSVPConfig, WeddingEventData } from "@/types/website";
import { Mail, CheckCircle2, Send, Users, Sparkles, Heart } from "lucide-react";

interface DestinationRSVPSectionProps {
  config?: WeddingRSVPConfig;
  events?: WeddingEventData[];
  projectSlug?: string;
  previewMode?: boolean;
}

export const DestinationRSVPSection: React.FC<DestinationRSVPSectionProps> = ({
  config,
  events = [],
  projectSlug = "wedding",
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
      setErrorMsg("Please provide your name.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!previewMode) {
        const res = await fetch(`/api/gift/${projectSlug}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to submit RSVP. Please try again.");
        }
      } else {
        // Simulated submission in preview mode
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="sec-destination-rsvp" className="py-12 sm:py-20 px-3 sm:px-6 max-w-3xl mx-auto" aria-label="Guest RSVP Section">
      {/* High-Contrast Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2 sm:mb-3 bg-[#F4EFE6] border border-[#D4AF37]/50 text-[#8B6514] font-semibold shadow-xs">
          <Mail size={12} className="text-[#8B6514]" />
          <span>GUEST ATTENDANCE</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-3 text-[#0F2336]">
          {config?.headline || "Will You Celebrate With Us? 💌"}
        </h2>
        <p className="text-xs sm:text-base max-w-xl mx-auto font-serif italic text-[#2C4860] leading-relaxed px-2">
          {config?.subtext || "Your presence and blessings will make our coastal celebration truly unforgettable. Please confirm your attendance below."}
        </p>
        {config?.rsvpDeadlineText && (
          <p className="text-[11px] sm:text-xs font-semibold text-[#8B6514] font-mono uppercase tracking-wider mt-2">
            {config.rsvpDeadlineText}
          </p>
        )}
      </div>

      {/* Main Luxury RSVP Form Card */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-[#D4AF37]/40 shadow-xl bg-white text-[#0F2336] relative overflow-hidden">
        {/* Subtle Decorative Linen Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C5A36A_1px,transparent_1px)] [background-size:20px_20px]" />

        {isSubmitted ? (
          <div className="text-center py-6 sm:py-8 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 border border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2 text-[#0F2336]">
              RSVP Received with Joy &amp; Gratitude!
            </h3>
            <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6 text-[#2C4860] font-serif">
              {config?.confirmationMessage ||
                "Thank you for confirming your presence. Our families eagerly look forward to celebrating this beautiful journey with you!"}
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs font-mono text-[#8B6514] hover:underline cursor-pointer"
            >
              Submit another response or update details &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 relative z-10">
            {/* Attendance Choice */}
            <div>
              <label className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-2 text-[#0F2336]">
                Will you be attending our wedding? *
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendanceStatus: "attending" })}
                  className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] ${
                    formData.attendanceStatus === "attending"
                      ? "bg-[#0F2336] text-[#FAF8F5] border-[#0F2336] shadow-sm"
                      : "bg-stone-50 border-stone-200 text-[#2C4860] hover:bg-stone-100"
                  }`}
                >
                  <Sparkles size={14} className="text-[#E5C378]" />
                  <span>Joyfully Accept</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendanceStatus: "declined" })}
                  className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] ${
                    formData.attendanceStatus === "declined"
                      ? "bg-stone-700 text-white border-stone-700 shadow-sm"
                      : "bg-stone-50 border-stone-200 text-[#2C4860] hover:bg-stone-100"
                  }`}
                >
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* Guest Full Name */}
            <div>
              <label htmlFor="destGuestName" className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 text-[#0F2336]">
                Full Name *
              </label>
              <input
                id="destGuestName"
                type="text"
                required
                placeholder="e.g. Kabir & Natasha Mehra"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-stone-50 border border-stone-300 text-[#0F2336] placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white text-xs sm:text-sm min-h-[44px]"
              />
            </div>

            {/* Email & Phone Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="destGuestEmail" className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 text-[#0F2336]">
                  Email Address
                </label>
                <input
                  id="destGuestEmail"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-stone-50 border border-stone-300 text-[#0F2336] placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white text-xs sm:text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="destGuestPhone" className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 text-[#0F2336]">
                  Phone / WhatsApp
                </label>
                <input
                  id="destGuestPhone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-stone-50 border border-stone-300 text-[#0F2336] placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white text-xs sm:text-sm min-h-[44px]"
                />
              </div>
            </div>

            {/* If Attending: Number of Guests */}
            {formData.attendanceStatus === "attending" && config?.enablePlusOnes !== false && (
              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1.5 text-[#0F2336]">
                  Total Guests Attending
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, guestCount: num })}
                      className={`w-10 h-10 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer flex items-center justify-center ${
                        formData.guestCount === num
                          ? "bg-[#0F2336] text-[#FAF8F5] border-[#0F2336] shadow-xs"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-xs text-stone-500 font-serif ml-2">
                    {formData.guestCount === 1 ? "1 Guest" : `${formData.guestCount} Guests`}
                  </span>
                </div>
              </div>
            )}

            {/* Attending Ceremonies */}
            {formData.attendanceStatus === "attending" && events.length > 0 && (
              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-2 text-[#0F2336]">
                  Select the celebrations you will attend
                </label>
                <div className="space-y-2">
                  {events.map((evt) => {
                    const isChecked = formData.attendingEvents.includes(evt.title);
                    return (
                      <div
                        key={evt.id || evt.title}
                        onClick={() => toggleEvent(evt.title)}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition ${
                          isChecked
                            ? "bg-[#FDFBF7] border-[#D4AF37] text-[#0F2336] shadow-2xs"
                            : "bg-stone-50 border-stone-200 text-stone-500"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-semibold block truncate">{evt.title}</span>
                          <span className="text-[11px] text-stone-500 font-mono block">{evt.date} &bull; {evt.time}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Personal Blessing Note */}
            <div>
              <label htmlFor="destBlessing" className="block text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 text-[#0F2336]">
                Message / Warm Blessing for the Couple
              </label>
              <textarea
                id="destBlessing"
                rows={3}
                placeholder="Share your heartfelt wishes, happy advice, or favorite memory..."
                value={formData.personalBlessing}
                onChange={(e) => setFormData({ ...formData, personalBlessing: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-stone-50 border border-stone-300 text-[#0F2336] placeholder-stone-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white text-xs sm:text-sm"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-mono text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
                {errorMsg}
              </p>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-serif text-xs sm:text-sm uppercase tracking-wider font-bold text-[#091825] bg-gradient-to-r from-[#F7E1A0] via-[#E5C378] to-[#C89B3C] hover:from-[#FFF0C2] hover:to-[#DBA843] shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[46px]"
            >
              <Send size={15} />
              <span>{isSubmitting ? "Confirming Attendance..." : "Confirm RSVP & Send Blessings 💌"}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
