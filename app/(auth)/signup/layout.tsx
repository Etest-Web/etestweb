import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an account on Glypha to hire certified designers or offer your design services.",
  robots: "noindex, nofollow",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
