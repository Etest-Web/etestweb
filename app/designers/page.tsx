"use client"

import React, { useMemo, useState } from "react"
import { DesignerCard } from "@/components/reusable/designercard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"

type Designer = {
  id: number
  name: string
  image: string
  location: { city: string }
  distance: number
  averageRating: number
  samples: { imageUrl: string }[]
  specialties: string[]
}

const sampleDesigners: Designer[] = [
  {
    id: 1,
    name: "Nora Finch",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    location: { city: "Berlin" },
    distance: 2.6,
    averageRating: 4.9,
    specialties: ["UI/UX", "Brand Systems", "Motion"],
    samples: [
      { imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 2,
    name: "Amir Chowdhury",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80",
    location: { city: "Amsterdam" },
    distance: 4.7,
    averageRating: 4.8,
    specialties: ["Product", "Motion", "Design Ops"],
    samples: [
      { imageUrl: "https://images.unsplash.com/photo-1545235617-9465b3f27ecf?auto=format&fit=crop&w=1200&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1545235617-9465b3f27ecf?auto=format&fit=crop&w=1200&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1551807990-a5d14651b5f5?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    id: 3,
    name: "Tessa Morrow",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    location: { city: "London" },
    distance: 8.1,
    averageRating: 5.0,
    specialties: ["Enterprise", "Visual Identity", "Accessibility"],
    samples: [
      { imageUrl: "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1200&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1500829243548-0c1d14d9a4a3?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
]

const Designers = () => {
  const [query, setQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)

  const allSpecialties = useMemo(
    () => Array.from(new Set(sampleDesigners.flatMap((d) => d.specialties))),
    []
  )

  const designers = useMemo(() => {
    return sampleDesigners
      .filter((designer) =>
        designer.name.toLowerCase().includes(query.toLowerCase()) ||
        designer.location.city.toLowerCase().includes(query.toLowerCase())
      )
      .filter((designer) =>
        !selectedSpecialty || designer.specialties.includes(selectedSpecialty)
      )
  }, [query, selectedSpecialty])

  return (
    <main className="bg-slate-950 text-white min-h-screen">
      <section
        className="relative overflow-hidden bg-[url('/hero-backdrop.jpg')] bg-cover bg-center text-white"
        style={{ minHeight: "75vh" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative items-center max-w-7xl flex flex-col mx-auto px-5 py-60">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Meet our designers
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200 text-lg md:text-xl">
            Curated experts in visual identity, UX systems, and product
            storytelling. Explore their portfolios and book your discovery call.
          </p>
        </div>
      </section>

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
              {allSpecialties.map((specialty) => (
                <Badge
                  key={specialty}
                  variant={selectedSpecialty === specialty ? "secondary" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedSpecialty((prev) =>
                      prev === specialty ? null : specialty
                    )
                  }
                >
                  {specialty}
                </Badge>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setQuery("")
                setSelectedSpecialty(null)
              }}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <p className="mb-6 text-sm text-slate-400">
          Showing {designers.length} of {sampleDesigners.length} designers
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designers.map((designer) => (
            <DesignerCard key={designer.id} designer={designer} />
          ))}
        </div>

        {designers.length === 0 && (
          <div className="mt-12 text-center text-slate-400">
            No designers match your query. Try a broader keyword.
          </div>
        )}
      </section>
    </main>
  )
}

export default Designers
