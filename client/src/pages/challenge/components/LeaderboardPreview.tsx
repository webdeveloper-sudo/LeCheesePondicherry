"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, AlertCircle, Eye, X, ExternalLink, ShieldCheck, Flame, Medal } from "lucide-react";

export default function LeaderboardPreview() {
  const [modalOpen, setModalOpen] = useState(false);

  const previewEntries = [
    {
      rank: "01",
      name: "Priya S.",
      handle: "@priya_cooks",
      displayHandle: "@priya…",
      reach: "24,580",
      dish: "Cheesy Sourdough Truffle Pizza",
      badge: "🥇 Rank 1",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      rank: "02",
      name: "Arun K.",
      handle: "@arunk_foodie",
      displayHandle: "@arun…",
      reach: "21,340",
      dish: "Pondy Spiced Mozzarella Dosa",
      badge: "🥈 Rank 2",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    },
    {
      rank: "03",
      name: "Meena R.",
      handle: "@meenaskitchen",
      displayHandle: "@meena…",
      reach: "18,920",
      dish: "Smoked Cheddar Smash Burger",
      badge: "🥉 Rank 3",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  const extendedEntries = [
    ...previewEntries,
    {
      rank: "04",
      name: "Karthik V.",
      handle: "@karthik_bakes",
      displayHandle: "@karthik…",
      reach: "16,450",
      dish: "Baby Swiss Cheese Fondue Pot",
      badge: "Top 5",
      badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
    },
    {
      rank: "05",
      name: "Deepa N.",
      handle: "@deepacooks_pondy",
      displayHandle: "@deepa…",
      reach: "14,890",
      dish: "Burrata Strawberry Balsamic Tart",
      badge: "Top 5",
      badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
    },
  ];

  return (
    <section id="leaderboard" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#FAB519]" />
            <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
              Campaign Rankings
            </span>
            <span className="h-px w-8 bg-[#FAB519]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Watch The Leaderboard
          </h2>

          <p className="text-base sm:text-lg font-medium text-gray-800 mb-2">
            Who's making the biggest splash?
          </p>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            The competition doesn't have to be a mystery. Follow the campaign leaderboard to see the participants currently generating the highest reach.
          </p>
        </div>

        {/* Leaderboard Table Card */}
        <div className="max-w-4xl mx-auto bg-[#FAF7F2] rounded-3xl border border-gray-200/90 shadow-lg overflow-hidden">
          
          {/* Card Top Banner */}
          <div className="bg-[#051F44] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-[#FAB519]" />
              <span className="font-bold text-sm tracking-wide">Current Top Contenders</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-white/10 text-white/80 px-3 py-1 rounded-full font-medium">
                Live 350+ Standings
              </span>
              <Link
                to="/cheese-cooking-challenge/leaderboard"
                className="text-xs font-bold text-[#FAB519] hover:underline flex items-center gap-1"
              >
                <span>View Full Leaderboard</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-[#FAF7F2] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 text-center w-20">Rank</th>
                  <th scope="col" className="px-6 py-4">Participant</th>
                  <th scope="col" className="px-6 py-4">Instagram</th>
                  <th scope="col" className="px-6 py-4 text-right">Reach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/70 bg-white">
                {previewEntries.map((row) => (
                  <tr key={row.rank} className="hover:bg-amber-50/50 transition-colors">
                    {/* Rank */}
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-extrabold text-base text-[#051F44]">
                        {row.rank}
                      </span>
                    </td>

                    {/* Participant & Recipe */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-gray-900">{row.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${row.badgeColor}`}>
                          {row.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{row.dish}</p>
                    </td>

                    {/* Instagram */}
                    <td className="px-6 py-4 font-mono text-xs text-[#051F44]">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 font-medium">
                        {row.displayHandle}
                      </span>
                    </td>

                    {/* Reach */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1 text-[#051F44] font-extrabold text-base font-mono">
                        <Flame className="w-4 h-4 text-[#FAB519]" />
                        <span>{row.reach}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Disclaimer */}
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-gray-200 text-xs text-gray-500 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Verification Note:</strong> Leaderboard figures are subject to verification. Final winner determination will be based on eligible reach recorded according to the campaign Terms & Conditions.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Link
            to="/cheese-cooking-challenge/leaderboard"
            className="inline-flex items-center gap-2 bg-[#051F44] hover:bg-[#1A3A20] text-white font-semibold text-xs sm:text-sm px-7 py-3 rounded-full transition-all shadow-md"
          >
            <Eye className="w-4 h-4 text-[#FAB519]" />
            <span>Check The Rankings (350+ Contestants) →</span>
          </Link>
        </div>

      </div>

      {/* Expanded Leaderboard Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col z-10 border border-gray-100"
            >
              {/* Modal Header */}
              <div className="bg-[#051F44] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-[#FAB519]" />
                  <h3 className="font-bold text-base">Campaign Leaderboard Standings</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                  📢 <strong>Official Rankings:</strong> Scores reflect verified organic reach during each participant's 21-day active window. New verified submissions update regularly.
                </div>

                <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
                  {extendedEntries.map((row) => (
                    <div key={row.rank} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-[#051F44] w-6 text-center">
                          {row.rank}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{row.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${row.badgeColor}`}>
                              {row.badge}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{row.dish} • <span className="font-mono text-gray-600">{row.handle}</span></p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Eligible Reach</span>
                        <span className="font-mono font-extrabold text-sm text-[#051F44]">
                          {row.reach}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#051F44] text-white text-xs font-semibold hover:bg-[#1A3A20]"
                >
                  Close Leaderboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
