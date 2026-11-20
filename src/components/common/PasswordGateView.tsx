"use client";

import React, { useState } from "react";
import { Lock, KeyRound, ArrowRight, Heart, Loader2, Sparkles, ShieldCheck } from "lucide-react";

interface PasswordGateViewProps {
  slug: string;
  recipientName: string;
  senderName: string;
  passwordHint?: string;
}

export function PasswordGateView({
  slug,
  recipientName,
  senderName,
  passwordHint,
}: PasswordGateViewProps) {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/gift/${slug}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.reload();
      } else {
        setErrorMsg(data.error || "Incorrect password. Please try again.");
      }
    } catch {
      setErrorMsg("Network error verifying password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 text-stone-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-xl shadow-rose-200/40 text-center relative overflow-hidden">
        {/* Soft Decorative Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-300/50">
          <Lock size={26} />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 mb-3">
          <Heart size={12} className="fill-rose-500 text-rose-500" />
          <span>Private Special Gift</span>
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          Password Protected
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
          {senderName} has crafted a private digital surprise for {recipientName}. Please enter the secret password to open it.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter secret password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 pr-10 text-center font-mono tracking-wider"
            />
            <div className="absolute right-3.5 top-3.5 text-stone-400">
              <KeyRound size={16} />
            </div>
          </div>

          {passwordHint && (
            <p className="text-xs text-rose-800 bg-rose-50/80 border border-rose-200/60 rounded-xl p-2.5 flex items-center justify-center gap-1.5">
              <Sparkles size={13} className="text-rose-500 shrink-0" />
              <span>Hint: {passwordHint}</span>
            </p>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-serif font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-300/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Unlocking Gift...</span>
              </>
            ) : (
              <>
                <span>Open Secret Gift</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>ExpertoMemories Protected Privacy</span>
        </div>
      </div>
    </div>
  );
}
