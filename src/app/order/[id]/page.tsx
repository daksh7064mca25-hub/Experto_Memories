"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
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
      try {
        const resolved = use(params as Promise<{ id: string }>);
        if (resolved && resolved.id) idFromProps = resolved.id;
      } catch {}
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
  const projectSlug = order.project?.slug;
  const isPublished = order.project?.status === "published";
  const publicGiftUrl = projectSlug ? `${typeof window !== "undefined" ? window.location.origin : ""}/gift/${projectSlug}` : "";

  return (
    <div className="min-h-screen bg-[#faf7f5] text-stone-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200/80 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
              <Heart size={16} className="fill-current" />
            </div>
            <span className="font-serif font-bold text-lg text-stone-900">ExpertoMemories</span>
          </Link>
          <span className="text-xs font-mono font-bold bg-stone-100 text-stone-800 px-3 py-1 rounded-full">
            {order.orderNumber}
          </span>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
          {/* Status Badge & Title */}
          <div className="text-center space-y-2">
            {isPaid ? (
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>
            ) : isPendingVerification ? (
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <Clock size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle size={32} />
              </div>
            )}

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {isPaid
                ? "Payment Confirmed!"
                : isPendingVerification
                ? "Payment Verification in Progress"
                : "Payment Pending"}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              {isPaid
                ? "Thank you for your order! Your gift website has been initialized."
                : isPendingVerification
                ? `We received your UPI reference (${order.manualUpiDetails?.utrNumber}). Our team will verify bank credit shortly.`
                : "Your order has been created. Please complete payment to begin personalizing your gift."}
            </p>
          </div>

          {/* Published Gift Link Box if live */}
          {isPaid && isPublished && publicGiftUrl && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-rose-100">
                  🎉 YOUR GIFT WEBSITE IS LIVE!
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  Published
                </span>
              </div>
              <p className="font-mono text-xs text-white/90 truncate bg-black/20 p-2.5 rounded-xl">
                {publicGiftUrl}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publicGiftUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-white text-rose-900 flex items-center justify-center gap-1.5 hover:bg-rose-50 transition-colors"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedLink ? "Copied" : "Copy Gift Link"}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I made a special digital gift for you! Open it here: ${publicGiftUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
                >
                  <Share2 size={14} />
                  <span>Share to WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2">
            {isPaid ? (
              <Link
                href={`/order/${order.id}/personalize?token=${encodeURIComponent(token)}`}
                className="w-full py-4 rounded-full font-serif font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-300/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Sparkles size={16} />
                <span>Personalize Your Gift (Photos & Stories)</span>
                <ArrowRight size={16} />
              </Link>
            ) : isPendingVerification ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 text-center">
                <p className="font-semibold">Verification usually takes 15–30 minutes.</p>
                <p className="text-[11px] text-amber-700">
                  You can bookmark this page. Once approved, the personalization button will unlock automatically.
                </p>
              </div>
            ) : (
              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-full font-serif font-bold text-sm bg-stone-900 text-white flex items-center justify-center gap-2"
              >
                <span>Complete Payment</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {/* Order Summary Details */}
          <div className="pt-6 border-t border-stone-100 space-y-3 text-xs text-stone-600">
            <h3 className="font-serif font-bold text-sm text-stone-900">Order Information</h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-400 block font-mono">CUSTOMER</span>
                <span className="font-semibold text-stone-800">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-mono">CONTACT</span>
                <span className="font-semibold text-stone-800">{order.customer.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-mono">GIFT PRODUCT</span>
                <span className="font-semibold text-stone-800">{order.items[0]?.title}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-mono">AMOUNT PAID</span>
                <span className="font-semibold text-stone-800 font-mono">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
