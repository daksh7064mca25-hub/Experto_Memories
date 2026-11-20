"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Lock, Mail, ArrowRight, Sparkles, Key } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@expertomemories.in");
  const [password, setPassword] = useState("apology123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/studio");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-pink-200/80">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-300/40">
            <Heart size={26} className="fill-current animate-pulse" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
            ExpertoMemories
          </h1>
          <p className="text-xs text-rose-600/80 font-mono tracking-widest mt-1">
            CREATOR STUDIO LOGIN
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@expertomemories.in"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-rose-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-rose-950"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3 rounded-xl bg-pink-50/80 border border-pink-200/60 text-[11px] text-rose-800 flex items-start gap-2">
            <Key size={14} className="shrink-0 text-rose-500 mt-0.5" />
            <div>
              <span className="font-semibold">Local Access: </span>
              Pre-filled with default studio credentials (<code className="bg-white/80 px-1 py-0.5 rounded">apology123</code>).
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-serif font-bold text-sm bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-400/30 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Enter Studio</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-rose-700/60">
          <span>&copy; ExpertoMemories Studio</span>
        </div>
      </div>
    </div>
  );
}

