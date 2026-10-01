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

import { Logo } from "@/components/ui/logo";

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
      <div className="border-b border-sidebar-border p-6">
        <Link href="/" className="flex items-center" onClick={onNavigate}>
          <Logo plate className="w-32" />
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          {clerkUser ? (
            <div className="relative flex-shrink-0">
              {clerkUser.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- external Clerk CDN domain
                <img
                  src={clerkUser.imageUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-sm font-bold text-primary">
                    {(clerkUser.firstName ?? clerkUser.username ?? "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-muted"
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">
            {clerkUser ? (
              <>
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {clerkUser.fullName ?? clerkUser.firstName ?? "Account"}
                </p>
                <p className="truncate text-xs capitalize text-muted-foreground">
                  {currentUser === undefined
                    ? "…"
                    : (currentUser?.role ?? "member")}
                </p>
              </>
            ) : (
              <div className="space-y-2 py-1" aria-hidden>
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-2 w-12 animate-pulse rounded bg-muted" />
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
                className="mx-1 my-2 h-9 animate-pulse rounded-md bg-muted"
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
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {showBadge && (
                    <span className="min-w-5 rounded-full bg-primary px-2 py-0.5 text-center text-xs font-bold text-primary-foreground">
                      {count! > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              );
            })}
      </nav>

      {/* Sign Out */}
      {clerkUser && (
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={() => {
              onNavigate?.();
              void signOut();
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
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
      <div className="hidden h-full border-r border-sidebar-border bg-sidebar md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="rounded-md border border-border bg-sidebar p-2 text-sidebar-foreground transition-colors hover:bg-accent"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 animate-in fade-in duration-200 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 animate-in slide-in-from-left duration-200 bg-sidebar">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
