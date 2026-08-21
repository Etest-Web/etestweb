"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import NavMenu from "@/components/reusable/NavMenu";
import Footer from "@/components/reusable/Footer";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/passwordreset");
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && !isDashboardPage && <NavMenu />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
}
