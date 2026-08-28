"use client"

import React, { useMemo, useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import type { Doc } from "@/convex/_generated/dataModel"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Briefcase, 
  MessageSquare, 
  ExternalLink,
  Clock,
  RotateCcw,
  Check,
  Globe,
  Calendar,
  Sparkles,
  ShieldCheck,
  Info
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"

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

export default function DesignerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn } = useUser()
  const designerId = params.id as Id<"profiles">

  // Convex Queries
  const designer = useQuery(api.profiles.getDesignerById, { designerId })
  const portfolioItems = useQuery(api.portfolio.getDesignerPortfolio, { designerId })
  const reviews = useQuery(api.reviews.getReviewsForDesigner, { designerId })

  // State
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"basic" | "standard" | "premium">("basic")
  
  // Embla Carousel control
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    const syncSlide = () => {
      setCurrentSlideIndex(carouselApi.selectedScrollSnap())
    }
    carouselApi.on("select", syncSlide)
    const timer = setTimeout(syncSlide, 0)
    return () => {
      clearTimeout(timer)
    }
  }, [carouselApi])

  const requireSignIn = async (next: () => void) => {
    if (!isSignedIn) {
      router.push("/signin")
      return
    }
    next()
  }

  const handleContact = () =>
    requireSignIn(() => router.push("/dashboard/messages"))

  const handleHire = () =>
    requireSignIn(() => router.push("/dashboard/jobs/post"))

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })

  const displaySkill = useMemo(() => {
    if (!designer?.skills) return "Designer"
    const skill = designer.skills[0]
    return skill ? SKILL_CATEGORIES[skill as keyof typeof SKILL_CATEGORIES] || skill : "Designer"
  }, [designer])

  // Pricing calculations
  const basePrice = useMemo(() => {
    if (!designer) return 50
    const code = designer._id.charCodeAt(designer._id.length - 1) || 0
    return 45 + (code % 8) * 35
  }, [designer])

  const pricingPackages = useMemo(() => {
    return {
      basic: {
        price: basePrice,
        delivery: 3,
        revisions: "3 Revisions",
        description: `Essential design for ${displaySkill}. Includes 1 high-resolution design concept draft, editable source file, and commercial rights.`,
        features: ["1 Design Concept", "Source File Included", "Commercial Use License", "High Resolution Output"]
      },
      standard: {
        price: Math.round(basePrice * 2.5),
        delivery: 5,
        revisions: "5 Revisions",
        description: `Standard professional grade ${displaySkill}. Includes 2 design concepts, layered source files, full branding guides, and priority queue delivery.`,
        features: ["2 Design Concepts", "Source File Included", "Commercial Use License", "High Resolution Output", "Layered/Vector File", "Priority Delivery"]
      },
      premium: {
        price: Math.round(basePrice * 5),
        delivery: 7,
        revisions: "Unlimited Revisions",
        description: `VVIP elite ${displaySkill} pack. 3 advanced mockup options, customized layout guide, priority 24/7 communications, and complete commercial copyright assets.`,
        features: ["3 Design Concepts", "Source File Included", "Commercial Use License", "High Resolution Output", "Layered/Vector File", "Priority Delivery", "Unlimited Revisions", "1-on-1 Consultation Call"]
      }
    }
  }, [basePrice, displaySkill])

  // Mock Review summary
  const reviewStats = useMemo(() => {
    if (!reviews || reviews.length === 0) return { avg: "New", count: 0, distribution: [0, 0, 0, 0, 0] }
    const total = reviews.reduce((sum, r) => sum + r.rating, 0)
    const avg = (total / reviews.length).toFixed(1)
    const dist = [0, 0, 0, 0, 0] // index 0: 5 stars, index 4: 1 star
    reviews.forEach(r => {
      const idx = Math.max(0, 5 - Math.round(r.rating))
      dist[idx]++
    })
    return { avg, count: reviews.length, distribution: dist }
  }, [reviews])

  if (designer === undefined) {
    return (
      <div className="min-h-screen bg-[#12100b] text-white pt-20">
        <div className="border-b border-white/[0.06] bg-[#1a1610]">
          <div className="max-w-7xl mx-auto px-5 py-6">
            <Skeleton className="h-5 w-36" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="aspect-video w-full rounded-2xl" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (designer === null) {
    return (
      <div className="min-h-screen bg-[#12100b] text-white flex items-center justify-center pt-20">
        <div className="text-center space-y-5">
          <h1 className="text-3xl font-black text-white">Designer Profile Unreachable</h1>
          <p className="text-stone-400 max-w-sm">This designer profile might be deactivated or doesn&apos;t exist in our system.</p>
          <Link
            href="/designers"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Discovery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#12100b] text-white pb-24 pt-20">
      {/* Sub-header Navigation / Breadcrumbs */}
      <div className="border-b border-white/[0.06] bg-[#16130c]/90 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link
            href="/designers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Designers
          </Link>

          <div className="text-xs text-stone-400 hidden sm:flex items-center gap-2">
            <span>Designers</span>
            <span>/</span>
            <span className="text-stone-300">{displaySkill}</span>
            <span>/</span>
            <span className="text-white font-semibold">{designer.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          
          {/* LEFT COLUMN - Main Content Details */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Title Block */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                I will provide premium design solutions in {displaySkill}
              </h1>

              {/* Seller info stripe */}
              <div className="flex flex-wrap items-center gap-4 text-sm pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-10 h-10 rounded-full bg-primary/20 border border-white/10 flex items-center justify-center overflow-hidden">
                    {designer.image ? (
                      <img src={designer.image} alt={designer.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base font-bold text-primary">
                        {designer.name?.charAt(0)?.toUpperCase() || "D"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{designer.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      <span>{designer.location?.city}, {designer.location?.country}</span>
                    </div>
                  </div>
                </div>

                <div className="h-6 w-px bg-white/[0.08]" />

                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{reviewStats.avg}</span>
                  <span className="text-stone-400 text-xs">({reviewStats.count} reviews)</span>
                </div>

                {designer.averageRating && designer.averageRating >= 4.7 && (
                  <>
                    <div className="h-6 w-px bg-white/[0.08]" />
                    <Badge className="bg-primary/10 text-primary border border-primary/25 text-[10px] font-black uppercase tracking-wider rounded">
                      TOP RATED SELLER
                    </Badge>
                  </>
                )}

                {designer.isOnline && (
                  <div className="ml-auto sm:ml-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online Now
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Embla Portfolio Carousel */}
            <div className="space-y-3">
              {portfolioItems === undefined ? (
                <Skeleton className="aspect-video w-full rounded-2xl" />
              ) : portfolioItems.length > 0 ? (
                <div className="relative group">
                  <Carousel setApi={setCarouselApi} className="w-full relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12100b]">
                    <CarouselContent className="m-0">
                      {portfolioItems.map((item: Doc<"portfolioItems">) => (
                        <CarouselItem key={item._id} className="p-0 select-none">
                          <button
                            onClick={() => setSelectedImage(item.imageUrl)}
                            className="w-full aspect-video relative block overflow-hidden focus:outline-none"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.category}
                              className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                            />
                            {/* Visual Overlay Zoom */}
                            <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl shadow-xl flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 fill-black" />
                                Click to View Fullscreen
                              </span>
                            </div>
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    
                    {/* Carousel Nav Arrows */}
                    {portfolioItems.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/60 hover:bg-black/90 text-white w-10 h-10 flex items-center justify-center shadow-lg" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/60 hover:bg-black/90 text-white w-10 h-10 flex items-center justify-center shadow-lg" />
                      </>
                    )}
                  </Carousel>

                  {/* Thumbnail Row Below Slider */}
                  {portfolioItems.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-2 pr-1 scrollbar-none">
                      {portfolioItems.map((item: Doc<"portfolioItems">, index: number) => (
                        <button
                          key={item._id}
                          onClick={() => carouselApi?.scrollTo(index)}
                          className={`relative aspect-video w-20 rounded-lg overflow-hidden border-2 bg-[#1a1610] flex-shrink-0 transition-all ${
                            index === currentSlideIndex 
                              ? "border-primary scale-[1.03] shadow-md shadow-primary/10" 
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#1a1610] border border-white/[0.06] rounded-2xl p-12 text-center">
                  <Briefcase className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Portfolio empty</h3>
                  <p className="text-stone-400 text-xs">No sample images uploaded by this designer yet.</p>
                </div>
              )}
            </div>

            {/* About Designer Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white border-l-2 border-primary pl-3">About The Gig</h2>
              {designer.bio ? (
                <p className="text-stone-200 text-sm leading-relaxed whitespace-pre-line">{designer.bio}</p>
              ) : (
                <p className="text-stone-500 text-xs italic">No gig description available.</p>
              )}
            </div>

            {/* Skills */}
            {designer.skills && designer.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-400">Skills & Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {designer.skills.map((skill: string) => (
                    <Badge 
                      key={skill} 
                      className="bg-white/[0.03] hover:bg-primary/10 hover:text-primary transition-all border border-white/10 text-stone-300 font-semibold px-3 py-1 rounded-lg text-xs"
                    >
                      {SKILL_CATEGORIES[skill as keyof typeof SKILL_CATEGORIES] || skill.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* About Seller Extended Profile */}
            <div className="bg-[#1a1610] border border-white/[0.06] rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">About the Seller</h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-white/[0.05]">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {designer.image ? (
                    <img src={designer.image} alt={designer.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {designer.name?.charAt(0)?.toUpperCase() || "D"}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">{designer.name}</h3>
                  <p className="text-xs text-stone-400">{displaySkill} & Brand Consultant</p>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{reviewStats.avg}</span>
                    <span>({reviewStats.count} Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="block text-stone-500 mb-1">From</span>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <Globe className="w-3.5 h-3.5 text-stone-400" />
                    <span>{designer.location?.country || "Worldwide"}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-stone-500 mb-1">Member since</span>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>2024</span>
                  </div>
                </div>
                <div>
                  <span className="block text-stone-500 mb-1">Avg. response time</span>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>1 hour</span>
                  </div>
                </div>
                <div>
                  <span className="block text-stone-500 mb-1">Last delivery</span>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                    <span>2 days ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Reviews */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-l-2 border-primary pl-3">Customer Reviews</h2>

              {reviews === undefined ? (
                <div className="space-y-4 animate-pulse">
                  {[0, 1].map((i) => (
                    <div key={i} className="bg-[#1a1610] border border-white/10 rounded-xl p-5">
                      <Skeleton className="h-4 w-40 mb-3" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Reviews Summary block */}
                  <div className="bg-[#1a1610] border border-white/[0.06] rounded-2xl p-5 flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center md:border-r border-white/[0.08] md:pr-8 py-2">
                      <span className="text-4xl font-black text-white">{reviewStats.avg}</span>
                      <div className="flex items-center justify-center gap-0.5 my-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < Math.round(Number(reviewStats.avg)) ? "text-amber-400 fill-amber-400" : "text-stone-700"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-stone-400">{reviewStats.count} Reviews</span>
                    </div>

                    {/* Bar breakdown */}
                    <div className="flex-1 w-full space-y-2 text-xs">
                      {reviewStats.distribution.map((count, index) => {
                        const stars = 5 - index
                        const percent = reviewStats.count > 0 ? (count / reviewStats.count) * 100 : 0
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="w-10 text-stone-300 font-semibold">{stars} Star</span>
                            <div className="flex-1 h-2 bg-[#12100b] rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="w-6 text-right text-stone-400 font-semibold">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* List of customer reviews */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-[#1a1610] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                              {review.reviewerName?.charAt(0)?.toUpperCase() || "A"}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xs">{review.reviewerName}</h4>
                              <p className="text-[10px] text-stone-400 font-medium">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.round(review.rating) ? "text-amber-400 fill-amber-400" : "text-stone-800"}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-stone-300 text-xs leading-relaxed pl-12">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1a1610] border border-white/[0.06] rounded-2xl p-8 text-center">
                  <Star className="w-10 h-10 text-stone-700 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">No reviews yet</h3>
                  <p className="text-stone-400 text-xs">
                    Get in touch with this designer and initiate your first contract to leave feedback!
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN - Sticky Action Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-36 space-y-6">
            
            {/* Fiverr style tabs selector card */}
            <div className="bg-[#1a1610] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Tab headers */}
              <div className="grid grid-cols-3 border-b border-white/[0.08] text-xs font-bold text-center">
                {(["basic", "standard", "premium"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3.5 capitalize transition-all border-b-2 focus:outline-none ${
                      activeTab === tab 
                        ? "border-primary text-primary font-black bg-white/[0.02]" 
                        : "border-transparent text-stone-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content Body */}
              <div className="p-5 space-y-6">
                
                {/* Title and Price */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-300">{pricingPackages[activeTab].title}</h3>
                  <span className="text-xl font-black text-white">${pricingPackages[activeTab].price}</span>
                </div>

                {/* Scope Description */}
                <p className="text-stone-300 text-xs leading-relaxed">
                  {pricingPackages[activeTab].description}
                </p>

                {/* Delivery and Revisions */}
                <div className="flex items-center gap-4 text-xs font-bold text-stone-300 pb-3 border-b border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span>{pricingPackages[activeTab].delivery} Days Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-stone-400" />
                    <span>{pricingPackages[activeTab].revisions}</span>
                  </div>
                </div>

                {/* Features checklist */}
                <ul className="space-y-2.5 text-xs text-stone-300">
                  {pricingPackages[activeTab].features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button 
                    onClick={handleHire} 
                    className="w-full h-11 bg-primary text-black hover:bg-primary/95 font-bold text-xs rounded-xl shadow-lg shadow-primary/5 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Order Now (${pricingPackages[activeTab].price})
                  </Button>
                  <Button 
                    onClick={handleContact} 
                    variant="outline" 
                    className="w-full h-11 border-white/[0.08] hover:border-white/20 bg-transparent text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                </div>

                <div className="flex gap-2 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-[10px] text-stone-400">
                  <Info className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                  <span>Contracts are bound under Etest platform security. Work begins once a project milestones terms are signed.</span>
                </div>
              </div>
            </div>

            {/* External portfolio callout card if available */}
            {designer.portfolioUrl && (
              <a
                href={designer.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-[#1a1610] hover:bg-[#231e0f] border border-white/[0.06] hover:border-primary/20 rounded-2xl p-4 transition-all block shadow-md"
              >
                <div>
                  <h4 className="font-bold text-white text-xs group-hover:text-primary transition-colors">Personal Portfolio Site</h4>
                  <p className="text-[10px] text-stone-400">Review full cases studies off-platform</p>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-primary transition-colors" />
              </a>
            )}

            {/* Request custom proposal helper link */}
            <div className="text-center">
              <button 
                onClick={handleContact}
                className="text-xs text-primary font-bold hover:underline"
              >
                Need custom requirements? Get a Quote
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox / Zoom-in Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Portfolio item detail"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/[0.08]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}