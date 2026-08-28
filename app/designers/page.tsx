"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DesignerCardSkeleton, Skeleton } from "@/components/ui/skeleton"
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
  ArrowUpDown
} from "lucide-react"
import Link from "next/link"

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

function DesignersHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#231e0f] via-[#18140e] to-[#12100b] py-28 lg:py-36 border-b border-white/[0.06]">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      
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

function DesignerCard({ designer }: { designer: DesignerWithSamples }) {
  const portfolioItems = useQuery(api.portfolio.getDesignerPortfolio, {
    designerId: designer._id,
  })

  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const previewItems = portfolioItems?.slice(0, 4) || []
  const primarySkill = designer.skills?.[0]
  const displaySkill = primarySkill ? SKILL_CATEGORIES[primarySkill as keyof typeof SKILL_CATEGORIES] || primarySkill : "Designer"

  // Compute a stable, deterministic starting price based on the designer ID
  const startingPrice = useMemo(() => {
    const code = designer._id.charCodeAt(designer._id.length - 1) || 0
    return 45 + (code % 8) * 35
  }, [designer._id])

  // Count reviews mock
  const reviewCount = useMemo(() => {
    const code = designer._id.charCodeAt(designer._id.length - 2) || 0
    return (code % 45) + 8
  }, [designer._id])

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (previewItems.length > 0) {
      setActiveImgIndex((prev) => (prev + 1) % previewItems.length)
    }
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (previewItems.length > 0) {
      setActiveImgIndex((prev) => (prev - 1 + previewItems.length) % previewItems.length)
    }
  }

  return (
    <div 
      className="group relative flex flex-col bg-[#1a1610] border border-white/[0.08] hover:border-primary/40 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(250,198,56,0.08)] hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setActiveImgIndex(0)
      }}
    >
      {/* Portfolio Gallery Preview */}
      <Link href={`/designers/${designer._id}`} className="relative aspect-[4/3] w-full bg-[#12100b] overflow-hidden block">
        {portfolioItems === undefined ? (
          <div className="w-full h-full animate-pulse bg-gradient-to-br from-white/[0.03] via-white/[0.08] to-white/[0.03]" />
        ) : previewItems.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={previewItems[activeImgIndex].imageUrl}
              alt={`${designer.name}'s work preview`}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              loading="lazy"
            />
            {/* Gallery Arrows (visible on hover) */}
            {previewItems.length > 1 && isHovered && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/10 shadow-lg transition-all"
                  aria-label="Previous portfolio item"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/10 shadow-lg transition-all"
                  aria-label="Next portfolio item"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Slider Dots */}
            {previewItems.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {previewItems.map((_, i) => (
                  <span 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === activeImgIndex ? "bg-primary w-3" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#18140e] border-b border-white/[0.03] p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-primary">
                {designer.name?.charAt(0)?.toUpperCase() || "D"}
              </span>
            </div>
            <span className="text-xs text-stone-500">No portfolio items uploaded</span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white hover:text-red-500 transition-colors z-20"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Pro / Vetted Label */}
        {designer.averageRating && designer.averageRating >= 4.7 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-primary text-black text-[10px] font-black uppercase tracking-wider shadow-md z-20">
            PRO VETTED
          </span>
        )}

        {/* Online Indicator */}
        {designer.isOnline && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider z-20">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Online
          </div>
        )}
      </Link>

      {/* Card Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Seller Metadata Header */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full bg-primary/20 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {designer.image ? (
                <img src={designer.image} alt={designer.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary">
                  {designer.name?.charAt(0)?.toUpperCase() || "D"}
                </span>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <Link href={`/designers/${designer._id}`} className="font-bold text-sm text-white hover:text-primary transition-colors block truncate">
                {designer.name}
              </Link>
              <div className="flex items-center gap-1 text-[11px] text-stone-400">
                <MapPin className="w-3 h-3 text-stone-500 flex-shrink-0" />
                <span className="truncate">{designer.location?.city}, {designer.location?.country}</span>
              </div>
            </div>
          </div>

          {/* Fiverr Gig style title */}
          <Link href={`/designers/${designer._id}`} className="block group/link">
            <h3 className="font-semibold text-sm text-stone-200 line-clamp-2 leading-snug group-hover/link:text-primary transition-colors">
              I will provide expert services in {displaySkill} & branding strategy
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="font-bold text-white">
              {designer.averageRating ? designer.averageRating.toFixed(1) : "New"}
            </span>
            <span className="text-stone-400">
              ({reviewCount})
            </span>
          </div>
        </div>

        {/* Footer info: Category badge and deterministically estimated starting price */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] h-5 border-white/10 text-stone-300 font-medium tracking-normal bg-white/[0.02]">
            {displaySkill}
          </Badge>
          
          <div className="text-right">
            <span className="block text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Starting At</span>
            <span className="text-sm font-black text-white">${startingPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Designers = () => {
  const designers = useQuery(api.profiles.listDesigners)
  
  // States
  const [query, setQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [onlyOnline, setOnlyOnline] = useState(false)
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "reviews">("relevance")
  
  // Dropdown States
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  
  // Refs for closing popups on click outside
  const skillDropdownRef = useRef<HTMLDivElement>(null)
  const locationDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target as Node)) {
        setIsSkillDropdownOpen(false)
      }
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

      const matchesSkill = !selectedSkill || designer.skills?.includes(selectedSkill)
      const matchesLocation = selectedLocation === "all" || designer.location?.country === selectedLocation
      const matchesOnline = !onlyOnline || designer.isOnline

      return matchesSearch && matchesSkill && matchesLocation && matchesOnline
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
  }, [designers, query, selectedSkill, selectedLocation, onlyOnline, sortBy])

  const hasActiveFilters = query !== "" || selectedSkill !== null || selectedLocation !== "all" || onlyOnline

  const handleClearFilters = () => {
    setQuery("")
    setSelectedSkill(null)
    setSelectedLocation("all")
    setOnlyOnline(false)
    setSortBy("relevance")
  }

  if (designers === undefined) {
    return (
      <main className="bg-[#12100b] text-white min-h-screen">
        <DesignersHero />
        <section className="max-w-7xl mx-auto px-5 py-12 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-11 w-full max-w-md rounded-xl" />
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        
        {/* Horizontal Category Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.06]">
          <button
            onClick={() => setSelectedSkill(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
              selectedSkill === null
                ? "bg-primary text-black border-primary font-bold shadow-md shadow-primary/10"
                : "bg-white/[0.03] border-white/10 text-stone-300 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
            }`}
          >
            All Fields
          </button>
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedSkill === skill
                  ? "bg-primary text-black border-primary font-bold shadow-md shadow-primary/10"
                  : "bg-white/[0.03] border-white/10 text-stone-300 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {SKILL_CATEGORIES[skill as keyof typeof SKILL_CATEGORIES] || skill.replace("-", " ")}
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
                className="pl-10 h-10 border-white/[0.08] bg-[#12100b] text-white placeholder-stone-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm rounded-xl w-full"
              />
            </div>

            {/* Custom Skill Category Dropdown */}
            <div className="relative" ref={skillDropdownRef}>
              <button
                onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                className={`h-10 px-4 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                  selectedSkill 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-[#12100b] border-white/[0.08] text-stone-300 hover:border-white/20"
                }`}
              >
                <span>Category</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSkillDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isSkillDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#1a1610] border border-white/10 shadow-2xl p-3 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 px-2 pb-1.5 border-b border-white/[0.05]">Filter Category</p>
                  <div className="max-h-60 overflow-y-auto pt-1 space-y-0.5">
                    <button 
                      onClick={() => { setSelectedSkill(null); setIsSkillDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${!selectedSkill ? "bg-primary text-black" : "text-stone-300 hover:bg-white/5"}`}
                    >
                      All Categories
                    </button>
                    {allSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => { setSelectedSkill(skill); setIsSkillDropdownOpen(false); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${selectedSkill === skill ? "bg-primary text-black" : "text-stone-300 hover:bg-white/5"}`}
                      >
                        {SKILL_CATEGORIES[skill as keyof typeof SKILL_CATEGORIES] || skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              <span>Online Sellers</span>
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
          {selectedSkill && (
            <p>
              Specializing in <span className="text-primary font-semibold">{SKILL_CATEGORIES[selectedSkill as keyof typeof SKILL_CATEGORIES] || selectedSkill}</span>
            </p>
          )}
        </div>

        {/* Results Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigners.map((designer) => (
              <DesignerCard key={designer._id} designer={designer} />
            ))}
          </div>
        )}

      </section>
    </main>
  )
}

export default Designers