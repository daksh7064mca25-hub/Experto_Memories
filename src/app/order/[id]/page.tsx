"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useParams } from "next/navigation";
import {
  Heart,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Share2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface Props {
  params?: Promise<{ id: string }> | { id: string };
}

export default function OrderStatusPage({ params }: Props) {
  const routeParams = useParams();
  let idFromProps = "";
  if (params) {
    if (typeof (params as any).then === "function") {
      const resolved = use(params as Promise<{ id: string }>);
      if (resolved && resolved.id) idFromProps = resolved.id;
    } else if (typeof params === "object" && (params as any).id) {
      idFromProps = (params as any).id;
    }
  }
  const id =
    idFromProps ||
    (typeof routeParams?.id === "string"
      ? routeParams.id
      : Array.isArray(routeParams?.id)
      ? routeParams.id[0]
      : "") ||
    "";

  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${id}?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
        } else {
          setErrorMsg(data.error || "Unable to find order details");
        }
      } catch {
        setErrorMsg("Network error loading order status");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center p-6 text-center font-sans">
        <div className="space-y-3">
          <Loader2 size={32} className="animate-spin text-rose-500 mx-auto" />
          <p className="text-sm font-serif text-stone-700">Retrieving your order details...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h1 className="font-serif text-xl font-bold text-stone-900">Order Access Error</h1>
          <p className="text-xs text-stone-600 leading-relaxed">
            {errorMsg || "You do not have permission to view this order or the link is invalid."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-full text-xs font-semibold bg-stone-900 text-white"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";
  const isPendingVerification = order.paymentStatus === "payment_pending_verification";
  const isFailed = order.paymentStatus === "failed";
  const isRefunded = order.paymentStatus === "refunded";
  const projectSlug = order.project?.slug;
  const isPublished = order.project?.status === "published";
  const projectId = order.project?.id || order.project?._id;
  const publicGiftUrl = projectSlug ? `${typeof window !== "undefined" ? window.location.origin : ""}/gift/${projectSlug}` : "";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211715] font-sans flex flex-col selection:bg-[#EADBCE]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#EFE7DE] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-4xl mx-auto px-5 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label="ExpertoMemories Home">
            <div className="relative h-8 sm:h-9 w-auto shrink-0 flex items-center">
              <Image
                src="/branding/expertomemories-monogram.png"
                alt="ExpertoMemories EM Monogram"
                width={505}
                height={321}
                priority
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-[#211715] tracking-tight block leading-tight">
                ExpertoMemories
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#C5A36A] font-bold uppercase">
                ORDER RECEIPT
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-serif font-semibold text-[#6B5E57] hover:text-[#211715] px-3.5 py-1.5 rounded-xl border border-[#EFE7DE] bg-white hover:bg-[#FAF7F2] transition-colors"
            >
              My Dashboard
            </Link>
            <span className="text-xs font-mono font-bold bg-[#FAF5EB] text-[#541D2B] border border-[#C5A36A]/30 px-3 py-1 rounded-full">
              {order.orderNumber}
            </span>
          </div>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE7DE] shadow-xl shadow-stone-200/50 space-y-6">
          {/* Status Badge & Title */}
          <div className="text-center space-y-2.5">
            {isPaid ? (
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>
            ) : isPendingVerification ? (
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <Clock size={32} />
              </div>
            ) : isRefunded ? (
              <div className="w-16 h-16 rounded-full bg-stone-100 border-2 border-stone-200 text-stone-600 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle size={32} />
              </div>
            )}

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715]">
              {isPaid
                ? "Payment Confirmed!"
                : isPendingVerification
                ? "Payment Verification in Progress"
                : isRefunded
                ? "Payment Refunded"
                : isFailed
                ? "Payment Verification Unsuccessful"
                : "Payment Pending"}
            </h1>

            <p className="text-xs sm:text-sm text-[#6B5E57] max-w-md mx-auto leading-relaxed">
              {isPaid
                ? "Thank you for your order! Your payment has been verified and your gift experience is ready."
                : isPendingVerification
                ? `We have received your UPI reference (${order.manualUpiDetails?.utrNumber || "submitted"}). Our concierge team is verifying the transfer with our bank.`
                : isRefunded
                ? "This order has been refunded in accordance with our refund policy."
                : isFailed
                ? (order.manualUpiDetails?.rejectionReason || "Payment could not be verified in our bank account. Please check the UTR or resubmit.")
                : "Your order has been initiated. Please complete payment to unlock your personalized experience."}
            </p>
          </div>

          {/* Milestone Status Timeline */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EFE7DE] space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] font-bold block">
              Order Milestone Progress
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {/* Step 1: Order Created */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                  <Check size={14} />
                </div>
                <span className="text-[11px] font-serif font-bold text-[#211715]">Order Placed</span>
                <span className="text-[9px] font-mono text-emerald-700">Completed</span>
              </div>

              {/* Step 2: Payment Submitted */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ${
                    isPendingVerification || isPaid
                      ? "bg-emerald-100 text-emerald-700"
                      : isFailed
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isPendingVerification || isPaid ? (
                    <Check size={14} />
                  ) : isFailed ? (
                    <AlertTriangle size={14} />
                  ) : (
                    "2"
                  )}
                </div>
                <span className="text-[11px] font-serif font-bold text-[#211715]">Payment Sent</span>
                <span className="text-[9px] font-mono text-[#8C7E75]">
                  {isPendingVerification || isPaid ? "Submitted" : isFailed ? "Failed" : "Awaiting"}
                </span>
              </div>

              {/* Step 3: Verification */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ${
                    isPaid
                      ? "bg-emerald-100 text-emerald-700"
                      : isPendingVerification
                      ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {isPaid ? <Check size={14} /> : isPendingVerification ? <Clock size={14} /> : "3"}
                </div>
                <span className="text-[11px] font-serif font-bold text-[#211715]">Bank Audit</span>
                <span className="text-[9px] font-mono text-[#8C7E75]">
                  {isPaid ? "Verified" : isPendingVerification ? "In Progress" : "Pending"}
                </span>
              </div>

              {/* Step 4: Payment Verified */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ${
                    isPaid ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {isPaid ? <Check size={14} /> : "4"}
                </div>
                <span className="text-[11px] font-serif font-bold text-[#211715]">Confirmed</span>
                <span className="text-[9px] font-mono text-[#8C7E75]">
                  {isPaid ? "Approved" : "Waiting"}
                </span>
              </div>

              {/* Step 5: Gift Published */}
              <div className="flex flex-col items-center text-center space-y-1.5 col-span-2 sm:col-span-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ${
                    isPaid && isPublished
                      ? "bg-[#7A1C2D] text-white"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {isPaid && isPublished ? <Sparkles size={14} /> : "5"}
                </div>
                <span className="text-[11px] font-serif font-bold text-[#211715]">Live Website</span>
                <span className="text-[9px] font-mono text-[#8C7E75]">
                  {isPaid && isPublished ? "Active" : isPaid ? "Ready to Publish" : "Locked"}
                </span>
              </div>
            </div>
          </div>

          {/* Published Gift Link Box if live */}
          {isPaid && isPublished && publicGiftUrl && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#9C2D41] to-[#D94B70] text-white shadow-lg shadow-[#9C2D41]/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-rose-100">
                  🎉 YOUR GIFT WEBSITE IS LIVE!
                </span>
                <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                  Published
                </span>
              </div>
              <p className="font-mono text-xs text-white/95 truncate bg-black/20 p-2.5 rounded-xl border border-white/10">
                {publicGiftUrl}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publicGiftUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="w-full sm:flex-1 py-2.5 rounded-xl text-xs font-serif font-bold bg-white text-[#541D2B] flex items-center justify-center gap-1.5 hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedLink ? "Copied" : "Copy Gift Link"}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I made a special digital gift for you! Open it here: ${publicGiftUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-serif font-bold bg-emerald-600 text-white flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Share2 size={14} />
                  <span>Share to WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 space-y-3">
            {isPaid ? (
              <div className="flex flex-col sm:flex-row gap-2.5">
                {projectId && (
                  <Link
                    href={`/editor/${projectId}`}
                    className="flex-1 py-3.5 rounded-full font-serif font-bold text-xs bg-[#541D2B] hover:bg-[#3D141F] text-white shadow-md shadow-[#541D2B]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Sparkles size={14} />
                    <span>Open Gift Editor &amp; Customize</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex-1 py-3.5 rounded-full font-serif font-semibold text-xs bg-white hover:bg-[#FAF7F2] text-[#211715] border border-[#EFE7DE] shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : isPendingVerification ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1.5 text-center">
                  <p className="font-serif font-bold text-sm text-amber-900">Verification in Progress</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Our team verifies bank transfers during working hours. Your project draft and custom photos are safe and intact in your account.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/dashboard?tab=orders"
                    className="flex-1 py-3.5 rounded-full font-serif font-bold text-xs bg-[#541D2B] hover:bg-[#3D141F] text-white shadow-md shadow-[#541D2B]/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>View in Dashboard Orders</span>
                    <ArrowRight size={14} />
                  </Link>
                  {projectId && (
                    <Link
                      href={`/editor/${projectId}`}
                      className="flex-1 py-3.5 rounded-full font-serif font-semibold text-xs bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Continue Editing Draft</span>
                    </Link>
                  )}
                </div>
              </div>
            ) : isFailed ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 text-center space-y-1">
                  <p className="font-semibold text-rose-800">Need to resubmit or retry payment?</p>
                  <p className="text-[11px] text-rose-700">
                    If you transferred the amount, please check the 12-digit UTR in your banking app and submit again from your dashboard.
                  </p>
                </div>
                <Link
                  href="/dashboard?tab=orders"
                  className="w-full py-3.5 rounded-full font-serif font-bold text-xs bg-[#541D2B] hover:bg-[#3D141F] text-white flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Go to Orders in Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-full font-serif font-bold text-xs bg-[#211715] hover:bg-black text-white flex items-center justify-center gap-2 shadow-md"
              >
                <span>Complete Payment</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {/* Authoritative Order Summary Details from Server */}
          <div className="pt-6 border-t border-[#EFE7DE] space-y-3 text-xs text-[#6B5E57]">
            <h3 className="font-serif font-bold text-sm text-[#211715]">Authoritative Order Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-[11px] bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE7DE]">
              <div>
                <span className="text-[#8C7E75] block font-mono text-[10px] uppercase">CUSTOMER</span>
                <span className="font-semibold text-[#211715]">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-[#8C7E75] block font-mono text-[10px] uppercase">CONTACT</span>
                <span className="font-semibold text-[#211715]">{order.customer.phone}</span>
              </div>
              <div>
                <span className="text-[#8C7E75] block font-mono text-[10px] uppercase">GIFT EXPERIENCE</span>
                <span className="font-semibold text-[#211715]">{order.items[0]?.title}</span>
              </div>
              <div>
                <span className="text-[#8C7E75] block font-mono text-[10px] uppercase">TOTAL AMOUNT</span>
                <span className="font-bold text-[#541D2B] font-mono text-xs">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              {order.manualUpiDetails?.utrNumber && (
                <div className="col-span-2 pt-2 border-t border-[#EFE7DE] flex items-center justify-between">
                  <div>
                    <span className="text-[#8C7E75] block font-mono text-[10px] uppercase">SUBMITTED UTR NUMBER</span>
                    <span className="font-mono font-bold text-[#541D2B] text-xs">
                      {order.manualUpiDetails.utrNumber}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {order.paymentStatus === "paid" ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
