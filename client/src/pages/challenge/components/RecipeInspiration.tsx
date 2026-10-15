"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Pizza, Utensils, Sandwich, Flame } from "lucide-react";
import pizzaellaPkg from "@/assets/images/products/pizzaella-package.webp";
import mozzarellaPkg from "@/assets/images/products/mozzarella-package.webp";
import babySwissPkg from "@/assets/images/products/baby-swiss-package.webp";
import agedCheddarPkg from "@/assets/images/products/aged-cheddar.webp";
import burrataPkg from "@/assets/images/products/burrata-package.webp";
import granaCherryPkg from "@/assets/images/products/grana-chery-package.webp";

export default function RecipeInspiration() {
  const recipes = [
    {
      id: "pizza",
      emoji: "🍕",
      title: "Cheesy Pizza",
      desc: "Woodfired, pan, or thin crust loaded with gooey melted strings.",
      recommendedCheese: "Pizzaella & Fresh Mozzarella",
      cheeseImage: pizzaellaPkg,
      accent: "from-amber-500/20 to-orange-500/10",
      tips: "Film that slow-motion cheese pull right out of the oven!",
    },
    {
      id: "pasta",
      emoji: "🍝",
      title: "Loaded Pasta",
      desc: "Creamy Alfredo, baked mac & cheese, or rich Aglio e Olio with shaved cheese.",
      recommendedCheese: "Grana Cherry & Aged Cheddar",
      cheeseImage: granaCherryPkg,
      accent: "from-yellow-500/20 to-amber-500/10",
      tips: "Show the velvety emulsification of cheese with pasta water.",
    },
    {
      id: "sandwich",
      emoji: "🥪",
      title: "Crazy Cheese Sandwich",
      desc: "Gourmet grilled cheese, sourdough melt, or Bombay triple-decker.",
      recommendedCheese: "Baby Swiss & Smoked Cheddar",
      cheeseImage: babySwissPkg,
      accent: "from-amber-400/20 to-yellow-500/10",
      tips: "Slice down the center diagonally for maximum visual crunch.",
    },
    {
      id: "dosa",
      emoji: "🥞",
      title: "Cheesy Dosa / Uttapam",
      desc: "Crispy South Indian dosa with spiced melted cheese fillings.",
      recommendedCheese: "Pondy Orange & Mozzarella",
      cheeseImage: mozzarellaPkg,
      accent: "from-orange-500/20 to-red-500/10",
      tips: "Melt cheese directly on the tawa over podi masala.",
    },
    {
      id: "burger",
      emoji: "🍔",
      title: "Ultimate Burger",
      desc: "Juicy smashed patty smothered under two thick slices of artisan cheese.",
      recommendedCheese: "Aged Cheddar & Herb Gouda",
      cheeseImage: agedCheddarPkg,
      accent: "from-amber-600/20 to-orange-500/10",
      tips: "Steam the burger under a lid to create a cascading cheese blanket.",
    },
    {
      id: "original",
      emoji: "✨",
      title: "Something Completely Original",
      desc: "Cheese kathi roll, dessert burrata with berries, cheese samosas or your own secret twist!",
      recommendedCheese: "Fresh Burrata & Bocconcini",
      cheeseImage: burrataPkg,
      accent: "from-yellow-400/20 to-emerald-500/10",
      tips: "Bold, unexpected pairings make people hit share and re-watch!",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#FAB519]" />
            <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
              Recipe Inspiration
            </span>
            <span className="h-px w-8 bg-[#FAB519]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1A1A] leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Will You Create?
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            There is no single recipe for winning. Your recipe. Your style. Your cheese twist.
          </p>
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {recipes.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Header emoji & title */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl border border-amber-100 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Idea #{idx + 1}
                  </span>
                </div>

                <h3
                  className="text-xl sm:text-2xl font-normal text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5">
                  {item.desc}
                </p>

                {/* Cheese Pairing Badge */}
                <div className="bg-[#FAF7F2] rounded-2xl p-3 border border-gray-100 flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0 border border-gray-200 overflow-hidden">
                    <img src={item.cheeseImage} alt={item.recommendedCheese} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-[#FAB519] tracking-wider">Recommended Pair</p>
                    <p className="text-xs font-bold text-[#051F44] truncate">{item.recommendedCheese}</p>
                  </div>
                </div>

                {/* Viral Reel Tip */}
                <p className="text-[11px] text-gray-500 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="font-semibold text-gray-700 not-italic">🎬 Reel Hook: </span>
                  {item.tips}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#051F44] group-hover:text-[#FAB519] transition-colors"
                >
                  <span>Shop cheeses for this</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Creative Freedom Callout */}
        <div className="mt-14 text-center">
          <p className="text-sm font-medium text-gray-700 mb-5">
            Have a family recipe, street food fusion, or experimental concept? You can enter with <strong>any dish</strong>!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#051F44] hover:bg-[#1A3A20] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all shadow-md"
          >
            <span>Explore All Cheeses In Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
