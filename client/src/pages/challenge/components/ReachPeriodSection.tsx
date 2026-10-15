"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { Calendar, Timer, TrendingUp, Award, ShieldCheck, Flame, Users } from "lucide-react";

export default function ReachPeriodSection() {
  const reachMilestones = [
    {
      phase: "DAY 01",
      title: "Reel Goes Live & Entry Logged",
      desc: "Post your Reel on Instagram, submit your URL here, and your personal 21-day reach clock officially begins.",
      icon: Calendar,
      highlight: "Clock Starts",
    },
    {
      phase: "DAYS 02 — 20",
      title: "Build Your Audience & Shares",
      desc: "Share with friends, family, and food communities. Strong hooks and craveable visuals keep viewers watching.",
      icon: TrendingUp,
      highlight: "Organic Reach",
    },
    {
      phase: "DAY 21",
      title: "Final Reach Recorded",
      desc: "At the exact end of your 21-day window, your eligible Reel reach is locked in for leaderboard & winner tally.",
      icon: Award,
      highlight: "Score Locked",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#051F44] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-dark-cheese opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FAB519]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#FAB519]" />
            <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
              Fair Competition Mechanic
            </span>
            <span className="h-px w-8 bg-[#FAB519]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight mb-4 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            21 Days To Make Your Reel Reach
          </h2>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Every participant gets their own 21-day reach period. That means the competition isn’t simply about who posts first.
          </p>
        </div>

        {/* 21-Day Highlight Box */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#FAB519]/15 via-white/5 to-[#FAB519]/15 border border-[#FAB519]/40 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Big 21 Number */}
            <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-white/15 pb-6 md:pb-0 md:pr-6">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#FAB519] tracking-tighter leading-none block">
                21
              </span>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/90 mt-2 block">
                Days Fair Window
              </span>
              <span className="inline-block mt-3 px-3 py-1 rounded-full text-[11px] bg-white/10 text-white/80 font-medium">
                Personalized per entry
              </span>
            </div>

            {/* Explanation */}
            <div className="md:col-span-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Your Reel. Your 21 Days. Your Chance.
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Whether you publish your Reel today or two weeks from now, you get an uninterrupted 21-day measurement window from your Reel's publication date. At the end of your 21 days, your eligible Reel's final reach is recorded.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FAB519]">
                <Flame className="w-4 h-4" />
                <span>The creator with the highest eligible reach at the end of their period wins the Electric Scooter!</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3-Step Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reachMilestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.phase}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-[#03132B]/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-[#FAB519]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#FAB519] tracking-wider">
                      {m.phase}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {m.highlight}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#FAB519]/15 flex items-center justify-center text-[#FAB519] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h4 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    {m.title}
                  </h4>

                  <p className="text-xs text-white/70 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/50 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FAB519]" />
                  <span>Verified by Le Pondicherry Team</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tip Box */}
        <div className="mt-12 text-center max-w-2xl mx-auto text-xs text-white/60">
          <p>
            💡 <strong className="text-white">Pro Tip:</strong> Don’t just make a Reel — make people want to watch and share it! Hook viewers in the first 3 seconds, show gooey cheese pulls, and share the recipe steps.
          </p>
        </div>

      </div>
    </section>
  );
}
