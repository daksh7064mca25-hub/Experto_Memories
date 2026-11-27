"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Eye,
  Calendar,
  Sparkles,
  Loader2,
  Search,
  RotateCcw,
  CreditCard,
  QrCode,
  RefreshCw,
  X,
  AlertCircle,
} from "lucide-react";

interface OrderCounts {
  all: number;
  needsVerification: number;
  paid: number;
  refunded: number;
  pending: number;
  failed: number;
}

function StudioOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("paymentStatus") || "all";

  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState<OrderCounts>({
    all: 0,
    needsVerification: 0,
    paid: 0,
    refunded: 0,
    pending: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("paymentStatus", statusFilter);
      if (methodFilter !== "all") params.set("paymentMethod", methodFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      if (data.orders) {
        setOrders(data.orders);
      }
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch (err: any) {
      console.error("Failed to fetch admin orders:", err);
      setError(err.message || "Network error loading orders. Please check database connection and retry.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, methodFilter, searchQuery, router]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchOrders();
    });
  }, [fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    // Immediate refetch without search filter
    setTimeout(() => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("paymentStatus", statusFilter);
      if (methodFilter !== "all") params.set("paymentMethod", methodFilter);
      fetch(`/api/admin/orders?${params.toString()}`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.orders) setOrders(d.orders);
          if (d.counts) setCounts(d.counts);
        })
        .catch(() => {});
    }, 10);
  };

  const renderPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            <CheckCircle2 size={10} /> Paid
          </span>
        );
      case "payment_pending_verification":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
            <Clock size={10} /> Needs Verification
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold">
            <RotateCcw size={10} /> Refunded
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
            <Clock size={10} /> Payment Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold">
            <AlertTriangle size={10} /> Failed / Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-bold capitalize">
            {status}
          </span>
        );
    }
  };

  const tabs: { id: string; label: string; count?: number; highlight?: boolean }[] = [
    { id: "all", label: "All Orders", count: counts.all },
    {
      id: "payment_pending_verification",
      label: "Needs UPI Verification",
      count: counts.needsVerification,
      highlight: counts.needsVerification > 0,
    },
    { id: "paid", label: "Paid", count: counts.paid },
    { id: "refunded", label: "Refunded", count: counts.refunded },
    { id: "pending", label: "Payment Pending", count: counts.pending },
    { id: "failed", label: "Failed / Rejected", count: counts.failed },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            FULFILLMENT &amp; PAYMENTS
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Customer Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review incoming gift orders, verify manual UPI payments, issue administrative refunds, and track delivery.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search order #, customer name, email, phone, UTR, or MongoDB ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">
            Method:
          </span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none"
          >
            <option value="all">All Gateways</option>
            <option value="razorpay">Razorpay Gateway</option>
            <option value="manual_upi">Manual UPI</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs with Counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200/80 text-xs font-semibold">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? "bg-stone-900 text-white shadow-sm"
                  : tab.highlight
                  ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? "bg-stone-700 text-white"
                      : tab.highlight
                      ? "bg-amber-200 text-amber-950"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <p><strong>Error loading orders:</strong> {error}</p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shrink-0 shadow-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">
            <Loader2 size={28} className="animate-spin text-rose-600 mx-auto mb-2" />
            <p className="text-xs">Loading orders database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No customer orders found matching criteria.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-2 text-xs text-rose-600 hover:underline font-semibold"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Mobile Order Cards View (<768px) */}
            <div className="md:hidden divide-y divide-stone-100">
              {orders.map((ord) => {
                const item = ord.items?.[0];
                const isNeedsVerification =
                  ord.paymentStatus === "payment_pending_verification" ||
                  (ord.paymentMethod === "manual_upi" &&
                    ord.paymentStatus === "pending" &&
                    Boolean(ord.manualUpiDetails?.utrNumber));

                return (
                  <div key={ord._id} className="p-4 space-y-3 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/studio/orders/${ord._id}`} className="font-mono font-bold text-xs text-stone-900 hover:underline block">
                          {ord.orderNumber}
                        </Link>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="shrink-0">
                        {isNeedsVerification ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            <Clock size={10} /> Verify UTR
                          </span>
                        ) : (
                          renderPaymentBadge(ord.paymentStatus)
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-xs text-stone-900 truncate">
                        {item?.title || ord.projectId?.title || "Digital Celebration Website"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 font-mono">
                        <span className="uppercase text-rose-700 font-bold">{item?.occasionType || ord.projectId?.occasionType || "Custom"}</span>
                        <span>•</span>
                        <span>{ord.customer?.name || "Customer"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <div>
                        <span className="font-serif font-bold text-sm text-stone-900 block">
                          ₹{ord.totalAmount?.toLocaleString("en-IN") || ord.totalAmount}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          {ord.paymentMethod === "razorpay" ? "Razorpay" : "Manual UPI"}
                        </span>
                      </div>

                      <Link
                        href={`/studio/orders/${ord._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold transition-colors"
                      >
                        <span>Manage</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>=768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[10px] font-mono uppercase text-stone-400 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Item &amp; Occasion</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => {
                  const item = ord.items?.[0];
                  const isNeedsVerification =
                    ord.paymentStatus === "payment_pending_verification" ||
                    (ord.paymentMethod === "manual_upi" &&
                      ord.paymentStatus === "pending" &&
                      Boolean(ord.manualUpiDetails?.utrNumber));

                  return (
                    <tr key={ord._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        <Link href={`/studio/orders/${ord._id}`} className="hover:underline">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block">{ord.customer?.name}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{ord.customer?.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-stone-800 block truncate max-w-xs">
                          {item?.title || ord.projectId?.title || "Digital Celebration Website"}
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold text-rose-700">
                          {item?.occasionType || ord.projectId?.occasionType || "Custom"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-sm text-stone-900">
                        ₹{ord.totalAmount?.toLocaleString("en-IN") || ord.totalAmount}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {ord.paymentMethod === "razorpay" ? (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                            <CreditCard size={11} /> Razorpay
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                            <QrCode size={11} /> Manual UPI
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isNeedsVerification ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            <Clock size={10} /> Verify UTR
                          </span>
                        ) : (
                          renderPaymentBadge(ord.paymentStatus)
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono capitalize text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {ord.orderStatus || "placed"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/studio/orders/${ord._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold transition-colors"
                        >
                          <span>Manage</span>
                          <ArrowRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default function StudioOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-stone-500">
          <Loader2 size={32} className="animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs">Loading customer orders...</p>
        </div>
      }
    >
      <StudioOrdersContent />
    </Suspense>
  );
}
