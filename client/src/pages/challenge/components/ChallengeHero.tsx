"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { Sparkles, Trophy, ShoppingBag, ArrowRight, Instagram, Timer } from "lucide-react";
import scooterPrize from "@/assets/images/electric-scooter-prize.jpg";

export default function ChallengeHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-[#051F44] text-white pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background Ambience & Gradient Orbs */}
      <div className="absolute inset-0 bg-dark-cheese opacity-25 mix-blend-overlay pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FAB519]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#FAB519]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#051F44] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Tamil Catchphrase Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#FAB519]/15 border border-[#FAB519]/40 text-[#FAB519] px-4 py-2 rounded-full backdrop-blur-md shadow-lg shadow-black/20 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-[#FAB519] animate-pulse" />
            <span>Cheese-a Order Pannu. Reel-a Podu. Vandiya Win Pannu!</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#FAB519] text-[#051F44] font-bold">
              TAMIL NADU & PONDY
            </span>
          </div>
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-center lg:text-left"
          >
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center justify-center lg:justify-start gap-2 mb-4"
            >
              <span className="h-px w-8 bg-[#FAB519]" />
              <span className="text-[#FAB519] text-xs md:text-sm uppercase tracking-[0.25em] font-semibold">
                Official Creator Contest
              </span>
              <span className="h-px w-8 bg-[#FAB519] lg:hidden" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-normal leading-[1.1] mb-6 text-white"
              style={{
                fontFamily: "var(--font-heading)",
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
              }}
            >
              Le Pondicherry Cheese{" "}
              <span className="text-[#FAB519] italic block mt-1">Cooking Challenge</span>
            </motion.h1>

            {/* Subheading & Core Concept */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/90 font-medium leading-relaxed mb-4 max-w-2xl mx-auto lg:mx-0"
            >
              Turn your favourite cheesy creation into a chance to win an{" "}
              <span className="text-[#FAB519] font-bold underline decoration-[#FAB519]/50 underline-offset-4">
                Electric Scooter
              </span>.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base text-white/75 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Buy any Le Pondicherry Cheese, create your own recipe, post it as an Instagram Reel, and compete with creators across the campaign. The more reach your Reel gets, the closer you get to the prize.
            </motion.p>

            {/* Campaign Journey Visual Chips */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-8 text-xs font-semibold text-white/80"
            >
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15">BUY CHEESE</span>
              <span className="text-[#FAB519]">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15">CREATE DISH</span>
              <span className="text-[#FAB519]">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15">POST REEL</span>
              <span className="text-[#FAB519]">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15">BUILD REACH</span>
              <span className="text-[#FAB519]">→</span>
              <span className="bg-[#FAB519] text-[#1A1A1A] px-3 py-1.5 rounded-full font-bold shadow-md">
                WIN SCOOTER 🛵
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6"
            >
              <Link
                to="/buy-cheese-online"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAB519] hover:bg-[#C9A961] text-[#1A1A1A] font-bold text-sm sm:text-base px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Buy Cheese & Join The Challenge</span>
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("entry-form")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/35 hover:border-[#FAB519] text-white hover:text-[#FAB519] font-semibold text-sm sm:text-base px-7 py-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
              >
                <Instagram className="w-5 h-5 text-[#FAB519]" />
                <span>Submit Your Reel</span>
              </button>
            </motion.div>

            {/* Legal Micro-note */}
            <motion.p
              variants={fadeUp}
              className="text-xs text-white/50 text-center lg:text-left"
            >
              * Campaign participation requires the purchase of a Le Pondicherry Cheese product. Terms & conditions apply.
            </motion.p>
          </motion.div>

          {/* Right Column: Prize Hero Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-1 bg-gradient-to-b from-[#FAB519]/40 via-white/10 to-transparent shadow-2xl">
              <div className="rounded-[22px] bg-[#03132B]/90 backdrop-blur-xl border border-white/10 overflow-hidden p-6 sm:p-7 relative">
                
                {/* Prize Banner Tag */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 bg-[#FAB519] text-[#1A1A1A] px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md">
                    <Trophy className="w-4 h-4 fill-current" />
                    <span>Grand Prize</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs text-[#FAB519] font-medium bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    <Timer className="w-3.5 h-3.5" />
                    <span>21-Day Reach Window</span>
                  </div>
                </div>

                {/* Scooter Prize Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/40 border border-white/10 shadow-inner group">
                  <img
                    src={scooterPrize}
                    alt="Le Pondicherry Cheese Cooking Challenge Grand Prize: Electric Scooter"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                    <span className="font-semibold tracking-wide text-white">🏆 Electric Scooter</span>
                    <span className="text-[#FAB519] font-bold">1st Prize</span>
                  </div>
                </div>

                {/* Punchy Metric Highlights */}
                <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Recipe</p>
                    <p className="text-sm font-bold text-white">Any Dish</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Format</p>
                    <p className="text-sm font-bold text-white">Insta Reel</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Metric</p>
                    <p className="text-sm font-bold text-[#FAB519]">Max Reach</p>
                  </div>
                </div>

                {/* Micro Action */}
                <div className="mt-5 text-center">
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAB519] hover:text-white transition-colors"
                  >
                    <span>See full contest rules & 5-step flow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
