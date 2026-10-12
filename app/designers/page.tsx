"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  X, 
  ChevronDown, 
  MapPin, 
  Star, 
  TrendingUp, 
  Users, 
  Heart, 
  Globe, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Award
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DesignerCard, DesignerCardSkeleton } from "@/components/ui/designer-card"

const SKILL_CATEGORIES = {
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
} as const

const CATEGORY_TABS = [
  { id: "all", label: "All", count: 1240 },
  { id: "ui-ux-design", label: "UI/UX Design", count: 280 },
  { id: "logo-design", label: "Logo Design", count: 195 },
  { id: "brand-identity", label: "Brand Identity", count: 150 },
  { id: "illustration", label: "Illustration", count: 180 },
  { id: "motion-design", label: "Motion Design", count: 95 },
  { id: "web-design", label: "Web Design", count: 140 },
  { id: "video-editing", label: "Video Editing", count: 75 },
]

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

function DesignersHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#231e0f] via-[#18140e] to-[#12100b] py-20 lg:py-28 border-b border-white/[0.06]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-purple-500/15 blur-[60px]" />
      
      <div className="relative max-w-7xl mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Elite Creative Talent</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white">
            Find the Perfect Designer <br/>
            <span className="bg-gradient-to-r from-primary via-amber-400 to-orange-400 bg-clip-text text-transparent">
              for Your Vision
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Browse top-tier creators in visual branding, motion, web interface design, and illustrations. 
            Connect, review portfolios, and hire directly in clicks.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-stone-400">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-primary" />
              <span><strong className="text-white font-semibold">1,200+</strong> Vetted Freelancers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-full">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span><strong className="text-white font-semibold">4.9/5</strong> Client Satisfaction</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white font-semibold">98.5%</strong> Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type DesignerWithSamples = Pick<
  Doc<"profiles">,
  "_id" | "name" | "bio" | "image" | "location" | "skills" | "averageRating" | "isOnline" | "portfolioUrl"
>

