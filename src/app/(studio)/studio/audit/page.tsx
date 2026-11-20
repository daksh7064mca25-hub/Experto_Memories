"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ScrollText,
  Filter,
  RefreshCw,
  Search,
  Shield,
  Loader2,
  Calendar,
  User,
  Tag,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function AdminAuditLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetFilter, setTargetFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (targetFilter !== "all") params.set("targetType", targetFilter);

      const res = await fetch(`/api/admin/audit?${params.toString()}`, {
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to fetch audit log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [targetFilter]);

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.actor?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.targetIdentifier?.toLowerCase().includes(q) ||
      log.notes?.toLowerCase().includes(q) ||
      log.targetId?.toLowerCase().includes(q)
    );
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes("SUSPEND") || action.includes("REJECT") || action.includes("DELETE")) {
      return "bg-rose-100 text-rose-800 border-rose-200";
    }
    if (action.includes("VERIFY") || action.includes("REACTIVATE") || action.includes("PUBLISH")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (action.includes("REFUND")) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">
            SECURITY &amp; COMPLIANCE
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Platform Audit Trail
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Immutable, chronological log of all administrator operations, payments, refund records, and security actions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search action, actor, order #, or customer email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "All Events" },
            { id: "order", label: "Orders" },
            { id: "customer", label: "Customers" },
            { id: "website", label: "Websites" },
            { id: "domain", label: "Domains" },
            { id: "pricing", label: "Pricing" },
            { id: "catalogue", label: "Catalogue" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTargetFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                targetFilter === tab.id
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">
            <Loader2 size={28} className="animate-spin text-rose-600 mx-auto mb-2" />
            <p className="text-xs">Loading audit trail records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <ScrollText size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No audit events match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[10px] font-mono uppercase text-stone-400 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Target Ref</th>
                  <th className="py-3 px-4">Admin Operator</th>
                  <th className="py-3 px-4">Notes / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log._id;
                  return (
                    <React.Fragment key={log._id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log._id)}
                        className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getActionBadgeColor(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-mono text-stone-500 font-bold">
                          {log.targetType}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-stone-900">
                          {log.targetIdentifier || log.targetId || "—"}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                          {log.actor}
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate max-w-xs block text-[11px]">
                              {log.notes || (log.details ? JSON.stringify(log.details) : "—")}
                            </span>
                            {isExpanded ? (
                              <ChevronDown size={14} className="text-stone-400 shrink-0" />
                            ) : (
                              <ChevronRight size={14} className="text-stone-400 shrink-0" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-stone-50/60">
                          <td colSpan={6} className="p-4 border-b border-stone-200">
                            <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs">
                              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                                Full Event Payload:
                              </span>
                              <pre className="text-[11px] font-mono bg-stone-900 text-stone-200 p-3 rounded-lg overflow-x-auto">
                                {JSON.stringify(
                                  {
                                    id: log._id,
                                    actor: log.actor,
                                    action: log.action,
                                    targetType: log.targetType,
                                    targetId: log.targetId,
                                    targetIdentifier: log.targetIdentifier,
                                    notes: log.notes,
                                    details: log.details,
                                    timestamp: log.createdAt,
                                  },
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
