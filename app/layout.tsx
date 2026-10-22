import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Fraunces, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmProvider } from "@/components/ui/confirm";
import { ThemeProvider } from "@/components/ui/theme-provider";

/* Editorial pairing: Fraunces carries every display setting (variable
   optical size + WONK axis, so the headlines read as drawn rather than
   typeset); Plus Jakarta Sans handles all interface copy. Geist Mono is
   retained for numeric/technical surfaces. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Glypha, Premium Design Freelancing Platform",
    template: "%s | Glypha",
  },
  description:
    "A curated marketplace of certified designers. Browse the work, pick a defined tier, pay on delivery.",
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Glypha",
    title: "Glypha, Premium Design Freelancing Platform",
    description:
      "A curated marketplace of certified designers. Browse the work, pick a defined tier, pay on delivery.",
    images: [
      {
        url: "/Logo.svg",
        width: 800,
        height: 600,
        alt: "Glypha logo",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glypha, Premium Design Freelancing Platform",
    description:
      "A curated marketplace of certified designers. Browse the work, pick a defined tier, pay on delivery.",
    images: ["/Logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* suppressHydrationWarning: next-themes sets .dark on <html> before
          paint; the class is written before React hydrates. */}
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="google-site-verification" content="wFwCJGycYcPHfP8xZ3zVFS9bCobqpYTcgpJH4tS2Q_s" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="alternate" type="text/plain" href="/llms.txt" title="AI Crawler Access" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Glypha",
                description:
                  "A curated marketplace of certified designers. Browse the work, pick a defined tier, pay on delivery.",
                url: "http://localhost:3000",
                logo: "http://localhost:3000/Logo.svg",
                foundingDate: "2024",
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                },
                sameAs: [
                  "https://dribbble.com",
                  "https://linkedin.com",
                  "https://twitter.com",
                ],
              }),
            }}
          />
        </head>
        <body
          className={`${fraunces.variable} ${jakarta.variable} ${geistMono.variable} font-sans antialiased`}
        >
          {/* Film grain. Fixed and pointer-events-none so it never sits in
              the scroll path — see the grain-layer utility in globals.css. */}
          <div className="grain-layer" aria-hidden />

          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ToastProvider>
                <ConfirmProvider>
                  <ConditionalLayout>{children}</ConditionalLayout>
                </ConfirmProvider>
              </ToastProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
