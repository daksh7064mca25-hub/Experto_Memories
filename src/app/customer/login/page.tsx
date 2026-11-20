"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

function CustomerAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const endpoint =
        mode === "register" ? "/api/auth/customer/register" : "/api/auth/customer/login";
      const payload =
        mode === "register"
          ? { name: name.trim(), email: email.trim(), password, phone: phone.trim() }
          : { email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-pink-50/40 text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
            <Heart size={16} className="fill-current" />
          </div>
          <span className="font-serif font-bold text-lg text-stone-900">ExpertoMemories</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
        >
          ← Back to Showcase
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Left: Value Proposition */}
        <div className="md:w-1/2 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <Sparkles size={13} className="text-rose-500" />
            <span>Self-Service Digital Gift Studio</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            Create Heartfelt Digital Gifts, Completely Free to Start.
          </h1>

          <p className="text-sm text-stone-600 leading-relaxed">
            Build your personalized interactive website with love letters, photo memories, music, and games. Edit and preview on mobile, tablet, and desktop for free — pay only when you are ready to publish.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "100% Free draft creation & real-time autosave",
              "Unlimited editing & multi-device preview",
              "Hosted URL or optional custom domain on publish",
              "Optional secret password protection for your gift",
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-700">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="md:w-1/2 w-full max-w-md">
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-stone-200/90 shadow-xl shadow-stone-200/50">
            {/* Mode Switcher */}
            <div className="flex rounded-2xl bg-stone-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Create Free Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <User size={16} className="absolute left-3.5 top-3 text-stone-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3 text-stone-400" />
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    WhatsApp / Phone (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <Phone size={16} className="absolute left-3.5 top-3 text-stone-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3 text-stone-400" />
                </div>
                {mode === "register" && (
                  <p className="text-[11px] text-stone-500 mt-1">Minimum 6 characters</p>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full font-serif font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-300/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{mode === "register" ? "Creating Account..." : "Signing In..."}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "register" ? "Create Free Account" : "Sign In to Studio"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Safe 256-Bit SSL Encrypted Session</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-rose-50">
          <Loader2 size={24} className="animate-spin text-rose-500" />
        </div>
      }
    >
      <CustomerAuthContent />
    </Suspense>
  );
}
