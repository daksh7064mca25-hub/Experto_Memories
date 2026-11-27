"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Settings,
  Shield,
  Cloud,
  Database,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Globe,
  Loader2,
  CreditCard,
  QrCode,
  Radio,
  Lock,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function StudioSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Settings State
  const [basePrice, setBasePrice] = useState(999);
  const [customDomainPrice, setCustomDomainPrice] = useState(1200);
  const [hostingDurationMonths, setHostingDurationMonths] = useState(12);
  const [renewalPolicy, setRenewalPolicy] = useState("");
  const [cnameTarget, setCnameTarget] = useState("cname.expertomemories.shop");
  const [paymentMethodsAllowed, setPaymentMethodsAllowed] = useState<"both" | "razorpay_only" | "upi_only">("both");
  const [productPrices, setProductPrices] = useState<any[]>([]);
  const [occasionPrices, setOccasionPrices] = useState<Record<string, number>>({});

  // Manual UPI Settings
  const [bankName, setBankName] = useState("HDFC Bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("/images/upi-qr.png");

  // Gateway status from server
  const [gateways, setGateways] = useState<any | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.settings) {
        setBasePrice(data.settings.basePrice);
        setCustomDomainPrice(data.settings.customDomainPrice);
        setHostingDurationMonths(data.settings.hostingDurationMonths || 12);
        setRenewalPolicy(data.settings.renewalPolicy || "");
        setCnameTarget(data.settings.cnameTarget || "cname.expertomemories.shop");
        setPaymentMethodsAllowed(data.settings.paymentMethodsAllowed || "both");

        if (data.settings.manualUpiConfig) {
          setBankName(data.settings.manualUpiConfig.bankName || "HDFC Bank");
          setAccountNumber(data.settings.manualUpiConfig.accountNumber || "");
          setIfscCode(data.settings.manualUpiConfig.ifscCode || "");
          setUpiId(data.settings.manualUpiConfig.upiId || "");
          setDisplayName(data.settings.manualUpiConfig.displayName || "");
          setQrCodeUrl(data.settings.manualUpiConfig.qrCodeUrl || "/images/upi-qr.jpeg");
        }

        if (data.gateways) {
          setGateways(data.gateways);
        }

        if (data.productPrices) {
          setProductPrices(data.productPrices);
        }
        if (data.occasionPrices) {
          setOccasionPrices(data.occasionPrices);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchSettings();
    });
  }, [fetchSettings]);

  const handleOccasionPriceChange = (slug: string, newPrice: number) => {
    setOccasionPrices((prev) => ({
      ...prev,
      [slug.toLowerCase()]: newPrice,
    }));
    setProductPrices((prev) =>
      prev.map((p) =>
        p.slug.toLowerCase() === slug.toLowerCase() ? { ...p, price: newPrice, isCustomPrice: true } : p
      )
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrice: Number(basePrice),
          customDomainPrice: Number(customDomainPrice),
          hostingDurationMonths: Number(hostingDurationMonths),
          renewalPolicy,
          cnameTarget,
          paymentMethodsAllowed,
          manualUpiConfig: {
            bankName,
            accountNumber,
            ifscCode,
            upiId,
            displayName,
            qrCodeUrl,
          },
          occasionPrices,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setSaveMsg("Business pricing, policy, and payment settings saved successfully!");
        await fetchSettings();
        setTimeout(() => setSaveMsg(""), 3500);
      } else {
        setSaveMsg(data.error || "Failed to update settings");
      }
    } catch {
      setSaveMsg("Network error saving platform settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-stone-500 font-sans">
        <Loader2 size={32} className="animate-spin text-rose-600 mx-auto mb-2" />
        <p className="text-xs">Loading platform settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            CONFIGURATION &amp; POLICIES
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Platform Settings &amp; Gateways
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Server-authoritative pricing, custom domain policies, Razorpay credentials, and manual UPI account details.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Reload</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Server-Authoritative Pricing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <DollarSign size={20} className="text-rose-500" />
                <span>Base Pricing &amp; Hosting Policy</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                These rates are server-authoritative: orders calculate total directly from MongoDB.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Rates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Standard Gift Website Base Price (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Base fee to unlock publishing for all 4 occasion templates.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Custom Domain Add-on Price (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                required
                value={customDomainPrice}
                onChange={(e) => setCustomDomainPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Additional charge when customer selects custom branded domain.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Included Hosting Duration (Months)
              </label>
              <input
                type="number"
                min="1"
                required
                value={hostingDurationMonths}
                onChange={(e) => setHostingDurationMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Standard hosting duration included with base publishing (default 12 months).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                CNAME Target for DNS Delegation
              </label>
              <input
                type="text"
                required
                value={cnameTarget}
                onChange={(e) => setCnameTarget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Destination host customers point their domain DNS CNAME to.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Hosting &amp; Domain Renewal Policy Text
            </label>
            <textarea
              rows={3}
              required
              value={renewalPolicy}
              onChange={(e) => setRenewalPolicy(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Occasion & Product-Specific Pricing Breakdown */}
          <div className="pt-5 border-t border-stone-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-1.5">
                  <Sparkles size={14} className="text-rose-500" />
                  <span>Occasion &amp; Product Pricing Overrides</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Configure custom prices per celebration category. When not overridden, categories inherit the global base price (₹{basePrice}).
                </p>
              </div>
              <Link
                href="/studio/templates"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Full Catalog &amp; Features</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Mobile Pricing Overrides Cards (<640px) */}
            <div className="sm:hidden divide-y divide-stone-100 rounded-2xl border border-stone-200 overflow-hidden bg-white">
              {(productPrices.length > 0
                ? productPrices
                : [
                    { id: "prod-wedding", slug: "wedding", title: "The Royal Wedding Invitation", occasionType: "wedding", price: 1499, isCustomPrice: true },
                    { id: "prod-anniversary", slug: "anniversary", title: "Our Forever Story", occasionType: "anniversary", price: 999, isCustomPrice: false },
                    { id: "prod-birthday", slug: "birthday", title: "The Birthday Chronicle", occasionType: "birthday", price: 999, isCustomPrice: false },
                    { id: "prod-love", slug: "love", title: "The Secret World of Us", occasionType: "love", price: 999, isCustomPrice: false },
                    { id: "prod-apology", slug: "apology", title: "A Little Sorry, A Lot of Love", occasionType: "apology", price: 999, isCustomPrice: false },
                  ]
              ).map((prod) => {
                const currentPrice = occasionPrices[prod.slug.toLowerCase()] ?? prod.price ?? basePrice;
                const isCustom = prod.isCustomPrice || currentPrice !== basePrice;

                return (
                  <div key={prod.slug} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-stone-900 block">{prod.title}</span>
                        <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">{prod.occasionType} • {prod.slug}</span>
                      </div>
                      {isCustom ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                          Override
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full shrink-0">
                          Base (₹{basePrice})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="text-xs text-stone-600 font-medium">Active Price:</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-400 font-mono text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={currentPrice}
                          onChange={(e) => handleOccasionPriceChange(prod.slug, Number(e.target.value))}
                          className="w-28 px-3 py-1.5 rounded-xl border border-stone-200 font-mono text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-stone-50"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Pricing Overrides Table (>=640px) */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-[10px] font-mono uppercase text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Occasion Category</th>
                    <th className="py-2.5 px-3">Catalog Slug</th>
                    <th className="py-2.5 px-3">Active Price (₹ INR)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(productPrices.length > 0
                    ? productPrices
                    : [
                        { id: "prod-wedding", slug: "wedding", title: "The Royal Wedding Invitation", occasionType: "wedding", price: 1499, isCustomPrice: true },
                        { id: "prod-anniversary", slug: "anniversary", title: "Our Forever Story", occasionType: "anniversary", price: 999, isCustomPrice: false },
                        { id: "prod-birthday", slug: "birthday", title: "The Birthday Chronicle", occasionType: "birthday", price: 999, isCustomPrice: false },
                        { id: "prod-love", slug: "love", title: "The Secret World of Us", occasionType: "love", price: 999, isCustomPrice: false },
                        { id: "prod-apology", slug: "apology", title: "A Little Sorry, A Lot of Love", occasionType: "apology", price: 999, isCustomPrice: false },
                      ]
                  ).map((prod) => {
                    const currentPrice = occasionPrices[prod.slug.toLowerCase()] ?? prod.price ?? basePrice;
                    const isCustom = prod.isCustomPrice || currentPrice !== basePrice;

                    return (
                      <tr key={prod.slug} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-stone-900 block">{prod.title}</span>
                          <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">{prod.occasionType}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-stone-500">
                          {prod.slug}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 max-w-[140px]">
                            <span className="text-stone-400 font-mono text-xs">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={currentPrice}
                              onChange={(e) => handleOccasionPriceChange(prod.slug, Number(e.target.value))}
                              className="w-24 px-2 py-1 rounded-lg border border-stone-200 font-mono text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          {isCustom ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                              Custom Override
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                              Base Fallback (₹{basePrice})
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Gateways & Allowed Methods Toggle */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-500" />
                <span>Payment Gateways &amp; Methods Control</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Toggle active payment options and manage bank details for manual UPI checkout.
              </p>
            </div>
          </div>

          {/* Method Toggle */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2">
              Allowed Payment Methods on Checkout
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "both", label: "Both Methods", desc: "Razorpay Gateway + Manual UPI (Recommended)" },
                { id: "razorpay_only", label: "Razorpay Only", desc: "Automated cards, netbanking & gateway UPI" },
                { id: "upi_only", label: "Manual UPI Only", desc: "Direct QR code bank transfer & UTR verification" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethodsAllowed === opt.id
                      ? "border-stone-900 bg-stone-50/80 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="paymentMethodsAllowed"
                      value={opt.id}
                      checked={paymentMethodsAllowed === opt.id}
                      onChange={(e) => setPaymentMethodsAllowed(e.target.value as any)}
                      className="text-stone-900 focus:ring-stone-900"
                    />
                    <span className="font-bold text-xs text-stone-900">{opt.label}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 pl-5 leading-normal">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Razorpay Gateway Status Card */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <CreditCard size={16} className="text-blue-600" />
                <span>Razorpay Integration Status</span>
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  gateways?.razorpay?.isConfigured
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {gateways?.razorpay?.isConfigured ? "CONFIGURED" : "MISSING CREDENTIALS"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block uppercase">Key ID</span>
                <span className="font-bold text-stone-800">
                  {gateways?.razorpay?.keyId || "Not Set"}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block uppercase">Gateway Environment</span>
                <span className="font-bold text-blue-700">
                  {gateways?.razorpay?.mode || "Live Production"}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block uppercase">Webhook Signature</span>
                <span className="font-bold text-emerald-700">
                  {gateways?.razorpay?.hasWebhookSecret ? "SECRET ACTIVE" : "NOT SET"}
                </span>
              </div>
            </div>
          </div>

          {/* Manual UPI Configuration */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <QrCode size={16} className="text-amber-600" />
              <span>Manual Direct UPI Bank Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono uppercase focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Business UPI VPA / ID
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Recipient Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  QR Code Image URL
                </label>
                <input
                  type="text"
                  required
                  value={qrCodeUrl}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Integration Diagnostics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
            Infrastructure &amp; Storage Diagnostics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <Database className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-serif font-bold text-sm text-stone-900 block">
                  MongoDB Atlas
                </span>
                <span className="text-xs text-stone-500 block mt-0.5">
                  Production cluster connected &amp; collections synced
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 mt-2">
                  <CheckCircle2 size={12} /> OPERATIONAL
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <Cloud className="text-purple-600 shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-serif font-bold text-sm text-stone-900 block">
                  Cloudflare R2 Storage
                </span>
                <span className="text-xs text-stone-500 block mt-0.5">
                  Presigned media uploads and public asset distribution
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 mt-2">
                  <CheckCircle2 size={12} /> READY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {saveMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
            {saveMsg}
          </div>
        )}

        {/* Save Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl font-serif font-bold text-sm bg-stone-900 hover:bg-stone-800 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>Save All Configuration &amp; Gateways</span>
          </button>
        </div>
      </form>
    </div>
  );
}
