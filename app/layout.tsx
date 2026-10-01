import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import {
  Geist,
  Geist_Mono,
  Roboto,
  Montserrat,
  Outfit,
  Bebas_Neue,
} from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmProvider } from "@/components/ui/confirm";
import { ThemeProvider } from "@/components/ui/theme-provider";

const montser = Montserrat({
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})

const roboto = Roboto({
  variable: "--font-roboto",
  subsets:["latin"]
})

/* Display faces carried over from etestlearn. --font-outfit is the app
   sans (wired to --font-sans in globals.css) and --font-bebas-neue backs
   the `font-display` utility. */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glypha - Premium Design Freelancing Platform",
  description: "Bridge the gap between physical branding and digital innovations",
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
        <body
          className={`${geistSans.variable} ${montser.variable} ${roboto.variable} ${geistMono.variable} ${outfit.variable} ${bebasNeue.variable} font-outfit antialiased`}
        >
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
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