const Designers = () => {
  const designers = useQuery(api.profiles.listDesigners)
  
  // States
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [onlyOnline, setOnlyOnline] = useState(false)
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "reviews">("relevance")
  
  // Dropdown States
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  
  // Refs for closing popups on click outside
  const locationDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Derived options
  const allSkills = useMemo(() => {
    if (!designers) return []
    const skills = new Set<string>()
    designers.forEach((d) => d.skills?.forEach((s: string) => skills.add(s)))
    return Array.from(skills).sort()
  }, [designers])

  const allLocations = useMemo(() => {
    if (!designers) return []
    const locations = new Set<string>()
    designers.forEach((d) => {
      if (d.location?.country) {
        locations.add(d.location.country)
      }
    })
    return Array.from(locations).sort()
  }, [designers])

  // Filter and Sort Designers
  const filteredDesigners = useMemo(() => {
    if (!designers) return []

    const result = designers.filter((designer) => {
      const matchesSearch =
        designer.name?.toLowerCase().includes(query.toLowerCase()) ||
        designer.location?.city?.toLowerCase().includes(query.toLowerCase()) ||
        designer.bio?.toLowerCase().includes(query.toLowerCase()) ||
        designer.skills?.some((s: string) => s.toLowerCase().includes(query.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || designer.skills?.includes(selectedCategory)
      const matchesLocation = selectedLocation === "all" || designer.location?.country === selectedLocation
      const matchesOnline = !onlyOnline || designer.isOnline

      return matchesSearch && matchesCategory && matchesLocation && matchesOnline
    })

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    } else if (sortBy === "reviews") {
      // Deterministic sort by review count based on name/id hash
      result.sort((a, b) => {
        const countA = (a._id.charCodeAt(a._id.length - 2) || 0) % 45
        const countB = (b._id.charCodeAt(b._id.length - 2) || 0) % 45
        return countB - countA
      })
    }

    return result
  }, [designers, query, selectedCategory, selectedLocation, onlyOnline, sortBy])

  const hasActiveFilters = query !== "" || selectedCategory !== "all" || selectedLocation !== "all" || onlyOnline

  const handleClearFilters = () => {
    setQuery("")
    setSelectedCategory("all")
    setSelectedLocation("all")
    setOnlyOnline(false)
    setSortBy("relevance")
  }

  if (designers === undefined) {
    return (
      <main className="bg-[#12100b] text-white min-h-screen">
        <DesignersHero />
        <section className="max-w-7xl mx-auto px-5 py-10 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-11 w-full max-w-md rounded-xl" />
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORY_TABS.slice(0, 6).map((tab) => (
                <Skeleton key={tab.id} className="h-9 w-28 rounded-full flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="masonry-grid">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <DesignerCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-[#12100b] text-white min-h-screen pb-20">
      <DesignersHero />
      
      <section className="max-w-7xl mx-auto px-5 py-10 space-y-6">
        
        {/* Category Tabs - Dribbble Style */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`category-tab ${
                selectedCategory === tab.id
                  ? "category-tab--active"
                  : "category-tab--inactive"
              }`}
            >
              {tab.label}
              <span className="ml-1 text-xs text-muted-foreground/60">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Horizontal Modern Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1a1610] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search designers, skills..."
                className="pl-10 h-10 border-white/[0.08] bg-[#12100b] text-white placeholder-stone-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm rounded-xl w-full search-input"
              />
            </div>

            {/* Custom Location Dropdown */}
            <div className="relative" ref={locationDropdownRef}>
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className={`h-10 px-4 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                  selectedLocation !== "all" 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-[#12100b] border-white/[0.08] text-stone-300 hover:border-white/20"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>{selectedLocation === "all" ? "Location" : selectedLocation}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLocationDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#1a1610] border border-white/10 shadow-2xl p-3 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 px-2 pb-1.5 border-b border-white/[0.05]">Filter Location</p>
                  <div className="max-h-60 overflow-y-auto pt-1 space-y-0.5">
                    <button 
                      onClick={() => { setSelectedLocation("all"); setIsLocationDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${selectedLocation === "all" ? "bg-primary text-black" : "text-stone-300 hover:bg-white/5"}`}
                    >
                      Worldwide
                    </button>
                    {allLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { setSelectedLocation(loc); setIsLocationDropdownOpen(false); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${selectedLocation === loc ? "bg-primary text-black" : "text-stone-300 hover:bg-white/5"}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Online Status Toggle Switch */}
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`h-10 px-4 rounded-xl border text-sm font-semibold flex items-center gap-2.5 transition-all ${
                onlyOnline 
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                  : "bg-[#12100b] border-white/[0.08] text-stone-300 hover:border-white/20"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${onlyOnline ? "bg-emerald-400 animate-pulse" : "bg-stone-600"}`} />
              <span>Online Only</span>
            </button>
          </div>

          {/* Sort selection & active filter cleanups */}
          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-white/[0.05] pt-3 md:pt-0">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "relevance" | "rating" | "reviews")}
                className="bg-transparent border-0 text-stone-300 text-xs font-semibold focus:outline-none focus:ring-0 cursor-pointer hover:text-white"
              >
                <option value="relevance" className="bg-[#1a1610] text-white">Sort: Best Match</option>
                <option value="rating" className="bg-[#1a1610] text-white">Sort: Rating</option>
                <option value="reviews" className="bg-[#1a1610] text-white">Sort: Reviews</option>
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 px-2.5 hover:bg-white/5 text-xs text-primary font-bold gap-1 rounded-lg"
              >
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Discovery Summary Info */}
        <div className="flex items-center justify-between text-xs text-stone-400 px-1">
          <p>
            Showing <strong className="text-white font-bold">{filteredDesigners.length}</strong> designers
          </p>
          {selectedCategory !== "all" && (
            <p>
              Specializing in <span className="text-primary font-semibold">{SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES] || selectedCategory}</span>
            </p>
          )}
        </div>

        {/* Results Grid - Masonry Style */}
        {filteredDesigners.length === 0 ? (
          <div className="bg-[#1a1610]/40 border border-white/[0.06] rounded-3xl p-16 text-center">
            <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-stone-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No matching designers found</h3>
            <p className="text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
              Try loosening your filters, switching locations, or resetting search keywords.
            </p>
            <Button variant="ghost" onClick={handleClearFilters} className="mt-5 bg-primary text-black font-semibold hover:bg-primary/95">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredDesigners.map((designer) => (
              <DesignerCard
                key={designer._id}
                designer={{
                  ...designer,
                  name: designer.name || "Designer",
                  isVerified: (designer.averageRating || 0) >= 4.7,
                  skillLevel:
                    (designer.averageRating || 0) >= 4.8
                      ? "expert"
                      : (designer.averageRating || 0) >= 4.3
                      ? "advanced"
                      : (designer.averageRating || 0) >= 3.8
                      ? "intermediate"
                      : "beginner",
                }}
              />
            ))}
          </div>
        )}

      </section>
    </main>
  )
}

export default Designers