"use client";

import { useRouter } from "next/navigation";

import { ArrowUpRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      {/* Sits in normal flow *behind* the content by DOM order, not a
          negative z-index — `-z-10` would drop the panel behind the body
          background and vanish entirely. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-ink" />
        <div
          className="absolute left-1/2 top-0 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--gold) 30%, transparent) 0%, transparent 64%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
        <Reveal>
          <span className="eyebrow !bg-white/10 !text-white/70 !shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
            Open for briefs
          </span>
        </Reveal>

        <Reveal delay={90}>
          <h2 className="mt-8 font-serif text-[clamp(2.75rem,7vw,5.25rem)] font-light leading-[0.98] tracking-[-0.03em] text-white text-balance">
            Your story is waiting to be <span className="italic text-gold">drawn</span>.
          </h2>
        </Reveal>

        <Reveal delay={180}>
          <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-white/60">
            Post a brief, get scoped proposals with real prices attached, and
            pay only when the work lands.
          </p>
        </Reveal>

        <Reveal delay={270}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/jobs/post")}
              className="btn-pill group !bg-white !text-ink"
            >
              Start your project
              <span className="btn-pill__island !bg-ink/10">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/designers")}
              className="btn-pill group !bg-transparent !text-white !shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
            >
              Meet the designers
              <span className="btn-pill__island !bg-white/10">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}