import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designers",
  description:
    "Browse certified designers on Glypha. Filter by craft, budget, deadline and seller level. Every card carries a real starting price.",
  robots: "index, follow",
  alternates: {
    canonical: "/designers",
  },
  openGraph: {
    title: "Designers | Glypha",
    description:
      "Browse certified designers on Glypha. Filter by craft, budget, deadline and seller level. Every card carries a real starting price.",
    images: ["/Logo.svg"],
    type: "website",
    url: "/designers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Designers | Glypha",
    description:
      "Browse certified designers on Glypha. Filter by craft, budget, deadline and seller level. Every card carries a real starting price.",
    images: ["/Logo.svg"],
  },
};

export default function DesignersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
