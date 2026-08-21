"use client";

import Link from "next/link";
import Image from "next/image"
import { CircleUser, Mail, User, Lock, Folder, MoveLeft} from "lucide-react";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Navbar Component */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-border px-6 md:px-10 py-2 lg:mx-auto lg:w-full lg:max-w-[1200px]">
            <Link href="/" className="flex items-center gap-3 text-primary">
              <div className="size-8 flex items-center h-full w-full justify-center">
                <Image src="/Etest-white.png" alt="Ettest" width={100} height={100} className="w-full h-max "/>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <a className="text-white hover:text-primary transition-colors text-sm font-medium" href="#">Support</a>
              <Link
                href="/signin"
                 className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all"
              >
                <span className="truncate">Login</span>
              </Link>
            </div>
          </header>
          {/* Main Content: Focused Card */}
          <main className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[480px] bg-white dark:bg-[#2b2513] rounded-xl shadow-2xl border border-neutral-border p-8 md:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CircleUser />
                </div>
                <h1 className="text-white tracking-tight text-3xl font-bold leading-tight mb-3 font-display">Create an Account</h1>
                <p className="text-white/70 text-base font-normal leading-relaxed">
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
                      formButtonPrimary: "bg-primary text-black hover:bg-primary/90",
                      card: "bg-transparent shadow-none w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-white/10 bg-white/5 hover:bg-white/10 text-white",
                      formFieldInput: "bg-white/5 border-white/10 text-white",
                      formFieldLabel: "text-white/80",
                      dividerText: "text-white/40",
                      dividerLine: "bg-white/10",
                      footer: "hidden",
                    }
                  }}
                />
              </div>
              <div className="mt-8 flex flex-col gap-4 items-center">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-bold"
                >
                  <MoveLeft className="w-4 h-4 text-sm"/>
                  Back to Login
                </Link>
              </div>
            </div>
          </main>
          {/* Footer Section */}
          <footer className="px-6 py-8 text-center">
            <p className="text-white/40 text-sm">
              © 2024 EliteDesign Studio. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
      {/* Background Decorative Element */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/40 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
