"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ArrowUpRight, Search, ShieldCheck, Sparkle } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { CATEGORIES, fromPrice, reviewsFor } from "@/lib/gigs";

const STATS = [
  { value: "1,247", label: "Certified designers" },
  { value: "4.8", label: "Average rating" },
  { value: "97.4%", label: "Projects delivered" },
  { value: "52", label: "Countries" },
];

const SHELF = [
  { seed: "shelf-identity", skill: "Brand Identity", title: "Identity system for a Nordic bakery", rating: 4.9, tone: "tag-branding", mark: "N" },
  { seed: "shelf-product", skill: "Product Design", title: "End-to-end fintech onboarding", rating: 4.8, tone: "tag-uiux", mark: "F" },
  { seed: "shelf-motion", skill: "Motion Design", title: "Title sequence for a docu-series", rating: 5.0, tone: "tag-motion", mark: "R" },
];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    router.push(`/designers${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden pb-24 pt-32 md:pt-40">
      {/* Warm light pooling from the top-left. No blur filter on a
          scrolling container — these are painted gradients, so they cost
          nothing per frame. Painted before the content, not behind it via
          a negative z-index. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 paper-tooth opacity-70" />
        <div
          className="absolute -left-[20%] -top-[30%] h-[70vh] w-[70vh] rounded-full opacity-[0.55]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--clay) 22%, transparent) 0%, transparent 62%)",
          }}
        />
        <div
          className="absolute -right-[15%] top-[10%] h-[60vh] w-[60vh] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--sage) 24%, transparent) 0%, transparent 62%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        {/* ── Editorial Split ────────────────────────────────────── */}
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow">
                <Sparkle className="h-3 w-3" />
                The certified design marketplace
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-7 font-serif text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-balance">
                Hire the hands behind the work{" "}
                <span className="italic text-brand-ink">you can’t stop</span> looking at.
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
                Dribbble showed you the taste. Glypha gives you the paperwork.
                Browse a curated bench of certified designers, then buy a
                defined tier. Price, deadline and revisions agreed before
                a pixel moves.
              </p>
            </Reveal>

            <Reveal delay={270}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/designers")}
                  className="btn-pill group"
                >
                  Explore designers
                  <span className="btn-pill__island">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/jobs/post")}
                  className="btn-pill btn-pill--ghost group"
                >
                  Post a job
                  <span className="btn-pill__island">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-14 flex items-center gap-3 text-[13px] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-sage" />
                Every seller is identity-verified and skill-certified by
                Glypha Learn.
              </div>
            </Reveal>
          </div>

          {/* ── The shelf: real gig cards, floated and tilted ───────── */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto flex max-w-md flex-col gap-5 lg:max-w-none">
              {SHELF.map((item, index) => (
                <Reveal
                  key={item.seed}
                  delay={160 + index * 120}
                  // Rotation and overlap are desktop-only: below lg they
                  // collapse into a plain vertical stack.
                  className={
                    index === 0
                      ? "lg:ml-0 lg:rotate-[-1.5deg]"
                      : index === 1
                        ? "lg:ml-10 lg:rotate-[1deg]"
                        : "lg:ml-4 lg:rotate-[-0.5deg]"
                  }
                >
                  <article className="shell shell--lift">
                    <div className="shell__core flex items-center gap-5 p-5">
                      {/* Stand-in for the seller's shot: a tinted artboard
                          carrying a serif monogram, not an empty frame. */}
                      <div
                        className={`relative h-28 w-24 shrink-0 overflow-hidden rounded-[1.25rem] ${item.tone}`}
                      >
                        <span className="absolute inset-0 paper-tooth opacity-50" />
                        <span className="absolute inset-0 flex items-center justify-center font-serif text-4xl italic opacity-80">
                          {item.mark}
                        </span>
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center py-1.5 text-[9px] uppercase tracking-[0.18em] opacity-70 text-ink">
                          Shot
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`tag-chip ${item.tone}`}>{item.skill}</span>
                        <p className="mt-3 font-serif text-lg leading-snug">
                          {item.title}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-[12px] text-muted-foreground">
                          <span>
                            ★ {item.rating.toFixed(1)} ({reviewsFor(item.seed)})
                          </span>
                          <span className="h-3 w-px bg-border" />
                          <span>from ${fromPrice(item.seed, item.rating)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ── Fiverr search + category rail ─────────────────────── */}
        <Reveal delay={200} className="mt-24 md:mt-32">
          <form onSubmit={submit} className="shell">
            <div className="shell__core flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try “brand identity for a coffee roaster”"
                  aria-label="Search designers and skills"
                  className="search-input"
                />
              </div>
              <button type="submit" className="btn-pill group shrink-0 self-start md:self-auto">
                Search
                <span className="btn-pill__island">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </form>

          <div className="rail mt-6">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategory(item.id);
                  const params = new URLSearchParams();
                  if (query.trim()) params.set("q", query.trim());
                  if (item.id !== "all") params.set("category", item.id);
                  router.push(`/designers${params.toString() ? `?${params}` : ""}`);
                }}
                className={`category-tab ${category === item.id ? "category-tab--active" : ""}`}
              >
                {item.label}
                <span className="ml-1.5 text-[11px] opacity-60">{item.count}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── Stats: a ruled editorial row, not a bootstrap grid ─── */}
        <Reveal delay={120} className="mt-20">
          <dl className="grid grid-cols-2 gap-y-8 border-t border-border pt-8 md:grid-cols-4 md:gap-y-0">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`md:px-8 ${index === 0 ? "md:pl-0" : ""} ${
                  index > 0 ? "md:border-l md:border-border" : ""
                }`}
              >
                <dt className="font-serif text-4xl font-light md:text-5xl">{stat.value}</dt>
                <dd className="mt-2 text-[13px] text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}