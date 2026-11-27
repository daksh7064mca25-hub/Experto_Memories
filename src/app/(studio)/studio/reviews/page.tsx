"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MessageSquareHeart,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  X,
  Trash2,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import { ReviewCategory, ReviewStatus } from "@/types/review";

interface ReviewItem {
  id: string;
  customerName: string;
  avatarInitials: string;
  rating: number;
  reviewText: string;
  category: ReviewCategory;
  reviewDate: string;
  isVerifiedPurchase: boolean;
  status: ReviewStatus;
  consentForDisplay: boolean;
  submittedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  moderationNote?: string;
  verifiedOrderId?: string;
}

interface ReviewCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageApprovedRating: number;
}

function StudioReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "all";

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [counts, setCounts] = useState<ReviewCounts>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageApprovedRating: 5.0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<ReviewCategory>("Love & Relationship");
  const [editRating, setEditRating] = useState(5);
  const [editReviewText, setEditReviewText] = useState("");
  const [editStatus, setEditStatus] = useState<ReviewStatus>("pending");
  const [editNote, setEditNote] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [rejectingReview, setRejectingReview] = useState<ReviewItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSavingReject, setIsSavingReject] = useState(false);

  const [deletingReview, setDeletingReview] = useState<ReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("page", page.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/admin/reviews?${params.toString()}`, { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch reviews");
      }

      setReviews(data.reviews || []);
      if (data.counts) {
        setCounts(data.counts);
      }
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch (err: any) {
      console.error("Failed to fetch admin reviews:", err);
      setError(err.message || "Failed to load reviews. Please check connection.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchQuery, page, router]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchReviews();
    });
  }, [fetchReviews]);

  // Clear toast notifications after 4 seconds
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  // Quick Approve
  const handleQuickApprove = async (rev: ReviewItem) => {
    if (!rev.consentForDisplay) {
      setError("Cannot approve review: Customer has not granted public display consent.");
      return;
    }
    try {
      setError(null);
      const res = await fetch(`/api/admin/reviews/${rev.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "approved",
          moderationNote: rev.moderationNote || "Approved for public website display",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to approve review");
      }

      setActionSuccess(`Review by ${rev.customerName} has been approved and is now live!`);
      fetchReviews();
    } catch (err: any) {
      setError(err.message || "Approval failed");
    }
  };

  // Open Edit Modal
  const openEditModal = (rev: ReviewItem) => {
    setEditingReview(rev);
    setEditName(rev.customerName);
    setEditCategory(rev.category);
    setEditRating(rev.rating);
    setEditReviewText(rev.reviewText);
    setEditStatus(rev.status);
    setEditNote(rev.moderationNote || "");
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    try {
      setIsSavingEdit(true);
      setError(null);

      const res = await fetch(`/api/admin/reviews/${editingReview.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerName: editName.trim(),
          category: editCategory,
          rating: editRating,
          reviewText: editReviewText.trim(),
          status: editStatus,
          moderationNote: editNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update review");
      }

      setActionSuccess("Review details and moderation status successfully updated.");
      setEditingReview(null);
      fetchReviews();
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Reject Modal
  const openRejectModal = (rev: ReviewItem) => {
    setRejectingReview(rev);
    setRejectReason(rev.moderationNote || "Does not meet publishing guidelines or content quality.");
  };

  // Confirm Reject
  const handleConfirmReject = async () => {
    if (!rejectingReview) return;
    try {
      setIsSavingReject(true);
      setError(null);

      const res = await fetch(`/api/admin/reviews/${rejectingReview.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "rejected",
          moderationNote: rejectReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reject review");
      }

      setActionSuccess(`Review by ${rejectingReview.customerName} has been rejected.`);
      setRejectingReview(null);
      fetchReviews();
    } catch (err: any) {
      setError(err.message || "Rejection failed");
    } finally {
      setIsSavingReject(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingReview) return;
    try {
      setIsDeleting(true);
      setError(null);

      const res = await fetch(`/api/admin/reviews/${deletingReview.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete review");
      }

      setActionSuccess("Review permanently deleted.");
      setDeletingReview(null);
      fetchReviews();
    } catch (err: any) {
      setError(err.message || "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: "all", label: "All Reviews", count: counts.total },
    {
      id: "pending",
      label: "Pending Moderation",
      count: counts.pending,
      highlight: counts.pending > 0,
    },
    { id: "approved", label: "Approved (Live)", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            MODERATION &amp; TRUST
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Customer Reviews
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review customer submissions, verify celebration stories, inspect consent, and manage testimonials on the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Notifications / Alerts */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500">Total Submissions</span>
            <MessageSquareHeart size={15} className="text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{counts.total}</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-xs transition-colors ${
          counts.pending > 0 ? "bg-amber-50/70 border-amber-200" : "bg-white border-stone-200"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-medium ${counts.pending > 0 ? "text-amber-800" : "text-stone-500"}`}>
              Pending Review
            </span>
            <Clock size={15} className={counts.pending > 0 ? "text-amber-600" : "text-stone-400"} />
          </div>
          <div className={`text-2xl font-bold mt-1 ${counts.pending > 0 ? "text-amber-900" : "text-stone-900"}`}>
            {counts.pending}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500">Approved (Live)</span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{counts.approved}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500">Rejected</span>
            <XCircle size={15} className="text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-stone-600 mt-1">{counts.rejected}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500">Avg Approved Rating</span>
            <Star size={15} className="fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-1 flex items-baseline gap-1">
            <span>{counts.averageApprovedRating.toFixed(1)}</span>
            <span className="text-xs font-normal text-stone-400">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search reviewer name, review text, or review ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">
            Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Love & Relationship">Love &amp; Relationship</option>
            <option value="Wedding Invitations">Wedding Invitations</option>
            <option value="Birthday Gifts">Birthday Gifts</option>
            <option value="Anniversary Keepsakes">Anniversary Keepsakes</option>
            <option value="Personalized Memories">Personalized Memories</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200/80 text-xs font-semibold">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? "bg-stone-900 text-white shadow-xs"
                  : tab.highlight
                  ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-stone-700 text-stone-200"
                    : tab.highlight
                    ? "bg-amber-200 text-amber-900 font-bold"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reviews Content Area */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw size={24} className="animate-spin text-stone-400 mx-auto" />
          <p className="text-xs text-stone-500 font-mono">Loading customer reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <MessageSquareHeart size={22} />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">No Reviews Found</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {statusFilter !== "all" || categoryFilter !== "all" || searchQuery
              ? "No reviews match the selected filter criteria. Try clearing your search or filters."
              : "No customer reviews have been submitted yet. Submissions from the public 'Share Your Experience' form will appear here for moderation."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-all space-y-4"
            >
              {/* Header row: Customer info, rating, status badges, actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-50 to-amber-50 border border-stone-200 flex items-center justify-center text-xs font-serif font-bold text-stone-800 shrink-0">
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-stone-900 text-base">
                        {rev.customerName}
                      </h3>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          <ShieldCheck size={10} /> Verified Purchase
                        </span>
                      )}
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                        {rev.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                      {/* Stars */}
                      <div className="flex items-center gap-0.5" aria-label={`${rev.rating} out of 5 stars`}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-400">&bull;</span>
                      <span className="text-[11px] font-mono text-stone-500">
                        Submitted: {new Date(rev.submittedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[11px] text-stone-400">&bull;</span>
                      {rev.consentForDisplay ? (
                        <span className="text-[10px] font-semibold text-emerald-700 inline-flex items-center gap-0.5">
                          <CheckCircle2 size={11} /> Consent Granted
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-rose-600 inline-flex items-center gap-0.5">
                          <XCircle size={11} /> No Consent
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {/* Status Pill */}
                  {rev.status === "approved" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Approved
                    </span>
                  ) : rev.status === "rejected" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-rose-100 text-rose-800 font-semibold px-2.5 py-1 rounded-full">
                      <XCircle size={12} /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full">
                      <Clock size={12} /> Pending Review
                    </span>
                  )}

                  {/* Quick Action Buttons */}
                  {rev.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => handleQuickApprove(rev)}
                      disabled={!rev.consentForDisplay}
                      title={!rev.consentForDisplay ? "Cannot approve without consent" : "Approve review for public display"}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold shadow-2xs transition-colors ${
                        rev.consentForDisplay
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-stone-200 text-stone-400 cursor-not-allowed"
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve</span>
                    </button>
                  )}

                  {rev.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => openRejectModal(rev)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                    title="Edit review details"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingReview(rev)}
                    className="p-1.5 rounded-lg border border-stone-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Review Text Body */}
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100 text-stone-800 text-xs sm:text-sm leading-relaxed italic font-serif">
                &ldquo;{rev.reviewText}&rdquo;
              </div>

              {/* Moderation Notes & Audit Trail Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-400 pt-1 gap-2 border-t border-stone-100">
                <div className="flex items-center gap-2 flex-wrap">
                  {rev.moderatedBy && (
                    <span>
                      Moderated by <strong className="text-stone-600">{rev.moderatedBy}</strong>
                      {rev.moderatedAt && ` on ${new Date(rev.moderatedAt).toLocaleDateString("en-IN")}`}
                    </span>
                  )}
                  {rev.moderationNote && (
                    <span className="text-stone-500 italic">
                      &bull; Note: &quot;{rev.moderationNote}&quot;
                    </span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-stone-400">
                  ID: {rev.id}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs text-stone-600">
              <div>
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total reviews)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingReview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
                EDIT &amp; MODERATE
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                Review Details
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Celebration Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ReviewCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="Love & Relationship">Love &amp; Relationship</option>
                    <option value="Wedding Invitations">Wedding Invitations</option>
                    <option value="Birthday Gifts">Birthday Gifts</option>
                    <option value="Anniversary Keepsakes">Anniversary Keepsakes</option>
                    <option value="Personalized Memories">Personalized Memories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Moderation Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ReviewStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white font-semibold"
                >
                  <option value="pending">Pending Moderation</option>
                  <option value="approved">Approved (Live on Public Website)</option>
                  <option value="rejected">Rejected (Hidden from Public)</option>
                </select>
                {editStatus === "approved" && !editingReview.consentForDisplay && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertTriangle size={12} /> Notice: Customer did not check consent. Publishing requires explicit consent.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Review Text
                </label>
                <textarea
                  required
                  rows={4}
                  value={editReviewText}
                  onChange={(e) => setEditReviewText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-serif resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Admin Moderation Note (Internal)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified wedding photos, checked anniversary date..."
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs disabled:opacity-50"
                >
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingReview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <XCircle size={20} />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Reject Customer Review
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Rejecting this review will prevent it from ever being displayed publicly on the ExpertoMemories website.
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-stone-700">
                Reason / Internal Note:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (e.g. Profanity, spam, unrelated inquiry)..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingReview(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingReject}
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isSavingReject ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingReview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 size={20} />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Permanently Delete Review?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to delete the review by <strong>{deletingReview.customerName}</strong>? This action cannot be undone and will be recorded in the security audit logs.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingReview(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudioReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center space-y-3">
          <RefreshCw size={24} className="animate-spin text-stone-400 mx-auto" />
          <p className="text-xs text-stone-500 font-mono">Loading reviews management...</p>
        </div>
      }
    >
      <StudioReviewsContent />
    </Suspense>
  );
}
