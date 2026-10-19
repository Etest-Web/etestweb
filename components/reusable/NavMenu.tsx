"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { ArrowUpRight } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { ModeToggle } from "@/components/ui/mode-toggle";

const navLinks = [
  { name: "Find Talent", href: "/designers" },
  { name: "How It Works", href: "#process" },
  { name: "Glypha Learn", href: "https://learn.glypha.com.ng" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  // The overlay is modal: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* ── The island ──────────────────────────────────────────────
          Detached from the top edge, pill-shaped, glass. Never an
          edge-to-edge bar. */}
      <header className="fixed inset-x-0 top-5 z-40 px-4">
        <div className="shell mx-auto w-full max-w-6xl !p-1">
          <div className="shell__core flex items-center justify-between gap-4 px-4 py-2.5 md:px-5">
            <Link href="/" className="flex shrink-0 items-center">
              <Logo className="w-24 md:w-28" priority />
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink/[0.05] hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <ModeToggle />
              </div>

              <Show when="signed-out">
                <div className="hidden items-center gap-2 md:flex">
                  <SignInButton>
                    <button className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn-primary !px-5 !py-2 !text-sm">
                      Join free
                    </button>
                  </SignUpButton>
                </div>
              </Show>

              <Show when="signed-in">
                <div className="hidden md:block">
                  <UserButton />
                </div>
              </Show>

              {/* Hamburger → X morph. Two hairlines pivot around the
                  centre of the 12px box to form a true cross. */}
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink/[0.05] md:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 top-[6px] block h-px w-full bg-current transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      open ? "translate-y-0 rotate-45" : "-translate-y-[3px]"
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[6px] block h-px w-full bg-current transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      open ? "rotate-[-45deg]" : "translate-y-[3px]"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Modal expansion ───────────────────────────────────────
          Fixed + backdrop-blur is the one place a blur filter is
          allowed to be expensive. */}
      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-background/85 backdrop-blur-3xl md:hidden">
          <div className="shell mx-4 mt-5 !p-1">
            <div className="shell__core flex items-center justify-between px-4 py-2.5">
              <Logo plate className="w-24" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground"
              >
                <span className="relative block h-3 w-4">
                  <span className="absolute left-0 top-[6px] block h-px w-full rotate-45 bg-current" />
                  <span className="absolute left-0 top-[6px] block h-px w-full rotate-[-45deg] bg-current" />
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 pb-16">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${120 + index * 80}ms` }}
                className="animate-mask group flex items-baseline justify-between border-b border-border/60 py-5 font-serif text-4xl"
              >
                {link.name}
                <ArrowUpRight className="h-5 w-5 shrink-0 translate-y-1 text-muted-foreground transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-0" />
              </Link>
            ))}

            <div style={{ animationDelay: "400ms" }} className="animate-mask mt-10">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button className="btn-pill group w-full justify-between">
                    Join Glypha
                    <span className="btn-pill__island">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Signed in</span>
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
