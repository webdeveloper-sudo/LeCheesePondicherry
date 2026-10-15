"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";

export default function ChallengeFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First one open by default

  const faqs = [
    {
      q: "Who can participate?",
      a: "Anyone who meets the campaign participation requirements can participate.",
    },
    {
      q: "Do I need to buy Le Pondicherry Cheese?",
      a: "Yes. Participants must purchase a Le Pondicherry Cheese product to enter the challenge.",
    },
    {
      q: "Can I use any Le Pondicherry Cheese product?",
      a: "Yes. The challenge allows participants to create their dish using any purchased Le Pondicherry Cheese product, subject to the campaign requirements.",
    },
    {
      q: "What should my Reel contain?",
      a: "Your Reel must feature a dish made using the Le Pondicherry Cheese you purchased. The first 10 seconds must clearly show the purchased product and what dish you are going to create.",
    },
    {
      q: "Does my Instagram account need to be public?",
      a: "Yes. Your Instagram account must remain public so the Reel can be viewed and its reach can be verified.",
    },
    {
      q: "How long do I have to build my reach?",
      a: "You get 21 days from the date your Reel is published. Each participant's 21-day period is calculated separately based on their Reel publication date.",
    },
    {
      q: "How is the winner decided?",
      a: "The participant whose eligible Reel records the highest reach at the end of their applicable 21-day period wins the First Prize: an Electric Scooter.",
    },
    {
      q: "Can I share my Reel with friends?",
      a: "Yes. You can share your Reel and encourage people to watch it. However, fake, purchased or artificially generated engagement may result in disqualification.",
    },
    {
      q: "Can I see who is currently leading?",
      a: "Yes. Visit the campaign Leaderboard to see the current rankings.",
      hasLeaderboardLink: true,
    },
    {
      q: "What happens if my Reel is deleted or made private?",
      a: "Your Reel must remain publicly available during the applicable competition and reach measurement period. Entries that become unavailable may be considered invalid.",
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const scrollToLeaderboard = () => {
    const el = document.getElementById("leaderboard");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#FAB519]" />
            <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
              Got Questions?
            </span>
            <span className="h-px w-8 bg-[#FAB519]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about the contest rules, Reel requirements, and winner selection.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:bg-amber-50/30"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-lg font-normal transition-colors ${
                      isOpen ? "text-[#051F44] font-semibold" : "text-gray-900"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "bg-[#FAB519] text-[#1A1A1A] rotate-180" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                        <p>{faq.a}</p>
                        {faq.hasLeaderboardLink && (
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={scrollToLeaderboard}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#051F44] hover:text-[#FAB519] transition-colors"
                            >
                              <span>View Leaderboard Preview</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
