"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { ShoppingBag, Utensils, Video, Instagram, Send, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function ChallengeFlow() {
  const steps = [
    {
      num: "01",
      title: "Get Your Cheese",
      icon: ShoppingBag,
      summary: "Choose any Le Pondicherry Cheese product and place your order through our shop.",
      detail: "Order any handcrafted cheese — Baby Swiss, Mozzarella, Burrata, Cheddar, Ricotta or more. Keep your order confirmation handy.",
      action: {
        label: "Shop Now",
        link: "/shop",
      },
      tag: "Mandatory Step",
    },
    {
      num: "02",
      title: "Create Your Dish",
      icon: Utensils,
      summary: "Bring your recipe to life using the Le Pondicherry Cheese you purchased.",
      detail: "It can be a classic favourite or something nobody has tried before — Pizza, Pasta, Dosa, Sandwich, Burger, or your signature creation. There are no limits to your creativity.",
      tag: "Pure Creativity",
    },
    {
      num: "03",
      title: "Start Your Reel Right",
      icon: Video,
      summary: "Your Reel needs to clearly introduce the challenge right from the start.",
      criticalRule: "Within the first 10 seconds, show:\n1. The Le Pondicherry Cheese product you purchased\n2. The dish you're going to create",
      example: '“I bought Le Pondicherry Fresh Mozzarella, and today I\'m making a cheesy pizza!”',
      tag: "Critical First 10s Rule",
      isHighlighted: true,
    },
    {
      num: "04",
      title: "Post It On Instagram",
      icon: Instagram,
      summary: "Post your cooking video as a Reel on your public Instagram account.",
      detail: "Make sure your profile is public. Tag @LePondicherryCheese and include the official campaign hashtag (#LePondicherryCheeseChallenge). Keep your Reel live and public.",
      tag: "Public Instagram Account",
    },
    {
      num: "05",
      title: "Submit Your Entry",
      icon: Send,
      summary: "Copy your Instagram Reel URL and submit it through the challenge entry form below.",
      detail: "Once verified, your 21-day reach window officially begins from your Reel's publication date. Then share, tell your friends, and build your reach!",
      action: {
        label: "Go to Entry Form",
        scrollId: "entry-form",
      },
      tag: "Starts 21-Day Period",
    },
  ];

  const handleActionClick = (step: any) => {
    if (step.action?.scrollId) {
      const el = document.getElementById(step.action.scrollId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#FAB519]" />
            <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
              The 5-Step Journey
            </span>
            <span className="h-px w-8 bg-[#FAB519]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How The Challenge Works
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Follow these five simple steps to turn your kitchen skills into a high-reach Reel and compete for the Electric Scooter.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                  step.isHighlighted
                    ? "bg-[#051F44] text-white border-2 border-[#FAB519] shadow-lg lg:col-span-1"
                    : "bg-[#FAF7F2] text-[#1A1A1A] border border-gray-200/80 hover:border-[#FAB519]/50"
                }`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        step.isHighlighted ? "text-[#FAB519]" : "text-[#051F44]/40"
                      }`}
                    >
                      {step.num}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        step.isHighlighted
                          ? "bg-[#FAB519] text-[#1A1A1A]"
                          : "bg-white text-gray-700 border border-gray-200"
                      }`}
                    >
                      {step.tag}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        step.isHighlighted
                          ? "bg-white/10 text-[#FAB519]"
                          : "bg-[#051F44] text-[#FAB519]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3
                      className={`text-xl sm:text-2xl font-normal leading-snug ${
                        step.isHighlighted ? "text-white" : "text-gray-900"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {step.title}
                    </h3>
                  </div>

                  {/* Summary */}
                  <p
                    className={`text-sm font-medium mb-3 leading-relaxed ${
                      step.isHighlighted ? "text-white/95" : "text-gray-800"
                    }`}
                  >
                    {step.summary}
                  </p>

                  {/* Details or Critical Callout */}
                  {step.detail && (
                    <p
                      className={`text-xs leading-relaxed mb-4 ${
                        step.isHighlighted ? "text-white/75" : "text-gray-600"
                      }`}
                    >
                      {step.detail}
                    </p>
                  )}

                  {/* Special Critical Rule Box for Step 3 */}
                  {step.criticalRule && (
                    <div className="bg-[#FAB519]/15 border border-[#FAB519]/40 rounded-2xl p-4 my-3 text-xs">
                      <div className="flex items-start gap-2 mb-2 text-[#FAB519] font-bold">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>FIRST 10 SECONDS REQUIREMENT:</span>
                      </div>
                      <div className="space-y-1 text-white/90 pl-6 list-disc">
                        <p>• The Le Pondicherry Cheese product purchased</p>
                        <p>• The dish you are going to create</p>
                      </div>
                      {step.example && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 text-white/80 italic">
                          <span className="text-[#FAB519] font-semibold not-italic">Example: </span>
                          {step.example}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Action (if any) */}
                {step.action && (
                  <div className="mt-5 pt-4 border-t border-gray-200/50">
                    {step.action.link ? (
                      <Link
                        to={step.action.link}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#051F44] hover:text-[#FAB519] transition-colors"
                      >
                        <span>{step.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleActionClick(step)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#051F44] hover:text-[#FAB519] transition-colors"
                      >
                        <span>{step.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-12 bg-amber-50 rounded-2xl p-4 sm:p-6 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#FAB519] flex-shrink-0" />
            <p className="text-xs sm:text-sm text-gray-800 font-medium">
              Every participant gets their own <strong>21-day reach window</strong> from their Reel publication date. Early or late entry, you get the exact same fair 21 days!
            </p>
          </div>
          <Link
            to="/shop"
            className="flex-shrink-0 bg-[#FAB519] hover:bg-[#C9A961] text-[#1A1A1A] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-md"
          >
            Shop Cheese Now
          </Link>
        </div>

      </div>
    </section>
  );
}
