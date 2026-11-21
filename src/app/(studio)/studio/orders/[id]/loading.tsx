import React from "react";

export default function OrderDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-6 animate-pulse">
      <div className="h-4 bg-rose-200/50 rounded w-36"></div>
      <div className="flex items-center justify-between">
        <div className="h-9 bg-rose-200/60 rounded-xl w-64"></div>
        <div className="h-9 bg-rose-200/60 rounded-xl w-40"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-white rounded-2xl border border-rose-100 p-6 space-y-4">
            <div className="h-4 bg-stone-200 rounded w-32"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-stone-100 rounded-xl"></div>
              <div className="h-16 bg-stone-100 rounded-xl"></div>
            </div>
          </div>
          <div className="h-64 bg-white rounded-2xl border border-rose-100 p-6 space-y-4">
            <div className="h-4 bg-stone-200 rounded w-40"></div>
            <div className="h-20 bg-stone-100 rounded-xl"></div>
            <div className="h-20 bg-stone-100 rounded-xl"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-56 bg-white rounded-2xl border border-rose-100 p-6 space-y-4">
            <div className="h-4 bg-stone-200 rounded w-36"></div>
            <div className="h-8 bg-stone-100 rounded-lg"></div>
            <div className="h-8 bg-stone-100 rounded-lg"></div>
            <div className="h-8 bg-stone-100 rounded-lg"></div>
          </div>
          <div className="h-48 bg-white rounded-2xl border border-rose-100 p-6 space-y-4">
            <div className="h-4 bg-stone-200 rounded w-36"></div>
            <div className="h-10 bg-stone-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
