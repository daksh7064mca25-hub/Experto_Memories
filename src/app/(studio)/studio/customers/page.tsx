"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Globe,
  ShoppingBag,
  ExternalLink,
  Loader2,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  RefreshCw,
  X,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  // Detail Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false);
  const [customerProjects, setCustomerProjects] = useState<any[]>([]);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  // Action Modal State (Suspend / Reactivate)
  const [suspendingCustomer, setSuspendingCustomer] = useState<any | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspendWebsites, setSuspendWebsites] = useState(true);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/admin/customers?${params.toString()}`, {
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const openCustomerDetails = async (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerDetailsLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customer._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCustomerProjects(data.projects || []);
        setCustomerOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load customer details:", err);
    } finally {
      setCustomerDetailsLoading(false);
    }
  };

  const handleConfirmSuspend = async () => {
    if (!suspendingCustomer) return;
    setActionSubmitting(true);
    try {
      const res = await fetch(`/api/admin/customers/${suspendingCustomer._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suspend",
          reason: suspensionReason || "Administrative suspension applied",
          suspendWebsites,
        }),
        credentials: "include",
      });

      if (res.ok) {
        setSuspendingCustomer(null);
        setSuspensionReason("");
        await fetchCustomers();
        if (selectedCustomer && selectedCustomer._id === suspendingCustomer._id) {
          openCustomerDetails(suspendingCustomer);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to suspend customer");
      }
    } catch {
      alert("Network error while suspending customer");
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleReactivate = async (customer: any) => {
    if (!confirm(`Are you sure you want to reactivate customer ${customer.email}? They will regain access to their dashboard and websites.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/customers/${customer._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reactivate",
          reason: "Administrative reactivation",
        }),
        credentials: "include",
      });

      if (res.ok) {
        await fetchCustomers();
        if (selectedCustomer && selectedCustomer._id === customer._id) {
          openCustomerDetails(customer);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reactivate customer");
      }
    } catch {
      alert("Network error while reactivating customer");
    }
  };

  const activeCount = customers.filter((c) => !c.isSuspended).length;
  const suspendedCount = customers.filter((c) => c.isSuspended).length;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            USER MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Registered Customers
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage customer accounts, monitor authored websites, review orders, and enforce account standing.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <span className="text-[11px] font-mono font-bold uppercase text-stone-400 block mb-1">
            Total Customers
          </span>
          <span className="font-serif text-2xl font-bold text-stone-900">
            {customers.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <span className="text-[11px] font-mono font-bold uppercase text-emerald-600 block mb-1">
            Active Accounts
          </span>
          <span className="font-serif text-2xl font-bold text-emerald-700">
            {activeCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <span className="text-[11px] font-mono font-bold uppercase text-rose-600 block mb-1">
            Suspended Accounts
          </span>
          <span className="font-serif text-2xl font-bold text-rose-700">
            {suspendedCount}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50/50"
          />
        </form>

        <div className="flex items-center gap-2">
          {(["all", "active", "suspended"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
            >
              {tab === "all" ? "All Customers" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">
            <Loader2 size={28} className="animate-spin text-rose-600 mx-auto mb-2" />
            <p className="text-xs">Loading customer directory...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No customer accounts matched your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[10px] font-mono uppercase text-stone-400 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4">Authored Websites</th>
                  <th className="py-3 px-4">Orders &amp; Spend</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 text-xs block">{c.name}</span>
                      <span className="text-[11px] text-stone-500 font-mono">{c.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                      {c.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-stone-900">
                          {c.projectStats?.total || 0} sites
                        </span>
                        {c.projectStats?.published > 0 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            {c.projectStats.published} live
                          </span>
                        )}
                        {c.projectStats?.draft > 0 && (
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                            {c.projectStats.draft} draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 font-serif">
                        ₹{(c.orderStats?.totalSpend || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 block font-mono">
                        {c.orderStats?.total || 0} orders ({c.orderStats?.paidCount || 0} paid)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.isSuspended ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                          <Lock size={10} /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          <CheckCircle2 size={10} /> Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openCustomerDetails(c)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition-colors"
                        >
                          Profile
                        </button>

                        {c.isSuspended ? (
                          <button
                            type="button"
                            onClick={() => handleReactivate(c)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 transition-colors"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSuspendingCustomer(c)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold border border-rose-200 transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
                  CUSTOMER PROFILE
                </span>
                <h2 className="font-serif font-bold text-2xl text-stone-900 mt-0.5">
                  {selectedCustomer.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 font-mono">
                  <span>{selectedCustomer.email}</span>
                  {selectedCustomer.phone && <span>• {selectedCustomer.phone}</span>}
                  <span>• Joined {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Suspension Status Alert if suspended */}
            {selectedCustomer.isSuspended && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 flex items-start gap-3">
                <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-950">Account Is Currently Suspended</h4>
                  <p className="mt-0.5">
                    Reason: {selectedCustomer.suspendedReason || "Administrative suspension."}
                  </p>
                  {selectedCustomer.suspendedAt && (
                    <p className="text-[10px] font-mono text-rose-700 mt-1">
                      Applied on: {new Date(selectedCustomer.suspendedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Customer's Websites Section */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <Globe size={16} className="text-rose-500" />
                <span>Created Websites ({customerProjects.length})</span>
              </h3>

              {customerDetailsLoading ? (
                <div className="py-6 text-center text-stone-400 text-xs">
                  <Loader2 size={18} className="animate-spin mx-auto mb-1" />
                  Loading authored websites...
                </div>
              ) : customerProjects.length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center bg-stone-50 rounded-xl">
                  This customer has not created any digital websites yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {customerProjects.map((proj) => (
                    <div
                      key={proj._id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-serif font-bold text-stone-900 block">
                          {proj.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 font-mono">
                          <span className="uppercase text-rose-700 font-bold">
                            {proj.occasionType}
                          </span>
                          <span>•</span>
                          <span>Slug: /{proj.slug}</span>
                          <span>•</span>
                          <span className="capitalize">{proj.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {proj.status === "published" && (
                          <a
                            href={`/gift/${proj.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold transition-colors"
                          >
                            <span>Live View</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                        <a
                          href={`/gift/${proj.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-[11px] font-semibold transition-colors"
                        >
                          Preview
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer's Orders Section */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <ShoppingBag size={16} className="text-rose-500" />
                <span>Order History ({customerOrders.length})</span>
              </h3>

              {customerDetailsLoading ? (
                <div className="py-6 text-center text-stone-400 text-xs">
                  <Loader2 size={18} className="animate-spin mx-auto mb-1" />
                  Loading customer orders...
                </div>
              ) : customerOrders.length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center bg-stone-50 rounded-xl">
                  No orders recorded for this customer.
                </p>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              ord.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.paymentStatus === "refunded"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-mono block mt-0.5">
                          Method: {ord.paymentMethod?.toUpperCase()} • {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-sm text-stone-900">
                          ₹{ord.totalAmount}
                        </span>
                        <Link
                          href={`/studio/orders/${ord._id}`}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold transition-colors"
                        >
                          Order Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              {selectedCustomer.isSuspended ? (
                <button
                  type="button"
                  onClick={() => handleReactivate(selectedCustomer)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Reactivate Customer Account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSuspendingCustomer(selectedCustomer);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Suspend Account
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Dialog */}
      {suspendingCustomer && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Suspend Customer Account
                </h3>
                <p className="text-xs text-stone-500">
                  {suspendingCustomer.name} ({suspendingCustomer.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Suspending this account will block the customer from logging in and accessing their dashboard.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Reason for Suspension (Logged in Audit Trail)
              </label>
              <textarea
                rows={3}
                required
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="e.g. Chargeback request, policy violation, or requested self-suspension."
                className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700 select-none">
              <input
                type="checkbox"
                checked={suspendWebsites}
                onChange={(e) => setSuspendWebsites(e.target.checked)}
                className="rounded border-stone-300 text-rose-600 focus:ring-rose-500 mt-0.5"
              />
              <span>Also suspend all live published websites authored by this customer</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendingCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionSubmitting}
                onClick={handleConfirmSuspend}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionSubmitting ? <Loader2 size={13} className="animate-spin" /> : null}
                <span>Confirm Suspension</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
