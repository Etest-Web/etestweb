"use client";

import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { ModeToggle } from "@/components/ui/mode-toggle";

/**
 * Shared chrome for every custom auth route.
 *
 * An editorial split: an espresso manifesto panel carrying the argument,
 * and the actual form on cream inside a double-bezel plate. The split
 * collapses to a single column below `lg`, where the manifesto is dropped
 * entirely rather than stacked above the fold.
 */

const PROOF = [
  { value: "1,247", label: "Certified designers" },
  { value: "4.8", label: "Average rating" },
  { value: "97.4%", label: "Delivered on time" },
];

export function AuthShell({
  eyebrow,
  headline,
  lede,
  children,
  footer,
}: {
  eyebrow: string;
  headline: React.ReactNode;
  lede: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      {/* ── Manifesto panel ─────────────────────────────────────── */}
      <aside className="relative hidden overflow-hidden bg-ink p-12 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute -right-[30%] -top-[20%] h-[40rem] w-[40rem] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--gold) 26%, transparent) 0%, transparent 62%)",
            }}
          />
          <div
            className="absolute -bottom-[25%] -left-[20%] h-[32rem] w-[32rem] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--sage) 24%, transparent) 0%, transparent 62%)",
            }}
          />
        </div>

        <div className="relative">
          <Link href="/" className="inline-flex items-center">
            <Logo plate className="w-32" priority />
          </Link>
        </div>

        <div className="relative max-w-lg">
          <span className="eyebrow !bg-white/10 !text-white/70 !shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
            {eyebrow}
          </span>
          <h2 className="mt-8 font-serif text-[clamp(2.5rem,4vw,3.75rem)] font-light leading-[1.02] tracking-[-0.03em] text-white text-balance">
            {headline}
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/60">
            {lede}
          </p>
        </div>

        <dl className="relative flex gap-10 border-t border-white/10 pt-8">
          {PROOF.map((item) => (
            <div key={item.label}>
              <dt className="font-serif text-3xl font-light text-white">{item.value}</dt>
              <dd className="mt-1 text-[12px] text-white/45">{item.label}</dd>
            </div>
          ))}
        </dl>
      </aside>

      {/* ── Form panel ─────────────────────────────────────────── */}
      {/* Padding is deliberately tighter than the marketing sections' macro
          whitespace: the sign-up form is tall enough that py-24 pushed the
          submit button below the fold on a 900px laptop. */}
      <div className="relative flex flex-col justify-center px-5 py-14 md:px-10 lg:px-16 lg:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 paper-tooth opacity-60" />
        </div>

        <div className="relative mx-auto w-full max-w-[26rem]">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="lg:hidden">
              <Logo plate className="w-28" priority />
            </Link>
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>

          <Reveal>
            <div className="shell">
              <div className="shell__core p-6 md:p-8">{children}</div>
            </div>
          </Reveal>

          <div className="mt-8 text-center text-[13px] text-muted-foreground">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Section heading used inside each form plate. */
export function AuthHeading({
  title,
  sub,
}: {
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-serif text-[2rem] font-light leading-tight tracking-[-0.02em]">
        {title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{sub}</p>
    </div>
  );
}