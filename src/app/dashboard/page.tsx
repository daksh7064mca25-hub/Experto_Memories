"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  PlusCircle,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Check,
  Globe,
  Lock,
  Sparkles,
  LogOut,
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  ShoppingBag,
  CreditCard,
  QrCode,
  MessageCircle,
  HelpCircle,
  User,
  Search,
  Gift,
  ArrowRight,
  Clock,
  Sparkle,
  Share2,
  Mail,
} from "lucide-react";
import { WebsiteProjectData } from "@/types/website";
import { PublishPricingModal } from "@/components/commerce/PublishPricingModal";

const OCCASION_THEMES: Record<
  string,
  { icon: string; name: string; bg: string; text: string; border: string; glow: string }
> = {
  apology: {
    icon: "💌",
    name: "Apology Gift",
    bg: "bg-[#FFF5F6]",
    text: "text-[#9C2D41]",
    border: "border-[#F8D2DA]",
    glow: "shadow-[#F8D2DA]/40",
  },
  anniversary: {
    icon: "💍",
    name: "Anniversary Story",
    bg: "bg-[#FAF5EB]",
    text: "text-[#8E641D]",
    border: "border-[#F1E2C5]",
    glow: "shadow-[#F1E2C5]/40",
  },
  birthday: {
    icon: "🎂",
    name: "Birthday Celebration",
    bg: "bg-[#FDF4ED]",
    text: "text-[#A85519]",
    border: "border-[#FCDDC6]",
    glow: "shadow-[#FCDDC6]/40",
  },
  love: {
    icon: "💖",
    name: "Romantic Love Gift",
    bg: "bg-[#FFF0F4]",
    text: "text-[#AB2850]",
    border: "border-[#FAD0DC]",
    glow: "shadow-[#FAD0DC]/40",
  },
  wedding: {
    icon: "👑",
    name: "Royal Wedding Invitation",
    bg: "bg-[#FBF6EE]",
    text: "text-[#7A1C2D]",
    border: "border-[#C5A36A]/50",
    glow: "shadow-[#C5A36A]/30",
  },
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any | null>(null);
  const [projects, setProjects] = useState<WebsiteProjectData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [rsvpStats, setRsvpStats] = useState({ total: 0, attending: 0, declined: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"websites" | "orders" | "rsvps" | "account" | "support">("websites");
  const [websiteFilter, setWebsiteFilter] = useState<"all" | "drafts" | "published" | "domains" | "weddings" | "gifts" | "birthdays">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Profile Edit State
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [changeNewPassword, setChangeNewPassword] = useState("");
  const [passwordChangeUpdating, setPasswordChangeUpdating] = useState(false);
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Publish / Pricing Modal State
  const [selectedProjectForPublish, setSelectedProjectForPublish] =
    useState<WebsiteProjectData | null>(null);

  // Custom Domain Setup Modal State
  const [domainModalProject, setDomainModalProject] = useState<WebsiteProjectData | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [domainUpdating, setDomainUpdating] = useState(false);
  const [domainMsg, setDomainMsg] = useState("");

  // Password Protection Modal State
  const [passwordModalProject, setPasswordModalProject] =
    useState<WebsiteProjectData | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordHint, setNewPasswordHint] = useState("");
  const [isPasswordActive, setIsPasswordActive] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // QR Code Modal State
  const [qrModalProject, setQrModalProject] = useState<WebsiteProjectData | null>(null);

  // Copied link indicator
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Load customer profile, projects, and orders
  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // 1. Check Customer Session
      const meRes = await fetch("/api/auth/customer/me", { credentials: "include" });
      const meData = await meRes.json();
      if (!meData.customer) {
        router.push("/customer/login?redirect=/dashboard");
        return;
      }
      setCustomer(meData.customer);
      setProfileName(meData.customer.name || "");
      setProfilePhone(meData.customer.phone || "");

      // 2. Fetch Customer Projects
      const projRes = await fetch("/api/projects", { credentials: "include" });
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }

      // 3. Fetch Customer Orders
      const orderRes = await fetch("/api/orders", { credentials: "include" });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.orders || []);
      }

      // 4. Fetch Wedding RSVPs
      try {
        const rsvpRes = await fetch("/api/customer/rsvps", { credentials: "include" });
        if (rsvpRes.ok) {
          const rData = await rsvpRes.json();
          setRsvps(rData.rsvps || []);
          if (rData.stats) setRsvpStats(rData.stats);
        }
      } catch {}
    } catch {
      setErrorMsg("Failed to load your creative workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/customer/login");
    router.refresh();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdating(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/auth/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName.trim(), phone: profilePhone.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      setCustomer((prev: any) => ({ ...prev, name: data.customer.name, phone: data.customer.phone }));
      setProfileMsg({ text: "Profile details updated successfully!", type: "success" });
    } catch (err: any) {
      setProfileMsg({ text: err.message || "Failed to update profile", type: "error" });
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordChangeMsg({ text: "Please enter your current password", type: "error" });
      return;
    }
    if (changeNewPassword.length < 6) {
      setPasswordChangeMsg({ text: "New password must be at least 6 characters", type: "error" });
      return;
    }
    setPasswordChangeUpdating(true);
    setPasswordChangeMsg(null);
    try {
      const res = await fetch("/api/auth/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword: changeNewPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }
      setCurrentPassword("");
      setChangeNewPassword("");
      setPasswordChangeMsg({ text: "Password changed successfully!", type: "success" });
    } catch (err: any) {
      setPasswordChangeMsg({ text: err.message || "Failed to change password", type: "error" });
    } finally {
      setPasswordChangeUpdating(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete website project.");
      }
    } catch {
      alert("Error deleting website project.");
    }
  };

  const copyUrl = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/gift/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const shareOnWhatsApp = (proj: WebsiteProjectData) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/gift/${proj.slug}`;
    const recipient = proj.recipientName || "My Love";
    const text = `Hey ${recipient}! ❤️ I crafted something special just for you. Open this on your phone: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleDirectPublish = async (proj: WebsiteProjectData) => {
    try {
      const res = await fetch(`/api/projects/${proj._id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
        credentials: "include",
      });

      if (res.status === 402) {
        setSelectedProjectForPublish(proj);
        return;
      }

      if (res.ok) {
        loadData();
      }
    } catch {
      alert("Failed to publish website.");
    }
  };

  const handleSaveCustomDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainModalProject) return;

    setDomainUpdating(true);
    setDomainMsg("");

    try {
      const res = await fetch(`/api/projects/${domainModalProject._id}/custom-domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainName: domainInput.trim().toLowerCase(),
          action: "request_verification",
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update custom domain");
      }

      setDomainMsg("Custom domain submitted! Point your CNAME record to cname.expertomemories.com.");
      loadData();
    } catch (err: any) {
      setDomainMsg(err.message || "Domain update failed");
    } finally {
      setDomainUpdating(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalProject) return;

    setPasswordUpdating(true);

    try {
      const payload: any = {
        isPasswordProtected: isPasswordActive,
      };

      if (isPasswordActive && newPassword.trim()) {
        payload.password = newPassword.trim();
        payload.passwordHint = newPasswordHint.trim();
      }

      const res = await fetch(`/api/projects/${passwordModalProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        setPasswordModalProject(null);
        loadData();
      } else {
        alert("Failed to update password protection");
      }
    } catch {
      alert("Error updating password protection");
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Metrics (Strictly scoped to customer records)
  const draftsCount = projects.filter((p) => p.status === "draft").length;
  const publishedCount = projects.filter((p) => p.status === "published").length;
  const readyToPublishCount = projects.filter((p) => p.paymentStatus === "paid" && p.status !== "published").length;
  const domainsCount = projects.filter((p) => Boolean(p.customDomain?.requested)).length;

  // Search & Filtered projects
  const filteredProjects = projects.filter((p) => {
    // 1. Status & Category Filter
    if (websiteFilter === "drafts" && p.status !== "draft") return false;
    if (websiteFilter === "published" && p.status !== "published") return false;
    if (websiteFilter === "domains" && !p.customDomain?.requested) return false;
    if (websiteFilter === "weddings" && p.occasionType !== "wedding") return false;
    if (websiteFilter === "birthdays" && p.occasionType !== "birthday") return false;
    if (websiteFilter === "gifts" && (p.occasionType === "wedding" || p.occasionType === "birthday")) return false;

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchRecipient = (p.recipientName || "").toLowerCase().includes(q);
      const matchSender = (p.senderName || "").toLowerCase().includes(q);
      const matchOccasion = (p.occasionType || "").toLowerCase().includes(q);
      const matchSlug = (p.slug || "").toLowerCase().includes(q);
      return matchTitle || matchRecipient || matchSender || matchOccasion || matchSlug;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211715] font-sans flex flex-col selection:bg-[#EADBCE] selection:text-[#211715]">
      {/* 1. LUXURY CUSTOMER TOPBAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#EFE7DE] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white flex items-center justify-center shadow-md shadow-[#9C2D41]/20 group-hover:scale-105 transition-transform duration-300">
              <Heart size={18} className="fill-current" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-[#211715] tracking-tight block leading-tight">
                ExpertoMemories
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#C5A36A] font-bold uppercase">
                CREATIVE STUDIO
              </span>
            </div>
          </Link>

          {/* Luxury Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#F4EFEB] p-1.5 rounded-2xl text-xs font-serif font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("websites")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                activeTab === "websites"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              My Websites ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rsvps")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === "rsvps"
                  ? "bg-white text-[#7A1C2D] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#7A1C2D]"
              }`}
            >
              <span>RSVP Manager</span>
              {rsvps.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#7A1C2D] font-bold">
                  {rsvps.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                activeTab === "orders"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              Orders &amp; Payments ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("account")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                activeTab === "account"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              Account Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("support")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                activeTab === "support"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              Help &amp; Support
            </button>
          </nav>

          {/* Customer Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 pr-2 border-r border-[#EFE7DE]">
              <div className="w-9 h-9 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[#8E641D] font-serif font-bold text-xs flex items-center justify-center">
                {customer?.name ? customer.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-serif font-bold text-[#211715] leading-tight">
                  {customer?.name || "Customer"}
                </span>
                <span className="text-[10px] text-[#8C7E75] font-mono leading-tight">
                  {customer?.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif text-[#6B5E57] hover:text-[#211715] hover:bg-[#F4EFEB] transition-colors"
              title="Sign Out Securely"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden bg-white border-b border-[#EFE7DE] px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs font-serif">
        <button
          type="button"
          onClick={() => setActiveTab("websites")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === "websites" ? "bg-[#211715] text-white font-bold" : "text-[#6B5E57]"
          }`}
        >
          My Websites ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === "orders" ? "bg-[#211715] text-white font-bold" : "text-[#6B5E57]"
          }`}
        >
          Orders &amp; Payments ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === "account" ? "bg-[#211715] text-white font-bold" : "text-[#6B5E57]"
          }`}
        >
          Account Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("support")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === "support" ? "bg-[#211715] text-white font-bold" : "text-[#6B5E57]"
          }`}
        >
          Help &amp; Support
        </button>
      </div>

      {/* 2. MAIN CREATIVE WORKSPACE */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12 w-full flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-[#8C7E75]">
            <Loader2 size={36} className="animate-spin text-[#D94B70] mb-4" />
            <p className="font-serif text-sm">Preparing your personal creative studio...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-[#FFF5F6] border border-[#F8D2DA] text-[#9C2D41] p-8 rounded-3xl text-center max-w-md mx-auto shadow-sm">
            <AlertCircle size={28} className="mx-auto text-[#D94B70] mb-3" />
            <p className="font-serif font-bold text-base mb-1">{errorMsg}</p>
            <button
              type="button"
              onClick={loadData}
              className="mt-4 px-5 py-2 rounded-full text-xs font-serif font-bold bg-[#D94B70] text-white shadow-sm hover:bg-[#B02A50] transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <>
            {/* TAB 1: WEBSITES WORKSPACE */}
            {activeTab === "websites" && (
              <div className="space-y-8">
                {/* 1.1 EDITORIAL WELCOME BANNER */}
                <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EB]/60 to-[#F5EEE4] border border-[#EADBCE] p-7 sm:p-10 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C5A36A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 max-w-2xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[11px] font-serif font-semibold text-[#8E641D]">
                        <Sparkle size={12} className="text-[#C5A36A]" />
                        <span>Your Little World of Memories</span>
                      </div>
                      <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#211715] tracking-tight leading-tight">
                        Welcome back, {customer?.name ? customer.name.split(" ")[0] : "Friend"}.
                      </h1>
                      <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
                        Design heartfelt interactive digital gifts freely. Preview them live on phone, tablet, and desktop — pay only when you&rsquo;re ready to publish and gift.
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                      <Link
                        href="/dashboard/create"
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-serif font-bold text-xs bg-gradient-to-r from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white shadow-lg shadow-[#D94B70]/25 hover:shadow-xl hover:shadow-[#D94B70]/35 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <PlusCircle size={16} />
                        <span>Create A New Gift</span>
                      </Link>
                      <span className="text-[11px] text-[#8C7E75] font-serif hidden sm:inline">
                        100% Free to customize &amp; preview
                      </span>
                    </div>
                  </div>

                  {/* 1.2 LUXURY METRIC COUNTERS (Customer Specific) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-7 border-t border-[#EADBCE]/80">
                    <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                        Total Websites
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#211715]">
                        {projects.length}
                      </span>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                        Drafts In Progress
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#A85519]">
                        {draftsCount}
                      </span>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                        Ready To Publish
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#8E641D]">
                        {readyToPublishCount}
                      </span>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                        Live Published
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#10B981]">
                        {publishedCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1.3 SEARCH & FILTER TOOLBAR */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
                  {/* Status Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-serif">
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter("all")}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        websiteFilter === "all"
                          ? "bg-[#211715] text-white border-[#211715] font-bold shadow-xs"
                          : "bg-white text-[#6B5E57] border-[#EFE7DE] hover:border-[#D5C7B8]"
                      }`}
                    >
                      All Websites ({projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter("drafts")}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        websiteFilter === "drafts"
                          ? "bg-[#211715] text-white border-[#211715] font-bold shadow-xs"
                          : "bg-white text-[#6B5E57] border-[#EFE7DE] hover:border-[#D5C7B8]"
                      }`}
                    >
                      Drafts ({draftsCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter("published")}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        websiteFilter === "published"
                          ? "bg-[#211715] text-white border-[#211715] font-bold shadow-xs"
                          : "bg-white text-[#6B5E57] border-[#EFE7DE] hover:border-[#D5C7B8]"
                      }`}
                    >
                      Live Published ({publishedCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter("domains")}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        websiteFilter === "domains"
                          ? "bg-[#211715] text-white border-[#211715] font-bold shadow-xs"
                          : "bg-white text-[#6B5E57] border-[#EFE7DE] hover:border-[#D5C7B8]"
                      }`}
                    >
                      Custom Domains ({domainsCount})
                    </button>
                  </div>

                  {/* Real-time Search Input */}
                  <div className="relative w-full lg:w-72">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7E75]"
                    />
                    <input
                      type="text"
                      placeholder="Search by title, recipient, occasion..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#EFE7DE] text-xs placeholder:text-[#A3958C] focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8C7E75] hover:text-[#211715]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* 1.4 PROJECT CARDS GRID OR LUXURY EMPTY STATE */}
                {projects.length === 0 ? (
                  /* TRUE EMPTY STATE FOR NEW CUSTOMER */
                  <div className="bg-white rounded-3xl border border-[#EADBCE] p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[#C5A36A] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Sparkles size={36} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[10px] font-mono uppercase tracking-wider text-[#8E641D] font-bold mb-3">
                      Start Your Story
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-[#211715] mb-2">
                      Your First Memory Starts Here
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B5E57] mb-8 leading-relaxed max-w-md mx-auto">
                      Create an unforgettable interactive digital gift website for someone you love. Personalize letters, photographs, music, quizzes, and private secrets. Preview completely free on any screen.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link
                        href="/dashboard/create"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-serif font-bold text-xs bg-gradient-to-r from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white shadow-md shadow-[#D94B70]/25 hover:shadow-lg transition-all hover:scale-105"
                      >
                        <PlusCircle size={15} />
                        <span>Create Your First Gift Website</span>
                      </Link>
                      <Link
                        href="/catalog"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-serif font-bold text-xs bg-[#FAF5EB] hover:bg-[#F4EFEB] text-[#8E641D] border border-[#EADBCE] transition-colors"
                      >
                        <span>Explore Gift Experiences</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  /* FILTER NO MATCH EMPTY STATE */
                  <div className="bg-white rounded-3xl border border-[#EFE7DE] p-12 text-center max-w-md mx-auto">
                    <Search size={28} className="mx-auto text-[#8C7E75] mb-3" />
                    <h3 className="font-serif font-bold text-base text-[#211715] mb-1">
                      No Matching Websites
                    </h3>
                    <p className="text-xs text-[#8C7E75] mb-4">
                      No gift websites match your selected filter or search keyword &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setWebsiteFilter("all");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 rounded-full font-serif font-bold text-xs bg-[#211715] text-white hover:bg-black transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  /* LUXURY PROJECT CARDS GRID */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((proj) => {
                      const isPublished = proj.status === "published";
                      const isPaid = proj.paymentStatus === "paid";
                      const isSuspended = proj.status === "suspended";
                      const occasionTheme =
                        OCCASION_THEMES[proj.occasionType || "apology"] || OCCASION_THEMES.apology;
                      const lastEdited = proj.updatedAt || proj.createdAt;
                      const formattedDate = lastEdited
                        ? new Date(lastEdited).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently";

                      return (
                        <div
                          key={proj._id}
                          className="bg-white rounded-3xl border border-[#EFE7DE] hover:border-[#D5C7B8] p-4 sm:p-6 shadow-xs hover:shadow-xl hover:shadow-[#211715]/5 transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            {/* Card Top: Occasion Pill & Status Indicator */}
                            <div className="flex items-center justify-between gap-2 mb-4">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[11px] font-serif font-bold tracking-wide px-3 py-1 rounded-full border shadow-xs ${occasionTheme.bg} ${occasionTheme.text} ${occasionTheme.border}`}
                              >
                                <span>{occasionTheme.icon}</span>
                                <span>{occasionTheme.name}</span>
                              </span>

                              {isSuspended ? (
                                <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full">
                                  Suspended
                                </span>
                              ) : isPublished ? (
                                <span className="text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Live Published
                                </span>
                              ) : isPaid ? (
                                <span className="text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full">
                                  Paid (Ready to Share)
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono font-bold bg-[#FAF5EB] text-[#8E641D] border border-[#F1E2C5] px-2.5 py-0.5 rounded-full">
                                  Draft (Free Preview)
                                </span>
                              )}
                            </div>

                            {/* Title & Metadata */}
                            <h3 className="font-serif font-bold text-xl text-[#211715] mb-1.5 group-hover:text-[#9C2D41] transition-colors leading-snug break-words">
                              {proj.title}
                            </h3>

                            <p className="text-xs text-[#6B5E57] mb-3 leading-relaxed break-words">
                              For: <strong className="text-[#211715]">{proj.recipientName || "Someone Special"}</strong> &bull; From: {proj.senderName || "You"}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-[#8C7E75] font-mono mb-4 pt-1 border-t border-[#F4EFEB]">
                              <span className="flex items-center gap-1">
                                <Clock size={11} /> {formattedDate}
                              </span>
                              <span className="bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EFE7DE] truncate max-w-[140px]">
                                /gift/{proj.slug}
                              </span>
                            </div>

                            {/* Tags: Password Protected & Custom Domain */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono mb-4 min-h-[22px]">
                              {proj.isPasswordProtected && (
                                <span className="bg-[#FAF5EB] text-[#8E641D] px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#F1E2C5]">
                                  <Lock size={9} /> Password Gate
                                </span>
                              )}
                              {proj.customDomain?.domainName && (
                                <span className="bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#BFDBFE]">
                                  <Globe size={9} /> {proj.customDomain.domainName}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Footers */}
                          <div className="pt-4 border-t border-[#F4EFEB] space-y-2">
                            {/* Primary Edit / Preview Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Link
                                href={`/editor/${proj._id}`}
                                className="py-2.5 px-3 rounded-xl bg-[#211715] hover:bg-black text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs min-h-[44px]"
                              >
                                <Edit3 size={13} />
                                <span>Continue Editing</span>
                              </Link>

                              <a
                                href={`/gift/${proj.slug}?preview=true`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2.5 px-3 rounded-xl bg-[#FAF5EB] hover:bg-[#F4EFEB] text-[#8E641D] border border-[#EADBCE] font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                              >
                                <Eye size={13} />
                                <span>Free Preview</span>
                              </a>
                            </div>

                            {/* Wedding RSVP Shortcut if wedding */}
                            {proj.occasionType === "wedding" && (
                              <button
                                type="button"
                                onClick={() => setActiveTab("rsvps")}
                                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Mail size={13} className="text-amber-700" />
                                <span>
                                  Manage Guest RSVPs ({rsvps.filter((r: any) => r.projectSlug === proj.slug).length})
                                </span>
                              </button>
                            )}

                            {/* Publishing / Sharing Row */}
                            {isPublished ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => copyUrl(proj.slug)}
                                    className="flex-1 py-2 px-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46] text-xs font-serif font-bold flex items-center justify-center gap-1.5 hover:bg-[#D1FAE5] transition-colors"
                                  >
                                    {copiedSlug === proj.slug ? <Check size={13} /> : <Copy size={13} />}
                                    <span>{copiedSlug === proj.slug ? "Link Copied!" : "Copy Share Link"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => shareOnWhatsApp(proj)}
                                    className="p-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white transition-colors"
                                    title="Share Directly on WhatsApp"
                                  >
                                    <MessageCircle size={15} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setQrModalProject(proj)}
                                    className="p-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F4EFEB] text-[#8E641D] border border-[#EADBCE] transition-colors"
                                    title="View Printable Gift Box QR Code"
                                  >
                                    <QrCode size={15} />
                                  </button>

                                  <a
                                    href={`/gift/${proj.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-[#F4EFEB] hover:bg-[#EADBCE] text-[#211715] transition-colors"
                                    title="Open Live Website"
                                  >
                                    <ExternalLink size={15} />
                                  </a>
                                </div>
                              </div>
                            ) : isPaid ? (
                              <button
                                type="button"
                                onClick={() => handleDirectPublish(proj)}
                                className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                              >
                                <CheckCircle2 size={14} />
                                <span>Publish Website Live (Paid)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedProjectForPublish(proj)}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9C2D41] to-[#D94B70] hover:from-[#802234] hover:to-[#C03E60] text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#D94B70]/20 transition-all hover:scale-[1.01]"
                              >
                                <Sparkles size={14} />
                                <span>Publish &amp; Pay to Share</span>
                              </button>
                            )}

                            {/* Secondary Options: Custom Domain, Password, Delete */}
                            <div className="flex items-center justify-between pt-2 text-[11px] text-[#8C7E75]">
                              <button
                                type="button"
                                onClick={() => {
                                  setDomainModalProject(proj);
                                  setDomainInput(proj.customDomain?.domainName || "");
                                  setDomainMsg("");
                                }}
                                className="hover:text-[#1E40AF] flex items-center gap-1 transition-colors"
                              >
                                <Globe size={11} />
                                <span>Custom Domain</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setPasswordModalProject(proj);
                                  setIsPasswordActive(proj.isPasswordProtected || false);
                                  setNewPassword("");
                                  setNewPasswordHint(proj.passwordHint || "");
                                }}
                                className="hover:text-[#9C2D41] flex items-center gap-1 transition-colors"
                              >
                                <Lock size={11} />
                                <span>Password Gate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj._id || "", proj.title)}
                                className="hover:text-red-600 transition-colors"
                                title="Delete Website Draft"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ORDERS & RECEIPTS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] tracking-tight">
                    Orders &amp; Payment Receipts
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B5E57] mt-1">
                    Review and verify all purchase receipts, invoices, and payment statuses for your published websites.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#EADBCE] p-12 sm:p-16 text-center max-w-md mx-auto shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-[#FAF5EB] text-[#C5A36A] flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#211715] mb-1">
                      No Orders Placed Yet
                    </h3>
                    <p className="text-xs text-[#8C7E75] mb-6 leading-relaxed">
                      When you publish a gift website, your official invoice, payment details, and receipt will appear here.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("websites")}
                      className="px-6 py-2.5 rounded-full font-serif font-bold text-xs bg-[#211715] text-white hover:bg-black transition-colors"
                    >
                      View My Websites
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#EFE7DE] overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#FAF7F2] border-b border-[#EFE7DE] text-[10px] font-mono uppercase tracking-wider text-[#8C7E75]">
                          <tr>
                            <th className="py-4 px-6">Order Ref</th>
                            <th className="py-4 px-6">Website Gift Item</th>
                            <th className="py-4 px-6">Amount</th>
                            <th className="py-4 px-6">Payment Method</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F4EFEB]">
                          {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                              <td className="py-4 px-6 font-mono font-bold text-[#211715]">
                                {order.orderNumber}
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-serif font-semibold text-[#211715] block">
                                  {order.items?.[0]?.title || "Gift Website"}
                                </span>
                                {order.packageDetails?.isCustomDomain && (
                                  <span className="text-[10px] text-[#1E40AF] block">
                                    + Custom Domain: {order.packageDetails.customDomainName}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 font-serif font-bold text-[#211715]">
                                ₹{order.totalAmount}
                              </td>
                              <td className="py-4 px-6 font-mono text-[11px] text-[#6B5E57] uppercase">
                                {order.paymentMethod === "razorpay" ? "Razorpay (Online)" : "Manual UPI"}
                              </td>
                              <td className="py-4 px-6">
                                {order.paymentStatus === "paid" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                                    <CheckCircle2 size={10} /> Paid &amp; Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#FAF5EB] text-[#8E641D] border border-[#F1E2C5] px-2.5 py-0.5 rounded-full">
                                    Pending Approval
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-[#8C7E75] font-mono text-[11px]">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: WEDDING RSVPs MANAGER */}
            {activeTab === "rsvps" && (
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#7A1C2D] border border-[#D4AF37]/40 mb-2">
                    <Sparkles size={13} className="text-[#C5A36A]" />
                    <span>Royal Wedding Concierge</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] tracking-tight">
                    Guest Attendance &amp; RSVP Manager
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B5E57] mt-1">
                    Track your wedding guests&rsquo; responses, headcount, attending functions, dietary notes, and blessings live.
                  </p>
                </div>

                {/* RSVP Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                      Total Responses
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#211715]">
                      {rsvpStats.total}
                    </span>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                      Confirmed Guests
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#D97706]">
                      {rsvpStats.totalGuests}
                    </span>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                      Joyfully Attending
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#065F46]">
                      {rsvpStats.attending}
                    </span>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-1">
                      Regretfully Declined
                    </span>
                    <span className="font-serif text-3xl font-bold text-stone-500">
                      {rsvpStats.declined}
                    </span>
                  </div>
                </div>

                {/* RSVP List Table / Cards */}
                {rsvps.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#EFE7DE] p-12 text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-full bg-[#FAF5EB] text-[#8E641D] flex items-center justify-center mx-auto mb-4 border border-[#F1E2C5]">
                      <Mail size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#211715] mb-2">
                      No Guest Responses Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed mb-6">
                      Share your wedding invitation website or QR code on WhatsApp with your family and friends. When guests submit their attendance, their details will appear here automatically.
                    </p>
                    <Link
                      href="/dashboard/create?occasion=wedding"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-serif font-bold bg-[#7A1C2D] text-white hover:bg-[#5E1421] transition shadow-md"
                    >
                      <span>Create Wedding Website</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#EFE7DE] overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF7F2] border-b border-[#EFE7DE] text-[#6B5E57] font-serif uppercase tracking-wider text-[10px]">
                            <th className="py-4 px-6 font-bold">Guest Name</th>
                            <th className="py-4 px-6 font-bold">Status</th>
                            <th className="py-4 px-6 font-bold">Party Size</th>
                            <th className="py-4 px-6 font-bold">Functions Attending</th>
                            <th className="py-4 px-6 font-bold">Dietary Notes</th>
                            <th className="py-4 px-6 font-bold">Blessings / Wishes</th>
                            <th className="py-4 px-6 font-bold">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F4EFEB]">
                          {rsvps.map((rsvp: any) => (
                            <tr key={rsvp._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                              <td className="py-4 px-6">
                                <span className="font-serif font-bold text-sm text-[#211715] block">
                                  {rsvp.guestName}
                                </span>
                                {(rsvp.guestEmail || rsvp.guestPhone) && (
                                  <span className="text-[11px] text-[#8C7E75] font-mono block mt-0.5">
                                    {[rsvp.guestPhone, rsvp.guestEmail].filter(Boolean).join(" • ")}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                {rsvp.attendanceStatus === "attending" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                                    <CheckCircle2 size={10} /> Attending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-stone-100 text-stone-600 border border-stone-300 px-2.5 py-0.5 rounded-full">
                                    Declined
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 font-serif font-bold text-sm text-[#211715]">
                                {rsvp.attendanceStatus === "attending" ? `${rsvp.guestCount} guests` : "—"}
                              </td>
                              <td className="py-4 px-6">
                                {rsvp.attendingEvents && rsvp.attendingEvents.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {rsvp.attendingEvents.map((evt: string, i: number) => (
                                      <span
                                        key={i}
                                        className="text-[10px] font-serif bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md"
                                      >
                                        {evt}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-stone-400">—</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-[#6B5E57] max-w-xs text-xs italic">
                                {rsvp.dietaryNotes || "None"}
                              </td>
                              <td className="py-4 px-6 text-[#211715] font-serif italic max-w-sm text-xs">
                                {rsvp.personalBlessing ? `“${rsvp.personalBlessing}”` : "—"}
                              </td>
                              <td className="py-4 px-6 text-[#8C7E75] font-mono text-[11px] whitespace-nowrap">
                                {new Date(rsvp.submittedAt || rsvp.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACCOUNT & SECURITY */}
            {activeTab === "account" && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] tracking-tight">
                    Account &amp; Security Settings
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B5E57] mt-1">
                    Manage your profile details, update login credentials, and review hosting guarantee policies.
                  </p>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-3xl border border-[#EFE7DE] p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F4EFEB]">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE] text-[#8E641D] flex items-center justify-center font-serif font-bold text-base">
                      {customer?.name ? customer.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#211715]">
                        Personal Profile
                      </h3>
                      <p className="text-xs text-[#8C7E75]">
                        Update your display name and WhatsApp notification number.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                          Phone Number (WhatsApp Delivery)
                        </label>
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={customer?.email || ""}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] bg-[#FAF7F2] text-xs text-[#8C7E75] font-mono cursor-not-allowed"
                      />
                      <span className="text-[10px] text-[#8C7E75] mt-1 block">
                        Your email address is your unique customer ID. Contact concierge to update your account email.
                      </span>
                    </div>

                    {profileMsg && (
                      <div
                        className={`p-3.5 rounded-xl text-xs font-medium ${
                          profileMsg.type === "success"
                            ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                            : "bg-[#FFF5F6] text-[#9C2D41] border border-[#F8D2DA]"
                        }`}
                      >
                        {profileMsg.text}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={profileUpdating}
                        className="px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-md transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {profileUpdating ? <Loader2 size={13} className="animate-spin" /> : null}
                        <span>Save Profile Details</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Form */}
                <div className="bg-white rounded-3xl border border-[#EFE7DE] p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F4EFEB]">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] text-[#211715] flex items-center justify-center">
                      <Lock size={16} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#211715]">
                        Security &amp; Password
                      </h3>
                      <p className="text-xs text-[#8C7E75]">
                        Change your account password for enhanced privacy.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                          New Password (Min. 6 chars)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={changeNewPassword}
                          onChange={(e) => setChangeNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                        />
                      </div>
                    </div>

                    {passwordChangeMsg && (
                      <div
                        className={`p-3.5 rounded-xl text-xs font-medium ${
                          passwordChangeMsg.type === "success"
                            ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                            : "bg-[#FFF5F6] text-[#9C2D41] border border-[#F8D2DA]"
                        }`}
                      >
                        {passwordChangeMsg.text}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={passwordChangeUpdating}
                        className="px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#211715] hover:bg-black text-white shadow-md transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {passwordChangeUpdating ? <Loader2 size={13} className="animate-spin" /> : null}
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Cloud Hosting Guarantee */}
                <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 sm:p-8 shadow-xs">
                  <h3 className="font-serif font-bold text-base text-[#211715] mb-3 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#10B981]" />
                    <span>Cloud Hosting &amp; Preservation Guarantee</span>
                  </h3>
                  <div className="bg-[#FAF7F2] rounded-2xl p-5 text-xs text-[#6B5E57] space-y-3 leading-relaxed border border-[#EFE7DE]">
                    <p>
                      &bull; <strong>12 Months Cloud Hosting Included:</strong> Every published digital gift includes 12 full months of high-speed Cloudflare edge hosting, SSL encryption, and global CDN delivery.
                    </p>
                    <p>
                      &bull; <strong>Renewal Notice:</strong> 30 days prior to your 1-year mark, you will receive an email reminder with a simple one-click option to renew hosting for another year.
                    </p>
                    <p>
                      &bull; <strong>Customer Privacy Guarantee:</strong> You retain complete ownership of all uploaded letters, photos, and secrets. Passwords protect your memories from unintended viewers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CONCIERGE & SUPPORT */}
            {activeTab === "support" && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] tracking-tight">
                    Concierge &amp; Customer Support
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B5E57] mt-1">
                    Everything you need to craft, preview, share, and preserve your digital gifts.
                  </p>
                </div>

                {/* Direct Concierge Contact Card */}
                <div className="rounded-3xl bg-gradient-to-br from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white p-7 sm:p-10 shadow-xl shadow-[#D94B70]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full font-bold">
                      GIFTING SPECIALIST CONCIERGE
                    </span>
                    <h2 className="font-serif font-bold text-xl sm:text-2xl mt-2 mb-1">
                      Need Help Creating Your Gift?
                    </h2>
                    <p className="text-xs text-rose-100 max-w-md leading-relaxed">
                      Need custom song assistance, high-res photo recommendations, or custom domain guidance? Our gifting concierge is available 7 days a week.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto relative z-10 shrink-0">
                    <a
                      href="https://api.whatsapp.com/send?phone=919876543210&text=Hello%20ExpertoMemories!%20I%20need%20help%20with%20my%20gift%20website."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 rounded-full font-serif font-bold text-xs bg-white text-[#9C2D41] hover:bg-[#FAF7F2] shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp Concierge</span>
                    </a>
                    <a
                      href="mailto:support@expertomemories.in"
                      className="w-full sm:w-auto px-5 py-3 rounded-full font-serif font-semibold text-xs bg-[#802234]/60 hover:bg-[#802234] text-white border border-white/20 flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Email Support</span>
                    </a>
                  </div>
                </div>

                {/* Customer FAQs */}
                <div className="bg-white rounded-3xl border border-[#EFE7DE] p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#211715] mb-4">
                    Frequently Asked Questions
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE]">
                      <h4 className="font-serif font-bold text-[#211715] text-sm mb-1">
                        1. How do I share my finished website with the recipient?
                      </h4>
                      <p className="text-[#6B5E57] leading-relaxed">
                        Once you publish your website, your dashboard will display a <strong>Copy Share Link</strong> button, a <strong>WhatsApp</strong> sharing button, and a <strong>Gift Box QR Code</strong>. You can print the QR code and slide it inside a physical card or bouquet, or simply text the private link!
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE]">
                      <h4 className="font-serif font-bold text-[#211715] text-sm mb-1">
                        2. Can I edit photos, letters, or songs after paying and publishing?
                      </h4>
                      <p className="text-[#6B5E57] leading-relaxed">
                        Yes! You have lifetime access to edit your project from your dashboard anytime. Any updates you save in the editor appear live immediately on your published link without paying again.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE]">
                      <h4 className="font-serif font-bold text-[#211715] text-sm mb-1">
                        3. How does the private password gate work?
                      </h4>
                      <p className="text-[#6B5E57] leading-relaxed">
                        In your website settings, enable <strong>Password Gate</strong> and choose a secret passphrase and optional hint (e.g. &ldquo;Our first trip together&rdquo;). Visitors must enter this secret word to view your love letters and photos.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE]">
                      <h4 className="font-serif font-bold text-[#211715] text-sm mb-1">
                        4. How do custom domains work (e.g. maya-and-daniel.love)?
                      </h4>
                      <p className="text-[#6B5E57] leading-relaxed">
                        You can purchase your own romantic domain name from GoDaddy or Namecheap and connect it to your website. Point your registrar&rsquo;s <strong>CNAME</strong> record to <code>cname.expertomemories.com</code>, and our system automatically provisions an SSL certificate.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE]">
                      <h4 className="font-serif font-bold text-[#211715] text-sm mb-1">
                        5. What happens at the end of the 12-month cloud hosting period?
                      </h4>
                      <p className="text-[#6B5E57] leading-relaxed">
                        Every gift website includes 12 full months of hosting. 30 days before expiration, you will receive a reminder with the option to renew for another year for a nominal hosting fee.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 3. PUBLISH & PRICING MODAL */}
      {selectedProjectForPublish && (
        <PublishPricingModal
          isOpen={Boolean(selectedProjectForPublish)}
          project={selectedProjectForPublish}
          onClose={() => setSelectedProjectForPublish(null)}
          onPaymentSuccess={() => {
            setSelectedProjectForPublish(null);
            loadData();
          }}
        />
      )}

      {/* 4. CUSTOM DOMAIN MODAL */}
      {domainModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE7DE]">
            <h3 className="font-serif font-bold text-lg text-[#211715] mb-1">
              Custom Domain Connection
            </h3>
            <p className="text-xs text-[#8C7E75] mb-6">
              Connect your own purchased domain (e.g. from GoDaddy or Namecheap) to this gift website.
            </p>

            <form onSubmit={handleSaveCustomDomain} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                  Your Domain Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rohan-ananya.love"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                />
              </div>

              {/* DNS Instructions */}
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 text-[11px] text-[#1E40AF] space-y-1.5">
                <p className="font-bold">Required DNS Setup in Your Registrar:</p>
                <p>1. Record Type: <strong>CNAME</strong></p>
                <p>2. Host / Name: <strong>@</strong> (or <strong>www</strong>)</p>
                <p>3. Destination / Target: <strong>cname.expertomemories.com</strong></p>
              </div>

              {domainMsg && (
                <p className="text-xs text-[#211715] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE7DE]">
                  {domainMsg}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDomainModalProject(null)}
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-medium bg-[#F4EFEB] hover:bg-[#EADBCE] text-[#211715]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={domainUpdating}
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-bold bg-[#1E40AF] hover:bg-[#1E3A8A] text-white shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {domainUpdating ? <Loader2 size={13} className="animate-spin" /> : null}
                  <span>Submit For Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PASSWORD PROTECTION MODAL */}
      {passwordModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE7DE]">
            <h3 className="font-serif font-bold text-lg text-[#211715] mb-1">
              Website Password Protection
            </h3>
            <p className="text-xs text-[#8C7E75] mb-6">
              Require visitors to enter a secret password before seeing your photos and love letters.
            </p>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE]">
                <span className="text-xs font-serif font-bold text-[#211715]">
                  Enable Password Protection
                </span>
                <input
                  type="checkbox"
                  checked={isPasswordActive}
                  onChange={(e) => setIsPasswordActive(e.target.checked)}
                  className="w-4 h-4 text-[#D94B70] rounded focus:ring-[#D94B70]"
                />
              </div>

              {isPasswordActive && (
                <>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                      Secret Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new secret password..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#211715] mb-1">
                      Password Hint (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Our anniversary year or favorite restaurant"
                      value={newPasswordHint}
                      onChange={(e) => setNewPasswordHint(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalProject(null)}
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-medium bg-[#F4EFEB] hover:bg-[#EADBCE] text-[#211715]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {passwordUpdating ? <Loader2 size={13} className="animate-spin" /> : null}
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. GIFT QR CODE MODAL */}
      {qrModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-[#EFE7DE]">
            <h3 className="font-serif font-bold text-lg text-[#211715] mb-1">
              Gift Box QR Code 🎁
            </h3>
            <p className="text-xs text-[#8C7E75] mb-6">
              Print this QR code or slide it into a gift card. When {qrModalProject.recipientName || "your recipient"} scans it, their special website opens instantly!
            </p>

            <div className="bg-[#FAF7F2] border border-[#EFE7DE] p-4 rounded-2xl flex items-center justify-center mx-auto mb-6 w-48 h-48">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `${typeof window !== "undefined" ? window.location.origin : ""}/gift/${qrModalProject.slug}`
                )}`}
                alt="Website QR Code"
                className="w-40 h-40 rounded-lg shadow-xs"
              />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => copyUrl(qrModalProject.slug)}
                className="w-full py-2.5 rounded-full text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-md transition-all"
              >
                {copiedSlug === qrModalProject.slug ? "Copied Link ✓" : "Copy Live Link"}
              </button>
              <button
                type="button"
                onClick={() => setQrModalProject(null)}
                className="w-full py-2 rounded-full text-xs font-serif text-[#8C7E75] hover:text-[#211715] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
