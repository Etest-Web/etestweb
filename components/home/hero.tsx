"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", count: 1240 },
    { id: "ui-ux-design", label: "UI/UX Design", count: 280 },
    { id: "logo-design", label: "Logo Design", count: 195 },
    { id: "brand-identity", label: "Brand Identity", count: 150 },
    { id: "illustration", label: "Illustration", count: 180 },
    { id: "motion-design", label: "Motion Design", count: 95 },
    { id: "web-design", label: "Web Design", count: 140 },
    { id: "video-editing", label: "Video Editing", count: 75 },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would trigger search
  };

  return (
    <section className="relative min-h-[100dvh] bg-gradient-to-b from-[#231e0f] via-[#18140e] to-[#12100b] overflow-hidden py-20">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 mesh-gradient"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/3 -translate-y-1/3 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/3 -translate-x-1/3 -translate-y-1/3 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[60px]" />
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-purple-500/15 blur-[50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground/50">🔍</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designers, skills, or portfolios..."
              className="w-full pl-10 pr-4 py-3 bg-background/50 backdrop-blur-sm border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent text-base"
            />
          </div>
        </form>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`category-tab ${
                activeCategory === category.id
                  ? "category-tab--active"
                  : "category-tab--inactive"
              }`}
            >
              {category.label}
              <span className="ml-1 text-xs text-muted-foreground/60">
                ({category.count})
              </span>
            </button>
          ))}
        </div>

        {/* Hero Headline */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-none">
            Discover <span className="gradient-text--brand">Exceptional Design Talent</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
            Browse verified designers with certified skills from Glypha Learn. 
            Find the perfect creative for your next project.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            className="btn-primary"
          >
            Browse Designers
          </button>
          <button
            className="btn-secondary"
          >
            Post a Job
          </button>
        </div>

        {/* Featured Shots Carousel */}
        <div className="relative mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Trending This Week
          </h2>
          
          {/* Carousel Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Most popular shots</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full bg-muted hover:bg-primary/10"
                disabled
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground/50" />
              </button>
              <span className="text-sm text-muted-foreground/60">1 / 8</span>
              <button
                className="p-2 rounded-full bg-muted hover:bg-primary/10"
              >
                <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div className="relative h-56 overflow-hidden">
            <div className="flex gap-4" style={{ transform: "translateX(0)" }}>
              {/* Sample cards - would be dynamic in real implementation */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[280px] flex-shrink-0">
                  <div className="shot-card">
                    <div className="relative h-[70%] overflow-hidden bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">
                            DS
                          </span>
                        </div>
                      </div>
                      <div className="shot-card__overlay">
                        <div className="shot-card__info">
                          <span className="shot-card__category tag-uiux">
                            UI/UX Design
                          </span>
                          <div className="shot-card__name">
                            Design Studio
                          </div>
                          <div className="shot-card__meta flex items-center gap-1 text-xs">
                            <MapPin className="w-3 h-3" />
                            <span>New York, USA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">
                            DS
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">
                            Design Studio
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            New York, USA
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white/80">
          <div>
            <h3 className="text-2xl font-black text-white mb-2">1,240+</h3>
            <p className="text-sm">Verified Designers</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">4.9/5</h3>
            <p className="text-sm">Avg. Rating</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">98%</h3>
            <p className="text-sm">Success Rate</p>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">50+</h3>
            <p className="text-sm">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}
