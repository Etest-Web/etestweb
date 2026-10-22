import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Glypha account password.",
  robots: "noindex, nofollow",
};

export default function PasswordResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
