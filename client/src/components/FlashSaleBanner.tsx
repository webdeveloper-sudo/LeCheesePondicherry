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
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

      <div className="px-16 mx-auto py-1 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-8 relative z-10">
        {/* Left: Text & Timer */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 animate-bounce text-current" />

            <span className="font-bold text-lg uppercase tracking-wide">
              Flash Sale
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/30 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/40 shadow-sm">
            <span className="text-sm font-medium">Ends in:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-lg text-[#1a3a20]">
              <span>{formatTime(timeLeft.hours)}</span>
              <span>:</span>
              <span>{formatTime(timeLeft.minutes)}</span>
              <span>:</span>
              <span>{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Offer & CTA */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm line-through opacity-70">₹2,400</span>
            <span className="text-2xl font-bold font-heading">₹1,800</span>
            <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
              -25% OFF
            </span>
          </div>

          <Link
            to="/shop"
            className="bg-[#2C5530] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:bg-[#1f3d23] hover:scale-105 transition-all duration-300 border-2 border-[#2C5530] flex items-center gap-2"
          >
            Buy Now
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
