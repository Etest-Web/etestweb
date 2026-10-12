"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Award } from "lucide-react"

interface PortfolioItem {
  imageUrl: string
  category?: string
}

interface DesignerWithSamples {
  _id: string
  name: string
  image: string | null | undefined
  location: { city: string; country: string } | null
  skills: string[]
  averageRating: number | null | undefined
  portfolioUrl: string | null | undefined
  isVerified?: boolean
  certificate?: string
  skillLevel?: "beginner" | "intermediate" | "advanced" | "expert"
}

const CATEGORY_COLORS: Record<string, string> = {
  "ui-ux-design": "tag-uiux",
  "logo-design": "tag-logo",
  "brand-identity": "tag-branding",
  "illustration": "tag-illustration",
  "motion-design": "tag-motion",
  "web-design": "tag-web",
  "video-editing": "tag-video",
  "packaging-design": "tag-packaging",
  "product-design": "tag-uiux",
  "design-systems": "tag-uiux",
  "character-design": "tag-illustration",
  "after-effects": "tag-motion",
  "framer": "tag-web",
  "webflow": "tag-web",
  "landing-pages": "tag-web",
}

const SKILL_DISPLAY: Record<string, string> = {
  "youtube-thumbnail": "YouTube Thumbnails",
  "logo-design": "Logo Design",
  "brand-identity": "Brand Identity",
  "ui-ux-design": "UI/UX Design",
  "product-design": "Product Design",
  "design-systems": "Design Systems",
  "illustration": "Illustration",
  "character-design": "Character Design",
  "motion-design": "Motion Design",
  "video-editing": "Video Editing",
  "after-effects": "After Effects",
  "packaging-design": "Packaging Design",
  "print-design": "Print Design",
  "web-design": "Web Design",
  "framer": "Framer",
  "webflow": "Webflow",
  "landing-pages": "Landing Pages",
}

const SKILL_LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
}

export function DesignerCard({ designer, style }: { designer: DesignerWithSamples; style?: React.CSSProperties }) {
  const portfolioItems: PortfolioItem[] = []
  const displaySkill =
    designer.skills?.[0] && SKILL_DISPLAY[designer.skills[0]]
      ? SKILL_DISPLAY[designer.skills[0]]
      : "Designer"
  const categoryTag = designer.skills?.[0]
    ? CATEGORY_COLORS[designer.skills[0]] || "tag-branding"
    : "tag-branding"

  return (
    <Link
      href={`/designers/${designer._id}`}
      className="shot-card block group"
      style={style}
    >
      {/* Portfolio Image */}
      <div className="relative h-[70%] overflow-hidden bg-muted">
        {portfolioItems.length > 0 ? (
          <Image
            src={portfolioItems[0]?.imageUrl || "/avatar-placeholder.png"}
            alt={`${designer.name}'s portfolio`}
            fill
            className="shot-card__image rounded-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {designer.name?.charAt(0)?.toUpperCase() || "D"}
              </span>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {designer.isVerified && (
            <span className="verified-badge">
              <Award className="verified-badge__icon" />
              Verified
            </span>
          )}
          {designer.certificate && (
            <span className="certificate-badge">
              <Award className="certificate-badge__icon" />
              {designer.certificate}
            </span>
          )}
        </div>

        {/* Overlay */}
        <div className="shot-card__overlay">
          <div className="shot-card__info">
            <span className={`shot-card__category ${categoryTag}`}>
              {displaySkill}
            </span>
            <div className="shot-card__name">{designer.name}</div>
            <div className="shot-card__meta flex items-center gap-1.5 text-xs">
              <MapPin className="w-3 h-3" />
              <span>
                {designer.location?.city}, {designer.location?.country}
              </span>
            </div>
            {designer.averageRating && (
              <div className="shot-card__rating items-center gap-1 mt-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm">
                  {designer.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-white/70">(48)</span>
              </div>
            )}
            {designer.skillLevel && (
              <div className="mt-2">
                <span
                  className={`skill-level skill-level--${designer.skillLevel}`}
                >
                  {SKILL_LEVEL_LABELS[designer.skillLevel]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Info (always visible) */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          {designer.image ? (
            <Image
              src={designer.image}
              alt={designer.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full bg-primary/20 object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">
                {designer.name?.charAt(0)?.toUpperCase() || "D"}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">
              {designer.name}
            </div>
            {designer.location && (
              <div className="text-[10px] text-muted-foreground truncate">
                {designer.location.city}, {designer.location.country}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function DesignerCardSkeleton() {
  return (
    <div className="shot-card bg-card/50">
      <div className="relative h-[70%] overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer rounded-2xl" />
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-muted skeleton-shimmer" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-24 bg-muted skeleton-shimmer rounded" />
            <div className="h-2.5 w-16 bg-muted skeleton-shimmer rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
