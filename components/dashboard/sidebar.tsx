"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Users,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const clientNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Briefcase, label: "Post a Job", href: "/dashboard/jobs/post" },
  { icon: FileText, label: "My Jobs", href: "/dashboard/jobs" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Users, label: "Contracts", href: "/dashboard/contracts" },
  { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const designerNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Briefcase, label: "Browse Jobs", href: "/dashboard/jobs/browse" },
  { icon: FileText, label: "My Proposals", href: "/dashboard/proposals" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Users, label: "Contracts", href: "/dashboard/contracts" },
  { icon: Users, label: "Find Designers", href: "/designers" },
  { icon: UserCircle, label: "Profile & Portfolio", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useUser();
  const pathname = usePathname();

  const navItems = user?.isSignedIn === true ? clientNavItems : designerNavItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
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
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.user?.firstName ?? "User"}
            </p>
            <p className="text-xs text-white/60 capitalize">{user?.user?.firstName ?? "User"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      {/* <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div> */}
    </div>
  );

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
          className="p-2 rounded-lg bg-[#1a1610] border border-white/10 text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#1a1610]">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
