"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/config/products";

export function CartDrawer() {
  const { items, removeItem, totalAmount, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag size={16} />
              </div>
              <h2 className="font-serif font-bold text-lg text-stone-900">Your Gift Bag</h2>
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-stone-200/60 text-stone-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-300 mb-3">
                  <Heart size={28} />
                </div>
                <p className="font-serif text-base text-stone-700 font-semibold">Your gift bag is empty</p>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Browse our anniversary, apology, birthday, and love websites to create a memorable gift.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const product = getProductBySlug(item.productSlug);
                const theme = product?.themes.find((t) => t.id === item.selectedTheme);

                return (
                  <div
                    key={`${item.productSlug}-${item.selectedTheme}`}
                    className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/40 flex items-start justify-between gap-3 transition-all hover:border-rose-200"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-bold">
                        {item.occasionType} Gift
                      </span>
                      <h3 className="font-serif font-bold text-sm text-stone-900 truncate mt-0.5">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                          style={{ backgroundColor: theme?.previewColor || "#ec4899" }}
                        />
                        <span className="text-[11px] text-stone-600 font-medium">
                          Theme: {theme?.name || item.selectedTheme}
                        </span>
                      </div>
                      <p className="font-serif font-bold text-sm text-rose-950 mt-2">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productSlug)}
                      className="p-2 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 font-medium">Total Amount:</span>
                <span className="font-serif font-bold text-xl text-stone-950">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 justify-center">
                <Sparkles size={13} className="text-amber-500" />
                <span>Zero hidden charges • Private link valid forever</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-6 rounded-full font-serif font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-300/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
