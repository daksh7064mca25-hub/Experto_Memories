"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MessageSquareHeart,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getHomepageReviews } from "@/config/reviews";
import { CustomerReview, ReviewCategory } from "@/types/review";

export function CustomerReviewsSection() {
  const initialData = getHomepageReviews();
  const [reviews, setReviews] = useState<CustomerReview[]>(initialData.reviews);
  const [hasGenuineReviews, setHasGenuineReviews] = useState(initialData.hasGenuineReviews);
  const [isDevelopmentPreview, setIsDevelopmentPreview] = useState(initialData.isDevelopmentPreview);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Submission Form State (for customer reviews)
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formCategory, setFormCategory] =
    useState<ReviewCategory>("Love & Relationship");
  const [formText, setFormText] = useState("");
  const [formConsent, setFormConsent] = useState(false);

  // Fetch approved customer reviews dynamically
  useEffect(() => {
    let isMounted = true;
    async function loadApprovedReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.reviews && Array.isArray(data.reviews)) {
          if (data.reviews.length > 0) {
            setReviews(data.reviews);
            setHasGenuineReviews(true);
            setIsDevelopmentPreview(false);
          }
        }
      } catch (err) {
        // Fall back gracefully to initial static or empty state
        console.error("Failed to load approved reviews:", err);
      }
    }
    loadApprovedReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNextMobile = () => {
    setActiveMobileIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrevMobile = () => {
    setActiveMobileIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const trimmedName = formName.trim();
    const trimmedText = formText.trim();

    if (trimmedName.length < 2) {
      setSubmitError("Please enter your name or initials (at least 2 characters).");
      return;
    }
    if (trimmedText.length < 10) {
      setSubmitError("Please share at least a few words about your experience (minimum 10 characters).");
      return;
    }
    if (trimmedText.length > 1000) {
      setSubmitError("Review text cannot exceed 1,000 characters.");
      return;
    }
    if (!formConsent) {
      setSubmitError("Please confirm your consent for public display.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: trimmedName,
          category: formCategory,
          rating: formRating,
          reviewText: trimmedText,
          consentForDisplay: formConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review. Please try again.");
      }

      setSubmittedSuccess(true);
      setFormName("");
      setFormRating(5);
      setFormCategory("Love & Relationship");
      setFormText("");
      setFormConsent(false);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong while submitting. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormRating(5);
    setFormCategory("Love & Relationship");
    setFormText("");
    setFormConsent(false);
    setSubmittedSuccess(false);
    setSubmitError(null);
    setIsSubmitModalOpen(false);
  };

  return (
    <section
      id="reviews"
      aria-label="Customer Reviews & Testimonials"
      className="py-20 sm:py-28 bg-[#FAF7F2] border-t border-[#EAE3D9] px-6 sm:px-10 relative overflow-hidden"
    >
      {/* Subtle Ambient Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
            <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
              Real Celebrations
            </span>
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
            Loved by Our Customers
          </h2>

          <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
            Real stories. Real celebrations. Real experiences.
          </p>

          {/* Development / Preview Transparency Notice */}
          {isDevelopmentPreview && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-[#78716C] bg-white/80 border border-[#E0D8CB] px-3.5 py-1 rounded-full shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A]" />
                <span>Development Preview • Illustrative customer stories for local review</span>
              </span>
            </div>
          )}
        </div>

        {/* REVIEWS DISPLAY */}
        {reviews.length > 0 ? (
          <>
            {/* DESKTOP REVIEWS GRID (Balanced 3 cards per row across 2 rows) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="group relative rounded-3xl bg-[#FCFAF7] border border-[#EAE3D9] hover:border-[#541D2B]/30 p-7 lg:p-8 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Top: Customer Profile & Review Text */}
                  <div className="space-y-4">
                    {/* Header: Photo, Name, and Date (No Category Badge) */}
                    <div className="flex items-center gap-3.5">
                      {rev.photoUrl ? (
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D5C2A4] shrink-0 shadow-2xs bg-stone-100">
                          <Image
                            src={rev.photoUrl}
                            alt={rev.customerName}
                            width={44}
                            height={44}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FAF5EB] via-[#F4ECE0] to-[#E5DAC8] border border-[#D5C2A4] shrink-0 flex items-center justify-center text-xs font-serif font-bold text-[#541D2B] shadow-2xs">
                          {rev.avatarInitials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif font-bold text-base text-[#211715] leading-snug truncate">
                          {rev.customerName}
                        </h3>
                        <p className="text-[11px] font-sans text-[#8C7E75]">
                          {rev.reviewDate}
                        </p>
                      </div>
                    </div>

                    {/* 5-Star Rating (Muted Gold) */}
                    <div
                      className="flex items-center gap-1 pt-0.5"
                      aria-label={`${rev.rating} out of 5 stars`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < rev.rating
                              ? "fill-[#C5A36A] text-[#C5A36A]"
                              : "text-[#E0D8CB]"
                          }
                        />
                      ))}
                    </div>

                    {/* Review Quote */}
                    <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed italic font-serif pt-1">
                      &ldquo;{rev.reviewText}&rdquo;
                    </p>
                  </div>

                  {/* Clean Bottom Strip (No Sample Preview Label) */}
                  <div className="pt-5 mt-4 border-t border-[#F2EDE5] flex items-center justify-between text-[10px] font-mono">
                    {rev.isVerifiedPurchase && !rev.isSample ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                        <ShieldCheck size={12} className="text-emerald-700" />
                        <span>Verified Recipient</span>
                      </span>
                    ) : (
                      <span className="text-transparent select-none">&bull;</span>
                    )}
                    <span className="text-[#C5A36A] font-bold tracking-wider">
                      ✦ ExpertoMemories
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* MOBILE VIEW (Smooth Swipeable Single-Card Carousel) */}
            <div className="md:hidden space-y-4">
              <div className="relative overflow-hidden">
                {reviews.map((rev, index) => {
                  if (index !== activeMobileIndex) return null;
                  return (
                    <div
                      key={rev.id}
                      className="rounded-3xl bg-[#FCFAF7] border border-[#EAE3D9] p-6 space-y-4 shadow-sm animate-in fade-in duration-200"
                    >
                      {/* Mobile Header: Photo, Name, and Date */}
                      <div className="flex items-center gap-3">
                        {rev.photoUrl ? (
                          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D5C2A4] shrink-0 bg-stone-100 shadow-2xs">
                            <Image
                              src={rev.photoUrl}
                              alt={rev.customerName}
                              width={44}
                              height={44}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FAF5EB] via-[#F4ECE0] to-[#E5DAC8] border border-[#D5C2A4] shrink-0 flex items-center justify-center text-xs font-serif font-bold text-[#541D2B]">
                            {rev.avatarInitials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif font-bold text-base text-[#211715]">
                            {rev.customerName}
                          </h3>
                          <p className="text-[11px] font-sans text-[#8C7E75]">
                            {rev.reviewDate}
                          </p>
                        </div>
                      </div>

                      {/* 5 Stars */}
                      <div
                        className="flex items-center gap-1"
                        aria-label={`${rev.rating} out of 5 stars`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < rev.rating
                                ? "fill-[#C5A36A] text-[#C5A36A]"
                                : "text-[#E0D8CB]"
                            }
                          />
                        ))}
                      </div>

                      {/* Review Quote */}
                      <p className="text-xs text-[#57534E] leading-relaxed italic font-serif">
                        &ldquo;{rev.reviewText}&rdquo;
                      </p>

                      {/* Clean Mobile Bottom */}
                      <div className="pt-3 border-t border-[#F2EDE5] flex items-center justify-between text-[10px] font-mono">
                        {rev.isVerifiedPurchase && !rev.isSample ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                            <ShieldCheck size={12} className="text-emerald-700" />
                            <span>Verified Recipient</span>
                          </span>
                        ) : (
                          <span className="text-transparent select-none">&bull;</span>
                        )}
                        <span className="text-[#C5A36A] font-bold">
                          ✦ ExpertoMemories
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Carousel Controls */}
              <div className="flex items-center justify-between pt-2 px-2">
                <button
                  type="button"
                  onClick={handlePrevMobile}
                  className="p-2 rounded-full border border-[#E0D8CB] bg-white text-[#211715] hover:bg-[#F2EDE5] transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* 6 Dots Pagination */}
                <div className="flex items-center gap-1.5">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveMobileIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        activeMobileIndex === i
                          ? "bg-[#541D2B] w-5"
                          : "bg-[#D8CDBD] hover:bg-[#8C7E75] w-2"
                      }`}
                      aria-label={`Go to review ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextMobile}
                  className="p-2 rounded-full border border-[#E0D8CB] bg-white text-[#211715] hover:bg-[#F2EDE5] transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State (Production when genuine reviews are pending approval) */
          <div className="max-w-xl mx-auto rounded-3xl bg-[#FCFAF7] border border-[#EAE3D9] p-8 sm:p-10 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#541D2B]/10 text-[#541D2B] flex items-center justify-center mx-auto">
              <MessageSquareHeart size={22} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#211715]">
              Be the First to Share Your Celebration Story
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
              We recently unveiled our bespoke digital gift websites. If you have celebrated an anniversary, wedding, or birthday with us, we invite you to share your experience.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#541D2B] text-white hover:bg-[#431622] transition-colors shadow-sm"
              >
                Share Your Experience
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM INVITATION: SHARE YOUR STORY */}
        {reviews.length > 0 && (
          <div className="text-center pt-2">
            <p className="text-xs text-[#78716C]">
              Created a celebration with ExpertoMemories?{" "}
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="font-serif font-bold text-[#541D2B] hover:underline underline-offset-4 inline-flex items-center gap-1"
              >
                <span>Share your experience</span>
                <MessageSquareHeart size={12} className="text-[#C5A36A]" />
              </button>
            </p>
          </div>
        )}
      </div>

      {/* SHARE YOUR EXPERIENCE MODAL */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E0D8CB] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              type="button"
              onClick={resetForm}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {submittedSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#211715]">
                  Thank You for Sharing
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Your feedback has been received. In accordance with our honesty standards, all genuine submissions are reviewed and moderated by our team before appearing publicly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#541D2B] text-white hover:bg-[#431622] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
                    Share Your Experience
                  </h3>
                  <p className="text-xs text-[#78716C] mt-1">
                    Your genuine story helps others celebrate moments that matter.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Display Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#292524]">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Priya S. or Ananya & Kabir"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D8CDBD] bg-white focus:outline-none focus:ring-1 focus:ring-[#541D2B]"
                  />
                </div>

                {/* Category & Rating */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#292524]">
                      Celebration Vertical
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(e.target.value as ReviewCategory)
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#D8CDBD] bg-white focus:outline-none focus:ring-1 focus:ring-[#541D2B]"
                    >
                      <option value="Love & Relationship">Love &amp; Relationship</option>
                      <option value="Wedding Invitations">Wedding Invitations</option>
                      <option value="Birthday Gifts">Birthday Gifts</option>
                      <option value="Anniversary Keepsakes">Anniversary Keepsakes</option>
                      <option value="Personalized Memories">Personalized Memories</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#292524]">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1.5 pt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="p-0.5 text-[#C5A36A] transition-transform hover:scale-115"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            size={16}
                            className={
                              star <= formRating
                                ? "fill-[#C5A36A] text-[#C5A36A]"
                                : "text-[#D8CDBD]"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#292524]">
                      Your Experience
                    </label>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {formText.length}/1000
                    </span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    maxLength={1000}
                    placeholder="Tell us about the emotional reaction of your partner, friend, or wedding guests..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D8CDBD] bg-white focus:outline-none focus:ring-1 focus:ring-[#541D2B] resize-none"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formConsent}
                    onChange={(e) => setFormConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#541D2B] focus:ring-[#541D2B]"
                  />
                  <label htmlFor="consent" className="text-[11px] text-[#78716C] leading-snug">
                    I confirm this is my genuine experience and grant permission to display this review on ExpertoMemories after moderation.
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#78716C] hover:bg-[#F2EDE5] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#541D2B] text-white hover:bg-[#431622] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit for Moderation</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
