"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {  Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

const navLinks = [
  { name: "The Journey", href: "#process" },
  { name: "Designers", href: "/designers" },
  { name: "Learn Graphic Design", href: "#" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 z-50 w-dvw border-b border-white/10 bg-background-dark/30 backdrop-blur-xl rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-primary h-full w-full">
              <Link href="/">
                <Image
                  src="/Etest-white.png"
                  alt=""
                  width={100}
                  height={100}
                  className="object-cover w-full h-max"
                />
              </Link>
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
           <Show when="signed-out">
              <SignInButton />
              <SignUpButton>
                <button className="bg-primary text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>

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

            <Show when="signed-out">
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
