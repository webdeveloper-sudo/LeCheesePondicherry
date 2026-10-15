"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Trophy, ArrowRight, Sparkles, Instagram } from "lucide-react";

export default function FinalCTA() {
  const scrollToForm = () => {
    const el = document.getElementById("entry-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLeaderboard = () => {
    const el = document.getElementById("leaderboard");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-[#051F44] text-white relative overflow-hidden text-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-dark-cheese opacity-30 mix-blend-overlay pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#FAB519]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 max-w-4xl">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="h-px w-8 bg-[#FAB519]" />
          <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
            Your Moment To Shine
          </span>
          <span className="h-px w-8 bg-[#FAB519]" />
        </div>

        {/* Big Heading */}
        <h2
          className="text-3xl sm:text-5xl md:text-6xl font-normal leading-tight text-white mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Your Cheese. Your Recipe. <br />
          <span className="text-[#FAB519] italic">Your Chance To Ride.</span>
        </h2>

        {/* 4-Word Rhythm */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6 text-sm sm:text-lg font-extrabold uppercase tracking-widest text-[#FAB519]">
          <span>CREATE IT.</span>
          <span className="text-white/30">•</span>
          <span>POST IT.</span>
          <span className="text-white/30">•</span>
          <span>GET IT SEEN.</span>
          <span className="text-white/30">•</span>
          <span className="text-white underline decoration-[#FAB519]">WIN IT.</span>
        </div>

        {/* Supporting Copy */}
        <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-10">
          Buy your Le Pondicherry Cheese. Create something people want to watch. Post your Reel. Build your reach. And you could be riding away with a brand new Electric Scooter.
        </p>

        {/* Dual Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FAB519] hover:bg-[#C9A961] text-[#1A1A1A] font-bold text-sm sm:text-base px-9 py-4 rounded-full transition-all duration-300 shadow-2xl hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Buy Cheese & Join Now</span>
          </Link>

          <button
            type="button"
            onClick={scrollToForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/35 hover:border-[#FAB519] text-white hover:text-[#FAB519] font-semibold text-sm sm:text-base px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
          >
            <Instagram className="w-5 h-5 text-[#FAB519]" />
            <span>Submit Your Reel</span>
          </button>

          <Link
            to="/cheese-cooking-challenge/leaderboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#FAB519] hover:text-white font-semibold text-xs sm:text-sm px-4 py-2 hover:underline"
          >
            <span>View Leaderboard →</span>
          </Link>
        </div>

        {/* Tamil Banner Punchline */}
        <div className="inline-flex items-center gap-3 bg-black/40 border border-[#FAB519]/30 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[#FAB519] tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#FAB519]" />
          <span>CHEESE-A ORDER PANNU. VANDIYA WIN PANNU! 🧀🏆</span>
        </div>

      </div>
    </section>
  );
}
