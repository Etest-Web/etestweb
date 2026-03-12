"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { api } from "@/convex/_generated/api";

const navLinks = [
  { name: "The Journey", href: "#process" },
  { name: "Transformations", href: "#transformations" },
  { name: "Learn Graphic Design", href: "#" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="fixed left-[15%] top-0 z-50 w-[70%] border-b border-white/10 bg-background-dark/30 backdrop-blur-xl rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-primary h-full w-full">
              <Image
                src="/Etest-white.png"
                alt=""
                width={100}
                height={100}
                className="object-cover w-full h-max"
              />
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA + Auth */}
          <div className="flex items-center gap-4">
            {user === undefined ? (
              <span className="hidden md:inline-block h-9 w-24 animate-pulse rounded-lg bg-white/10" aria-hidden />
            ) : user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-white/80 truncate max-w-30" title={user.email ?? undefined}>
                  {user.name ?? user.email ?? "User"}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="bg-white/10 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="hidden md:block bg-primary text-background-dark text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                Sign in
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/10"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          ref={menuRef}
          className="md:hidden border-t border-white/10 bg-black/50 backdrop-blur-xl"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <ul className="space-y-4 text-sm text-white/80">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block transition hover:text-primary"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {user === undefined ? null : user ? (
              <>
                <p className="text-sm text-white/80 truncate">{user.name ?? user.email ?? "User"}</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className="w-full bg-white/10 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-white/20"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-primary text-background-dark text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-primary/20"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
