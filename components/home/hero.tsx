"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { DesignerCard } from "@/components/reusable/designercard";

export default function Hero() {
  const [showDesigner, setShowDesigner] = useState(false);

  const sampleDesigner = {
    distance: 2.4,
    image: "/avatar-placeholder.png",
    name: "Ava Stone",
    location: { city: "London" },
    samples: [
      { imageUrl: "/portfolio-1.jpg" },
      { imageUrl: "/portfolio-2.jpg" },
    ],
    averageRating: 4.8,
  };
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-gradient z-10"></div>
        <Image
          alt="Compelling brand identity showcase"
          fill
          className="w-full h-full object-cover brightness-30"
          src="/herobackdrop.png"
        />
      </div>
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        <span className="inline-block text-primary font-bold tracking-[0.3em] uppercase text-sm mb-6 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
          A New Era of Digital Presence
        </span>
        <h1 className="text-3xl md:text-7xl font-black leading-tight tracking-tighter text-white mb-8">
          Bridging the gap between <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
            Physical branding 
          </span>
           & <br/> 
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
            {" "}
            Digital Innovations
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          We don't just build websites; we architect legacies. Elevate your
          narrative with design that speaks louder than words.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button
            onClick={() => setShowDesigner(true)}
            className="bg-primary text-gray-900 px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(250,198,56,0.4)] transition-all"
          >
            Explore designers
          </button>
        </div>

        {showDesigner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowDesigner(false)}
              aria-hidden
            />

            <div
              className="relative w-full max-w-md mx-auto bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowDesigner(false)}
                  aria-label="Close designer card"
                  className="text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <DesignerCard designer={sampleDesigner} />
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
