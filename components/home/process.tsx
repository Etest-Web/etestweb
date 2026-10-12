"use client";

import Link from "next/link";

import { ArrowUpRight, Check, Clock, Quote, Search } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    title: "Browse the wall",
    body: "Filter by craft, budget, delivery window and seller level. Every card carries a real starting price.",
  },
  {
    title: "Pick your tier",
    body: "Basic, Standard or Premium. Each tier carries its own scope, revision count and delivery date, written down.",
  },
  {
    title: "Work in the open",
    body: "Proposals, contracts and milestones live in your dashboard. Scope creep needs a signature.",
  },
  {
    title: "Release on delivery",
    body: "Funds move when the files land and you accept them. Escrow is the default, not an upsell.",
  },
];

const GUARANTEES = [
  "Identity-verified sellers",
  "Escrow on every contract",
  "Files released on acceptance",
  "Dispute window after delivery",
];

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-secondary/50" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.02] tracking-[-0.03em] text-balance">
                Four steps. Zero ambiguity.
              </h2>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
                The reason marketplace work goes wrong is never talent. It’s
                loose scope. So we made the scope the product.
              </p>

              <div className="mt-10 flex flex-col gap-3">
                {GUARANTEES.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[15px]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Asymmetrical bento, not a 4-up grid: the first and last steps take the
                full measure, the middle pair share a row. Every cell is filled. */}
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {STEPS.map((step, index) => (
                <Reveal
                  key={step.title}
                  delay={index * 90}
                  className={index === 0 || index === 3 ? "sm:col-span-2" : ""}
                >
                  <article className="shell shell--lift h-full">
                    <div
                      className={`shell__core h-full p-7 md:p-10 ${
                        index === 0 || index === 3
                          ? "grid content-center gap-5 md:grid-cols-2 md:items-center md:gap-12"
                          : "flex flex-col justify-center"
                      }`}
                    >
                      <h3
                        className={`font-serif leading-tight ${
                          index === 0 || index === 3
                            ? "text-3xl md:text-4xl"
                            : "text-2xl"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-24">
          <div className="shell">
            <div className="shell__core flex flex-col items-start gap-10 p-9 md:flex-row md:items-center md:justify-between md:p-14">
              <div className="max-w-xl">
                <Quote className="h-6 w-6 text-muted-foreground" />
                <p className="mt-6 font-serif text-2xl leading-snug text-balance md:text-3xl">
                  “The tier strip killed the awkward part. We knew what we were
                  buying before the first message.”
                </p>
                <p className="mt-6 text-[13px] text-muted-foreground">
                  Amara Osei · Brand lead, Northbank Coffee
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/designers" className="btn-pill group">
                  Browse talent
                  <span className="btn-pill__island">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <span className="flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Median hire: 4 days
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-10 flex justify-center">
          <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            Everything above is enforced by the contract layer, not by goodwill.
          </span>
        </Reveal>
      </div>
    </section>
  );
}