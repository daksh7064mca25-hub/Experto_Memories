"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Globe,
  Lock,
  ExternalLink,
  Check,
  AlertCircle,
  Copy,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ShieldAlert,
  Calendar,
  Clock,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { WebsiteProjectData } from "@/types/website";

function AdminCustomerWebsitesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") as any) || "all";

  const [projects, setProjects] = useState<WebsiteProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "domains" | "suspended" | "expired">(initialFilter);
  const [occasionFilter, setOccasionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Custom Domain Verification Modal State
  const [verifyingProj, setVerifyingProj] = useState<WebsiteProjectData | null>(null);
  const [domainStatus, setDomainStatus] = useState<"connected" | "failed">("connected");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmittingDomain, setIsSubmittingDomain] = useState(false);

  // Suspension Modal State
  const [suspendingProject, setSuspendingProject] = useState<WebsiteProjectData | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/websites", { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProjects();
    });
  }, [fetchProjects]);

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    try {
      const action = currentStatus === "published" ? "unpublish" : currentStatus === "suspended" ? "reactivate" : "publish";
      const res = await fetch(`/api/projects/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
        credentials: "include",
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleConfirmSuspend = async () => {
    if (!suspendingProject) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/projects/${suspendingProject._id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend", reason: suspendReason || "Administrative suspension" }),
        credentials: "include",
      });
      if (res.ok) {
        setSuspendingProject(null);
        setSuspendReason("");
        fetchProjects();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to suspend website");
      }
    } catch (err) {
      alert("Error suspending website");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtendHosting = async (id: string) => {
    if (!confirm("Extend hosting duration for this website by 12 months?")) return;
    try {
      const res = await fetch(`/api/projects/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extend_hosting", extendMonths: 12 }),
        credentials: "include",
      });
      if (res.ok) {
        alert("Hosting duration successfully extended by 12 months!");
        fetchProjects();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to extend hosting");
      }
    } catch {
      alert("Error extending hosting");
    }
  };

  const handleVerifyDomain = async () => {
    if (!verifyingProj) return;
    setIsSubmittingDomain(true);
    try {
      const res = await fetch(`/api/admin/custom-domains/${verifyingProj._id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: domainStatus,
          notes: adminNotes || undefined,
        }),
        credentials: "include",
      });

      if (res.ok) {
        setVerifyingProj(null);
        setAdminNotes("");
        fetchProjects();
      } else {
        alert("Domain verification failed");
      }
    } catch {
      alert("Error verifying domain");
    } finally {
      setIsSubmittingDomain(false);
    }
  };

  const copyUrl = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/gift/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const now = new Date();

  const filteredProjects = projects.filter((p) => {
    // Occasion filter
    if (occasionFilter !== "all" && p.occasionType !== occasionFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchRecipient = (p.recipientName || "").toLowerCase().includes(q);
      const matchSender = (p.senderName || "").toLowerCase().includes(q);
      const matchSlug = (p.slug || "").toLowerCase().includes(q);
      const matchCustomer = (p.customerEmail || "").toLowerCase().includes(q);
      if (!matchTitle && !matchRecipient && !matchSender && !matchSlug && !matchCustomer) {
        return false;
      }
    }

    const isExpired = p.hostingExpiresAt && new Date(p.hostingExpiresAt) < now;

    if (filter === "published") return p.status === "published" && !isExpired;
    if (filter === "draft") return p.status === "draft";
    if (filter === "suspended") return p.status === "suspended";
    if (filter === "expired") return Boolean(isExpired);
    if (filter === "domains") return Boolean(p.customDomain?.requested);
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            EXPERIENCE DIRECTORY
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight mt-0.5">
            Customer Gift Websites
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Search customer-authored websites across all occasions, inspect domains, manage suspensions, and extend hosting.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProjects}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm text-xs">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: "all", label: `All (${projects.length})` },
            { id: "published", label: `Live (${projects.filter((p) => p.status === "published").length})` },
            { id: "draft", label: `Drafts (${projects.filter((p) => p.status === "draft").length})` },
            { id: "domains", label: `Domains (${projects.filter((p) => p.customDomain?.requested).length})` },
            { id: "suspended", label: `Suspended (${projects.filter((p) => p.status === "suspended").length})` },
            { id: "expired", label: `Expired (${projects.filter((p) => p.hostingExpiresAt && new Date(p.hostingExpiresAt) < now).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filter === tab.id ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Occasion & Search Inputs */}
        <div className="flex items-center gap-2">
          <select
            value={occasionFilter}
            onChange={(e) => setOccasionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 text-stone-700 focus:outline-none"
          >
            <option value="all">All Occasions</option>
            <option value="wedding">Wedding Invitation</option>
            <option value="love">Love &amp; Romance</option>
            <option value="anniversary">Anniversary</option>
            <option value="birthday">Birthday</option>
            <option value="apology">Apology</option>
          </select>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search title, recipient, sender, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-stone-400" />
          </div>
        </div>
      </div>

      {/* Main Websites Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-mono uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-3.5 px-5">Project Title</th>
                <th className="py-3.5 px-5">Occasion</th>
                <th className="py-3.5 px-5">Customer &amp; Parties</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Custom Domain</th>
                <th className="py-3.5 px-5">Hosting Expiry</th>
                <th className="py-3.5 px-5">Publish Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No website projects found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const isPublished = p.status === "published";
                  const isSuspended = p.status === "suspended";
                  const isPaid = p.paymentStatus === "paid";
                  const isExpired = p.hostingExpiresAt && new Date(p.hostingExpiresAt) < now;

                  return (
                    <tr key={p._id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Title & Slug */}
                      <td className="py-3.5 px-5">
                        <span className="font-serif font-bold text-stone-900 block text-sm">
                          {p.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-stone-400">
                          <span>/gift/{p.slug}</span>
                          {p.isPasswordProtected && (
                            <span className="text-amber-700 bg-amber-50 px-1.5 rounded flex items-center gap-0.5">
                              <Lock size={9} /> Protected
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Occasion */}
                      <td className="py-3.5 px-5 font-bold uppercase text-[10px] text-rose-700">
                        {p.occasionType || "Gift"}
                      </td>

                      {/* Customer & Parties */}
                      <td className="py-3.5 px-5">
                        <span className="text-stone-800 font-medium block">
                          To: {p.recipientName} {p.senderName ? `(From: ${p.senderName})` : ""}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 block truncate max-w-[160px]">
                          {p.customerEmail || "Guest / Direct"}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-5">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Paid
                          </span>
                        ) : p.paymentStatus === "refunded" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </td>

                      {/* Custom Domain */}
                      <td className="py-3.5 px-5">
                        {p.customDomain?.requested ? (
                          <div className="space-y-1">
                            <span className="font-mono text-stone-800 text-[11px] block font-semibold">
                              {p.customDomain.domainName}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  p.customDomain.status === "connected"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : p.customDomain.status === "verification_pending"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-stone-100 text-stone-600"
                                }`}
                              >
                                {p.customDomain.status}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setVerifyingProj(p);
                                  setDomainStatus("connected");
                                  setAdminNotes("");
                                }}
                                className="text-[10px] text-blue-600 hover:underline font-bold"
                              >
                                Verify
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Hosting Expiry */}
                      <td className="py-3.5 px-5 font-mono text-[11px]">
                        {p.hostingExpiresAt ? (
                          <div>
                            <span className={isExpired ? "text-rose-600 font-bold" : "text-stone-700"}>
                              {new Date(p.hostingExpiresAt).toLocaleDateString()}
                            </span>
                            {isExpired && (
                              <span className="text-[9px] text-rose-600 block font-bold uppercase">
                                EXPIRED
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        {isSuspended ? (
                          <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            Suspended
                          </span>
                        ) : isPublished ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`/gift/${p.slug}?preview=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                            title="Preview Website"
                          >
                            <ExternalLink size={14} />
                          </a>

                          <button
                            type="button"
                            onClick={() => copyUrl(p.slug)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                            title="Copy Link"
                          >
                            {copiedSlug === p.slug ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleExtendHosting(p._id || "")}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Extend Hosting (12 Months)"
                          >
                            <PlusCircle size={14} />
                          </button>

                          {isPublished ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSuspendingProject(p);
                                setSuspendReason("");
                              }}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                              title="Suspend Public Access"
                            >
                              Suspend
                            </button>
                          ) : isSuspended ? (
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(p._id || "", p.status)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              Re-activate
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspension Modal */}
      {suspendingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Suspend Website Access
                </h3>
                <p className="text-xs text-stone-500">{suspendingProject.title}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Suspending this website will immediately block public visitors from viewing it at <code>/gift/{suspendingProject.slug}</code>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Reason for Suspension (Audit Log)
              </label>
              <textarea
                rows={3}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g. Inappropriate content, copyright dispute, or customer request."
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendingProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmSuspend}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                {actionLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                <span>Confirm Suspension</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Custom Domain Verification Modal */}
      {verifyingProj && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
              Verify Custom Domain
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Project: <strong>{verifyingProj.title}</strong>
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-1 mb-4 font-mono">
              <p>Requested Domain: <strong className="text-stone-900">{verifyingProj.customDomain?.domainName}</strong></p>
              <p>Target CNAME: <strong className="text-blue-700">cname.expertomemories.shop</strong></p>
              <p>Current Status: <span className="uppercase text-amber-700">{verifyingProj.customDomain?.status}</span></p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Verification Action
                </label>
                <select
                  value={domainStatus}
                  onChange={(e) => setDomainStatus(e.target.value as any)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-200 bg-white"
                >
                  <option value="connected">Approve &amp; Mark Connected (DNS verified)</option>
                  <option value="failed">Reject / Flag DNS Misconfigured</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Administrative Notes / Customer Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. CNAME propagation verified on Cloudflare edge."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingProj(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingDomain}
                  onClick={handleVerifyDomain}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
                >
                  {isSubmittingDomain ? "Updating..." : "Save Domain Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCustomerWebsitesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-stone-500">
          <Loader2 size={32} className="animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs">Loading customer websites...</p>
        </div>
      }
    >
      <AdminCustomerWebsitesContent />
    </Suspense>
  );
}
