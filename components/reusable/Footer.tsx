import React from "react";

import { Logo } from "@/components/ui/logo";

/**
 * Footer component used across the application.
 *
 * It renders a simple footer with a copyright notice and optional
 * navigation links. The component is intentionally lightweight so it
 * can be reused in any layout without pulling in heavy dependencies.
 */
const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="flex flex-col items-center gap-6 md:items-start">
            <Logo plate className="w-40" />
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              We are the architects of digital narrative, helping visionary
              brands unleash their full potential.
            </p>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-10">
              <a
                className="text-muted-foreground transition-colors hover:text-brand-ink"
                href="#"
              >
                Twitter
              </a>
              <a
                className="text-muted-foreground transition-colors hover:text-brand-ink"
                href="#"
              >
                LinkedIn
              </a>
              <a
                className="text-muted-foreground transition-colors hover:text-brand-ink"
                href="#"
              >
                Dribbble
              </a>
            </div>
            <p className="text-xs text-muted-foreground/60">
              © {year} Glypha Storytelling Agency. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
