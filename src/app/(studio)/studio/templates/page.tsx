"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Palette,
  ArrowRight,
  Check,
  Heart,
  ShieldCheck,
  Edit2,
  DollarSign,
  Loader2,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/catalogue", { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch catalogue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const handleToggleActive = async (prod: any) => {
    try {
      const updatedStatus = !prod.isActive;
      const res = await fetch("/api/admin/catalogue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: prod.id,
          title: prod.title,
          subtitle: prod.subtitle,
          price: prod.price,
          badge: prod.badge,
          isActive: updatedStatus,
        }),
        credentials: "include",
      });
      if (res.ok) {
        fetchCatalogue();
      }
    } catch {
      alert("Error toggling product status");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch("/api/admin/catalogue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingProduct.id,
          title: editingProduct.title,
          subtitle: editingProduct.subtitle,
          price: Number(editingProduct.price),
          originalPrice: Number(editingProduct.originalPrice || 1999),
          badge: editingProduct.badge || "",
          isActive: editingProduct.isActive !== false,
          description: editingProduct.description,
          features: editingProduct.features,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("Product catalogue updated successfully! Customer websites remain untouched.");
        setTimeout(() => {
          setEditingProduct(null);
          setMsg("");
          fetchCatalogue();
        }, 1200);
      } else {
        setMsg(data.error || "Failed to update product");
      }
    } catch {
      setMsg("Error saving catalogue product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            PRODUCT &amp; THEME ARCHITECTURE
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Occasion Catalogues &amp; Themes
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage platform celebration collections: Wedding Invitations, Love &amp; Romance, Anniversary, Birthday, and Apology.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCatalogue}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh Catalogue</span>
        </button>
      </div>

      {/* Safeguard Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-950">
            Platform Safeguard Active: Isolated Customer Data Integrity
          </h4>
          <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
            Catalogue modifications adjust the public storefront display, default pricing, and template features for new creations. Under strict architectural isolation, catalogue updates <strong>never</strong> mutate or overwrite existing customized customer websites or draft projects.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-16 text-center text-stone-500">
          <Loader2 size={32} className="animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs">Loading occasion catalogue...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className={`bg-white rounded-3xl border ${
                prod.isActive ? "border-stone-200" : "border-stone-200 opacity-60"
              } shadow-sm overflow-hidden flex flex-col justify-between`}
            >
              <div>
                {/* Header Strip */}
                <div className="p-6 bg-gradient-to-r from-stone-50 to-rose-50/30 border-b border-stone-100 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {prod.occasionType}
                      </span>
                      {prod.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {prod.badge}
                        </span>
                      )}
                      {!prod.isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                          Hidden
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {prod.subtitle}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif font-bold text-2xl text-stone-900">
                      ₹{prod.price}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-stone-400 line-through block">
                        ₹{prod.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features & Description */}
                <div className="p-6 space-y-4 text-xs">
                  <p className="text-stone-600 leading-relaxed text-xs">
                    {prod.description}
                  </p>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-400 block mb-2">
                      Occasion Features ({prod.features?.length || 0})
                    </span>
                    <ul className="space-y-1.5">
                      {prod.features?.slice(0, 4).map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-stone-700">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {prod.themes && prod.themes.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-stone-400 block mb-2">
                        Supported Themes ({prod.themes.length})
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prod.themes.map((t: any) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-[11px] font-medium text-stone-700"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: t.previewColor || "#f43f5e" }}
                            />
                            <span>{t.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(prod)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                      prod.isActive
                        ? "bg-stone-200 hover:bg-stone-300 text-stone-800"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {prod.isActive ? "Hide Product" : "Publish to Storefront"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...prod })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold transition-colors"
                  >
                    <Edit2 size={12} />
                    <span>Edit Details</span>
                  </button>
                </div>

                <a
                  href={prod.demoUrl || `/demo/${prod.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-stone-500 hover:text-rose-600 font-semibold"
                >
                  <Eye size={13} />
                  <span>View Demo</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-600 font-bold">
                  EDIT OCCASION PRODUCT
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  {editingProduct.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Product Title
              </label>
              <input
                type="text"
                required
                value={editingProduct.title}
                onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Marketing Subtitle / Tagline
              </label>
              <input
                type="text"
                value={editingProduct.subtitle || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Base Price (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Original Price (₹ Crossout)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProduct.originalPrice || 1999}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Badge (e.g. Bestseller, Most Heartfelt, Trending)
              </label>
              <input
                type="text"
                value={editingProduct.badge || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editingProduct.description || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={editingProduct.isActive !== false}
                onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                className="rounded border-stone-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold text-stone-800">
                Active &amp; Visible on Public Storefront
              </span>
            </label>

            {msg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {msg}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
