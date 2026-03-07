import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, PieChart, ShoppingBag } from "lucide-react";

export default function TopHeader() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#FAB519] py-3 via-[#fadea0] to-[#FAB519] bg-[length:200%_100%] animate-shimmer shadow-md text-[#1D161A]">
      {/* Sparkle/Glitter Effects using pseudo-elements in CSS or simple divs */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

      <div className=" mx-auto px-4 md:px-8 lg:px-16 py-1 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-8 relative z-10">  
        {/* Center/Right: Offer & CTA */}
       <div className="text-xs sm:text-sm font-medium text-green">
        Free Delivery on orders above ₹2000
       </div>
       <div className="flex items-center text-green gap-4">
        <a href="tel:+919150121331" className="flex items-center gap-2">
          <Phone size={16}/> +91 91501 21331
        </a>
        <div className="px-1">|</div>
        <a href="mailto:hello@lepondicheese.com" className="flex items-center gap-2">
          <Mail size={16}/> hello@lepondicheese.com
        </a>
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
