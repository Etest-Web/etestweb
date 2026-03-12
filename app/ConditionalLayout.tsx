"use client";

import { usePathname } from "next/navigation";
import NavMenu from "@/components/reusable/NavMenu";
import Footer from "@/components/reusable/Footer";

const AUTH_PATHS = ["/signin", "/signup", "/passwordreset"];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname === path || pathname?.startsWith(`${path}/`));

  return (
    <>
      {!isAuthPage && <NavMenu />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
