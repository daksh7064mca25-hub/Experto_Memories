"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Globe,
  Lock,
  Check,
  Loader2,
  Copy,
  ExternalLink,
  ArrowRight,
  Info,
  Smartphone,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { WebsiteProjectData } from "@/types/website";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PublishPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WebsiteProjectData;
  onPaymentSuccess: (updatedProject: WebsiteProjectData) => void;
}

export function PublishPricingModal({
  isOpen,
  onClose,
  project,
  onPaymentSuccess,
}: PublishPricingModalProps) {
  // Pricing configuration from server
  const [pricing, setPricing] = useState<{
    basePrice: number;
    customDomainPrice: number;
    currency: string;
    hostingDurationMonths: number;
    renewalPolicy: string;
    occasionPrices?: Record<string, number>;
    paymentMethodsAllowed?: "both" | "razorpay_only" | "upi_only";
    manualUpiConfig?: any;
  }>({
    basePrice: 999,
    customDomainPrice: 1200,
    currency: "INR",
    hostingDurationMonths: 12,
    renewalPolicy:
      "1 Year hosting included. Annual hosting renewal applies thereafter. Custom domain renewal after Year 1 is managed directly with your registrar.",
    occasionPrices: {},
    paymentMethodsAllowed: "both",
  });

  // Package Selections
  const [includeCustomDomain, setIncludeCustomDomain] = useState(false);
  const [customDomainName, setCustomDomainName] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    project.isPasswordProtected || false
  );
  const [websitePassword, setWebsitePassword] = useState("");
  const [passwordHint, setPasswordHint] = useState(project.passwordHint || "");

  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "manual_upi">("razorpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingMsg, setSubmittingMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Router & Post-Payment / Manual UPI Confirmation
  const router = useRouter();
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [publishCompleteUrl, setPublishCompleteUrl] = useState<string | null>(null);
  const [copiedPublishUrl, setCopiedPublishUrl] = useState(false);

  // Submitted UPI Receipt & Auto-redirect state
  const [submittedUpiReceipt, setSubmittedUpiReceipt] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    utrNumber: string;
    paymentStatus: string;
    submittedAt?: string;
    accessToken?: string;
  } | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [isRedirectPaused, setIsRedirectPaused] = useState(false);
  const [copiedReceiptUtr, setCopiedReceiptUtr] = useState(false);

  // Optional and visible auto-redirect countdown to Dashboard Home
  useEffect(() => {
    if (redirectCountdown === null || isRedirectPaused) return;
    if (redirectCountdown <= 0) {
      router.push("/dashboard");
      onClose();
      return;
    }
    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [redirectCountdown, isRedirectPaused, router, onClose]);

  // Fetch server pricing
  useEffect(() => {
    fetch("/api/settings/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing) {
          setPricing(d.pricing);
          if (d.pricing.paymentMethodsAllowed === "upi_only") {
            setPaymentMethod("manual_upi");
          } else if (d.pricing.paymentMethodsAllowed === "razorpay_only") {
            setPaymentMethod("razorpay");
          }
        }
      })
      .catch(() => {});
  }, []);

  // Resolve product/occasion specific price from server
  const occasionKey = (project.occasionType || "apology").toLowerCase();
  const experiencePrice =
    pricing.occasionPrices?.[occasionKey] ??
    pricing.occasionPrices?.[project.slug?.toLowerCase() || ""] ??
    pricing.basePrice ??
    999;

  // Calculate live totals
  const totalAmount =
    experiencePrice + (includeCustomDomain ? pricing.customDomainPrice : 0);

  const occasionDisplayName =
    project.occasionType === "wedding"
      ? "Luxury Wedding Invitation Website"
      : project.occasionType === "anniversary"
      ? "Anniversary Celebration Website"
      : project.occasionType === "birthday"
      ? "Birthday Celebration Website"
      : project.occasionType === "love"
      ? "Romantic Love Story Website"
      : project.occasionType === "apology"
      ? "Heartfelt Apology & Healing Website"
      : "Digital Celebration Website";

  if (!isOpen) return null;

  // Load Razorpay Script helper
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        return resolve(true);
      }
      const existing = document.getElementById("razorpay-checkout-js");
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-js";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInitiateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");

    if (includeCustomDomain) {
      const cleanDomain = customDomainName.trim();
      if (!cleanDomain) {
        setErrorMsg("Please enter your desired custom domain name (e.g. riyaandrahul.com).");
        return;
      }
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
      if (!domainRegex.test(cleanDomain)) {
        setErrorMsg("Invalid domain format. Example: riyaandrahul.com");
        return;
      }
    }

    if (isPasswordProtected && !project.isPasswordProtected && !websitePassword.trim()) {
      setErrorMsg("Please enter a secret password for your website.");
      return;
    }

    setIsSubmitting(true);
    setSubmittingMsg(paymentMethod === "manual_upi" ? "Generating UPI Details..." : "Creating Order...");

    try {
      const res = await fetch(`/api/projects/${project._id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          includeCustomDomain,
          customDomainName: includeCustomDomain ? customDomainName.trim() : undefined,
          isPasswordProtected,
          websitePassword: websitePassword.trim() || undefined,
          passwordHint: passwordHint.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout");
      }

      // If Manual UPI: Show QR screen
      if (paymentMethod === "manual_upi") {
        setCreatedOrder(data);
        setIsSubmitting(false);
        setSubmittingMsg("");
        return;
      }

      // If Razorpay: Launch Gateway
      if (paymentMethod === "razorpay") {
        setSubmittingMsg("Opening Payment Gateway...");
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded || !window.Razorpay) {
          throw new Error("Unable to load payment gateway. Please use Direct UPI or try again.");
        }

        const options = {
          key: data.razorpayKeyId,
          amount: Math.round(data.totalAmount * 100),
          currency: "INR",
          name: "ExpertoMemories",
          description: `Publish: ${project.title}`,
          order_id: data.razorpayOrderId,
          prefill: {
            email: project.customerEmail || "",
            contact: project.customerPhone || "",
            name: project.senderName || "",
          },
          theme: {
            color: "#f43f5e",
          },
          config: {
            display: {
              blocks: {
                upi: {
                  name: "Pay via UPI (GPay, PhonePe, Paytm, QR)",
                  instruments: [
                    {
                      method: "upi",
                    },
                  ],
                },
                other: {
                  name: "Cards, Netbanking & Wallets",
                  instruments: [
                    {
                      method: "card",
                    },
                    {
                      method: "netbanking",
                    },
                    {
                      method: "wallet",
                    },
                  ],
                },
              },
              sequence: ["block.upi", "block.other"],
              preferences: {
                show_default_blocks: true,
              },
            },
          },
          method: {
            netbanking: true,
            card: true,
            upi: true,
            wallet: true,
            emi: false,
            paylater: false,
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              setSubmittingMsg("");
              setErrorMsg("Payment was cancelled. You can retry when you are ready.");
            },
          },
          handler: async (response: any) => {
            setIsSubmitting(true);
            setSubmittingMsg("Verifying payment and publishing your website...");
            try {
              const verifyRes = await fetch("/api/checkout/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                // Auto-publish project now that it is paid
                const publishRes = await fetch(`/api/projects/${project._id}/publish`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "publish" }),
                });
                const publishData = await publishRes.json();
                if (publishData.success) {
                  setPublishCompleteUrl(publishData.publicUrl);
                  onPaymentSuccess(publishData.project);
                } else {
                  setErrorMsg(publishData.error || "Payment succeeded! Please click publish.");
                }
              } else {
                setErrorMsg(verifyData.error || "Payment verification failed.");
              }
            } catch {
              setErrorMsg("Error verifying payment with server.");
            } finally {
              setIsSubmitting(false);
              setSubmittingMsg("");
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp: any) => {
          setIsSubmitting(false);
          setSubmittingMsg("");
          setErrorMsg(resp?.error?.description || "Payment failed or declined.");
        });

        rzp.open();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Checkout error occurred");
      setIsSubmitting(false);
      setSubmittingMsg("");
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMsg("Please enter a valid 12-digit UPI UTR / Reference number.");
      return;
    }

    if (isSubmittingUtr) return; // Prevent double submit

    setIsSubmittingUtr(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout/submit-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder.orderId,
          accessToken: createdOrder.accessToken,
          utrNumber: utrNumber.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedUpiReceipt({
          orderId: data.orderId || createdOrder.orderId,
          orderNumber: data.orderNumber || createdOrder.orderNumber,
          totalAmount: data.totalAmount || createdOrder.totalAmount,
          utrNumber: data.utrNumber || utrNumber.trim(),
          paymentStatus: data.paymentStatus || "payment_pending_verification",
          submittedAt: data.submittedAt || new Date().toISOString(),
          accessToken: createdOrder.accessToken,
        });
        setRedirectCountdown(5);
      } else {
        setErrorMsg(data.error || "Failed to submit UTR number.");
      }
    } catch {
      setErrorMsg("Network error submitting UTR.");
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 via-white to-pink-50/30">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Publishing &amp; Pricing
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Publish &quot;{project.title}&quot; Live
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {publishCompleteUrl ? (
            /* SUCCESS SCREEN AFTER PUBLISHING */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check size={32} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                🎉 Your Website Is Now Published!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Your recipient can now view their personalized interactive gift experience anywhere in the world.
              </p>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-lg mx-auto flex items-center justify-between gap-3 text-left">
                <div className="overflow-hidden">
                  <p className="text-[10px] font-mono uppercase text-stone-400 font-bold">Public Shareable Link</p>
                  <p className="font-mono text-xs sm:text-sm text-rose-600 font-bold truncate">
                    {publishCompleteUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publishCompleteUrl);
                    setCopiedPublishUrl(true);
                    setTimeout(() => setCopiedPublishUrl(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold hover:bg-stone-100 flex items-center gap-1.5 shrink-0"
                >
                  {copiedPublishUrl ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedPublishUrl ? "Copied" : "Copy Link"}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <a
                  href={publishCompleteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-all"
                >
                  <span>Open Live Website</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/dashboard");
                    onClose();
                  }}
                  className="px-6 py-3 rounded-full text-xs font-serif font-bold bg-[#211715] hover:bg-black text-white shadow-md transition-colors cursor-pointer"
                >
                  Go to My Dashboard
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : submittedUpiReceipt ? (
            /* PAYMENT REFERENCE SUBMITTED CONFIRMATION SCREEN */
            <div className="text-center py-4 space-y-6 animate-fade-in font-sans">
              {/* Animated Status Icon */}
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-200/50 animate-ping opacity-30" />
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-700 flex items-center justify-center shadow-md shadow-amber-200/50">
                  <Clock size={32} className="stroke-[2.2]" />
                </div>
              </div>

              {/* Header Titles */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/70 text-amber-900 text-[11px] font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  ORDER #{submittedUpiReceipt.orderNumber}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  Your Payment Reference Has Been Received!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you for choosing ExpertoMemories. Your payment reference is now awaiting verification by our team.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#C5A36A]/30 max-w-lg mx-auto text-left shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/70">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">
                      Digital Keepsake Gift
                    </span>
                    <span className="font-serif font-bold text-sm text-[#211715]">
                      {project.title}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending Verification
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">
                      Amount Transferred
                    </span>
                    <span className="font-serif font-bold text-base text-stone-900">
                      ₹{submittedUpiReceipt.totalAmount?.toLocaleString("en-IN") || submittedUpiReceipt.totalAmount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">
                      Payment Method
                    </span>
                    <span className="font-semibold text-stone-800">Manual UPI Transfer</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-mono uppercase text-stone-400 block font-semibold">
                      Submitted UPI UTR / Reference
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#541D2B] tracking-wider truncate block">
                      {submittedUpiReceipt.utrNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(submittedUpiReceipt.utrNumber);
                      setCopiedReceiptUtr(true);
                      setTimeout(() => setCopiedReceiptUtr(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold border border-stone-200 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedReceiptUtr ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedReceiptUtr ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-1">
                  <span>Submission Time:</span>
                  <span>
                    {submittedUpiReceipt.submittedAt
                      ? new Date(submittedUpiReceipt.submittedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Recently submitted"}
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-stone-600 leading-relaxed border-t border-stone-200/70">
                  💡 Your gift is safely saved in your account. Our team will verify the payment against the bank records. You can track the status from your dashboard.
                </div>
              </div>

              {/* Optional & Visible Auto-redirect Countdown */}
              {redirectCountdown !== null && (
                <div className="max-w-lg mx-auto flex items-center justify-between px-3.5 py-2 rounded-xl bg-stone-100/90 border border-stone-200 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-stone-500 shrink-0" />
                    <span>
                      {isRedirectPaused ? (
                        <span className="text-stone-700 font-medium">Auto-redirect paused.</span>
                      ) : (
                        <span>
                          Redirecting to dashboard in <strong className="text-stone-900 font-mono">{redirectCountdown}s</strong>...
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRedirectPaused(!isRedirectPaused)}
                    className="text-[11px] font-semibold text-[#9C2D41] hover:underline cursor-pointer"
                  >
                    {isRedirectPaused ? "Resume Redirect" : "Pause Redirect"}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsRedirectPaused(true);
                    router.push("/dashboard");
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full font-serif font-bold text-xs bg-[#541D2B] hover:bg-[#3D141F] text-white shadow-md shadow-[#541D2B]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span>Go to My Home</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRedirectPaused(true);
                    const dest = `/order/${submittedUpiReceipt.orderId}${
                      submittedUpiReceipt.accessToken ? `?token=${submittedUpiReceipt.accessToken}` : ""
                    }`;
                    router.push(dest);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-full font-serif font-semibold text-xs bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>View Order Details</span>
                  <ExternalLink size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRedirectPaused(true);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Close &amp; Stay in Editor
                </button>
              </div>
            </div>
          ) : createdOrder ? (
            /* MANUAL UPI PAYMENT SCREEN */
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-[#541D2B]/10 text-[#541D2B] px-3.5 py-1 rounded-full border border-[#541D2B]/15 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#541D2B] animate-pulse" />
                  ORDER #{createdOrder.orderNumber}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                  Transfer ₹{createdOrder.totalAmount?.toLocaleString("en-IN") || createdOrder.totalAmount} via UPI
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  Scan the QR code using any UPI application to complete your payment.
                </p>
              </div>

              {/* Desktop 2 Columns, Mobile Stacked */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#541D2B]/10">
                {/* Left Column: Scannable QR Container */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-[220px] sm:max-w-[240px] bg-white p-3.5 rounded-2xl border-2 border-[#541D2B]/15 shadow-sm relative aspect-square flex items-center justify-center overflow-hidden">
                    {!qrLoaded && !qrError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 rounded-xl text-stone-400 gap-2">
                        <Loader2 size={24} className="animate-spin text-[#541D2B]" />
                        <span className="text-[10px] font-mono">Loading QR Code...</span>
                      </div>
                    )}
                    {qrError ? (
                      <div className="p-4 text-center text-xs text-rose-700 bg-rose-50 rounded-xl border border-rose-200">
                        <AlertCircle size={24} className="mx-auto mb-1.5 text-rose-500" />
                        <p className="font-semibold">QR Code unavailable</p>
                        <p className="text-[10px] text-stone-600 mt-1">
                          Please use the UPI ID on the right to transfer via your UPI app.
                        </p>
                      </div>
                    ) : (
                      <img
                        src={createdOrder.manualUpi?.qrImageUrl || "/images/upi-qr.jpeg"}
                        alt="ExpertoMemories UPI QR Code"
                        onLoad={() => setQrLoaded(true)}
                        onError={() => setQrError(true)}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${
                          qrLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-[11px] font-semibold text-stone-800">
                      Scan with GPay, PhonePe, Paytm, or BHIM
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      Payee: <span className="font-medium text-stone-800">{createdOrder.manualUpi?.payeeName || "ExpertoMemories"}</span>
                    </p>
                  </div>

                  {createdOrder.manualUpi?.intentUri && (
                    <a
                      href={createdOrder.manualUpi.intentUri}
                      className="mt-3 w-full max-w-[240px] py-2 px-3 rounded-xl bg-[#541D2B] hover:bg-[#3D141F] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all md:hidden"
                    >
                      <Smartphone size={14} />
                      <span>Tap to Open UPI App</span>
                    </a>
                  )}
                </div>

                {/* Right Column: Payment Details & UTR Submission */}
                <div className="space-y-3.5">
                  {/* Payee UPI ID Card */}
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider">
                        Payee UPI ID
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Business
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="font-mono font-bold text-xs sm:text-sm text-[#541D2B] break-all">
                        {createdOrder.manualUpi?.upiId || ""}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          const upi = createdOrder.manualUpi?.upiId || "";
                          if (upi) {
                            navigator.clipboard.writeText(upi);
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }
                        }}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        {copiedUpi ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Payment Amount & Order Summary */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/80 border border-stone-200/60 text-xs">
                    <span className="text-stone-500">Payable Amount:</span>
                    <span className="font-serif font-bold text-sm sm:text-base text-stone-900">
                      ₹{createdOrder.totalAmount?.toLocaleString("en-IN") || createdOrder.totalAmount}
                    </span>
                  </div>

                  {/* UTR Submission Form */}
                  <form onSubmit={handleSubmitUtr} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                        12-Digit UPI Reference / UTR Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={22}
                        placeholder="e.g. 428190382910"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#541D2B] bg-white"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">
                        Found under transaction details in your UPI app receipt after payment.
                      </p>
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingUtr}
                      className="w-full py-3 rounded-full font-serif font-bold text-xs bg-[#541D2B] hover:bg-[#3D141F] text-white shadow-md shadow-[#541D2B]/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isSubmittingUtr ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Submitting Reference...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Reference for Verification</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-stone-400">
                      Payment is verified against our bank records before activation.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* PRICING & CUSTOMIZATION FORM */
            <form onSubmit={handleInitiateCheckout} className="space-y-5">
              {/* Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
                <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Free Editing & Preview:</strong> You can edit and preview your website as many times as you want for free. Payment is required only once when you are ready to publish live.
                </p>
              </div>

              {/* Package Breakdown Cards */}
              <div className="space-y-3">
                {/* 1. Base Package (Included) */}
                <div className="p-4 rounded-2xl border-2 border-rose-500/80 bg-rose-50/20 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        {occasionDisplayName}
                      </span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                      <li>Included: ExpertoMemories hosted URL (e.g. <code>/gift/{project.slug}</code>)</li>
                      <li>Included: {pricing.hostingDurationMonths} Months high-speed cloud hosting &amp; SSL</li>
                      <li>Included: Interactive music, photo gallery, personalized notes &amp; animations</li>
                    </ul>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-serif font-bold text-lg text-rose-600">
                      ₹{experiencePrice.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-stone-400">One-time experience fee</p>
                  </div>
                </div>

                {/* 2. Optional Custom Domain Add-on */}
                <div
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    includeCustomDomain
                      ? "border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                  onClick={() => setIncludeCustomDomain(!includeCustomDomain)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={includeCustomDomain}
                        onChange={(e) => setIncludeCustomDomain(e.target.checked)}
                        className="mt-1 accent-rose-600 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-stone-900 text-sm">
                            Connect Custom Domain
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                            Optional Add-on
                          </span>
                        </div>
                        <p className="text-xs text-stone-600">
                          Use your own branded domain (e.g. <code>riyaandrahul.com</code>). You retain full ownership of your domain.
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-base text-stone-800">
                        +₹{pricing.customDomainPrice.toLocaleString("en-IN")}
                      </span>
                      <p className="text-[10px] text-stone-400">Setup & 1st year</p>
                    </div>
                  </div>

                  {includeCustomDomain && (
                    <div
                      className="mt-4 pt-3 border-t border-rose-100 space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">
                          Preferred Domain Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. riyaandrahul.love"
                          value={customDomainName}
                          onChange={(e) => setCustomDomainName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 space-y-1 border border-stone-200">
                        <p className="font-semibold text-stone-800 flex items-center gap-1">
                          <Globe size={12} className="text-blue-500" /> Domain Ownership Policy:
                        </p>
                        <p>
                          • You retain 100% control of your domain through your own registrar (GoDaddy, Namecheap, etc.).
                        </p>
                        <p>
                          • After payment, we provide instant CNAME DNS instructions.
                        </p>
                        <p>
                          • Domain renewals after Year 1 are managed and paid directly by you to your registrar.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Optional Password Protection */}
                <div
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isPasswordProtected
                      ? "border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                  onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isPasswordProtected}
                        onChange={(e) => setIsPasswordProtected(e.target.checked)}
                        className="mt-1 accent-rose-600 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-stone-900 text-sm">
                            Website Password Protection
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Free Included
                          </span>
                        </div>
                        <p className="text-xs text-stone-600">
                          Require visitors to enter a secret password before revealing the gift.
                        </p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-xs text-emerald-600">Free</span>
                  </div>

                  {isPasswordProtected && (
                    <div
                      className="mt-4 pt-3 border-t border-rose-100 grid grid-cols-1 sm:grid-cols-2 gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">
                          Secret Password {project.isPasswordProtected && "(Leave blank to keep current)"}
                        </label>
                        <input
                          type="password"
                          placeholder="Secret code..."
                          value={websitePassword}
                          onChange={(e) => setWebsitePassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">
                          Password Hint (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Our first date"
                          value={passwordHint}
                          onChange={(e) => setPasswordHint(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Renewal & Hosting Transparency Callout */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-500 flex items-start gap-2">
                <Info size={14} className="shrink-0 text-stone-400 mt-0.5" />
                <span>
                  <strong>Hosting & Renewal Policy:</strong> {pricing.renewalPolicy} We do not promise unrealistic &quot;lifetime&quot; hosting.
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <p className="text-xs font-bold text-stone-800 mb-2">Select Payment Method</p>
                <div className={`grid gap-3 ${pricing.paymentMethodsAllowed === "both" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                  {pricing.paymentMethodsAllowed !== "upi_only" && (
                    <label
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "razorpay"
                          ? "border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payMethod"
                          value="razorpay"
                          checked={paymentMethod === "razorpay"}
                          onChange={() => setPaymentMethod("razorpay")}
                          className="accent-rose-600"
                        />
                        <div>
                          <p className="font-serif font-bold text-xs text-stone-900">Online Gateway</p>
                          <p className="text-[10px] text-stone-500">Cards, UPI, Netbanking</p>
                        </div>
                      </div>
                      <CreditCard size={18} className="text-stone-400" />
                    </label>
                  )}

                  {pricing.paymentMethodsAllowed !== "razorpay_only" && (
                    <label
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "manual_upi"
                          ? "border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payMethod"
                          value="manual_upi"
                          checked={paymentMethod === "manual_upi"}
                          onChange={() => setPaymentMethod("manual_upi")}
                          className="accent-rose-600"
                        />
                        <div>
                          <p className="font-serif font-bold text-xs text-stone-900">Direct UPI Transfer</p>
                          <p className="text-[10px] text-stone-500">GPay, PhonePe, Paytm QR</p>
                        </div>
                      </div>
                      <QrCode size={18} className="text-stone-400" />
                    </label>
                  )}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
                  {errorMsg}
                </p>
              )}

              {/* Submit Button with Live Total */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full font-serif font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-300/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{submittingMsg || "Processing..."}</span>
                  </>
                ) : (
                  <>
                    <span>
                      Pay & Publish Live • ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
