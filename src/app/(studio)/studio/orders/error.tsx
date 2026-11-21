"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, ArrowLeft, ShieldAlert } from "lucide-react";

export default function StudioOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Studio Orders Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-rose-950">
            Order View Failed to Load
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            An unexpected error occurred while loading this order. This may happen if the database connection timed out or an order ID format was invalid.
          </p>
          {error?.message && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/80 text-rose-900 font-mono text-[11px] break-all text-left mt-3">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw size={14} /> Try Again
          </button>
          <Link
            href="/studio/orders"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-stone-200"
          >
            <ArrowLeft size={14} /> Back to Orders Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
