"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, ShoppingBag } from "lucide-react";
import { API_BASE_URL } from "@/config";

interface FlashSaleBannerProps {
  settings?: {
    couponName: string;
    validTime: string | null;
    discountRate: number;
  };
}

export default function FlashSaleBanner({ settings: initialSettings }: FlashSaleBannerProps) {
  const [localSettings, setLocalSettings] = useState<any>(initialSettings || null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Sync settings prop to state or fetch if not present
  useEffect(() => {
    if (initialSettings) {
      setLocalSettings(initialSettings);
      return;
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings`);
        const result = await response.json();
        if (result.success) {
          setLocalSettings(result.data);
        }
      } catch (error) {
        console.error("Error fetching settings in FlashSaleBanner:", error);
      }
    };
    fetchSettings();
  }, [initialSettings]);

  const settings = localSettings;

  // Countdown Timer Logic
  useEffect(() => {
    if (!settings?.validTime) return;

    const targetDate = new Date(settings.validTime);

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [settings]);

  const formatTime = (val: number) => val.toString().padStart(2, "0");

  // If the toggle is disabled or time expired, do not show
  const isFlashSaleActive = settings?.flashSaleEnabled && settings.validTime && new Date() < new Date(settings.validTime);
  if (!isFlashSaleActive) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-gold py-3 via-brand-gold-subtle to-brand-gold bg-[length:200%_100%] animate-shimmer shadow-md text-text-primary">
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
            <div className="flex items-center gap-1 font-mono font-bold text-base sm:text-lg text-brand-green-dark">
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
            <span className="text-xs font-medium uppercase tracking-wider opacity-80">
              Use Code:
            </span>
            <span className="text-sm sm:text-base font-black bg-brand-green text-white px-3 py-1 rounded-lg tracking-tight uppercase shadow-sm">
              {settings?.couponName || "N/A"}
            </span>
            <span className="inline-block text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse shadow-sm">
              -{settings?.discountRate || 0}% OFF
            </span>
          </div>

          <Link
            to="/shop"
            className="bg-brand-green text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:bg-brand-green-dark hover:scale-105 transition-all duration-300 border-2 border-brand-green flex items-center gap-2"
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
