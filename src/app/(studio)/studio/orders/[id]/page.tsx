"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  CreditCard,
  QrCode,
  User,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
  XCircle,
  Calendar,
  History,
  Layers,
  Sparkles,
  RefreshCw,
  Music,
  Image as ImageIcon,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import type { OrderData, OrderItem, AuditTrailEntry, PaymentStatus, OrderStatus } from "@/types/order";

export default function AdminOrderDetailPage({
  params,
}: {
  params?: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const routeParams = useParams();

  // Bulletproof parameter resolution:
  // Handles plain object (Netlify), Promise (Next.js SSR), or useParams hook
  let idFromProps = "";
  if (params) {
    if (typeof (params as any).then === "function") {
      const resolved = use(params as Promise<{ id: string }>);
      if (resolved && resolved.id) idFromProps = resolved.id;
    } else if (typeof params === "object" && (params as any).id) {
      idFromProps = (params as any).id;
    }
  }

  const orderId =
    idFromProps ||
    (typeof routeParams?.id === "string"
      ? routeParams.id
      : Array.isArray(routeParams?.id)
      ? routeParams.id[0]
      : "") ||
    "";

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [suspendWebsiteOnRefund, setSuspendWebsiteOnRefund] = useState(false);
  const [refundNote, setRefundNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("placed");

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      setError("No order ID provided in URL");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load order");
      }

      setOrder(data.order);
      setSelectedStatus(data.order.orderStatus);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching order");
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (orderId) {
      Promise.resolve().then(() => {
        fetchOrder();
      });
    }
  }, [orderId, fetchOrder]);

  const handleVerifyUpi = async () => {
    if (!confirm("Are you sure you have verified the funds in your business account? This will mark the order as PAID and provision/link the website project.")) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}/verify-upi`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      await fetchOrder();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectUpi = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason (e.g. UTR not found in bank statement).");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}/reject-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: rejectReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Rejection failed");
      }

      setShowRejectModal(false);
      setRejectReason("");
      await fetchOrder();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!refundReason.trim()) {
      alert("Please provide a refund reason for audit records.");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          paymentStatus: "refunded",
          refundReason,
          suspendWebsite: suspendWebsiteOnRefund,
          note: refundNote || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process refund");
      }

      setShowRefundModal(false);
      setRefundReason("");
      setRefundNote("");
      await fetchOrder();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Refund processing failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderStatus: selectedStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      await fetchOrder();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResyncProject = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}/sync-project`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      alert("Successfully synchronized personalization into WebsiteProject!");
      await fetchOrder();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setActionLoading(false);
    }
  };

  const renderPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={14} /> Paid & Verified
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <RotateCcw size={14} /> Refunded (₹{order?.totalAmount})
          </span>
        );
      case "payment_pending_verification":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock size={14} /> UTR Submitted &bull; Action Required
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <Clock size={14} /> Pending Payment
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle size={14} /> Payment Rejected / Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-rose-200/50 rounded w-1/3"></div>
          <div className="h-64 bg-white rounded-2xl border border-rose-100"></div>
          <div className="h-48 bg-white rounded-2xl border border-rose-100"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-rose-950 mb-2">Order Not Found</h2>
          <p className="text-sm text-rose-700 mb-6">{error || "Unable to retrieve order details."}</p>
          <Link
            href="/studio/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700"
          >
            <ArrowLeft size={16} /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const projectIdStr =
    typeof order.projectId === "object" && order.projectId !== null
      ? (order.projectId as any)._id?.toString() || ""
      : (typeof order.projectId === "string" ? order.projectId : "");

  const projectDetails =
    (order as any).projectDetails ||
    (typeof order.projectId === "object" && order.projectId !== null ? order.projectId : null);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/studio/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-800 mb-2"
          >
            <ArrowLeft size={14} /> Back to Orders Dashboard
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-rose-950">
              Order {order.orderNumber}
            </h1>
            {renderPaymentBadge(order.paymentStatus)}
          </div>
          <p className="text-xs text-rose-800/70 mt-1 flex items-center gap-2">
            <Calendar size={13} /> Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recently"}
          </p>
        </div>

        {/* Quick Project Editor Action if project exists */}
        {projectIdStr && (
          <Link
            href={`/editor/${projectIdStr}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow-md shadow-rose-300/40 hover:opacity-95 transition-opacity"
          >
            <Edit3 size={15} /> Open in Project Editor
          </Link>
        )}
      </div>

      {/* Manual UPI Review Callout Banner */}
      {order.paymentMethod === "manual_upi" && order.paymentStatus === "payment_pending_verification" && (
        <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-amber-950">
                Action Required: Manual UPI Payment Verification
              </h3>
              <p className="text-xs text-amber-900 mt-1">
                The customer has submitted a UTR/reference number. Confirm the receipt of ₹{order.totalAmount} in your bank account before approving.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 block">Submitted UTR / Ref ID</span>
              <span className="font-mono font-bold text-base text-stone-900 select-all">
                {order.manualUpiDetails?.utrNumber || "None Provided"}
              </span>
              {order.manualUpiDetails?.submittedAt && (
                <span className="text-[11px] text-stone-700 block mt-0.5">
                  Submitted at: {new Date(order.manualUpiDetails.submittedAt).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleVerifyUpi}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 size={16} /> Confirm Payment & Credit
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs border border-rose-300 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <XCircle size={16} /> Reject Payment
              </button>
            </div>
          </div>

          {order.manualUpiDetails?.screenshotUrl && (
            <div className="bg-amber-100/50 p-4 rounded-xl border border-amber-200/80">
              <span className="text-[11px] font-bold text-amber-950 block mb-2">
                Customer Uploaded Payment Receipt / Screenshot:
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={order.manualUpiDetails.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-amber-300 shadow-sm max-w-[240px] hover:opacity-90 transition-opacity bg-white"
                >
                  <img
                    src={order.manualUpiDetails.screenshotUrl}
                    alt="Payment receipt proof"
                    className="max-h-48 w-auto object-contain"
                  />
                </a>
                <div className="space-y-1">
                  <a
                    href={order.manualUpiDetails.screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-50 transition-colors"
                  >
                    <ExternalLink size={13} /> View Full-Resolution Receipt
                  </a>
                  <p className="text-[11px] text-amber-800/80">
                    Verify that the amount, payee name, and timestamp on this receipt match your business account.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer and Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-950 flex items-center gap-2">
              <User size={16} className="text-rose-500" /> Customer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-rose-50/50">
                <span className="text-rose-600 block text-[10px] uppercase font-mono">Full Name</span>
                <span className="font-semibold text-rose-950 text-sm">{order.customer?.name || "N/A"}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/50">
                <span className="text-rose-600 block text-[10px] uppercase font-mono">Email Address</span>
                {order.customer?.email ? (
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="font-semibold text-rose-950 text-sm flex items-center gap-1.5 hover:underline"
                  >
                    <Mail size={13} className="text-rose-500" /> {order.customer.email}
                  </a>
                ) : (
                  <span className="font-semibold text-rose-950 text-sm">N/A</span>
                )}
              </div>
              <div className="p-3 rounded-xl bg-rose-50/50">
                <span className="text-rose-600 block text-[10px] uppercase font-mono">Phone Number</span>
                {order.customer?.phone ? (
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="font-semibold text-rose-950 text-sm flex items-center gap-1.5 hover:underline"
                  >
                    <Phone size={13} className="text-rose-500" /> {order.customer.phone}
                  </a>
                ) : (
                  <span className="font-semibold text-rose-950 text-sm">N/A</span>
                )}
              </div>
              <div className="p-3 rounded-xl bg-rose-50/50">
                <span className="text-rose-600 block text-[10px] uppercase font-mono">Status</span>
                <span className="font-medium text-rose-900 capitalize">{order.orderStatus || "placed"}</span>
              </div>
            </div>
          </div>

          {/* Purchased Items Card */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-950 flex items-center gap-2">
              <Layers size={16} className="text-rose-500" /> Ordered Items ({(order.items || []).length})
            </h3>
            <div className="space-y-3">
              {(order.items || []).map((item: OrderItem, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/20"
                >
                  <div>
                    <span className="font-bold text-rose-950 text-sm block">{item.title}</span>
                    <span className="text-xs text-rose-600">Product: {item.productSlug}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono font-semibold">
                        Theme: {item.selectedTheme}
                      </span>
                      <span className="text-[10px] text-rose-800 font-mono">
                        Qty: {item.quantity || 1} &times; ₹{item.price}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-rose-950">₹{(item.quantity || 1) * item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-rose-100 flex justify-between items-center text-sm font-bold text-rose-950">
              <span>Total Paid Amount</span>
              <span className="text-lg text-rose-600 font-serif">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Associated Website Project Details */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-950 flex items-center gap-2">
              <Sparkles size={16} className="text-rose-500" /> Website Project Link
            </h3>

            {projectIdStr ? (
              <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 block">Project ID</span>
                  <span className="font-mono text-xs font-semibold text-rose-950 block">{projectIdStr}</span>
                  {projectDetails?.title && (
                    <span className="text-xs text-rose-800 font-serif block mt-0.5">{projectDetails.title}</span>
                  )}
                  {projectDetails?.slug && (
                    <span className="text-[11px] text-rose-600/80 font-mono block mt-0.5">/gift/{projectDetails.slug}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/editor/${projectIdStr}`}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-medium text-xs hover:bg-rose-700 transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 size={14} /> Open Editor
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                No project provisioned yet. Projects are provisioned automatically when payment is marked as PAID.
              </div>
            )}
          </div>

          {/* Customer Personalization & Media Inspection Card */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-950 flex items-center gap-2">
                <FileText size={16} className="text-rose-500" /> Customer Personalization & Memories
              </h3>
              {projectIdStr && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleResyncProject}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200 disabled:opacity-50"
                >
                  <RefreshCw size={13} /> Re-sync to Website
                </button>
              )}
            </div>

            {order.personalization && (order.personalization.recipientName || order.personalization.letter || (order.personalization.mediaItems && order.personalization.mediaItems.length > 0)) ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-rose-50/50">
                    <span className="text-rose-600 block text-[10px] uppercase font-mono">Recipient / Partner</span>
                    <span className="font-bold text-rose-950">
                      {order.personalization.partner1Name && order.personalization.partner2Name
                        ? `${order.personalization.partner1Name} & ${order.personalization.partner2Name}`
                        : order.personalization.recipientName || "Not set"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/50">
                    <span className="text-rose-600 block text-[10px] uppercase font-mono">Sender</span>
                    <span className="font-bold text-rose-950">
                      {order.personalization.senderName || order.personalization.partner1Name || "Not set"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/50">
                    <span className="text-rose-600 block text-[10px] uppercase font-mono">Occasion Date</span>
                    <span className="font-bold text-rose-950">
                      {order.personalization.occasionDate || "Not set"}
                    </span>
                  </div>
                </div>

                {order.personalization.letter && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">Customer Heartfelt Letter</span>
                    <p className="font-serif text-xs text-stone-800 whitespace-pre-line leading-relaxed">
                      {order.personalization.letter}
                    </p>
                  </div>
                )}

                {order.personalization.audioTrackUrl && (
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music size={16} className="text-purple-600" />
                      <span className="font-medium text-xs">Audio Track Provided</span>
                    </div>
                    <audio controls src={order.personalization.audioTrackUrl} className="h-7 max-w-xs" />
                  </div>
                )}

                {/* Uploaded Media Gallery */}
                {order.personalization.mediaItems && order.personalization.mediaItems.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">
                      Uploaded Media ({order.personalization.mediaItems.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {order.personalization.mediaItems.map((item: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-rose-100 overflow-hidden bg-stone-50 p-1">
                          <img
                            src={item.url}
                            alt={item.caption || `Upload ${idx + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          {item.caption && (
                            <span className="block text-[10px] text-stone-600 truncate mt-1 px-1">
                              {item.caption}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">Customer has not submitted personalization yet.</p>
                <p className="text-[11px]">Once paid, the customer can access their personal memory portal to upload photos and story details.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Payment & Order State */}
        <div className="space-y-6">
          {/* Payment Method Details */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-950 flex items-center gap-2">
              {order.paymentMethod === "manual_upi" ? <QrCode size={16} className="text-rose-500" /> : <CreditCard size={16} className="text-rose-500" />}
              Payment Information
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-rose-100">
                <span className="text-rose-700">Payment Method</span>
                <span className="font-semibold text-rose-950 uppercase">
                  {order.paymentMethod === "manual_upi" ? "Direct UPI (Manual)" : "Razorpay Online"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-rose-100">
                <span className="text-rose-700">Status</span>
                <span>{renderPaymentBadge(order.paymentStatus)}</span>
              </div>

              {order.paymentMethod === "manual_upi" && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-rose-100">
                    <span className="text-rose-700">UTR / Ref</span>
                    <span className="font-mono font-bold text-rose-950">
                      {order.manualUpiDetails?.utrNumber || "Pending submission"}
                    </span>
                  </div>
                  {order.manualUpiDetails?.verifiedBy && (
                    <div className="flex justify-between py-1.5 border-b border-rose-100">
                      <span className="text-rose-700">Verified By</span>
                      <span className="font-mono text-rose-950">{order.manualUpiDetails.verifiedBy}</span>
                    </div>
                  )}
                  {order.manualUpiDetails?.rejectionReason && (
                    <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900 border border-rose-200 mt-2">
                      <span className="block font-bold text-[10px] uppercase text-rose-700">Rejection Reason</span>
                      {order.manualUpiDetails.rejectionReason}
                    </div>
                  )}
                  {order.manualUpiDetails?.screenshotUrl && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 block mb-1.5">
                        Attached Receipt Proof
                      </span>
                      <a
                        href={order.manualUpiDetails.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border border-rose-200 max-w-[200px] mb-1.5 hover:opacity-90 transition-opacity bg-stone-50"
                      >
                        <img
                          src={order.manualUpiDetails.screenshotUrl}
                          alt="Payment receipt proof"
                          className="max-h-36 w-auto object-contain mx-auto"
                        />
                      </a>
                      <a
                        href={order.manualUpiDetails.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:underline font-semibold"
                      >
                        <ExternalLink size={13} /> View Full Size Proof
                      </a>
                    </div>
                  )}
                </>
              )}

              {order.paymentMethod === "razorpay" && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-rose-100">
                    <span className="text-rose-700">Razorpay Order ID</span>
                    <span className="font-mono text-rose-950">{order.razorpayDetails?.razorpayOrderId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-rose-100">
                    <span className="text-rose-700">Payment ID</span>
                    <span className="font-mono text-rose-950">{order.razorpayDetails?.razorpayPaymentId || "N/A"}</span>
                  </div>
                </>
              )}

              {order.paymentStatus === "paid" && (
                <div className="pt-3 border-t border-rose-100">
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>Record Administrative Refund</span>
                  </button>
                </div>
              )}

              {order.paymentStatus === "refunded" && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <RotateCcw size={14} className="text-purple-600" />
                    <span>Payment Refunded</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    This payment has been marked as refunded. Original transaction references and audit records are preserved.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment Status Management */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-950 flex items-center gap-2">
              <Clock size={16} className="text-rose-500" /> Fulfillment Workflow
            </h3>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-rose-900 block">
                Update Order Status:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50/30 text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="placed">Placed (New)</option>
                <option value="personalizing">Customer Personalizing</option>
                <option value="in_review">In Review / Preparing</option>
                <option value="completed">Completed / Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                type="button"
                disabled={actionLoading || selectedStatus === order.orderStatus}
                onClick={handleUpdateOrderStatus}
                className="w-full py-2 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs transition-colors disabled:opacity-40"
              >
                Save Order Status
              </button>
            </div>
          </div>

          {/* Audit Trail Log */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-950 flex items-center gap-2">
              <History size={16} className="text-rose-500" /> Audit Trail ({order.auditTrail?.length || 0})
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {order.auditTrail && order.auditTrail.length > 0 ? (
                order.auditTrail
                  .slice()
                  .reverse()
                  .map((entry: AuditTrailEntry, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100 text-xs">
                      <div className="flex justify-between items-center text-[10px] text-rose-500 font-mono mb-1">
                        <span>{entry.action}</span>
                        <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-rose-950 font-medium">{typeof entry.details === "object" ? JSON.stringify(entry.details) : entry.details || entry.action}</p>
                      <span className="text-[10px] text-rose-600 block mt-0.5">By: {entry.actor}</span>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-rose-600">No audit records logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <XCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950">Reject UPI Payment</h3>
                <p className="text-xs text-rose-700">Specify why the payment could not be verified.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-rose-900 block mb-1.5">
                Rejection Reason for Customer
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR number not found in bank statement, or amount received was incorrect."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={handleRejectUpi}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950">Record Order Refund</h3>
                <p className="text-xs text-rose-700">Order #{order.orderNumber} • ₹{order.totalAmount}</p>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 leading-relaxed">
              <strong>Audit Notice:</strong> This records an administrative refund for a previously received payment. Original payment records (UTR / Razorpay Payment ID) remain preserved in database history.
            </div>

            <div>
              <label className="text-xs font-semibold text-rose-900 block mb-1.5">
                Refund Reason (Required for Audit Trail)
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Customer requested cancellation within 24h, or duplicate payment received."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-rose-900 block mb-1.5">
                Support Notes (Optional)
              </label>
              <input
                type="text"
                value={refundNote}
                onChange={(e) => setRefundNote(e.target.value)}
                placeholder="Internal reference or support ticket ID"
                className="w-full text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {projectIdStr && (
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={suspendWebsiteOnRefund}
                  onChange={(e) => setSuspendWebsiteOnRefund(e.target.checked)}
                  className="rounded border-stone-300 text-purple-600 focus:ring-purple-500 mt-0.5"
                />
                <span>Also suspend the associated website project from public access</span>
              </label>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !refundReason.trim()}
                onClick={handleProcessRefund}
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs disabled:opacity-50 transition-colors"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
