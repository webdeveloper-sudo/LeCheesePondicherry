"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown, FileText, AlertTriangle } from "lucide-react";

export default function TermsAndConditions() {
  const [isExpanded, setIsExpanded] = useState(false);

  const rules = [
    {
      title: "Participation",
      content: "Participants must purchase a Le Pondicherry Cheese product and use a public Instagram account.",
    },
    {
      title: "Reel Requirements",
      content: "The Reel must feature a dish made using the purchased cheese, be original content, tag the official Le Pondicherry Cheese Instagram account (@LePondicherryCheese), and follow the campaign requirements (including showing the cheese and dish in the first 10 seconds).",
    },
    {
      title: "21-Day Reach Period",
      content: "Each participant receives a 21-day period beginning from the publication of their Reel. The final eligible reach recorded during this period is considered.",
    },
    {
      title: "Winner Determination",
      content: "The participant with the highest eligible reach at the end of their applicable competition period receives the First Prize: an Electric Scooter.",
    },
    {
      title: "Invalid Entries & Disqualification",
      content: "Entries involving fake or purchased engagement, bots, artificially generated traffic, copied content, misleading information, unavailable Reels or other violations of the campaign requirements may be disqualified.",
    },
    {
      title: "Content Usage & Marketing Rights",
      content: "By participating, you grant Le Pondicherry Cheese permission to repost your submitted Reel and use the content for campaign-related marketing and promotional purposes, subject to the applicable terms.",
    },
    {
      title: "Campaign Modification & Cancellation",
      content: "Le Pondicherry Cheese reserves the right to modify, extend, pause or cancel the campaign where necessary. Important changes will be communicated through the campaign's official channels.",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-white relative border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#FAB519]" />
              <span>Official Contest Rules</span>
            </div>

            <h3
              className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Before You Cook, Know The Rules
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
              Participation in the challenge means agreeing to the official campaign Terms & Conditions. Here are the key conditions at a glance.
            </p>
          </div>

          {/* Collapsible Card */}
          <div className="bg-[#FAF7F2] rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
            
            {/* Quick Summary Highlights */}
            <div className="space-y-4 divide-y divide-gray-200/70">
              {rules.slice(0, isExpanded ? rules.length : 3).map((r, idx) => (
                <div key={idx} className={idx > 0 ? "pt-4" : ""}>
                  <h4 className="text-sm font-bold text-[#051F44] mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FAB519]" />
                    <span>{r.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-3.5">
                    {r.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Expand / Collapse Button */}
            <div className="mt-6 pt-5 border-t border-gray-200 flex justify-center">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#051F44] hover:text-[#FAB519] bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isExpanded ? "Collapse Terms & Conditions" : "Read Full Terms & Conditions (7 Rules)"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
