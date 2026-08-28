"use client";

import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  Users,
  Settings,
  UserCircle,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const clientNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Briefcase, label: "Post a Job", href: "/dashboard/jobs/post" },
  { icon: FileText, label: "My Jobs", href: "/dashboard/jobs" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: "messages" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications", badge: "notifications" },
  { icon: Users, label: "Contracts", href: "/dashboard/contracts" },
  { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const designerNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Briefcase, label: "Browse Jobs", href: "/dashboard/jobs/browse" },
  { icon: FileText, label: "My Proposals", href: "/dashboard/proposals" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: "messages" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications", badge: "notifications" },
  { icon: Users, label: "Contracts", href: "/dashboard/contracts" },
  { icon: Users, label: "Find Designers", href: "/designers" },
  { icon: UserCircle, label: "Profile & Portfolio", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getCurrentUser);
  const unreadCount = useQuery(api.messages.getUnreadCount);
  const notifCount = useQuery(api.notifications.getUnreadCount);

  const badgeCount = (key?: string): number | undefined =>
    key === "messages"
      ? unreadCount
      : key === "notifications"
      ? notifCount
      : undefined;

  const navItems =
    currentUser?.role === "client"
      ? clientNavItems
      : currentUser?.role === "designer"
      ? designerNavItems
      : null;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3" onClick={onNavigate}>
          <Image
            src="/Etest-white.png"
            alt="Etest"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {clerkUser ? (
            <div className="relative flex-shrink-0">
              {clerkUser.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- external Clerk CDN domain
                <img
                  src={clerkUser.imageUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {(clerkUser.firstName ?? clerkUser.username ?? "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/[0.07] animate-pulse flex-shrink-0" aria-hidden />
          )}
          <div className="flex-1 min-w-0">
            {clerkUser ? (
              <>
                <p className="text-sm font-semibold text-white truncate">
                  {clerkUser.fullName ?? clerkUser.firstName ?? "Account"}
                </p>
                <p className="text-xs text-white/60 capitalize truncate">
                  {currentUser === undefined
                    ? "…"
                    : (currentUser?.role ?? "member")}
                </p>
              </>
            ) : (
              <div className="space-y-2 py-1" aria-hidden>
                <div className="h-3 w-20 rounded bg-white/[0.07] animate-pulse" />
                <div className="h-2 w-12 rounded bg-white/[0.07] animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {!navItems
          ? [0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                aria-hidden
                className="mx-1 my-2 h-9 rounded-lg bg-white/[0.05] animate-pulse"
              />
            ))
          : navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const count = badgeCount(item.badge);
              const showBadge = item.badge && count !== undefined && count > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {showBadge && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-black text-xs font-bold min-w-5 text-center">
                      {count! > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              );
            })}
      </nav>

      {/* Sign Out */}
      {clerkUser && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              onNavigate?.();
              void signOut();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full bg-[#1a1610] border-r border-white/10">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="p-2 rounded-lg bg-[#1a1610] border border-white/10 text-white transition-colors hover:border-white/20"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#1a1610] animate-in slide-in-from-left duration-200">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
