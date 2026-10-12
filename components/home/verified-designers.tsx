"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { DesignerCard, DesignerCardSkeleton } from "@/components/ui/designer-card";
import { ArrowUpRight, Award, ShieldCheck } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { levelFromRating } from "@/lib/gigs";

export default function VerifiedDesigners() {
  const designers = useQuery(api.profiles.listDesigners);

  const loading = designers === undefined;

  const bench = loading
    ? []
    : designers
        .filter((designer) => (designer.averageRating ?? 0) >= 4.5)
        .slice(0, 4);

  return (
    <section id="talent" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">
                <ShieldCheck className="h-3 w-3" />
                The certified bench
              </span>
              <h2 className="mt-6 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.02] tracking-[-0.03em] text-balance">
                A shortlist, not a directory.
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-muted-foreground">
                Nobody lists here until Glypha Learn has verified the work and
                the person behind it. Levels are earned from delivered
                projects — not bought.
              </p>
            </div>

            {!loading && (
              <Link href="/designers" className="btn-pill btn-pill--ghost group shrink-0 self-start md:self-auto">
                See all {designers.length}
                <span className="btn-pill__island">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            )}
          </div>
        </Reveal>

        {/* Certification banner — a machined panel, not a flat alert */}
        <Reveal delay={100} className="mt-14">
          <div className="shell">
            <div className="shell__core flex flex-col gap-6 p-7 md:flex-row md:items-center md:gap-8 md:p-9">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Award className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-serif text-2xl">
                  Certified talent, verified skill
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  Every designer in this room has cleared Glypha Learn’s
                  portfolio review. The certificate badge on a card is a real
                  assessment with a date on it — not a self-reported claim.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? [0, 1, 2, 3].map((i) => <DesignerCardSkeleton key={i} />)
            : bench.map((designer, index) => (
                <Reveal key={designer._id} delay={index * 90}>
                  <DesignerCard
                    designer={{
                      _id: designer._id,
                      name: designer.name || "Designer",
                      bio: designer.bio,
                      image: designer.image,
                      location: designer.location,
                      skills: designer.skills ?? [],
                      averageRating: designer.averageRating,
                      isOnline: designer.isOnline,
                      isVerified: true,
                      level: levelFromRating(designer.averageRating),
                    }}
                  />
                </Reveal>
              ))}
        </div>

        {!loading && bench.length === 0 && (
          <Reveal delay={100} className="mt-16">
            <div className="shell">
              <div className="shell__core px-8 py-20 text-center">
                <Award className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-5 font-serif text-2xl">The bench is being cleared</p>
                <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
                  No designer has cleared certification yet. Be the first to
                  publish a portfolio shot.
                </p>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}