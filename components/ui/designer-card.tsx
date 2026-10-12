"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  Star,
} from "@/components/ui/icons";
import {
  CATEGORY_TONES,
  LEVEL_LABELS,
  SKILL_LABELS,
  levelFromRating,
  reviewsFor,
  tiersFor,
  type SkillLevel,
} from "@/lib/gigs";

export interface GigDesigner {
  _id: string;
  name: string;
  bio?: string;
  image: string | null | undefined;
  location: { city: string; country: string } | null;
  skills: string[];
  averageRating: number | null | undefined;
  isOnline?: boolean;
  isVerified?: boolean;
  level?: SkillLevel;
  /** Headline of the gig — Dribbble's "shot title". */
  title?: string;
  /** Portfolio shot used as the gig cover. */
  cover?: string | null;
}

/**
 * Seller avatar with a hard fallback.
 *
 * Profile image URLs come from user-entered records and Convex storage, so
 * a dead link is routine, not exceptional. A broken <Image> would leave a
 * torn-image glyph in the card, so any load error demotes to the monogram.
 */
function Avatar({
  src,
  name,
  className = "h-8 w-8",
}: {
  src: string | null | undefined;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials =
    name
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "G";

  if (!src || failed) {
    return (
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium tracking-wide text-muted-foreground ${className}`}
      >
        {initials}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={64}
      height={64}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}

/**
 * The hybrid card.
 *
 * Dribbble gives us the shot — a tall, cropped piece of work you can feel.
 * Fiverr gives us the commerce — a named tier ladder, a delivery window,
 * a seller level, and a price you can act on. Wrapped in the double-bezel
 * so it reads as a machined plate sitting in a tray rather than a
 * rectangle floating on cream.
 */
export function DesignerCard({
  designer,
  cover,
  title,
  className = "",
}: {
  designer: GigDesigner;
  cover?: string | null;
  title?: string;
  className?: string;
}) {
  const [coverFailed, setCoverFailed] = useState(false);
  const skill = designer.skills?.[0];
  const skillLabel = (skill && SKILL_LABELS[skill]) || "Design";
  const tone = (skill && CATEGORY_TONES[skill]) || "tag-branding";
  const level = designer.level ?? levelFromRating(designer.averageRating);
  const tiers = tiersFor(designer._id, designer.averageRating);
  const reviews = reviewsFor(designer._id);
  const monogram = designer.name?.charAt(0)?.toUpperCase() ?? "G";
  const heading = title ?? skillLabel;
  const hasCover = Boolean(cover) && !coverFailed;

  return (
    <Link
      href={`/designers/${designer._id}`}
      className={`group block ${className}`}
      aria-label={`${designer.name}: ${heading}, from $${tiers[0].price}`}
    >
      <article className="shell shell--lift h-full">
        <div className="shell__core flex h-full flex-col overflow-hidden">
          {/* ── The shot ─────────────────────────────────────────── */}
          <div className="relative aspect-[4/5] overflow-hidden">
            {hasCover ? (
              <Image
                src={cover as string}
                alt={`${designer.name}: ${heading}`}
                fill
                onError={() => setCoverFailed(true)}
                className="shot-card__image"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
              />
            ) : (
              // No portfolio shot yet: rather than an empty frame, paint an
              // artboard in the seller's category tone.
              <div className={`artboard absolute inset-0 ${tone}`}>
                <span className="paper-tooth absolute inset-0 opacity-70" />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-serif text-[7rem] font-light leading-none opacity-25"
                >
                  {monogram}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-end p-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                    Open slot
                  </span>
                </span>
              </div>
            )}

            {/* Category chip floats on the plate, never glued to the edge */}
            <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
              <span className={`tag-chip ${tone} bg-background/90 shadow-sm`}>
                {skillLabel}
              </span>
              {designer.isVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground shadow-sm">
                  <ShieldCheck className="h-3 w-3 text-sage" />
                  Verified
                </span>
              ) : null}
            </div>

            {/* Hover veil — the Dribbble tell */}
            <div className="shot-card__overlay">
              <div className="shot-card__info">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {designer.location?.city ?? "Remote"} · {level}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-white/90">
                  {designer.bio?.slice(0, 92) ?? skillLabel}
                </p>
              </div>
            </div>
          </div>

          {/* ── The gig ──────────────────────────────────────────── */}
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar src={designer.image} name={designer.name} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{designer.name}</p>
                  <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {designer.location?.country ?? "Remote"}
                  </p>
                </div>
              </div>
              <span className={`level-chip level-chip--${level} shrink-0`}>
                {LEVEL_LABELS[level]}
              </span>
            </div>

            <h3 className="font-serif text-[19px] leading-[1.25] text-balance">
              {heading}
            </h3>

            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="font-medium text-foreground">
                {(designer.averageRating ?? 0).toFixed(1)}
              </span>
              <span>({reviews})</span>
              {designer.isOnline ? (
                <span className="ml-auto inline-flex items-center gap-1.5 text-sage">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                  Online
                </span>
              ) : null}
            </div>

            {/* Tier ladder — the Fiverr spine */}
            <div className="tier-strip mt-auto">
              {tiers.map((tier) => (
                <div key={tier.name} className="tier-cell" data-selected={tier.name === "Standard"}>
                  <span className="tier-cell__label">{tier.name}</span>
                  <span className="tier-cell__price">${tier.price}</span>
                  <span className="text-[10px] text-muted-foreground">{tier.delivery}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] text-muted-foreground">
                from <span className="text-[15px] font-medium text-foreground">${tiers[0].price}</span>
              </span>
              <span className="btn-pill group">
                Hire now
                <span className="btn-pill__island">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function DesignerCardSkeleton() {
  return (
    <div className="shell">
      <div className="shell__core overflow-hidden">
        <div className="skeleton-shimmer aspect-[4/5]" />
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2.5">
            <div className="skeleton-shimmer h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton-shimmer h-3 w-24 rounded" />
              <div className="skeleton-shimmer h-2.5 w-16 rounded" />
            </div>
          </div>
          <div className="skeleton-shimmer h-5 w-4/5 rounded" />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-shimmer h-14 flex-1 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}