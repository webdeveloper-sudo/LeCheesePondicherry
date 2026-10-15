"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { ChefHat, Sparkles, Video, Flame, ArrowRight, Heart } from "lucide-react";
import heroCheeseBoard from "@/assets/images/hero-cheese-board.webp";
import bocconciniPkg from "@/assets/images/products/bocconcini-package.webp";

export default function ChallengeOverview() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] relative overflow-hidden border-y border-[#F0F0F0]">
      {/* Decorative subtle cheese crumb background pattern */}
      <div className="absolute inset-0 bg-pattern opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-gray-100">
                <img
                  src={heroCheeseBoard}
                  alt="Delicious artisanal cheese board and creations"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-2 bg-[#FAB519] text-[#1A1A1A] font-bold text-xs px-3 py-1 rounded-full mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Your Recipe. Your Rules.</span>
                  </div>
                  <p className="text-base font-medium font-serif leading-snug">
                    "Make it yours. Make it cheesy. Make it worth watching."
                  </p>
                </div>
              </div>

              {/* Floating Accent Badge: Product Purchase */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3.5 max-w-[240px]">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] p-1 flex-shrink-0 border border-amber-100">
                  <img src={bocconciniPkg} alt="Le Pondicherry Cheese" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#051F44] uppercase tracking-wider">Step 1 Ready</p>
                  <p className="text-xs text-gray-600 font-medium">Use any 100% natural Le Pondicherry cheese</p>
                </div>
              </div>

              {/* Floating Pill: Instagram Reel */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-[#051F44] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold">
                <Video className="w-4 h-4 text-[#FAB519]" />
                <span>Instagram Reel Format</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            {/* Section Tag */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-[#FAB519]" />
              <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.2em]">
                The Challenge Concept
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More Than A Recipe. <br />
              <span className="text-[#051F44] italic">Make It Your Reel.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-800 font-medium leading-relaxed mb-4"
            >
              You already have a favourite dish. Now give it your cheesy twist.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base"
            >
              Take your Le Pondicherry Cheese, get creative in the kitchen, turn your recipe into a Reel, and let Instagram do the rest. Whether it’s a pizza, pasta, sandwich, dosa, burger or something completely original, there’s only one rule:
            </motion.p>

            {/* Three Mantras Callout */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
            >
              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#FAB519] flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Make it yours</h4>
                  <p className="text-xs text-gray-500">Your unique spin</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#FAB519] flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Make it cheesy</h4>
                  <p className="text-xs text-gray-500">Pure dairy richness</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#FAB519] flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Worth watching</h4>
                  <p className="text-xs text-gray-500">First 10s matter</p>
                </div>
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-gray-700 leading-relaxed mb-8 text-sm sm:text-base border-l-4 border-[#FAB519] pl-4 italic bg-amber-50/50 py-3 rounded-r-lg"
            >
              And if your Reel achieves the highest eligible reach during your 21-day competition period, the Electric Scooter could be yours.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#051F44] hover:bg-[#1A3A20] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                <span>Shop Le Pondicherry Cheese</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
