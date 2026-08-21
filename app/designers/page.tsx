"use client"

import React, { useMemo, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, MapPin, Star, Users } from "lucide-react"
import Link from "next/link"

const Designers = () => {
  const designers = useQuery(api.profiles.listDesigners)
  const [query, setQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  // Get all unique skills from designers for filtering
  const allSkills = useMemo(() => {
    if (!designers) return []
    const skills = new Set<string>()
    designers.forEach((d) => d.skills?.forEach((s: string) => skills.add(s)))
    return Array.from(skills).sort()
  }, [designers])

  // Filter designers based on search and skill
  const filteredDesigners = useMemo(() => {
    if (!designers) return []

    return designers.filter((designer) => {
      const matchesSearch =
        designer.name?.toLowerCase().includes(query.toLowerCase()) ||
        designer.location?.city?.toLowerCase().includes(query.toLowerCase()) ||
        designer.bio?.toLowerCase().includes(query.toLowerCase())

      const matchesSkill =
        !selectedSkill || designer.skills?.includes(selectedSkill)

      return matchesSearch && matchesSkill
    })
  }, [designers, query, selectedSkill])

  if (designers === undefined) {
    return (
      <main className="bg-slate-950 text-white min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60">Loading designers...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-950 text-white min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-[url('/hero-backdrop.jpg')] bg-cover bg-center text-white"
        style={{ minHeight: "60vh" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative items-center max-w-7xl flex flex-col mx-auto px-5 py-48">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">
            Meet our designers
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200 text-lg md:text-xl text-center">
            Curated experts in visual identity, UX systems, and product
            storytelling. Explore their portfolios and connect for your project.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designers or city"
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-10 py-2.5 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkill === skill ? "secondary" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedSkill((prev) =>
                      prev === skill ? null : skill
                    )
                  }
                >
                  {skill}
                </Badge>
              ))}
            </div>
            {(query || selectedSkill) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setQuery("")
                  setSelectedSkill(null)
                }}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <p className="mb-6 text-sm text-slate-400">
          Showing {filteredDesigners.length} of {designers.length} designers
        </p>

        {filteredDesigners.length === 0 ? (
          <div className="mt-12 text-center text-slate-400">
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-lg mb-2">No designers match your search</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigners.map((designer) => (
              <DesignerCard key={designer._id} designer={designer} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

type DesignerWithSamples = Pick<
  Doc<"profiles">,
  "_id" | "name" | "bio" | "location" | "skills" | "averageRating" | "isOnline"
>;

function DesignerCard({ designer }: { designer: DesignerWithSamples }) {
  const portfolioItems = useQuery(api.portfolio.getDesignerPortfolio, {
    designerId: designer._id,
  })

  // Get up to 3 portfolio items for the preview
  const previewItems = portfolioItems?.slice(0, 3) || []

  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all">
      {/* Header with profile info */}
      <div className="p-4 flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {designer.name?.charAt(0)?.toUpperCase() || "D"}
            </span>
          </div>
          {designer.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#1a1610]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white truncate">
            {designer.name || "Designer"}
          </h3>
          <div className="flex items-center text-white/60 text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {designer.location?.city || "Unknown"}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold">{designer.averageRating ?? "New"}</span>
          </div>
        </div>
      </div>

      {/* Mini Portfolio Carousel */}
      <Link href={`/designers/${designer._id}`} className="block">
        <div className="relative aspect-video bg-white/5">
          {previewItems.length > 0 ? (
            <img
              src={previewItems[0].imageUrl}
              alt="Portfolio sample"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white/40 text-sm">No portfolio yet</p>
            </div>
          )}
          {previewItems.length > 1 && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
              +{previewItems.length - 1} more
            </div>
          )}
        </div>
      </Link>

      {/* Skills */}
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {designer.skills?.slice(0, 3).map((skill: string) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/70"
            >
              {skill}
            </span>
          ))}
          {designer.skills?.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-white/50">
              +{designer.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Link
          href={`/designers/${designer._id}`}
          className="flex items-center justify-center w-full h-10 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}

export default Designers