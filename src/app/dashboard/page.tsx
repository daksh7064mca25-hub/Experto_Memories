"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Compass,
  Star,
  ChevronRight,
  Filter,
  Menu,
  X,
  Home,
} from "lucide-react";
import { WebsiteProjectData } from "@/types/website";
import { PublishPricingModal } from "@/components/commerce/PublishPricingModal";
import { CATALOG_PRODUCTS, CatalogProduct } from "@/config/products";

type DashboardTab = "home" | "explore" | "websites" | "orders" | "rsvps" | "account" | "support";

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

function CustomerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customer, setCustomer] = useState<any | null>(null);
  const [projects, setProjects] = useState<WebsiteProjectData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [rsvpStats, setRsvpStats] = useState({ total: 0, attending: 0, declined: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Navigation & Drawer State
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [websiteFilter, setWebsiteFilter] = useState<"all" | "drafts" | "published" | "domains" | "weddings" | "gifts" | "birthdays">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreFilter, setExploreFilter] = useState<string>("all");
  const [orderFilter, setOrderFilter] = useState<"all" | "pending_verification" | "paid" | "pending" | "failed">("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Dynamic Server Pricing
  const [pricing, setPricing] = useState<{
    basePrice: number;
    occasionPrices: Record<string, number>;
  }>({
    basePrice: 999,
    occasionPrices: {},
  });

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

  // URL-driven Tab Navigation & Deep Linking
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    let nextTab: DashboardTab = "home";
    if (tabParam === "explore") {
      nextTab = "explore";
    } else if (tabParam === "gifts" || tabParam === "websites") {
      nextTab = "websites";
    } else if (tabParam === "orders") {
      nextTab = "orders";
    } else if (tabParam === "rsvps") {
      nextTab = "rsvps";
    } else if (tabParam === "account") {
      nextTab = "account";
    } else if (tabParam === "support") {
      nextTab = "support";
    }
    Promise.resolve().then(() => {
      setActiveTab(nextTab);
    });
  }, [searchParams]);

  // Synchronize Tab Switching with Browser History without Full Page Reload
  const switchTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    let url = "/dashboard";
    if (tab === "explore") url = "/dashboard?tab=explore";
    else if (tab === "websites") url = "/dashboard?tab=gifts";
    else if (tab === "orders") url = "/dashboard?tab=orders";
    else if (tab === "rsvps") url = "/dashboard?tab=rsvps";
    else if (tab === "account") url = "/dashboard?tab=account";
    else if (tab === "support") url = "/dashboard?tab=support";
    router.push(url, { scroll: false });
  };

  // Load customer profile, projects, orders, and dynamic pricing
  const loadData = useCallback(async () => {
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

      // 5. Fetch Authoritative Dynamic Pricing Engine Settings
      try {
        const priceRes = await fetch("/api/settings/pricing");
        if (priceRes.ok) {
          const priceData = await priceRes.json();
          if (priceData.pricing) {
            setPricing({
              basePrice: priceData.pricing.basePrice ?? 999,
              occasionPrices: priceData.pricing.occasionPrices ?? {},
            });
          }
        }
      } catch {}
    } catch {
      setErrorMsg("Failed to load your creative workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadData();
    });
  }, [loadData]);

  // Helper to resolve product price dynamically from authoritative pricing engine
  const getOccasionPrice = (occasion: string) => {
    const key = (occasion || "").toLowerCase();
    return pricing.occasionPrices?.[key] ?? pricing.basePrice ?? 999;
  };

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

      setDomainMsg("Custom domain submitted! Point your CNAME record to cname.expertomemories.shop.");
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
  const drafts = projects.filter((p) => p.status === "draft");
  const publishedProjects = projects.filter((p) => p.status === "published");
  const draftsCount = drafts.length;
  const publishedCount = publishedProjects.length;
  const domainsCount = projects.filter((p) => Boolean(p.customDomain?.requested)).length;

  // Search & Filtered projects for My Gifts tab
  const filteredProjects = projects.filter((p) => {
    if (websiteFilter === "drafts" && p.status !== "draft") return false;
    if (websiteFilter === "published" && p.status !== "published") return false;
    if (websiteFilter === "domains" && !p.customDomain?.requested) return false;
    if (websiteFilter === "weddings" && p.occasionType !== "wedding") return false;
    if (websiteFilter === "birthdays" && p.occasionType !== "birthday") return false;
    if (websiteFilter === "gifts" && (p.occasionType === "wedding" || p.occasionType === "birthday")) return false;

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

  // Filtered orders for Orders tab
  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== "all" && o.paymentStatus !== orderFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase().trim();
      const matchNumber = (o.orderNumber || "").toLowerCase().includes(q);
      const matchTitle = (o.items?.[0]?.title || "").toLowerCase().includes(q);
      const matchUtr = (o.manualUpiDetails?.utrNumber || "").toLowerCase().includes(q);
      return matchNumber || matchTitle || matchUtr;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211715] font-sans flex flex-col selection:bg-[#EADBCE] selection:text-[#211715]">
      {/* ========================================================================= */}
      {/* 1. LUXURY REDESIGNED CUSTOMER NAVBAR */}
      {/* ========================================================================= */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#EFE7DE] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Title */}
          <Link href="/dashboard" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white flex items-center justify-center shadow-md shadow-[#9C2D41]/20 group-hover:scale-105 transition-transform duration-300">
              <Heart size={18} className="fill-current" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-[#211715] tracking-tight block leading-tight">
                ExpertoMemories
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#C5A36A] font-bold uppercase block">
                KEEPSAKE ATELIER
              </span>
            </div>
          </Link>

          {/* Center: Clean, Beautifully Spaced Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#F4EFEB] p-1.5 rounded-2xl text-[12px] font-serif font-semibold">
            <button
              type="button"
              onClick={() => switchTab("home")}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "home"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              <Home size={13} />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab("explore")}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "explore"
                  ? "bg-white text-[#9C2D41] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#9C2D41]"
              }`}
            >
              <Compass size={13} />
              <span>Explore Experiences</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab("websites")}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "websites"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              <Gift size={13} />
              <span>My Gifts</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-200/60 text-[#211715] font-bold">
                {projects.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => switchTab("orders")}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              <ShoppingBag size={13} />
              <span>Orders &amp; Payments</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-200/60 text-[#211715] font-bold">
                {orders.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => switchTab("rsvps")}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "rsvps"
                  ? "bg-white text-[#7A1C2D] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#7A1C2D]"
              }`}
            >
              <Mail size={13} />
              <span>RSVP Manager</span>
              {rsvps.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#7A1C2D] font-bold">
                  {rsvps.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => switchTab("account")}
              className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === "account"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              <User size={13} />
              <span>Account Settings</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab("support")}
              className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === "support"
                  ? "bg-white text-[#211715] shadow-xs font-bold"
                  : "text-[#6B5E57] hover:text-[#211715]"
              }`}
            >
              <HelpCircle size={13} />
              <span>Help &amp; Support</span>
            </button>
          </nav>

          {/* Right: Customer Profile & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-[#EFE7DE]">
              <div className="w-9 h-9 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[#8E641D] font-serif font-bold text-xs flex items-center justify-center">
                {customer?.name ? customer.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-serif font-bold text-[#211715] leading-tight truncate max-w-[110px]">
                  {customer?.name || "Customer"}
                </span>
                <span className="text-[10px] text-[#8C7E75] font-mono leading-tight truncate max-w-[110px]">
                  {customer?.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif text-[#6B5E57] hover:text-[#211715] hover:bg-[#F4EFEB] transition-colors cursor-pointer"
              title="Sign Out Securely"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Sign Out</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE] text-[#211715] hover:bg-[#F4EFEB] transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed inset-0 top-20 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-start">
            <div className="bg-white border-b border-[#EFE7DE] shadow-2xl p-5 space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto">
              {/* Profile Card in Drawer */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE]">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[#8E641D] font-serif font-bold text-sm flex items-center justify-center">
                  {customer?.name ? customer.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-serif font-bold text-[#211715]">
                    {customer?.name || "Customer"}
                  </span>
                  <span className="text-xs text-[#8C7E75] font-mono">
                    {customer?.email}
                  </span>
                </div>
              </div>

              {/* Drawer Links */}
              <div className="grid grid-cols-1 gap-1.5 text-xs font-serif font-semibold">
                <button
                  type="button"
                  onClick={() => switchTab("home")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    activeTab === "home" ? "bg-[#211715] text-white font-bold" : "text-[#211715] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Home size={15} />
                    <span>Home</span>
                  </span>
                  <ChevronRight size={14} className="opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("explore")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    activeTab === "explore" ? "bg-[#9C2D41] text-white font-bold" : "text-[#211715] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Compass size={15} />
                    <span>Explore Experiences</span>
                  </span>
                  <ChevronRight size={14} className="opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("websites")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    activeTab === "websites" ? "bg-[#211715] text-white font-bold" : "text-[#211715] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Gift size={15} />
                    <span>My Gifts</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200/70 text-[#211715]">
                    {projects.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("orders")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    activeTab === "orders" ? "bg-[#211715] text-white font-bold" : "text-[#211715] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag size={15} />
                    <span>Orders &amp; Payments</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200/70 text-[#211715]">
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("rsvps")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    activeTab === "rsvps" ? "bg-[#7A1C2D] text-white font-bold" : "text-[#211715] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mail size={15} />
                    <span>RSVP Manager</span>
                  </span>
                  {rsvps.length > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#7A1C2D]">
                      {rsvps.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("account")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    activeTab === "account" ? "bg-[#211715] text-white font-bold" : "text-[#211715] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User size={15} />
                    <span>Account Settings</span>
                  </span>
                  <ChevronRight size={14} className="opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("support")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    activeTab === "support" ? "bg-[#211715] text-white font-bold" : "text-[#211715] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={15} />
                    <span>Help &amp; Support</span>
                  </span>
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              </div>

              {/* Sign Out CTA in Drawer */}
              <div className="pt-2 border-t border-[#EFE7DE]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl text-xs font-serif font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CREATIVE WORKSPACE */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
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
              className="mt-4 px-5 py-2 rounded-full text-xs font-serif font-bold bg-[#D94B70] text-white shadow-sm hover:bg-[#B02A50] transition-colors cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* TAB: HOME (Personalized Hero, Product Discovery, Featured, Drafts, Orders) */}
            {/* ========================================================================= */}
            {activeTab === "home" && (
              <div className="space-y-12 animate-fade-in">
                {/* 2.1 SECTION 1: PERSONALIZED HERO */}
                <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE1] border border-[#EADBCE] p-7 sm:p-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C5A36A]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2.5 max-w-2xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[11px] font-serif font-semibold text-[#8E641D]">
                        <Sparkle size={12} className="text-[#C5A36A]" />
                        <span>ExpertoMemories Keepsake Atelier</span>
                      </div>
                      <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#211715] tracking-tight leading-tight">
                        Welcome back, {customer?.name ? customer.name.split(" ")[0] : "Friend"}.
                      </h1>
                      <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
                        Every beautiful moment deserves a story of its own. Curate bespoke interactive digital keepsakes for the people you love.
                      </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                      <Link
                        href="/dashboard/create"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-serif font-bold text-xs bg-gradient-to-r from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white shadow-md shadow-[#D94B70]/25 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <PlusCircle size={15} />
                        <span>Create a New Gift</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => switchTab("explore")}
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-serif font-semibold text-xs bg-white hover:bg-[#FAF7F2] text-[#211715] border border-[#EADBCE] shadow-2xs transition-colors cursor-pointer"
                      >
                        <Compass size={14} className="text-[#9C2D41]" />
                        <span>Explore Experiences</span>
                      </button>
                    </div>
                  </div>

                  {/* Refined Quick Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#EADBCE]/70">
                    <div className="bg-white/70 backdrop-blur-xs rounded-2xl p-3.5 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-0.5">
                        Total Keepsakes
                      </span>
                      <span className="font-serif text-xl font-bold text-[#211715]">
                        {projects.length}
                      </span>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xs rounded-2xl p-3.5 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-0.5">
                        Drafts In Progress
                      </span>
                      <span className="font-serif text-xl font-bold text-[#A85519]">
                        {draftsCount}
                      </span>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xs rounded-2xl p-3.5 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-0.5">
                        Live Published
                      </span>
                      <span className="font-serif text-xl font-bold text-[#065F46]">
                        {publishedCount}
                      </span>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xs rounded-2xl p-3.5 border border-[#EFE7DE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] block mb-0.5">
                        Orders &amp; Receipts
                      </span>
                      <span className="font-serif text-xl font-bold text-[#7A1C2D]">
                        {orders.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2.2 SECTION 2: EXPLORE OUR EXPERIENCES (Storefront Product Cards with Authoritative Dynamic Prices) */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#C5A36A] font-bold">
                        <Sparkles size={12} />
                        <span>EXPLORE OUR EXPERIENCES</span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] mt-1">
                        Curated Collections for Life&rsquo;s Moments
                      </h2>
                      <p className="text-xs sm:text-sm text-[#6B5E57] mt-1 max-w-xl">
                        Choose a celebration format to begin personalizing with your own photographs, heartfelt letters, private secrets, and background soundtrack.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => switchTab("explore")}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#9C2D41] hover:underline cursor-pointer shrink-0"
                    >
                      <span>View Full Atelier</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* 5 Rich Catalogue Cards with Authoritative Dynamic Prices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* CARD 1: LOVE & ROMANCE */}
                    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-xs hover:shadow-xl hover:border-[#FAD0DC] transition-all duration-300 flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF0F4] text-[#AB2850] border border-[#FAD0DC]">
                            Pure Romance
                          </span>
                          <span className="text-xl">💖</span>
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#211715] group-hover:text-[#9C2D41] transition-colors">
                            The Secret World of Us
                          </h3>
                          <p className="text-xs text-[#6B5E57] mt-1.5 leading-relaxed">
                            An intimate romantic universe featuring a 3D wax-sealed opening, glowing starlit constellation, interactive love questions, memory gallery, and heartfelt letter.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Starlit Night Sky
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Wax-Sealed Letter
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Love Puzzle
                          </span>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-[#F4EFEB] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8C7E75] block font-semibold">
                            Full Experience From
                          </span>
                          <span className="font-serif font-bold text-base text-[#211715]">
                            ₹{getOccasionPrice("love").toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href="/demo/love"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-serif font-semibold text-[#6B5E57] hover:bg-[#FAF7F2] border border-[#EFE7DE] transition-colors"
                          >
                            Demo
                          </Link>
                          <Link
                            href="/dashboard/create?occasion=love"
                            className="px-4 py-2 rounded-xl text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-xs transition-all hover:scale-105"
                          >
                            Create Yours
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: BIRTHDAY CELEBRATION */}
                    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-xs hover:shadow-xl hover:border-[#FCDDC6] transition-all duration-300 flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FDF4ED] text-[#A85519] border border-[#FCDDC6]">
                            Celebration
                          </span>
                          <span className="text-xl">🎂</span>
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#211715] group-hover:text-[#A85519] transition-colors">
                            The Birthday Wonderland
                          </h3>
                          <p className="text-xs text-[#6B5E57] mt-1.5 leading-relaxed">
                            An immersive digital celebration with an interactive 3D birthday cake, candle blowout celebration, wish balloons, polaroid scrapbook, and audio visualizer.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Interactive 3D Cake
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Candle Blowout
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Wishes Scrapbook
                          </span>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-[#F4EFEB] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8C7E75] block font-semibold">
                            Full Experience From
                          </span>
                          <span className="font-serif font-bold text-base text-[#211715]">
                            ₹{getOccasionPrice("birthday").toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href="/demo/birthday"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-serif font-semibold text-[#6B5E57] hover:bg-[#FAF7F2] border border-[#EFE7DE] transition-colors"
                          >
                            Demo
                          </Link>
                          <Link
                            href="/dashboard/create?occasion=birthday"
                            className="px-4 py-2 rounded-xl text-xs font-serif font-bold bg-[#A85519] hover:bg-[#8A4413] text-white shadow-xs transition-all hover:scale-105"
                          >
                            Create Yours
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* CARD 3: ANNIVERSARY STORY */}
                    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-xs hover:shadow-xl hover:border-[#F1E2C5] transition-all duration-300 flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF5EB] text-[#8E641D] border border-[#F1E2C5]">
                            Anniversary Milestone
                          </span>
                          <span className="text-xl">💍</span>
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#211715] group-hover:text-[#8E641D] transition-colors">
                            Our Forever Story
                          </h3>
                          <p className="text-xs text-[#6B5E57] mt-1.5 leading-relaxed">
                            A timeless milestone journey through every chapter of your love. Features relationship timelines, couple trivia quizzes, glowing star memories, and turntable vinyl player.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Milestone Timeline
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Vinyl Turntable Lounge
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Couple Quiz
                          </span>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-[#F4EFEB] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8C7E75] block font-semibold">
                            Full Experience From
                          </span>
                          <span className="font-serif font-bold text-base text-[#211715]">
                            ₹{getOccasionPrice("anniversary").toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href="/demo/anniversary"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-serif font-semibold text-[#6B5E57] hover:bg-[#FAF7F2] border border-[#EFE7DE] transition-colors"
                          >
                            Demo
                          </Link>
                          <Link
                            href="/dashboard/create?occasion=anniversary"
                            className="px-4 py-2 rounded-xl text-xs font-serif font-bold bg-[#8E641D] hover:bg-[#724F14] text-white shadow-xs transition-all hover:scale-105"
                          >
                            Create Yours
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* CARD 4: APOLOGY & HEALING */}
                    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-xs hover:shadow-xl hover:border-[#F8D2DA] transition-all duration-300 flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF5F6] text-[#9C2D41] border border-[#F8D2DA]">
                            Heartfelt
                          </span>
                          <span className="text-xl">💌</span>
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#211715] group-hover:text-[#9C2D41] transition-colors">
                            A Little Sorry, A Lot of Love
                          </h3>
                          <p className="text-xs text-[#6B5E57] mt-1.5 leading-relaxed">
                            An earnest, respectful path to healing. Features a wax-sealed envelope, memory vault, redeemable apology coupon book, and handwritten promises letter.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Handwritten Letter
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Apology Coupon Book
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Forgiveness Garden
                          </span>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-[#F4EFEB] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8C7E75] block font-semibold">
                            Full Experience From
                          </span>
                          <span className="font-serif font-bold text-base text-[#211715]">
                            ₹{getOccasionPrice("apology").toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href="/demo/apology"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-serif font-semibold text-[#6B5E57] hover:bg-[#FAF7F2] border border-[#EFE7DE] transition-colors"
                          >
                            Demo
                          </Link>
                          <Link
                            href="/dashboard/create?occasion=apology"
                            className="px-4 py-2 rounded-xl text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-xs transition-all hover:scale-105"
                          >
                            Create Yours
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* CARD 5: ROYAL WEDDING INVITATIONS */}
                    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-xs hover:shadow-xl hover:border-[#C5A36A]/50 transition-all duration-300 flex flex-col justify-between group md:col-span-2 lg:col-span-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FBF6EE] text-[#7A1C2D] border border-[#C5A36A]/40">
                            Royal Luxury
                          </span>
                          <span className="text-xl">👑</span>
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#211715] group-hover:text-[#7A1C2D] transition-colors">
                            The Royal Wedding Collection
                          </h3>
                          <p className="text-xs text-[#6B5E57] mt-1.5 leading-relaxed max-w-2xl">
                            Majestic cultural digital wedding invitations with palace double doors or wax seal unboxing, multi-event itineraries (Haldi, Mehendi, Sangeet, Vivah), Google Maps navigation, and interactive guest RSVP tracking.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Double-Door Opening
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Multi-Event Schedules
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            Interactive Guest RSVP
                          </span>
                          <span className="text-[10px] font-serif bg-[#FAF7F2] text-[#6B5E57] px-2 py-0.5 rounded-md border border-[#EFE7DE]">
                            5 Cultural Traditions
                          </span>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-[#F4EFEB] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8C7E75] block font-semibold">
                            Full Experience From
                          </span>
                          <span className="font-serif font-bold text-base text-[#211715]">
                            ₹{getOccasionPrice("wedding").toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href="/demo/wedding"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl text-xs font-serif font-semibold text-[#6B5E57] hover:bg-[#FAF7F2] border border-[#EFE7DE] transition-colors"
                          >
                            Explore Demo
                          </Link>
                          <Link
                            href="/dashboard/create?occasion=wedding"
                            className="px-5 py-2 rounded-xl text-xs font-serif font-bold bg-[#7A1C2D] hover:bg-[#5E1421] text-white shadow-xs transition-all hover:scale-105"
                          >
                            Create Wedding Invitation
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2.3 SECTION 3: FEATURED EXPERIENCES (Editorial Keepsake Atelier Spotlight) */}
                <div className="rounded-3xl bg-gradient-to-r from-[#211715] via-[#38161D] to-[#541D2B] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C5A36A]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 max-w-2xl space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A36A] font-bold bg-[#C5A36A]/10 px-3 py-1 rounded-full border border-[#C5A36A]/20">
                      FEATURED SPOTLIGHT
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      Made for the Moments That Matter
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      Unlike generic greeting cards that get tucked away in a drawer, an ExpertoMemories keepsake is an interactive web experience your recipient can carry on their phone forever. Add your favorite song, private pictures, and personal jokes.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        href="/dashboard/create?occasion=love"
                        className="px-6 py-3 rounded-full font-serif font-bold text-xs bg-white text-[#211715] hover:bg-[#FAF7F2] shadow-md transition-all hover:scale-105"
                      >
                        Start Romantic Keepsake
                      </Link>
                      <button
                        type="button"
                        onClick={() => switchTab("explore")}
                        className="px-5 py-3 rounded-full font-serif font-semibold text-xs text-stone-300 hover:text-white border border-stone-600 transition-colors cursor-pointer"
                      >
                        Explore All 5 Formats
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2.4 SECTION 4: CONTINUE YOUR CREATIONS (Saved Drafts) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] font-bold">
                        SAVED WORKSPACE
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
                        Continue Your Creations
                      </h2>
                    </div>
                    {draftsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          switchTab("websites");
                          setWebsiteFilter("drafts");
                        }}
                        className="text-xs font-serif font-semibold text-[#9C2D41] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All My Gifts ({projects.length})</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {draftsCount === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#EADBCE] p-8 sm:p-10 text-center max-w-lg mx-auto shadow-2xs space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#C5A36A] flex items-center justify-center mx-auto">
                        <Sparkles size={20} />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#211715]">
                        Your Next Beautiful Memory Starts Here
                      </h3>
                      <p className="text-xs text-[#6B5E57] max-w-sm mx-auto leading-relaxed">
                        You have no drafts in progress. Choose any celebration format above to start customizing your interactive keepsake.
                      </p>
                      <Link
                        href="/dashboard/create"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-[#211715] hover:bg-black text-white transition-colors"
                      >
                        <PlusCircle size={13} />
                        <span>Create A Gift Now</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {drafts.slice(0, 3).map((draft) => {
                        const theme = OCCASION_THEMES[draft.occasionType || "apology"] || OCCASION_THEMES.apology;
                        return (
                          <div
                            key={draft._id}
                            className="bg-white rounded-3xl p-5 border border-[#EFE7DE] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.bg} ${theme.text} ${theme.border}`}
                                >
                                  <span>{theme.icon}</span>
                                  <span>{theme.name}</span>
                                </span>
                                <span className="text-[10px] font-mono text-[#8C7E75]">
                                  {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : "Draft"}
                                </span>
                              </div>

                              <div>
                                <h3 className="font-serif font-bold text-base text-[#211715] leading-snug line-clamp-1">
                                  {draft.title}
                                </h3>
                                <p className="text-xs text-[#8C7E75] mt-0.5">
                                  Recipient: <strong className="text-[#211715]">{draft.recipientName || "Loved One"}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-[#F4EFEB] flex items-center gap-2">
                              <Link
                                href={`/editor/${draft._id}`}
                                className="flex-1 py-2 rounded-xl text-xs font-serif font-bold bg-[#211715] hover:bg-black text-white flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                              >
                                <Edit3 size={12} />
                                <span>Continue Editing</span>
                              </Link>
                              <Link
                                href={`/gift/${draft.slug}?preview=true`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl text-xs bg-[#FAF7F2] hover:bg-[#F4EFEB] text-[#6B5E57] border border-[#EFE7DE] transition-colors"
                                title="Live Preview"
                              >
                                <Eye size={14} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => setSelectedProjectForPublish(draft)}
                                className="px-3 py-2 rounded-xl text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-2xs cursor-pointer"
                                title="Publish and Pay"
                              >
                                Publish
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2.5 SECTION 5: YOUR PUBLISHED MEMORIES */}
                {publishedCount > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#065F46] font-bold">
                          LIVE &amp; ACTIVE
                        </span>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
                          Your Published Memories
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          switchTab("websites");
                          setWebsiteFilter("published");
                        }}
                        className="text-xs font-serif font-semibold text-[#065F46] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Live Keepsakes ({publishedCount})</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {publishedProjects.slice(0, 3).map((proj) => {
                        const origin = typeof window !== "undefined" ? window.location.origin : "";
                        const liveUrl = `${origin}/gift/${proj.slug}`;
                        return (
                          <div
                            key={proj._id}
                            className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 size={10} /> Live &amp; Published
                              </span>
                              <span className="text-[10px] font-mono text-[#8C7E75]">
                                {proj.occasionType?.toUpperCase()}
                              </span>
                            </div>

                            <div>
                              <h3 className="font-serif font-bold text-base text-[#211715] truncate">
                                {proj.title}
                              </h3>
                              <p className="text-[11px] font-mono text-emerald-700 truncate mt-1 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                                {liveUrl}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-[#F4EFEB]">
                              <button
                                type="button"
                                onClick={() => copyUrl(proj.slug)}
                                className="flex-1 py-1.5 rounded-xl text-xs font-serif font-semibold bg-[#FAF7F2] hover:bg-[#F4EFEB] text-[#211715] border border-[#EFE7DE] flex items-center justify-center gap-1 cursor-pointer"
                              >
                                {copiedSlug === proj.slug ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                <span>{copiedSlug === proj.slug ? "Copied" : "Copy Link"}</span>
                              </button>
                              <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                                title="Open Live Website"
                              >
                                <ExternalLink size={13} />
                              </a>
                              <button
                                type="button"
                                onClick={() => shareOnWhatsApp(proj)}
                                className="p-2 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                title="Share on WhatsApp"
                              >
                                <Share2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2.6 SECTION 6: RECENT ORDERS & PAYMENT UPDATES */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E75] font-bold">
                        PURCHASE ACTIVITY
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
                        Recent Orders &amp; Payment Updates
                      </h2>
                    </div>
                    {orders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => switchTab("orders")}
                        className="text-xs font-serif font-semibold text-[#9C2D41] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Orders ({orders.length})</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#EADBCE] p-8 text-center max-w-lg mx-auto shadow-2xs space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#C5A36A] flex items-center justify-center mx-auto">
                        <ShoppingBag size={20} />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#211715]">
                        Your Purchase Journey Starts with a Special Moment
                      </h3>
                      <p className="text-xs text-[#6B5E57] max-w-sm mx-auto leading-relaxed">
                        When you publish a gift website, your invoice, payment verification, and order receipts will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {orders.slice(0, 3).map((order) => {
                        const isPaid = order.paymentStatus === "paid";
                        const isPendingVerif = order.paymentStatus === "payment_pending_verification";
                        const isFailed = order.paymentStatus === "failed";
                        const isRefunded = order.paymentStatus === "refunded";

                        return (
                          <div
                            key={order._id}
                            className="bg-white rounded-3xl p-5 border border-[#EFE7DE] shadow-xs space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-[#211715]">
                                  {order.orderNumber}
                                </span>
                                {isPaid ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                                    <CheckCircle2 size={10} /> Verified
                                  </span>
                                ) : isPendingVerif ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    Pending Audit
                                  </span>
                                ) : isFailed ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                                    Failed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>

                              <div>
                                <h4 className="font-serif font-bold text-sm text-[#211715] truncate">
                                  {order.items?.[0]?.title || "Gift Website"}
                                </h4>
                                <p className="text-xs font-mono font-bold text-[#541D2B] mt-0.5">
                                  ₹{order.totalAmount?.toLocaleString("en-IN") || order.totalAmount}
                                  <span className="text-[10px] font-normal text-[#8C7E75] ml-1.5">
                                    • {order.paymentMethod === "razorpay" ? "Online" : "Manual UPI"}
                                  </span>
                                </p>
                              </div>

                              {order.manualUpiDetails?.utrNumber && (
                                <p className="text-[10px] font-mono text-[#8C7E75]">
                                  Submitted UTR: <strong className="text-[#211715]">{order.manualUpiDetails.utrNumber}</strong>
                                </p>
                              )}
                            </div>

                            <div className="pt-2 border-t border-[#F4EFEB] flex items-center justify-between text-[11px]">
                              <span className="text-[#8C7E75] font-mono">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <Link
                                href={`/order/${order._id}${order.accessToken ? `?token=${order.accessToken}` : ""}`}
                                className="text-[#9C2D41] hover:underline font-serif font-semibold inline-flex items-center gap-1"
                              >
                                <span>View Receipt</span>
                                <ExternalLink size={10} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: EXPLORE EXPERIENCES (Full Catalogue Discovery) */}
            {/* ========================================================================= */}
            {activeTab === "explore" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[11px] font-serif font-semibold text-[#8E641D] mb-2">
                      <Compass size={12} className="text-[#C5A36A]" />
                      <span>THE EXPERTOMEMORIES COLLECTION</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#211715] tracking-tight">
                      Explore Digital Experiences
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6B5E57] mt-1.5 max-w-2xl leading-relaxed">
                      Every celebration is a bespoke interactive website designed to delight your loved one on their smartphone. Free to customize and preview anytime.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/create"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-serif font-bold text-xs bg-[#211715] hover:bg-black text-white shadow-md transition-all shrink-0"
                  >
                    <PlusCircle size={15} />
                    <span>Start Creating</span>
                  </Link>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-serif scrollbar-none">
                  {[
                    { id: "all", label: "All Collections" },
                    { id: "love", label: "Love & Romance" },
                    { id: "birthday", label: "Birthday Wonderland" },
                    { id: "anniversary", label: "Anniversary Stories" },
                    { id: "apology", label: "Apology & Healing" },
                    { id: "wedding", label: "Royal Weddings" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setExploreFilter(cat.id)}
                      className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        exploreFilter === cat.id
                          ? "bg-[#211715] text-white font-bold shadow-xs"
                          : "bg-white text-[#6B5E57] border border-[#EFE7DE] hover:border-[#D5C7B8]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Experiences Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CATALOG_PRODUCTS.filter((prod) => {
                    if (exploreFilter === "all") return true;
                    return prod.occasionType === exploreFilter;
                  }).map((prod) => {
                    const dynamicPrice = getOccasionPrice(prod.occasionType);
                    const occasionTheme =
                      OCCASION_THEMES[prod.occasionType || "apology"] || OCCASION_THEMES.apology;

                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${occasionTheme.bg} ${occasionTheme.text} ${occasionTheme.border}`}
                            >
                              <span>{occasionTheme.icon}</span>
                              <span>{prod.badge || occasionTheme.name}</span>
                            </span>
                            <span className="text-[10px] font-mono text-[#8C7E75] uppercase">
                              {prod.occasionType}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-serif font-bold text-xl text-[#211715] group-hover:text-[#9C2D41] transition-colors">
                              {prod.title}
                            </h3>
                            <p className="text-xs text-[#8C7E75] italic mt-0.5">
                              {prod.subtitle}
                            </p>
                            <p className="text-xs text-[#6B5E57] mt-2.5 leading-relaxed">
                              {prod.description}
                            </p>
                          </div>

                          {/* Features */}
                          <div className="space-y-1.5 pt-2 border-t border-[#F4EFEB]">
                            <span className="text-[10px] font-mono uppercase text-[#8C7E75] font-bold block">
                              Signature Features
                            </span>
                            <ul className="text-xs text-[#6B5E57] space-y-1">
                              {prod.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <Sparkle size={10} className="text-[#C5A36A] mt-1 shrink-0" />
                                  <span className="line-clamp-1">{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-[#F4EFEB] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#8C7E75] block font-semibold">
                              Starting Price
                            </span>
                            <span className="font-serif font-bold text-lg text-[#211715]">
                              ₹{dynamicPrice.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={prod.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl text-xs font-serif font-semibold text-[#6B5E57] hover:bg-[#FAF7F2] border border-[#EFE7DE] transition-colors"
                            >
                              Demo
                            </Link>
                            <Link
                              href={`/dashboard/create?occasion=${prod.occasionType}`}
                              className="px-4 py-2 rounded-xl text-xs font-serif font-bold bg-[#211715] hover:bg-black text-white shadow-xs transition-all hover:scale-105"
                            >
                              Create Experience
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: MY GIFTS (Websites Management) */}
            {/* ========================================================================= */}
            {activeTab === "websites" && (
              <div className="space-y-8 animate-fade-in">
                {/* Header & Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] tracking-tight">
                      My Gift Websites
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6B5E57] mt-1">
                      Manage all your drafts, customized designs, and live published celebration websites.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-serif font-bold text-xs bg-gradient-to-r from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white shadow-md shadow-[#D94B70]/25 hover:shadow-lg transition-all shrink-0"
                  >
                    <PlusCircle size={14} />
                    <span>Create A New Gift</span>
                  </Link>
                </div>

                {/* Filter Pills & Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-serif scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter("all")}
                      className={`px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                        websiteFilter === "all"
                          ? "bg-[#211715] text-white border-[#211715] font-bold shadow-xs"
                          : "bg-white text-[#6B5E57] border-[#EFE7DE] hover:border-[#D5C7B8]"
                      }`}
                    >
                      All Keepsakes ({projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter("drafts")}
                      className={`px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
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
                      className={`px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
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
                      className={`px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                        websiteFilter === "domains"
                          ? "bg-[#211715] text-white border-[#211715] font-bold shadow-xs"
                          : "bg-white text-[#6B5E57] border-[#EFE7DE] hover:border-[#D5C7B8]"
                      }`}
                    >
                      Custom Domains ({domainsCount})
                    </button>
                  </div>

                  <div className="relative w-full lg:w-72">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7E75]"
                    />
                    <input
                      type="text"
                      placeholder="Search title, recipient, occasion..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#EFE7DE] text-xs placeholder:text-[#A3958C] focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8C7E75] hover:text-[#211715] cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Cards Grid */}
                {projects.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#EADBCE] p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[#C5A36A] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Sparkles size={36} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#EADBCE] text-[10px] font-mono uppercase tracking-wider text-[#8E641D] font-bold mb-3">
                      Start Your Story
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-[#211715] mb-2">
                      Your First Creation Is Waiting
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B5E57] mb-8 leading-relaxed max-w-md mx-auto">
                      Create an unforgettable interactive digital gift website for someone you love. Personalize letters, photographs, music, quizzes, and private secrets.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link
                        href="/dashboard/create"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-serif font-bold text-xs bg-gradient-to-r from-[#9C2D41] via-[#D94B70] to-[#E58097] text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <PlusCircle size={15} />
                        <span>Create Your First Gift</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => switchTab("explore")}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-serif font-bold text-xs bg-[#FAF5EB] hover:bg-[#F4EFEB] text-[#8E641D] border border-[#EADBCE] transition-colors cursor-pointer"
                      >
                        <span>Explore Experiences</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#EFE7DE] p-12 text-center max-w-md mx-auto">
                    <Search size={28} className="mx-auto text-[#8C7E75] mb-3" />
                    <h3 className="font-serif font-bold text-base text-[#211715] mb-1">
                      No Matching Keepsakes
                    </h3>
                    <p className="text-xs text-[#8C7E75] mb-4">
                      No websites match your filter or search keyword &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setWebsiteFilter("all");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 rounded-full font-serif font-bold text-xs bg-[#211715] text-white hover:bg-black transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
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
                          className="bg-white rounded-3xl border border-[#EFE7DE] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                        >
                          <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${occasionTheme.bg} ${occasionTheme.text} ${occasionTheme.border}`}
                              >
                                <span>{occasionTheme.icon}</span>
                                <span>{occasionTheme.name}</span>
                              </span>

                              {isPublished ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                                  <CheckCircle2 size={10} /> Live
                                </span>
                              ) : isPaid ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#FAF5EB] text-[#8E641D] border border-[#F1E2C5] px-2.5 py-0.5 rounded-full">
                                  Paid (Draft)
                                </span>
                              ) : proj.paymentStatus === "pending_verification" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                  <Clock size={10} /> In Verification
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-stone-100 text-stone-600 border border-stone-200 px-2.5 py-0.5 rounded-full">
                                  Draft
                                </span>
                              )}
                            </div>

                            <div>
                              <h3 className="font-serif font-bold text-lg text-[#211715] leading-snug line-clamp-1 group-hover:text-[#9C2D41] transition-colors">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-[#8C7E75] mt-1">
                                For: <strong className="text-[#211715]">{proj.recipientName || "Loved One"}</strong>
                              </p>
                              <p className="text-[10px] font-mono text-[#8C7E75] mt-1">
                                Last edited: {formattedDate}
                              </p>
                            </div>

                            {/* Features list */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {proj.isPasswordProtected && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#FAF7F2] text-[#8C7E75] border border-[#EFE7DE] px-2 py-0.5 rounded-md">
                                  <Lock size={10} /> Password
                                </span>
                              )}
                              {proj.customDomain?.requested && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                                  <Globe size={10} /> Domain
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE7DE] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/editor/${proj._id}`}
                                className="px-3 py-1.5 rounded-xl text-xs font-serif font-semibold bg-white hover:bg-stone-50 text-[#211715] border border-[#EFE7DE] shadow-2xs flex items-center gap-1"
                              >
                                <Edit3 size={12} />
                                <span>Edit</span>
                              </Link>
                              <Link
                                href={`/gift/${proj.slug}?preview=true`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#6B5E57] border border-[#EFE7DE] shadow-2xs"
                                title="Live Preview"
                              >
                                <Eye size={14} />
                              </Link>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isPublished ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => copyUrl(proj.slug)}
                                    className="p-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#6B5E57] border border-[#EFE7DE] shadow-2xs cursor-pointer"
                                    title="Copy Link"
                                  >
                                    {copiedSlug === proj.slug ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setQrModalProject(proj)}
                                    className="p-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#6B5E57] border border-[#EFE7DE] shadow-2xs cursor-pointer"
                                    title="Gift QR Code"
                                  >
                                    <QrCode size={14} />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSelectedProjectForPublish(proj)}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-2xs cursor-pointer"
                                >
                                  Publish &amp; Pay
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj._id || "", proj.title)}
                                className="p-1.5 rounded-xl text-[#8C7E75] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={13} />
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

            {/* ========================================================================= */}
            {/* TAB: ORDERS & PAYMENTS (Authoritative Financial Ledger & History) */}
            {/* ========================================================================= */}
            {activeTab === "orders" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] tracking-tight">
                      Orders &amp; Payment History
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6B5E57] mt-1">
                      Review and verify all purchase receipts, invoices, and bank transfer statuses for your orders.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => switchTab("explore")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-serif font-semibold text-xs bg-white hover:bg-[#FAF7F2] text-[#211715] border border-[#EFE7DE] shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>Browse Experiences</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Filter and Search Bar for Orders */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-serif scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setOrderFilter("all")}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                        orderFilter === "all"
                          ? "bg-[#211715] text-white font-bold"
                          : "bg-white text-[#6B5E57] border border-[#EFE7DE]"
                      }`}
                    >
                      All Orders ({orders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter("pending_verification")}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                        orderFilter === "pending_verification"
                          ? "bg-amber-600 text-white font-bold"
                          : "bg-white text-[#6B5E57] border border-[#EFE7DE]"
                      }`}
                    >
                      Pending Verification
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter("paid")}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                        orderFilter === "paid"
                          ? "bg-emerald-700 text-white font-bold"
                          : "bg-white text-[#6B5E57] border border-[#EFE7DE]"
                      }`}
                    >
                      Verified &amp; Paid
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7E75]"
                    />
                    <input
                      type="text"
                      placeholder="Search order #, title, UTR..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#EFE7DE] text-xs placeholder:text-[#A3958C] focus:outline-none focus:ring-1 focus:ring-[#C5A36A]"
                    />
                  </div>
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
                      Your purchase journey starts with a special moment. When you publish a gift website, your official invoice and payment details will appear here.
                    </p>
                    <button
                      type="button"
                      onClick={() => switchTab("explore")}
                      className="px-6 py-2.5 rounded-full font-serif font-bold text-xs bg-[#211715] text-white hover:bg-black transition-colors cursor-pointer"
                    >
                      Explore Experiences
                    </button>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#EFE7DE] p-10 text-center max-w-md mx-auto">
                    <p className="text-xs text-[#8C7E75]">No orders match the selected filter or search keyword.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#EFE7DE] overflow-hidden shadow-xs">
                    {/* Mobile Order Cards View (<768px) */}
                    <div className="md:hidden divide-y divide-[#F4EFEB]">
                      {filteredOrders.map((order) => {
                        const isPaid = order.paymentStatus === "paid";
                        const isPendingVerif = order.paymentStatus === "payment_pending_verification";
                        const isFailed = order.paymentStatus === "failed";
                        const isRefunded = order.paymentStatus === "refunded";

                        return (
                          <div key={order._id} className="p-4 sm:p-5 space-y-3 bg-white">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-mono font-bold text-xs text-[#211715] block">
                                  {order.orderNumber}
                                </span>
                                <span className="text-[10px] text-[#8C7E75] font-mono">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full shrink-0">
                                  <CheckCircle2 size={10} /> Verified
                                </span>
                              ) : isPendingVerif ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Pending Verification
                                </span>
                              ) : isFailed ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full shrink-0">
                                  Failed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-0.5 rounded-full shrink-0">
                                  Pending
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-serif font-bold text-sm text-[#211715]">
                                {order.items?.[0]?.title || "Digital Gift Website"}
                              </h4>
                              {order.packageDetails?.isCustomDomain && (
                                <p className="text-[10px] text-[#1E40AF] mt-0.5">
                                  + Custom Domain: {order.packageDetails.customDomainName}
                                </p>
                              )}
                              {order.manualUpiDetails?.utrNumber && (
                                <p className="text-[10px] font-mono text-[#8C7E75] mt-0.5">
                                  UTR: <span className="text-[#211715] font-bold">{order.manualUpiDetails.utrNumber}</span>
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#F4EFEB]">
                              <div>
                                <span className="text-[10px] font-mono uppercase text-[#8C7E75] block">
                                  Total Amount
                                </span>
                                <span className="font-serif font-bold text-base text-[#211715]">
                                  ₹{order.totalAmount?.toLocaleString("en-IN") || order.totalAmount}
                                </span>
                              </div>

                              <Link
                                href={`/order/${order._id}${order.accessToken ? `?token=${order.accessToken}` : ""}`}
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-serif font-bold bg-[#FAF7F2] hover:bg-[#F4EFEB] text-[#211715] border border-[#EFE7DE] shadow-2xs transition-colors"
                              >
                                <span>Track Milestone</span>
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Order Table View (>=768px) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#FAF7F2] border-b border-[#EFE7DE] text-[10px] font-mono uppercase tracking-wider text-[#8C7E75]">
                          <tr>
                            <th className="py-4 px-6 font-bold">Order Ref</th>
                            <th className="py-4 px-6 font-bold">Experience Item</th>
                            <th className="py-4 px-6 font-bold">Amount</th>
                            <th className="py-4 px-6 font-bold">Payment Method</th>
                            <th className="py-4 px-6 font-bold">Status</th>
                            <th className="py-4 px-6 font-bold">Date</th>
                            <th className="py-4 px-6 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F4EFEB]">
                          {filteredOrders.map((order) => {
                            const isPaid = order.paymentStatus === "paid";
                            const isPendingVerif = order.paymentStatus === "payment_pending_verification";
                            const isFailed = order.paymentStatus === "failed";
                            const isRefunded = order.paymentStatus === "refunded";

                            return (
                              <tr key={order._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                                <td className="py-4 px-6">
                                  <span className="font-mono font-bold text-[#211715] block">
                                    {order.orderNumber}
                                  </span>
                                  {order.manualUpiDetails?.utrNumber && (
                                    <span className="text-[10px] font-mono text-[#8C7E75] block mt-0.5">
                                      UTR: {order.manualUpiDetails.utrNumber}
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="font-serif font-semibold text-[#211715] block">
                                    {order.items?.[0]?.title || "Digital Gift Website"}
                                  </span>
                                  {order.packageDetails?.isCustomDomain && (
                                    <span className="text-[10px] text-[#1E40AF] block mt-0.5">
                                      + Domain: {order.packageDetails.customDomainName}
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-6 font-serif font-bold text-[#211715]">
                                  ₹{order.totalAmount?.toLocaleString("en-IN") || order.totalAmount}
                                </td>
                                <td className="py-4 px-6 font-mono text-[11px] text-[#6B5E57] uppercase">
                                  {order.paymentMethod === "razorpay" ? "Razorpay (Online)" : "Manual UPI Transfer"}
                                </td>
                                <td className="py-4 px-6">
                                  {isPaid ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                                      <CheckCircle2 size={10} /> Payment Verified
                                    </span>
                                  ) : isPendingVerif ? (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                      Pending Verification
                                    </span>
                                  ) : isFailed ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
                                      Payment Failed
                                    </span>
                                  ) : isRefunded ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-stone-100 text-stone-600 border border-stone-200 px-2.5 py-0.5 rounded-full">
                                      Refunded
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-0.5 rounded-full">
                                      Payment Pending
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-[#8C7E75] font-mono text-[11px]">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <Link
                                    href={`/order/${order._id}${order.accessToken ? `?token=${order.accessToken}` : ""}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-serif font-semibold bg-white hover:bg-[#FAF7F2] text-[#211715] border border-[#EFE7DE] shadow-2xs transition-colors"
                                  >
                                    <span>Details &amp; Timeline</span>
                                    <ExternalLink size={11} />
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
            )}

            {/* ========================================================================= */}
            {/* TAB: WEDDING RSVPs MANAGER */}
            {/* ========================================================================= */}
            {activeTab === "rsvps" && (
              <div className="space-y-8 animate-fade-in">
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

                {/* RSVP List Table */}
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
                    {/* Mobile Guest RSVP Cards (<768px) */}
                    <div className="md:hidden divide-y divide-[#F4EFEB]">
                      {rsvps.map((rsvp: any) => (
                        <div key={rsvp._id} className="p-4 sm:p-5 space-y-3 bg-white">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif font-bold text-sm text-[#211715]">
                                {rsvp.guestName}
                              </h4>
                              {(rsvp.guestEmail || rsvp.guestPhone) && (
                                <p className="text-[11px] text-[#8C7E75] font-mono mt-0.5">
                                  {[rsvp.guestPhone, rsvp.guestEmail].filter(Boolean).join(" • ")}
                                </p>
                              )}
                            </div>
                            {rsvp.attendanceStatus === "attending" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 size={10} /> Attending ({rsvp.guestCount})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-stone-100 text-stone-600 border border-stone-300 px-2.5 py-0.5 rounded-full shrink-0">
                                Declined
                              </span>
                            )}
                          </div>

                          {rsvp.attendingEvents && rsvp.attendingEvents.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono text-[#8C7E75] uppercase block mb-1">
                                Events Attending
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {rsvp.attendingEvents.map((evt: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-[10px] font-serif bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md"
                                  >
                                    {evt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {rsvp.dietaryNotes && (
                            <p className="text-xs text-[#6B5E57] bg-stone-50 p-2 rounded-xl border border-stone-100">
                              <strong className="text-[#211715]">Dietary:</strong> {rsvp.dietaryNotes}
                            </p>
                          )}

                          {rsvp.personalBlessing && (
                            <p className="text-xs font-serif italic text-[#211715] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE7DE]">
                              &ldquo;{rsvp.personalBlessing}&rdquo;
                            </p>
                          )}

                          <div className="text-[10px] font-mono text-[#8C7E75] text-right">
                            Submitted: {new Date(rsvp.submittedAt || rsvp.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Guest RSVP Table (>=768px) */}
                    <div className="hidden md:block overflow-x-auto">
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

            {/* ========================================================================= */}
            {/* TAB: ACCOUNT & SECURITY */}
            {/* ========================================================================= */}
            {activeTab === "account" && (
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
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
                          WhatsApp / Mobile Number
                        </label>
                        <input
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="+91..."
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EFE7DE] text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A36A]/50 focus:border-[#C5A36A]"
                        />
                      </div>
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
                        className="px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#211715] hover:bg-black text-white shadow-md transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        {profileUpdating ? <Loader2 size={13} className="animate-spin" /> : null}
                        <span>Save Profile</span>
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
                        className="px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#211715] hover:bg-black text-white shadow-md transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
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

            {/* ========================================================================= */}
            {/* TAB: SUPPORT & CONCIERGE */}
            {/* ========================================================================= */}
            {activeTab === "support" && (
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
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
                      href="mailto:support@expertomemories.shop"
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
                        You can purchase your own romantic domain name from GoDaddy or Namecheap and connect it to your website. Point your registrar&rsquo;s <strong>CNAME</strong> record to <code>cname.expertomemories.shop</code>, and our system automatically provisions an SSL certificate.
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
                <p>3. Destination / Target: <strong>cname.expertomemories.shop</strong></p>
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
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-medium bg-[#F4EFEB] hover:bg-[#EADBCE] text-[#211715] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={domainUpdating}
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-bold bg-[#1E40AF] hover:bg-[#1E3A8A] text-white shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-medium bg-[#F4EFEB] hover:bg-[#EADBCE] text-[#211715] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="flex-1 py-2.5 rounded-full text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
                className="w-full py-2.5 rounded-full text-xs font-serif font-bold bg-[#9C2D41] hover:bg-[#802234] text-white shadow-md transition-all cursor-pointer"
              >
                {copiedSlug === qrModalProject.slug ? "Copied Link ✓" : "Copy Live Link"}
              </button>
              <button
                type="button"
                onClick={() => setQrModalProject(null)}
                className="w-full py-2 rounded-full text-xs font-serif text-[#8C7E75] hover:text-[#211715] transition-colors cursor-pointer"
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

export default function CustomerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#8C7E75]">
          <Loader2 size={36} className="animate-spin text-[#D94B70]" />
        </div>
      }
    >
      <CustomerDashboardContent />
    </Suspense>
  );
}
