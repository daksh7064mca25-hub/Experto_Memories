"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

export default function StudioOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
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
      if (res.ok && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, methodFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const renderPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            <CheckCircle2 size={10} /> Paid
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
            <Clock size={10} /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold">
            <AlertTriangle size={10} /> Failed
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
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search order #, customer name, email, phone, UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50/50"
          />
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200/80 text-xs font-semibold">
        {[
          { id: "all", label: "All Orders" },
          { id: "payment_pending_verification", label: "Needs UPI Verification" },
          { id: "paid", label: "Paid" },
          { id: "refunded", label: "Refunded" },
          { id: "pending", label: "Payment Pending" },
          { id: "failed", label: "Failed / Rejected" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              statusFilter === tab.id
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-stone-100 hover:bg-stone-200 text-stone-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    ord.paymentMethod === "manual_upi" &&
                    ord.paymentStatus === "pending" &&
                    Boolean(ord.manualUpiDetails?.utrNumber);

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
                          {item?.title || "Digital Gift Website"}
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold text-rose-700">
                          {item?.occasionType || "Custom"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-sm text-stone-900">
                        ₹{ord.totalAmount}
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
        )}
      </div>
    </div>
  );
}
