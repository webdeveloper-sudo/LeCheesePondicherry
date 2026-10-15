"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ChefHat } from "lucide-react";

export default function EntryChecklist() {
  const checklist = [
    "Purchased Le Pondicherry Cheese",
    "Created a dish using your purchased cheese",
    "Shown the cheese + dish introduction within the first 10 seconds",
    "Posted the Reel from a public Instagram account",
    "Tagged @LePondicherryCheese",
    "Added the official campaign hashtag (#LePondicherryCheeseChallenge)",
    "Kept the Reel publicly available",
    "Submitted your Reel URL through the entry form",
  ];

  return (
    <section className="py-14 md:py-20 bg-white relative border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#FAF7F2] border border-gray-200/80 p-6 sm:p-10 shadow-sm">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FAB519] mb-1">
                <ChefHat className="w-4 h-4" />
                <span>Pre-Flight Check</span>
              </div>
              <h3
                className="text-2xl sm:text-3xl font-normal text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your Entry Checklist
              </h3>
            </div>

            <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-xs font-bold text-[#051F44]">
              8 Requirements For Eligibility
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Before you hit Submit, make sure you’ve completed everything on this list:
          </p>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-[#FAB519]/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-[#FAB519] flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom punchline */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-[#051F44]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FAB519]" />
              <span>All set? You're ready to compete for the Electric Scooter!</span>
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("entry-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[#051F44] hover:text-[#FAB519] underline font-bold"
            >
              Fill Entry Form ↑
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
