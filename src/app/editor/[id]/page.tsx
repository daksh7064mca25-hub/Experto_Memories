"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Share2,
  Check,
  Globe,
  Lock,
  ChevronUp,
  ChevronDown,
  Plus,
  Save,
  Palette,
  ExternalLink,
  Sliders,
  Sparkles,
  QrCode,
  MessageCircle,
  Music,
  User,
  Layers,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { WebsiteProjectData, WebsiteSectionData, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";
import { ANNIVERSARY_THEMES, getThemeConfig } from "@/config/anniversary-themes";
import { LOVE_THEMES } from "@/config/love-themes";
import { ApologyRenderer } from "@/components/apology/ApologyRenderer";
import { AnniversaryRenderer } from "@/components/anniversary/AnniversaryRenderer";
import { BirthdayRenderer } from "@/components/birthday/BirthdayRenderer";
import { LoveRenderer } from "@/components/love/LoveRenderer";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import { SectionControls } from "@/components/studio/editor/SectionControls";
import { AnniversarySectionControls } from "@/components/studio/editor/AnniversarySectionControls";
import { BirthdaySectionControls } from "@/components/studio/editor/BirthdaySectionControls";
import { LoveSectionControls } from "@/components/studio/editor/LoveSectionControls";
import { WeddingSectionControls } from "@/components/studio/editor/WeddingSectionControls";
import { PublishPricingModal } from "@/components/commerce/PublishPricingModal";
import { MediaUploader } from "@/components/studio/editor/MediaUploader";

interface Props {
  params?: Promise<{ id: string }> | { id: string };
}

export default function CustomerVisualEditorPage({ params }: Props) {
  const router = useRouter();
  const routeParams = useParams();

  let idFromProps = "";
  if (params) {
    if (typeof (params as any).then === "function") {
      try {
        const resolved = use(params as Promise<{ id: string }>);
        if (resolved && resolved.id) idFromProps = resolved.id;
      } catch {}
    } else if (typeof params === "object" && (params as any).id) {
      idFromProps = (params as any).id;
    }
  }

  const id =
    idFromProps ||
    (typeof routeParams?.id === "string"
      ? routeParams.id
      : Array.isArray(routeParams?.id)
      ? routeParams.id[0]
      : "") ||
    "";

  const [project, setProject] = useState<WebsiteProjectData | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"mobile" | "desktop">("mobile");
  const [activeEditorTab, setActiveEditorTab] = useState<
    "sections" | "details" | "theme" | "music" | "privacy"
  >("sections");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<"preview" | "customize">("preview");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Protection against accidental navigation while changes are unsaved or saving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === "unsaved" || saveStatus === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveStatus]);

  // Fetch initial project
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`, { credentials: "include" });
        if (res.status === 401) {
          router.push(`/customer/login?redirect=/editor/${id}`);
          return;
        }
        const data = await res.json();
        if (data.project) {
          setProject(data.project);
        }
      } catch (err) {
        console.error("Failed to load project:", err);
      }
    };
    load();
  }, [id, router]);

  // Debounced autosave
  const triggerAutosave = (updatedProj: WebsiteProjectData) => {
    setSaveStatus("unsaved");
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/projects/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProj),
          credentials: "include",
        });

        if (res.ok) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    }, 1000);
  };

  const handleManualSave = async () => {
    if (!project) return;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
        credentials: "include",
      });

      if (res.ok) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const handleUpdateProject = (updates: Partial<WebsiteProjectData>) => {
    if (!project) return;
    const next = { ...project, ...updates };
    setProject(next);
    triggerAutosave(next);
  };

  const handleUpdateSection = (updatedSec: WebsiteSectionData) => {
    if (!project) return;
    const updatedSections = project.sections.map((s) =>
      s.id === updatedSec.id ? updatedSec : s
    );
    const next = { ...project, sections: updatedSections };
    setProject(next);
    triggerAutosave(next);
  };

  const handleUpdateSectionConfig = (sectionId: string, newConfig: Record<string, any>) => {
    if (!project) return;
    const updatedSections = project.sections.map((s) =>
      s.id === sectionId ? { ...s, config: { ...s.config, ...newConfig } } : s
    );
    const next = { ...project, sections: updatedSections };
    setProject(next);
    triggerAutosave(next);
  };

  const toggleSectionVisibility = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project) return;
    const updatedSections = project.sections.map((s) =>
      s.id === secId ? { ...s, enabled: !s.enabled } : s
    );
    const next = { ...project, sections: updatedSections };
    setProject(next);
    triggerAutosave(next);
  };

  const moveSection = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project) return;
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= project.sections.length) return;

    const reordered = [...project.sections];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    // Reassign order indices
    const updated = reordered.map((sec, i) => ({ ...sec, order: i }));
    const next = { ...project, sections: updated };
    setProject(next);
    triggerAutosave(next);
  };

  const duplicateSection = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project) return;
    const target = project.sections.find((s) => s.id === secId);
    if (!target) return;

    const cloned: WebsiteSectionData = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sec-${Date.now()}`,
      title: `${target.title} (Copy)`,
      order: project.sections.length,
    };

    const next = { ...project, sections: [...project.sections, cloned] };
    setProject(next);
    triggerAutosave(next);
  };

  const deleteSection = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project) return;
    if (project.sections.length <= 1) {
      alert("At least one section must remain in your gift website.");
      return;
    }
    const updated = project.sections.filter((s) => s.id !== secId);
    const next = { ...project, sections: updated };
    if (selectedSectionId === secId) {
      setSelectedSectionId(null);
    }
    setProject(next);
    triggerAutosave(next);
  };

  const handleTogglePublish = async () => {
    if (!project) return;

    // If unpaid, trigger payment/publishing modal
    if (project.paymentStatus !== "paid") {
      setIsPricingModalOpen(true);
      return;
    }

    try {
      const action = project.status === "published" ? "unpublish" : "publish";
      const res = await fetch(`/api/projects/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
        credentials: "include",
      });

      if (res.status === 402) {
        setIsPricingModalOpen(true);
        return;
      }

      const data = await res.json();
      if (data.project) {
        setProject(data.project);
      }
    } catch (err) {
      console.error("Publish toggle failed:", err);
    }
  };

  const getPublicShareUrl = () => {
    if (!project) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/gift/${project.slug}`;
  };

  const copyPublicUrl = () => {
    const url = getPublicShareUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const shareOnWhatsApp = () => {
    const url = getPublicShareUrl();
    if (!url || !project) return;
    const recipient = project.recipientName || "My Love";
    const text = `Hey ${recipient}! ❤️ I created a special interactive gift website just for you. Open this on your phone: ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/40 text-rose-500 font-serif">
        Loading Visual Studio Editor...
      </div>
    );
  }

  const selectedSection =
    project.sections.find((s) => s.id === selectedSectionId) || null;

  return (
    <div className="h-screen w-full flex flex-col bg-stone-100 overflow-hidden font-sans select-none">
      {/* 1. TOP BAR */}
      <header className="h-16 bg-white border-b border-stone-200 px-2 sm:px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Return to Customer Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-serif font-bold text-xs sm:text-base text-stone-900 truncate max-w-[100px] sm:max-w-xs">
                {project.recipientName}
              </h1>

              {/* Status Pill */}
              <button
                type="button"
                onClick={handleTogglePublish}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide uppercase transition-all shrink-0 ${
                  project.status === "published"
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                {project.status === "published" ? <Globe size={10} /> : <Lock size={10} />}
                <span className="hidden xs:inline">{project.status === "published" ? "Live" : "Draft"}</span>
              </button>
            </div>
            <p className="text-[10px] text-stone-500 font-mono truncate max-w-[140px] sm:max-w-[200px] hidden xs:block">
              /gift/{project.slug}
            </p>
          </div>
        </div>

        {/* Viewport Switcher (Center on Desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80">
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium transition-all ${
              viewport === "mobile"
                ? "bg-white text-rose-600 shadow-sm font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone size={15} />
            <span>Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium transition-all ${
              viewport === "desktop"
                ? "bg-white text-rose-600 shadow-sm font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
            title="Desktop View (Full Width)"
          >
            <Monitor size={15} />
            <span>Desktop</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Manual Save Button */}
          <button
            type="button"
            onClick={handleManualSave}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-serif font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 min-h-[38px]"
            title="Save changes immediately"
          >
            <Save size={13} className={saveStatus === "saving" ? "animate-spin text-amber-500" : "text-stone-500"} />
            <span className="hidden sm:inline">
              {saveStatus === "saving" ? "Saving..." : saveStatus === "unsaved" ? "Save Now" : "Saved"}
            </span>
          </button>

          {/* Autosave Status */}
          <div className="text-[11px] font-mono text-stone-500 hidden md:block">
            {saveStatus === "saving" && <span className="text-amber-600 animate-pulse">Saving...</span>}
            {saveStatus === "saved" && <span className="text-emerald-600">Saved ✓</span>}
            {saveStatus === "unsaved" && <span className="text-stone-400">Unsaved</span>}
            {saveStatus === "error" && <span className="text-rose-600">Save Failed</span>}
          </div>

          {/* WhatsApp Share & QR (if published) */}
          {project.status === "published" && (
            <>
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-serif font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all"
                title="Share on WhatsApp"
              >
                <MessageCircle size={13} />
                <span className="hidden md:inline">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                title="View Gift QR Code"
              >
                <QrCode size={16} />
              </button>

              {/* Copy Public Link (Strictly when published) */}
              <button
                type="button"
                onClick={copyPublicUrl}
                className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                title="Copy Public Web Link"
              >
                {copiedUrl ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            </>
          )}

          {/* External Preview Link */}
          <a
            href={`/gift/${project.slug}?preview=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-serif font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all"
          >
            <span>Preview</span>
            <ExternalLink size={12} />
          </a>

          {/* Publish CTA */}
          <button
            type="button"
            onClick={handleTogglePublish}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-serif font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ${
              project.status === "published"
                ? "bg-stone-800 hover:bg-stone-900 text-white"
                : project.paymentStatus === "paid"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-rose-500 hover:bg-rose-600 text-white hover:scale-105"
            }`}
          >
            {project.status === "published" ? (
              <>
                <Globe size={12} />
                <span>Live</span>
              </>
            ) : project.paymentStatus === "paid" ? (
              <>
                <Sparkles size={12} />
                <span>Publish</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>Publish &amp; Pay</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile & Small Screen Segmented Switcher (<1024px) */}
      <div className="lg:hidden h-12 bg-white border-b border-stone-200 px-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex w-full p-1 bg-stone-100 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setMobileViewMode("preview")}
            className={`flex-1 py-1.5 rounded-lg font-serif font-semibold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[36px] ${
              mobileViewMode === "preview"
                ? "bg-white text-rose-600 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Eye size={14} />
            <span>Preview Gift</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileViewMode("customize")}
            className={`flex-1 py-1.5 rounded-lg font-serif font-semibold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[36px] ${
              mobileViewMode === "customize"
                ? "bg-white text-rose-600 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sliders size={14} />
            <span>Customize Story</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN BODY (SPLIT VIEW) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR: WORKSPACE TABS */}
        <aside
          className={`w-80 bg-white border-r border-stone-200 flex flex-col shrink-0 z-20 transition-all duration-300 ${
            mobileViewMode === "customize" && !selectedSectionId
              ? "absolute inset-0 w-full z-20 flex"
              : "hidden lg:flex"
          }`}
        >
          {/* Top Quick-Switch Tabs */}
          <div className="p-2 border-b border-stone-200 bg-stone-50/70 flex items-center justify-around gap-1 text-[11px] font-serif">
            <button
              type="button"
              onClick={() => setActiveEditorTab("sections")}
              className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeEditorTab === "sections"
                  ? "bg-white text-rose-600 shadow-xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Storyline & Sections"
            >
              <Layers size={14} />
              <span className="text-[10px]">Sections</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("details")}
              className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeEditorTab === "details"
                  ? "bg-white text-rose-600 shadow-xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Names & Details"
            >
              <User size={14} />
              <span className="text-[10px]">Names</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("theme")}
              className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeEditorTab === "theme"
                  ? "bg-white text-rose-600 shadow-xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Theme & Colors"
            >
              <Palette size={14} />
              <span className="text-[10px]">Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("music")}
              className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeEditorTab === "music"
                  ? "bg-white text-rose-600 shadow-xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Music & Audio"
            >
              <Music size={14} />
              <span className="text-[10px]">Music</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("privacy")}
              className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeEditorTab === "privacy"
                  ? "bg-white text-rose-600 shadow-xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Password & Gate"
            >
              <Lock size={14} />
              <span className="text-[10px]">Privacy</span>
            </button>
          </div>

          {/* TAB 1: SECTIONS LIST */}
          {activeEditorTab === "sections" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-stone-100 flex items-center justify-between">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-600">
                  Sections &amp; Storyline
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {project.sections.length} total
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {project.sections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      data-section-id={sec.id}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        if (window.innerWidth < 1024) setMobileViewMode("customize");
                      }}
                      className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-rose-50/80 border-rose-300 shadow-sm"
                          : "bg-white border-stone-200/70 hover:border-stone-300 hover:bg-stone-50/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                            isSelected
                              ? "bg-rose-500 text-white font-bold"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="truncate">
                          <p
                            className={`text-xs truncate font-serif ${
                              isSelected ? "font-bold text-rose-950" : "font-medium text-stone-800"
                            }`}
                          >
                            {sec.title}
                          </p>
                          <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                            {sec.type}
                          </p>
                        </div>
                      </div>

                      {/* Quick Action Icons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => moveSection(idx, "up", e)}
                          disabled={idx === 0}
                          className="p-1 hover:text-stone-900 disabled:opacity-20 text-stone-400"
                          title="Move Up"
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => moveSection(idx, "down", e)}
                          disabled={idx === project.sections.length - 1}
                          className="p-1 hover:text-stone-900 disabled:opacity-20 text-stone-400"
                          title="Move Down"
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleSectionVisibility(sec.id, e)}
                          className={`p-1 hover:text-stone-900 ${
                            sec.enabled ? "text-stone-400" : "text-rose-400"
                          }`}
                          title={sec.enabled ? "Hide from Website" : "Show on Website"}
                        >
                          {sec.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-stone-100 bg-stone-50/50">
                <p className="text-[10px] text-stone-400 text-center font-serif">
                  Click any section to customize text, photos, and secrets.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: NAMES & DETAILS */}
          {activeEditorTab === "details" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              <h3 className="font-serif font-bold text-sm text-stone-900 mb-1">
                Recipient &amp; Story Details
              </h3>
              <p className="text-[11px] text-stone-500 mb-3">
                Configure who this gift is created for and their personalized titles.
              </p>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Gift Recipient Name</label>
                <input
                  type="text"
                  value={project.recipientName}
                  onChange={(e) => handleUpdateProject({ recipientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Sender Name (Your Name)</label>
                <input
                  type="text"
                  value={project.senderName}
                  onChange={(e) => handleUpdateProject({ senderName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Website Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleUpdateProject({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Website Link Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono text-stone-400">/gift/</span>
                  <input
                    type="text"
                    value={project.slug}
                    onChange={(e) =>
                      handleUpdateProject({
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {project.occasionType === "birthday" && (
                <>
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-stone-700 font-semibold mb-1">Birthday Date</label>
                    <input
                      type="text"
                      placeholder="e.g. November 25th or Today"
                      value={project.birthdayDate || ""}
                      onChange={(e) => handleUpdateProject({ birthdayDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Age Milestone (Years)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 25"
                      value={project.age || ""}
                      onChange={(e) => handleUpdateProject({ age: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              {(project.occasionType === "anniversary" ||
                project.occasionType === "love") && (
                <>
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-stone-700 font-semibold mb-1">Special Date (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. October 14th"
                      value={project.anniversaryDate || ""}
                      onChange={(e) => handleUpdateProject({ anniversaryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Years Celebrated</label>
                    <input
                      type="number"
                      min="0"
                      value={project.yearsTogether ?? 1}
                      onChange={(e) => handleUpdateProject({ yearsTogether: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: THEME & COLOR PALETTE */}
          {activeEditorTab === "theme" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 mb-1">
                  Color Palette &amp; Mood
                </h3>
                <p className="text-[11px] text-stone-500 mb-4">
                  Tap any colorway to instantly re-theme your entire website live.
                </p>
              </div>

              <div className="space-y-2.5">
                {(project.occasionType === "wedding"
                  ? [
                      { id: "royal-crimson", name: "Royal Crimson & Gold 👑", color: "#7a1c2d", desc: "Palatial deep maroon with metallic gold foil" },
                      { id: "marigold-sindoor", name: "Marigold & Sindoor 🌼", color: "#d97706", desc: "Vibrant auspicious saffron and vermilion" },
                      { id: "shahi-emerald", name: "Shahi Emerald 💎", color: "#065f46", desc: "Regal jewel emerald with antique gold filigree" },
                      { id: "golden-anand", name: "Golden Sunrise ☀️", color: "#b45309", desc: "Warm royal amber and luminous ivory" },
                      { id: "cathedral-rose", name: "Cathedral Rose 🌹", color: "#e11d48", desc: "Delicate blush pink & poetic romantic warmth" },
                      { id: "minimal-linen", name: "Modern Minimal Linen 🕊️", color: "#78716c", desc: "Architectural gatefold, taupe & crisp linen" },
                      { id: "botanical-sage", name: "Botanical Sage 🌿", color: "#059669", desc: "Wildflower blooms, watercolor petals & eucalyptus" },
                      { id: "coastal-azure", name: "Coastal Azure 🌊", color: "#0284c7", desc: "Tropical coastal sunsets & sea salt ivory" },
                    ]
                  : project.occasionType === "birthday"
                  ? [
                      { id: "golden-champagne", name: "Golden Champagne 🥂", color: "#f59e0b", desc: "Warm champagne, ivory silk & candles" },
                      { id: "blush-wonderland", name: "Blush Wonderland 🎀", color: "#ec4899", desc: "Delicate blush pink & party glitter" },
                      { id: "peachy-celebration", name: "Peachy Celebration 🍑", color: "#f97316", desc: "Sweet apricot, coral & warm joy" },
                      { id: "midnight-sparkle", name: "Midnight Sparkle 🎆", color: "#3b0764", desc: "Velvet midnight sky & neon gold sparks" },
                    ]
                  : project.occasionType === "love"
                  ? [
                      { id: "burgundy-velvet", name: "Burgundy Velvet 🍷", color: "#722f37", desc: "Deep royal wine, velvet romance & warm gold" },
                      { id: "rose-blush", name: "Rose Blush 🌹", color: "#f43f5e", desc: "Delicate blush pink & poetic romantic warmth" },
                      { id: "midnight-starlight", name: "Midnight Starlight ✨", color: "#111326", desc: "Obsidian night sky & glowing constellations" },
                      { id: "champagne-romance", name: "Champagne Romance 🥂", color: "#d97706", desc: "Timeless ivory elegance & bespoke luxury" },
                    ]
                  : project.occasionType === "anniversary"
                  ? [
                      { id: "pink-paradise", name: "Pink Paradise 🎀", color: "#ec4899", desc: "Soft romantic pinks & blushes" },
                      { id: "golden-forever", name: "Golden Forever ✨", color: "#f59e0b", desc: "Warm champagne & golden accents" },
                      { id: "our-universe", name: "Our Universe 🌌", color: "#4f46e5", desc: "Deep starlight midnight tones" },
                      { id: "sunset-love", name: "Sunset Love 🌅", color: "#f97316", desc: "Warm coral & golden hour hues" },
                    ]
                  : [
                      { id: "cotton-candy", name: "Cotton Candy", color: "#ffb6c1", desc: "Sweet pink & gentle marshmallow" },
                      { id: "lavender-dreams", name: "Lavender Dreams", color: "#e6e6fa", desc: "Calming lavender & soft purple" },
                      { id: "peachy-love", name: "Peachy Love", color: "#ffd1b3", desc: "Warm peach & apricot tones" },
                      { id: "midnight-hearts", name: "Midnight Hearts", color: "#2b1055", desc: "Moody velvet night & neon rose" },
                    ]
                ).map((t) => {
                  const isActive = project.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleUpdateProject({ theme: t.id as ThemeId })}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? "bg-rose-50/80 border-rose-400 shadow-xs"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full shadow-inner shrink-0"
                          style={{ backgroundColor: t.color }}
                        />
                        <div>
                          <p className={`font-serif font-bold text-xs ${isActive ? "text-rose-950" : "text-stone-900"}`}>
                            {t.name}
                          </p>
                          <p className="text-[10px] text-stone-400">{t.desc}</p>
                        </div>
                      </div>
                      {isActive && <Check size={16} className="text-rose-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MUSIC & SOUND */}
          {activeEditorTab === "music" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 mb-1">
                  Background Soundtrack
                </h3>
                <p className="text-[11px] text-stone-500 mb-4">
                  Add a tender acoustic melody that plays when your recipient views the website.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-serif font-semibold text-stone-800 block">Enable Background Audio</span>
                  <span className="text-[10px] text-stone-400">Visitor taps to play on mobile</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.audioSettings?.enabled ?? true}
                  onChange={(e) =>
                    handleUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Song Title</label>
                <input
                  type="text"
                  value={project.audioSettings?.title || ""}
                  onChange={(e) =>
                    handleUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Can't Help Falling in Love"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <MediaUploader
                  label="Upload Custom Song (MP3 / WAV)"
                  currentUrl={project.audioSettings?.backgroundMusicUrl || ""}
                  onUploadSuccess={(url) =>
                    handleUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        backgroundMusicUrl: url,
                        enabled: true,
                      },
                    })
                  }
                  accept="audio/*"
                  projectSlug={project.slug}
                  helpText="Upload an audio file (up to 25MB) or paste a link below"
                />
                <input
                  type="text"
                  value={project.audioSettings?.backgroundMusicUrl || ""}
                  onChange={(e) =>
                    handleUpdateProject({
                      audioSettings: {
                        ...project.audioSettings,
                        backgroundMusicUrl: e.target.value,
                      },
                    })
                  }
                  placeholder="Or paste audio URL https://.../song.mp3"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PRIVACY & PASSWORD */}
          {activeEditorTab === "privacy" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 mb-1">
                  Privacy &amp; Password Gate
                </h3>
                <p className="text-[11px] text-stone-500 mb-4">
                  Keep your personal letters and photos completely private with a secret passphrase.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-serif font-semibold text-stone-800 block">Password Protection</span>
                  <span className="text-[10px] text-stone-400">Visitors must enter passphrase</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.isPasswordProtected || false}
                  onChange={(e) =>
                    handleUpdateProject({
                      isPasswordProtected: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400"
                />
              </div>

              {project.isPasswordProtected && (
                <>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Secret Passphrase</label>
                    <input
                      type="password"
                      placeholder="Enter new secret password..."
                      onChange={(e) =>
                        handleUpdateProject({
                          password: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Leave blank if keeping previous password.
                    </span>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Password Hint</label>
                    <input
                      type="text"
                      value={project.passwordHint || ""}
                      onChange={(e) =>
                        handleUpdateProject({
                          passwordHint: e.target.value,
                        })
                      }
                      placeholder="e.g. The place we first had coffee"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-stone-100">
                <span className="font-serif font-semibold text-stone-800 block mb-1">Custom Web Domain</span>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
                  Connect your own romantic domain (e.g. <code>maya-and-daniel.love</code>) through the customer dashboard anytime.
                </p>
                {project.customDomain?.domainName ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200">
                    <Globe size={11} /> {project.customDomain.domainName} ({project.customDomain.status})
                  </span>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Configure in Dashboard &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* CENTER: LIVE WEBSITE PREVIEW */}
        <main
          className={`flex-1 bg-stone-100 overflow-y-auto flex items-start justify-center p-2 sm:p-6 lg:p-8 ${
            mobileViewMode === "customize" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div
            className={`transition-all duration-300 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative flex flex-col ${
              viewport === "mobile"
                ? "w-full max-w-[390px] min-h-[780px] is-mobile-preview"
                : "w-full min-h-[900px] max-w-5xl"
            }`}
          >
            {/* Mock Device Bezel (Mobile Viewport Only) */}
            {viewport === "mobile" && (
              <div className="h-6 bg-stone-900 flex items-center justify-center shrink-0">
                <div className="w-16 h-3 bg-stone-800 rounded-full" />
              </div>
            )}

            {/* Embedded Live Renderer with previewMode=true */}
            <div className="flex-1 w-full bg-[#FAF5F0] overflow-y-auto relative">
              {project.occasionType === "wedding" ? (
                <WeddingRenderer project={project} previewMode={true} />
              ) : project.occasionType === "birthday" ? (
                <BirthdayRenderer project={project} previewMode={true} />
              ) : project.occasionType === "love" ? (
                <LoveRenderer project={project} previewMode={true} />
              ) : project.occasionType === "anniversary" ? (
                <AnniversaryRenderer project={project} previewMode={true} />
              ) : (
                <ApologyRenderer project={project} previewMode={true} />
              )}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: SELECTED SECTION CONTROLS */}
        <aside
          className={`w-96 bg-white border-l border-stone-200 flex flex-col shrink-0 z-20 transition-all duration-300 ${
            mobileViewMode === "customize" && selectedSectionId
              ? "absolute inset-0 w-full z-20 flex"
              : "hidden lg:flex"
          }`}
        >
          {selectedSection ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(null)}
                    className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                    title="Back to Sections List"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      {selectedSection.title}
                    </h3>
                    <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                      Customize Section Settings
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSectionId(null)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-serif"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {project.occasionType === "wedding" ? (
                  <WeddingSectionControls
                    project={project}
                    selectedSection={selectedSection}
                    onUpdateProject={handleUpdateProject}
                    onUpdateSectionConfig={handleUpdateSectionConfig}
                  />
                ) : project.occasionType === "birthday" ? (
                  <BirthdaySectionControls
                    project={project}
                    selectedSection={selectedSection}
                    onUpdateProject={handleUpdateProject}
                    onUpdateSectionConfig={handleUpdateSectionConfig}
                  />
                ) : project.occasionType === "love" ? (
                  <LoveSectionControls
                    project={project}
                    selectedSection={selectedSection}
                    onUpdateProject={handleUpdateProject}
                    onUpdateSectionConfig={handleUpdateSectionConfig}
                  />
                ) : project.occasionType === "anniversary" ? (
                  <AnniversarySectionControls
                    project={project}
                    selectedSection={selectedSection}
                    onUpdateProject={handleUpdateProject}
                    onUpdateSectionConfig={handleUpdateSectionConfig}
                  />
                ) : (
                  <SectionControls
                    project={project}
                    selectedSection={selectedSection}
                    onUpdateProject={handleUpdateProject}
                    onUpdateSectionConfig={handleUpdateSectionConfig}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400 font-serif">
              <Sparkles size={28} className="text-rose-400 mb-3 animate-pulse" />
              <h4 className="font-bold text-stone-700 text-sm mb-1">Select A Section</h4>
              <p className="text-xs max-w-[200px] leading-relaxed">
                Click any section from the left sidebar to edit headings, personal notes, photos, and music.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* 3. PUBLISH & PRICING MODAL */}
      {isPricingModalOpen && (
        <PublishPricingModal
          isOpen={isPricingModalOpen}
          project={project}
          onClose={() => setIsPricingModalOpen(false)}
          onPaymentSuccess={(updatedProject) => {
            setProject(updatedProject);
            setIsPricingModalOpen(false);
          }}
        />
      )}

      {/* 4. QR CODE MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
              Gift Box QR Code 🎁
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Print this QR code or slide it into a card. When {project.recipientName} scans it, their special website opens instantly!
            </p>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center justify-center mx-auto mb-6 w-48 h-48">
              {/* Responsive SVG QR rendering */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  getPublicShareUrl()
                )}`}
                alt="Website QR Code"
                className="w-40 h-40 rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={copyPublicUrl}
                className="w-full py-2.5 rounded-full text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-all"
              >
                {copiedUrl ? "Copied Link ✓" : "Copy Web Link"}
              </button>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="w-full py-2 rounded-full text-xs font-serif text-stone-500 hover:text-stone-800 transition-colors"
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
