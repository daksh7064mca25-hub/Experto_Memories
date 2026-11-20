"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Loader2,
  RefreshCw,
  QrCode,
  DollarSign,
  RotateCcw,
  Tag,
  Settings,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function AdminOverviewDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/admin/overview", { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setErrorMsg(json.error || "Failed to load dashboard metrics");
      }
    } catch {
      setErrorMsg("Network error loading dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-stone-500 font-sans">
        <Loader2 size={36} className="animate-spin text-rose-600 mb-3" />
        <p className="text-sm font-medium">Aggregating real-time MongoDB metrics...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl max-w-lg mx-auto text-center font-sans">
        <ShieldAlert size={28} className="mx-auto text-red-600 mb-2" />
        <h3 className="font-bold text-base mb-1">Access Restricted or Error</h3>
        <p className="text-xs text-red-700 mb-4">{errorMsg || "Unable to load business overview"}</p>
        <button
          type="button"
          onClick={fetchOverview}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  const { kpis, recentOrders, recentCustomers, recentProjects } = data;
  const totalCustomerWebsites = kpis.totalWebsites || (kpis.publishedWebsites + kpis.draftWebsites + (kpis.suspendedWebsites || 0));
  const suspendedOrExpiredCount = (kpis.suspendedWebsites || 0) + (kpis.expiredWebsites || 0);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            EXPERTOMEMORIES HQ
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight mt-0.5">
            Business Operations Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time business performance, revenue, customer accounts, orders, manual UPI verifications, and custom domains.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOverview}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-sm flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-mono uppercase text-stone-400 font-bold px-2 shrink-0">
          Quick Actions:
        </span>
        <Link
          href="/studio/orders?paymentStatus=payment_pending_verification"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200/80 whitespace-nowrap transition-colors"
        >
          <Clock size={13} className="text-amber-600" />
          <span>Pending UPI ({kpis.pendingUpiApprovals || 0})</span>
        </Link>
        <Link
          href="/studio/customers"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold whitespace-nowrap transition-colors"
        >
          <Users size={13} className="text-stone-600" />
          <span>Customer Directory</span>
        </Link>
        <Link
          href="/studio/websites"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold whitespace-nowrap transition-colors"
        >
          <Globe size={13} className="text-stone-600" />
          <span>Customer Websites</span>
        </Link>
        <Link
          href="/studio/websites?filter=domains"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold border border-blue-200/80 whitespace-nowrap transition-colors"
        >
          <Globe size={13} className="text-blue-600" />
          <span>Custom Domains ({kpis.pendingCustomDomains || 0})</span>
        </Link>
        <Link
          href="/studio/settings"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold whitespace-nowrap transition-colors"
        >
          <Settings size={13} className="text-stone-600" />
          <span>Pricing &amp; Policies</span>
        </Link>
      </div>

      {/* Primary KPI Cards Grid (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 text-emerald-600">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Total Revenue
            </span>
            <TrendingUp size={18} />
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 mb-1">
            ₹{kpis.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-500">
            From {kpis.successfulPayments} paid orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 text-blue-600">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <ShoppingBag size={18} />
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 mb-1">
            {kpis.totalOrders}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <span>{kpis.pendingPayments} pending</span>
            <span>•</span>
            <span className="text-purple-600 font-semibold">{kpis.refundedOrders || 0} refunded</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 text-purple-600">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Registered Customers
            </span>
            <Users size={18} />
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 mb-1">
            {kpis.totalCustomers}
          </p>
          <p className="text-[11px] text-stone-500">
            +{kpis.newCustomersThisMonth} joined in last 30 days
          </p>
        </div>

        {/* Total Customer Websites */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 text-rose-600">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Customer Websites
            </span>
            <Globe size={18} />
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 mb-1">
            {totalCustomerWebsites}
          </p>
          <p className="text-[11px] text-stone-500">
            {kpis.publishedWebsites} live • {kpis.draftWebsites} drafts
          </p>
        </div>
      </div>

      {/* Secondary Operational KPI Strip (Row 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-sm">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 block mb-0.5">
            Paid Orders
          </span>
          <span className="font-serif text-xl font-bold text-stone-900">
            {kpis.successfulPayments}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-sm">
          <span className="text-[10px] font-mono font-bold uppercase text-purple-600 block mb-0.5">
            Refunded Orders
          </span>
          <span className="font-serif text-xl font-bold text-purple-900">
            {kpis.refundedOrders || 0}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-sm">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-600 block mb-0.5">
            Pending UPI
          </span>
          <span className="font-serif text-xl font-bold text-amber-900">
            {kpis.pendingUpiApprovals || 0}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-sm">
          <span className="text-[10px] font-mono font-bold uppercase text-rose-600 block mb-0.5">
            Suspended / Expired
          </span>
          <span className="font-serif text-xl font-bold text-rose-900">
            {suspendedOrExpiredCount}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-sm">
          <span className="text-[10px] font-mono font-bold uppercase text-blue-600 block mb-0.5">
            Custom Domains
          </span>
          <span className="font-serif text-xl font-bold text-blue-900">
            {kpis.pendingCustomDomains || 0}
          </span>
        </div>
      </div>

      {/* Action Required Banners (if any pending approvals) */}
      {(kpis.pendingUpiApprovals > 0 || kpis.pendingCustomDomains > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpis.pendingUpiApprovals > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-amber-950">
                    {kpis.pendingUpiApprovals} Manual UPI Payments Awaiting Verification
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Customers have submitted UTR reference numbers for review.
                  </p>
                </div>
              </div>
              <Link
                href="/studio/orders?paymentStatus=payment_pending_verification"
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors"
              >
                Review Orders
              </Link>
            </div>
          )}

          {kpis.pendingCustomDomains > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-blue-950">
                    {kpis.pendingCustomDomains} Custom Domains Pending DNS Verification
                  </h4>
                  <p className="text-[11px] text-blue-800">
                    Customers have submitted CNAME records for domain connection.
                  </p>
                </div>
              </div>
              <Link
                href="/studio/websites?filter=domains"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition-colors"
              >
                Inspect Domains
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Recent Customer Orders
              </h3>
              <Link
                href="/studio/orders"
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No orders recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] font-mono uppercase text-stone-400 border-b border-stone-100">
                    <tr>
                      <th className="pb-2">Order #</th>
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentOrders.map((ord: any) => (
                      <tr key={ord._id} className="hover:bg-stone-50">
                        <td className="py-2.5 font-mono font-bold text-stone-900">
                          <Link href={`/studio/orders/${ord._id}`} className="hover:underline">
                            {ord.orderNumber}
                          </Link>
                        </td>
                        <td className="py-2.5 text-stone-700">
                          {ord.customer?.name}
                        </td>
                        <td className="py-2.5 font-bold text-stone-900 font-serif">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="py-2.5">
                          {ord.paymentStatus === "paid" ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                              Paid
                            </span>
                          ) : ord.paymentStatus === "refunded" ? (
                            <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                              Refunded
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Customer Registrations */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Recent Customer Accounts
              </h3>
              <Link
                href="/studio/customers"
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <span>Manage Customers</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {recentCustomers.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No customers registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] font-mono uppercase text-stone-400 border-b border-stone-100">
                    <tr>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Phone</th>
                      <th className="pb-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentCustomers.map((c: any) => (
                      <tr key={c._id} className="hover:bg-stone-50">
                        <td className="py-2.5 font-semibold text-stone-900">
                          {c.name}
                        </td>
                        <td className="py-2.5 text-stone-600 font-mono text-[11px]">
                          {c.email}
                        </td>
                        <td className="py-2.5 text-stone-500 font-mono text-[11px]">
                          {c.phone || "—"}
                        </td>
                        <td className="py-2.5 text-stone-400 text-[11px] font-mono">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Websites Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Active Customer Websites &amp; Projects
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customer-authored digital gift websites across all occasions.
            </p>
          </div>
          <Link
            href="/studio/websites"
            className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
          >
            <span>Manage All Websites</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <p className="text-xs text-stone-400 py-6 text-center">No projects created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-mono uppercase text-stone-400 border-b border-stone-100">
                <tr>
                  <th className="pb-2.5">Title</th>
                  <th className="pb-2.5">Occasion</th>
                  <th className="pb-2.5">Recipient</th>
                  <th className="pb-2.5">Payment</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Live Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentProjects.map((p: any) => (
                  <tr key={p._id} className="hover:bg-stone-50">
                    <td className="py-3 font-semibold text-stone-900 font-serif">
                      {p.title}
                    </td>
                    <td className="py-3 uppercase text-[10px] font-bold text-rose-800">
                      {p.occasionType}
                    </td>
                    <td className="py-3 text-stone-700">
                      {p.recipientName}
                    </td>
                    <td className="py-3">
                      {p.paymentStatus === "paid" ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Paid
                        </span>
                      ) : p.paymentStatus === "refunded" ? (
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                          Refunded
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded-full font-bold capitalize">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <a
                        href={`/gift/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-500 hover:text-rose-600 inline-flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>/gift/{p.slug}</span>
                        <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
