"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Star, MapPin, Award, Sparkles } from "lucide-react"
import { DesignerCard, DesignerCardSkeleton } from "@/components/ui/designer-card"
import Image from "next/image"
import Link from "next/link"

interface PortfolioItem {
  _id: string
  _creationTime: number
  imageUrl: string
  designerId: string
  category: string
}

interface PortfolioItemWithDesigner extends PortfolioItem {
  designer: {
    _id: string
    name: string
    image: string | null
    location: { city: string; country: string } | null
    skills: string[]
    averageRating: number | null
    isVerified?: boolean
    skillLevel?: "beginner" | "intermediate" | "advanced" | "expert"
  }
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

export default function PortfolioGrid() {
  const portfolioItems = useQuery(api.portfolio.listPortfolioItems, { limit: 20 })

  if (portfolioItems === undefined) {
    return (
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Trending Shots
          </h2>
        </div>
        <div className="masonry-grid">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <DesignerCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (portfolioItems.length === 0) {
    return (
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Trending Shots
          </h2>
        </div>
        <div className="bg-[#1a1610] border border-white/10 rounded-3xl p-16 text-center">
          <Sparkles className="w-16 h-16 text-stone-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No shots yet</h3>
          <p className="text-stone-400 text-sm max-w-md mx-auto">
            Be the first to upload your work and get discovered!
          </p>
        </div>
      </section>
    )
  }

  // Build enriched items with fallback designer data
  const itemsWithDesigner: PortfolioItemWithDesigner[] = portfolioItems.map((item) => ({
    ...item,
    designer: {
      _id: item.designerId,
      name: "Designer",
      image: null,
      location: { city: "Unknown", country: "Unknown" },
      skills: [item.category],
      averageRating: null,
    },
  }))

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Trending This Week
        </h2>
        <Link
          href="/designers"
          className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
        >
          View all
          <span className="text-lg">→</span>
        </Link>
      </div>

      <div className="masonry-grid">
        {itemsWithDesigner.map((item: PortfolioItemWithDesigner, index: number) => (
          <article
            key={item._id}
            className="shot-card group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Portfolio Image */}
            <Link
              href={`/designers/${item.designerId}`}
              className="block relative h-[70%] overflow-hidden bg-muted"
            >
              <Image
                src={item.imageUrl}
                alt={`${item.designer.name}'s ${item.category}`}
                fill
                className="shot-card__image rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />

              {/* Category Badge - Top Left */}
              <div className="absolute top-3 left-3">
                <span
                  className={`shot-card__category ${
                    CATEGORY_COLORS[item.category] || "tag-branding"
                  }`}
                >
                  {SKILL_DISPLAY[item.category] || item.category}
                </span>
              </div>

              {/* Verified Badge - Top Right */}
              {item.designer.isVerified && (
                <div className="absolute top-3 right-3">
                  <span className="verified-badge">
                    <Award className="verified-badge__icon" />
                    Verified
                  </span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="shot-card__overlay">
                <div className="shot-card__info">
                  <div className="shot-card__name">{item.designer.name}</div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {item.designer.location?.city},{" "}
                      {item.designer.location?.country}
                    </span>
                  </div>
                  {item.designer.averageRating && (
                    <div className="shot-card__rating items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-sm">
                        {item.designer.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {item.designer.skillLevel && (
                    <div className="mt-2">
                      <span
                        className={`skill-level skill-level--${item.designer.skillLevel}`}
                      >
                        {item.designer.skillLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>

            {/* Bottom Info */}
            <div className="p-3">
              <div className="flex items-center gap-2">
                {item.designer.image ? (
                  <Image
                    src={item.designer.image}
                    alt={item.designer.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full bg-primary/20 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">
                      {item.designer.name?.charAt(0)?.toUpperCase() || "D"}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {item.designer.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {item.designer.location?.city},{" "}
                    {item.designer.location?.country}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}