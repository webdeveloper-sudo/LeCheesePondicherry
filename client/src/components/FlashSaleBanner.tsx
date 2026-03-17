"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, ShoppingBag } from "lucide-react";

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Countdown Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset or stop (looping for demo effect)
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, "0");

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#FAB519] py-3 via-[#fadea0] to-[#FAB519] bg-[length:200%_100%] animate-shimmer shadow-md text-[#1D161A]">
      {/* Sparkle/Glitter Effects using pseudo-elements in CSS or simple divs */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.webp')] opacity-30 mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-1 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-8 relative z-10">
        {/* Left: Text & Timer */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 animate-bounce text-current shrink-0" />
            <span className="font-bold text-base sm:text-lg uppercase tracking-wide whitespace-nowrap">
              Flash Sale
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/30 px-3 sm:px-4 py-1 rounded-full backdrop-blur-sm border border-white/40 shadow-sm shrink-0">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-v-wide opacity-80">
              Ends in:
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-base sm:text-lg text-[#1a3a20]">
              <span>{formatTime(timeLeft.hours)}</span>
              <span className="animate-pulse">:</span>
              <span>{formatTime(timeLeft.minutes)}</span>
              <span className="animate-pulse">:</span>
              <span>{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Offer & CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs line-through opacity-60 font-medium">
              ₹2,400
            </span>
            <span className="text-xl sm:text-2xl font-black font-heading tracking-tight italic">
              ₹1,800
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse shadow-sm">
              -25% OFF
            </span>
          </div>

          <Link
            to="/shop"
            className="bg-[#2C5530] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:bg-[#1f3d23] hover:scale-105 transition-all duration-300 border-2 border-[#2C5530] flex items-center gap-2"
          >
            Buy Now
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>

      {/* CSS Animation for Gradient Shimmer */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
