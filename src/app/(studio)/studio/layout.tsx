"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Globe,
  Palette,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Users,
  ScrollText,
  ExternalLink,
} from "lucide-react";

export default function AdminStudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Overview & KPIs", href: "/studio", icon: LayoutDashboard },
    { label: "Customer Orders", href: "/studio/orders", icon: ShoppingBag },
    { label: "Customer Accounts", href: "/studio/customers", icon: Users },
    { label: "Customer Websites", href: "/studio/websites", icon: Globe },
    { label: "Catalogue & Themes", href: "/studio/templates", icon: Palette },
    { label: "Media Storage", href: "/studio/media", icon: ImageIcon },
    { label: "Platform Settings", href: "/studio/settings", icon: Settings },
    { label: "Audit & Security Logs", href: "/studio/audit", icon: ScrollText },
  ];

  return (
    <div className="min-h-screen flex bg-stone-100 text-stone-900 font-sans antialiased">
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-stone-900 border-b border-stone-800 z-40 px-4 flex items-center justify-between text-white">
        <Link href="/studio" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
            <Shield size={16} />
          </div>
          <span className="font-serif font-bold text-base text-white">ExpertoMemories Admin</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-stone-300 hover:bg-stone-800"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-stone-900 text-stone-300 border-r border-stone-800 z-50 flex flex-col justify-between p-5 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Logo & Operator Tag */}
          <Link
            href="/studio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-2 py-3 mb-6"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-rose-950/40">
              <Shield size={18} />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight text-white block leading-tight">
                ExpertoMemories
              </span>
              <span className="text-[9px] font-mono tracking-widest text-rose-400 font-bold uppercase">
                OPERATIONS DASHBOARD
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/studio"
                  ? pathname === "/studio"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans text-xs font-medium transition-all ${
                    isActive
                      ? "bg-rose-600 text-white font-bold shadow-sm"
                      : "text-stone-400 hover:text-white hover:bg-stone-800/80"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/60 text-xs font-sans transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} />
              <span>Public Storefront</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-sans font-medium transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pt-16 lg:pt-0">
        <main className="p-5 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
