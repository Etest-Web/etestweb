"use client";

import Link from "next/link";
import { CircleUser, Mail, User, Lock, Folder, MoveLeft} from "lucide-react";
import { SignUp } from "@clerk/nextjs";

import { Logo } from "@/components/ui/logo";

export default function SignupPage() {
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
              <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="#">Support</a>
              <Link
                href="/signin"
                className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-primary-foreground transition-colors hover:bg-primary/80"
              >
                <span className="truncate">Login</span>
              </Link>
            </div>
          </header>
          {/* Main Content: Focused Card */}
          <main className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[480px] rounded-lg border border-border bg-card p-8 text-card-foreground shadow-lg md:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CircleUser />
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground mb-3 font-display">Create an Account</h1>
                <p className="text-base font-normal leading-relaxed text-muted-foreground">
                  Join the exclusive network of top-tier designers.
                </p>
              </div>
              <div className="flex w-full justify-center">
                <SignUp
                  routing="hash"
                  fallbackRedirectUrl="/"
                  signInFallbackRedirectUrl="/signin"
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-primary text-primary-foreground hover:bg-primary/80",
                      card: "bg-transparent shadow-none w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "border-border bg-secondary text-secondary-foreground hover:bg-accent",
                      formFieldInput: "bg-card border-input text-foreground",
                      formFieldLabel: "text-foreground",
                      dividerText: "text-muted-foreground",
                      dividerLine: "bg-border",
                      footer: "hidden",
                    }
                  }}
                />
              </div>
              <div className="mt-8 flex flex-col gap-4 items-center">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-sm font-bold text-brand-ink transition-colors hover:text-brand dark:text-brand"
                >
                  <MoveLeft className="w-4 h-4 text-sm"/>
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
