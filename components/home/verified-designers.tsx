"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Star, Award, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import { DesignerCard } from "@/components/ui/designer-card"
import Link from "next/link"

const SKILL_LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
}

export default function VerifiedDesigners() {
  const designers = useQuery(api.profiles.listDesigners)

  if (designers === undefined) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#18140e] to-[#12100b]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">Verified & Certified</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card/50 rounded-2xl border border-white/10 overflow-hidden">
                <div className="h-[70%] skeleton-shimmer" />
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
            ))}
          </div>
        </div>
      </section>
    )
  }

  const verified = designers.filter((d) => (d.averageRating || 0) >= 4.5)

  return (
    <section className="py-16 bg-gradient-to-b from-[#18140e] to-[#12100b]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">Verified & Certified Designers</h2>
          </div>
          <Link
            href="/designers"
            className="btn-ghost"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Certification Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-10 flex items-start gap-4">
          <Award className="w-8 h-8 text-primary mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Certified Talent, Verified Skill</h3>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Every designer here has completed Glypha Learn verification. Check their certificate badges
              to confirm their expertise before hiring.
            </p>
          </div>
        </div>

        {/* Designers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {verified.slice(0, 4).map((designer, index) => (
            <DesignerCard
              key={designer._id}
              designer={{
                ...designer,
                name: designer.name || "Designer",
                isVerified: true,
                certificate: "Glypha Certified",
                skillLevel:
                  (designer.averageRating || 0) >= 4.8
                    ? "expert"
                    : (designer.averageRating || 0) >= 4.3
                    ? "advanced"
                    : (designer.averageRating || 0) >= 3.8
                    ? "intermediate"
                    : "beginner",
              }}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}