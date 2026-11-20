"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShieldCheck,
  QrCode,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CATALOG_PRODUCTS } from "@/config/products";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart, addItem } = useCart();

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"manual_upi" | "razorpay">("manual_upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingMessage, setSubmittingMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Post-order state for manual UPI
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);

  // If cart is empty, prefill default gift so user can test checkout smoothly
  useEffect(() => {
    if (items.length === 0) {
      const defaultProd = CATALOG_PRODUCTS[0]; // Anniversary
      addItem({
        productSlug: defaultProd.slug,
        occasionType: defaultProd.occasionType,
        title: defaultProd.title,
        price: defaultProd.price,
        selectedTheme: defaultProd.defaultTheme,
        quantity: 1,
      });
    }
  }, [items.length, addItem]);

  // Load Razorpay Checkout Script helper
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        return resolve(true);
      }
      const existingScript = document.getElementById("razorpay-checkout-js");
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
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

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");

    const trimmedName = customerName.trim();
    const trimmedEmail = customerEmail.trim();
    const trimmedPhone = customerPhone.trim();

    if (trimmedName.length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    const cleanPhone = trimmedPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit phone/WhatsApp number.");
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Please select at least one gift product.");
      return;
    }

    setIsSubmitting(true);
    setSubmittingMessage(paymentMethod === "manual_upi" ? "Generating UPI Details..." : "Creating Order...");

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
          },
          items: items.map((i) => ({
            productSlug: i.productSlug,
            selectedTheme: i.selectedTheme,
            quantity: i.quantity || 1,
          })),
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // If Manual UPI: Store created order & display UPI payment modal
      if (paymentMethod === "manual_upi") {
        setCreatedOrder(data);
        clearCart();
        setIsSubmitting(false);
        setSubmittingMessage("");
        return;
      }

      // If Razorpay: Launch Razorpay Modal
      if (paymentMethod === "razorpay") {
        setSubmittingMessage("Loading Payment Gateway...");
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded || !window.Razorpay) {
          throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection or use Direct UPI.");
        }

        const options = {
          key: data.razorpayKeyId,
          amount: Math.round(data.totalAmount * 100),
          currency: "INR",
          name: "ExpertoMemories",
          description: `Order ${data.orderNumber}`,
          order_id: data.razorpayOrderId,
          prefill: {
            name: trimmedName,
            email: trimmedEmail,
            contact: trimmedPhone,
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
              setSubmittingMessage("");
              setErrorMsg("Payment was cancelled. You can retry when you are ready.");
            },
          },
          handler: async (response: any) => {
            setIsSubmitting(true);
            setSubmittingMessage("Verifying payment with bank...");
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
                clearCart();
                router.push(`/order/${data.orderId}?token=${data.accessToken}`);
              } else {
                setErrorMsg(verifyData.error || "Payment signature verification failed. Please contact support.");
                setIsSubmitting(false);
                setSubmittingMessage("");
              }
            } catch {
              setErrorMsg("Error verifying payment with server. Please check your order status.");
              setIsSubmitting(false);
              setSubmittingMessage("");
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp: any) => {
          setIsSubmitting(false);
          setSubmittingMessage("");
          const failureReason = resp?.error?.description || resp?.error?.reason || "Payment was declined or failed.";
          setErrorMsg(`Payment Failed: ${failureReason}`);
        });

        rzp.open();
        // Notice: Keep isSubmitting true while modal is active; ondismiss or handler will reset/transition it
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during checkout");
      setIsSubmitting(false);
      setSubmittingMessage("");
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMsg("Please enter a valid 12-digit UPI reference / UTR number.");
      return;
    }

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
        router.push(`/order/${createdOrder.orderId}?token=${createdOrder.accessToken}`);
      } else {
        setErrorMsg(data.error || "Failed to submit UPI details");
      }
    } catch {
      setErrorMsg("Network error submitting UTR number");
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] text-stone-900 font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
              <Heart size={16} className="fill-current" />
            </div>
            <span className="font-serif font-bold text-lg text-stone-900">ExpertoMemories</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-8 sm:py-12">
        {createdOrder ? (
          /* MANUAL UPI PAYMENT CONFIRMATION SCREEN */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl max-w-xl mx-auto">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#541D2B]/10 text-[#541D2B] border border-[#541D2B]/15 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#541D2B] animate-pulse" />
                ORDER #{createdOrder.orderNumber} &bull; DIRECT UPI
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Transfer ₹{createdOrder.totalAmount?.toLocaleString("en-IN") || createdOrder.totalAmount} via UPI
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Scan the QR code using any UPI application to complete your payment.
              </p>
            </div>

            {/* QR Code and Payment Info Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-[#541D2B]/10 mb-6">
              {/* Left: Scannable QR Container */}
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
                    Payee: <span className="font-medium text-stone-800">{createdOrder.manualUpi?.payeeName || "Experto Memories"}</span>
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

              {/* Right: UPI ID & Amount */}
              <div className="space-y-3.5">
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
                      {createdOrder.manualUpi?.upiId || "dakshbabbar31@oksbi"}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        const upi = createdOrder.manualUpi?.upiId || "dakshbabbar31@oksbi";
                        navigator.clipboard.writeText(upi);
                        setCopiedUpi(true);
                        setTimeout(() => setCopiedUpi(false), 2000);
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

                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/80 border border-stone-200/60 text-xs">
                  <span className="text-stone-500">Payable Amount:</span>
                  <span className="font-serif font-bold text-sm sm:text-base text-stone-900">
                    ₹{createdOrder.totalAmount?.toLocaleString("en-IN") || createdOrder.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* UTR Submission Form */}
            <form onSubmit={handleSubmitUtr} className="space-y-4 pt-4 border-t border-stone-100">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  12-Digit UPI Reference / UTR Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 428190382910"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Found in your UPI app payment receipt after transfer.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingUtr}
                className="w-full py-3.5 rounded-full font-serif font-bold text-sm bg-stone-900 hover:bg-stone-800 text-white shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmittingUtr ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting UTR...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm UPI Payment Submission</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* REGULAR CHECKOUT FORM */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Customer & Payment Details */}
            <div className="md:col-span-7 space-y-6">
              <form onSubmit={handleCreateOrder} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-stone-900">Contact Details</h1>
                  <p className="text-xs text-stone-500 mt-1">
                    We will send your order updates and published gift link to this contact.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="rohan@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="pt-6 border-t border-stone-100">
                  <h2 className="font-serif text-lg font-bold text-stone-900 mb-3">Payment Method</h2>
                  <div className="space-y-3">
                    <label
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "manual_upi"
                          ? "border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "manual_upi"}
                          onChange={() => setPaymentMethod("manual_upi")}
                          className="accent-rose-600"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-stone-900">Direct UPI Transfer</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              0% Gateway Fee
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            GPay, PhonePe, Paytm QR code with instant UTR confirmation
                          </p>
                        </div>
                      </div>
                      <QrCode size={20} className="text-stone-400" />
                    </label>

                    <label
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "razorpay"
                          ? "border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "razorpay"}
                          onChange={() => setPaymentMethod("razorpay")}
                          className="accent-rose-600"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-stone-900">Online Payment Gateway</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                              Automated
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Credit/Debit Cards, Netbanking, Razorpay UPI
                          </p>
                        </div>
                      </div>
                      <CreditCard size={20} className="text-stone-400" />
                    </label>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-serif font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-300/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{submittingMessage || "Processing..."}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === "manual_upi" ? "Generate UPI QR Code" : "Pay with Razorpay"} • ₹
                        {totalAmount.toLocaleString("en-IN")}
                      </span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 sticky top-24">
                <h2 className="font-serif font-bold text-base text-stone-900 pb-3 border-b border-stone-100">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.productSlug}-${item.selectedTheme}`} className="flex items-start justify-between gap-3 text-xs">
                      <div>
                        <p className="font-serif font-bold text-stone-900">{item.title}</p>
                        <p className="text-stone-500 text-[11px]">Theme: {item.selectedTheme}</p>
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Delivery</span>
                    <span className="text-emerald-700 font-bold">Free (Digital Delivery)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-100">
                    <span>Total Payable</span>
                    <span className="font-serif text-lg text-rose-600">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-600 space-y-1">
                  <p className="font-semibold text-stone-800 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> What happens after payment?
                  </p>
                  <p>
                    You will be guided to enter your memories, love letter, and upload photos for your recipient.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
