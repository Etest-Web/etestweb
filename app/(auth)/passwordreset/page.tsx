import Link from "next/link";
import { Lock, Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
        <div className="layout-container flex h-full grow flex-col">
          {/* Navbar Component */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border px-6 md:px-10 py-3 lg:mx-auto lg:w-full lg:max-w-[1200px]">
            <Link href="/" className="flex items-center">
              <Logo className="w-28" priority />
            </Link>
            <div className="flex items-center gap-4">
              <a
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                href="#"
              >
                Support
              </a>
              <Link
                href="/signin"
                className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-primary-foreground transition-colors hover:bg-primary/80"
              >
                <span className="truncate">Login</span>
              </Link>
            </div>
          </header>
          {/* Main Content: Focused Card */}
          <main className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="w-full max-w-[480px] rounded-lg border border-border bg-card p-8 text-card-foreground shadow-lg md:p-10">
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Lock className="h-8 w-8" />
                </div>
                <h1 className="mb-3 font-display text-3xl font-bold leading-tight tracking-tight text-foreground">
                  Reset your password
                </h1>
                <p className="text-base font-normal leading-relaxed text-muted-foreground">
                  No worries! Enter the email address associated with your
                  account and we&apos;ll send you a recovery link.
                </p>
              </div>
              <form className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium leading-normal text-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                  </label>
                  <Input
                    className="h-14"
                    placeholder="e.g. alex@glypha.com"
                    required
                    type="email"
                  />
                </div>
                <Button className="h-14 w-full text-lg" type="submit">
                  Send Recovery Link
                </Button>
              </form>
              <div className="mt-8 flex flex-col items-center gap-4">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-sm font-bold text-brand-ink transition-colors hover:text-brand dark:text-brand"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </main>
          {/* Footer Section */}
          <footer className="px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Glypha Studio. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
      {/* Background Decorative Element */}
      <div className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-primary/40 blur-[100px]"></div>
      </div>
    </div>
  );
}
