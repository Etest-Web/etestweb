import React from "react";
import { LogoIcon } from "@/app/(auth)/signin/[[...rest]]/page";

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
    <footer className="border-t border-white/5 bg-background-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="text-primary h-max w-full">
                <LogoIcon className="h-max w-full object-cover" />
              </div>
              
            </div>
            <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
              We are the architects of digital narrative, helping visionary
              brands unleash their full potential.
            </p>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-10">
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
              >
                Twitter
              </a>
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
              >
                LinkedIn
              </a>
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
              >
                Dribbble
              </a>
            </div>
            <p className="text-slate-600 text-xs">
              © 2024 EliteDesign Storytelling Agency. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
