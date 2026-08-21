"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import type { Doc } from "@/convex/_generated/dataModel"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Briefcase, MessageSquare, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DesignerDetailPage() {
  const params = useParams()
  const designerId = params.id as Id<"profiles">

  const designer = useQuery(api.profiles.getDesignerById, { designerId })
  const portfolioItems = useQuery(api.portfolio.getDesignerPortfolio, { designerId })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (designer === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (designer === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Designer not found</h1>
          <p className="text-white/60 mb-4">This profile may have been removed or doesn&apos;t exist.</p>
          <Link
            href="/designers"
            className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Designers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero with Back Button */}
      <div className="bg-[#1a1610] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <Link
            href="/designers"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Designers
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 sticky top-6">
              {/* Avatar and Name */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {designer.name?.charAt(0)?.toUpperCase() || "D"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{designer.name}</h1>
                <div className="flex items-center justify-center gap-2 text-white/60 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{designer.location?.city}, {designer.location?.country}</span>
                </div>
                {designer.isOnline && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online Now
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-6 py-4 border-y border-white/10">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold text-white">
                  {designer.averageRating ?? "New"}
                </span>
                <span className="text-white/60 text-sm">
                  {designer.averageRating ? "rating" : "New designer"}
                </span>
              </div>

              {/* Bio */}
              {designer.bio && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/60 mb-2">About</h3>
                  <p className="text-white">{designer.bio}</p>
                </div>
              )}

              {/* Skills */}
              {designer.skills && designer.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/60 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {designer.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* External Portfolio Link */}
              {designer.portfolioUrl && (
                <div className="mb-6">
                  <a
                    href={designer.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View External Portfolio
                  </a>
                </div>
              )}

              {/* CTA */}
              <div className="space-y-3">
                <Button className="w-full h-12 bg-primary text-black font-bold hover:bg-primary/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Designer
                </Button>
                <Button variant="outline" className="w-full h-12 border-white/10 text-white hover:bg-white/5">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Hire for Project
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Portfolio Gallery */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Portfolio ({portfolioItems?.length || 0})
              </h2>
            </div>

            {portfolioItems && portfolioItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioItems.map((item: Doc<"portfolioItems">) => (
                  <button
                    key={item._id}
                    onClick={() => setSelectedImage(item.imageUrl)}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-[#1a1610] border border-white/10 hover:border-primary/50 transition-all"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.category}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1 bg-white/20 rounded-lg text-sm text-white backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1610] border border-white/10 rounded-xl p-12 text-center">
                <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No portfolio items yet</h3>
                <p className="text-white/60">
                  This designer hasn&apos;t added any portfolio items yet.
                </p>
              </div>
            )}

            {/* Reviews Section Placeholder */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
              <div className="bg-[#1a1610] border border-white/10 rounded-xl p-8 text-center">
                <p className="text-white/60">
                  No reviews yet. Complete a project with this designer to leave a review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Portfolio full size"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}