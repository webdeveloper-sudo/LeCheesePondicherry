"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Sparkles, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import scooterPrize from "@/assets/images/electric-scooter-prize.jpg";

export default function PrizeSection() {
  const scrollToForm = () => {
    const el = document.getElementById("entry-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="prize" className="py-16 md:py-24 bg-[#03132B] text-white relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#FAB519]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-[#FAB519]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#FAB519]" />
            <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
              Grand Prize Reveal
            </span>
            <span className="h-px w-8 bg-[#FAB519]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight mb-4 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            🏆 One Electric Scooter
          </h2>

          <div className="text-lg sm:text-xl font-bold text-[#FAB519] tracking-wide mb-3">
            One recipe. One Reel. One big ride.
          </div>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Imagine turning something you created in your kitchen into your next ride. All it takes is one eligible Reel with the highest reach.
          </p>
        </div>

        {/* Hero Prize Showcase Box */}
        <div className="max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-[#FAB519]/40 via-white/10 to-transparent shadow-2xl">
          <div className="rounded-[22px] bg-[#051F44] border border-white/10 overflow-hidden p-6 sm:p-10 lg:p-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Prize Visual */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/60 aspect-[16/10] group">
                  <img
                    src={scooterPrize}
                    alt="Grand Prize: Modern Electric Scooter for Le Pondicherry Cheese Cooking Challenge"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Gold Overlay Ribbon */}
                  <div className="absolute top-4 left-4 bg-[#FAB519] text-[#1A1A1A] font-extrabold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Trophy className="w-4 h-4 fill-current" />
                    <span>FIRST PRIZE</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold text-[#FAB519]">Official First Prize Asset</span>
                    <span className="text-white/80">Eco-Friendly • Zero Emissions</span>
                  </div>
                </div>
              </div>

              {/* Prize Details & Narrative */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FAB519] block mb-2">
                    Winner Takes All
                  </span>
                  
                  <h3
                    className="text-2xl sm:text-3xl font-normal text-white mb-4 leading-snug"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Could Your Recipe Go All The Way?
                  </h3>

                  <p className="text-sm text-white/80 leading-relaxed mb-6">
                    No complicated judging panels. No arbitrary votes. Your prize depends entirely on pure, verifiable audience reach during your Reel’s 21-day window.
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                      <div className="w-6 h-6 rounded-full bg-[#FAB519]/20 flex items-center justify-center text-[#FAB519] flex-shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span>Brand new high-efficiency Electric Scooter</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                      <div className="w-6 h-6 rounded-full bg-[#FAB519]/20 flex items-center justify-center text-[#FAB519] flex-shrink-0">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span>Fully road-legal with manufacturer warranty</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                      <div className="w-6 h-6 rounded-full bg-[#FAB519]/20 flex items-center justify-center text-[#FAB519] flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Awarded to the creator with #1 verified reach</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAB519] hover:bg-[#C9A961] text-[#1A1A1A] font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-300 shadow-xl"
                  >
                    <span>Join The Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    to="/buy-cheese-online"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 hover:border-[#FAB519] text-white hover:text-[#FAB519] font-semibold text-sm px-6 py-3.5 rounded-full transition-all duration-300"
                  >
                    <span>Order Cheese</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
