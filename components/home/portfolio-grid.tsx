"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { DesignerCard, DesignerCardSkeleton } from "@/components/ui/designer-card";
import { ArrowUpRight, Sparkle } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SKILL_LABELS, levelFromRating } from "@/lib/gigs";

export default function PortfolioGrid() {
  const items = useQuery(api.portfolio.listPortfolioItems, { limit: 20 });
  const designers = useQuery(api.profiles.listDesigners);

  const loading = items === undefined;

  // listPortfolioItems returns bare shots; join them to their seller so the
  // card shows a real name, rating and tier ladder instead of a placeholder.
  const sellers = new Map((designers ?? []).map((designer) => [designer._id, designer]));

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">
                <Sparkle className="h-3 w-3" />
                The wall
              </span>
              <h2 className="mt-6 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.02] tracking-[-0.03em] text-balance">
                Shots people are hiring from.
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-muted-foreground">
                Every tile is live work with a seller attached and a price
                attached to it. Like what you see? The tier strip is already
                on the card.
              </p>
            </div>

            <Link href="/designers" className="btn-pill btn-pill--ghost group shrink-0 self-start md:self-auto">
              Browse the wall
              <span className="btn-pill__island">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-16">
          {loading ? (
            <div className="masonry-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <DesignerCardSkeleton key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Reveal>
              <div className="shell">
                <div className="shell__core px-8 py-24 text-center">
                  <Sparkle className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-5 font-serif text-3xl">Nothing on the wall yet</p>
                  <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
                    The first designer to publish here sets the tone for
                    everyone after. Upload a shot and get discovered.
                  </p>
                  <Link href="/dashboard" className="btn-pill group mt-8">
                    Publish a shot
                    <span className="btn-pill__island">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="masonry-grid">
              {items.map((item: Doc<"portfolioItems">, index: number) => {
                const seller = sellers.get(item.designerId);
                const title = SKILL_LABELS[item.category]
                  ? `${SKILL_LABELS[item.category]} — case study`
                  : item.category;

                return (
                  <Reveal key={item._id} delay={Math.min(index, 6) * 70}>
                    <DesignerCard
                      cover={item.imageUrl}
                      title={title}
                      designer={{
                        _id: item.designerId,
                        name: seller?.name || "Designer",
                        bio: seller?.bio,
                        image: seller?.image,
                        location: seller?.location ?? null,
                        skills: seller?.skills ?? [item.category],
                        averageRating: seller?.averageRating,
                        isOnline: seller?.isOnline,
                        isVerified: (seller?.averageRating ?? 0) >= 4.7,
                        level: levelFromRating(seller?.averageRating),
                      }}
                    />
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}