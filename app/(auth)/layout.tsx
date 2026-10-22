import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Glypha",
  description: "Authenticate to your Glypha account.",
  robots: "noindex, nofollow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}