import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Geist, Geist_Mono, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmProvider } from "@/components/ui/confirm";

const montser = Montserrat({
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})

const roboto = Roboto({
  variable: "--font-roboto",
  subsets:["latin"]
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Etest - Premium Design Freelancing Platform",
  description: "Bridge the gap between physical branding and digital innovations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${montser.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <ToastProvider>
              <ConfirmProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </ConfirmProvider>
            </ToastProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
