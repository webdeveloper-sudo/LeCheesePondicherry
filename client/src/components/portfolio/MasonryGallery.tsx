import React from "react";
import { motion } from "framer-motion";

const galleryItems = [
  { id: 1, height: "h-64", color: "bg-brand-green/20" },
  { id: 2, height: "h-96", color: "bg-brand-gold/20" },
  { id: 3, height: "h-80", color: "bg-brand-green-subtle/20" },
  { id: 4, height: "h-72", color: "bg-bg-cream/50" },
  { id: 5, height: "h-96", color: "bg-brand-green/20" },
  { id: 6, height: "h-64", color: "bg-brand-gold/20" },
  { id: 7, height: "h-80", color: "bg-brand-green-subtle/20" },
  { id: 8, height: "h-112", color: "bg-bg-cream/50" },
  { id: 9, height: "h-72", color: "bg-brand-green/20" },
  { id: 10, height: "h-96", color: "bg-brand-gold/20" },
  { id: 11, height: "h-64", color: "bg-brand-green-subtle/20" },
  { id: 12, height: "h-80", color: "bg-bg-cream/50" },
];

const MasonryGallery: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className={`relative break-inside-avoid overflow-hidden rounded-xl border border-brand-green/10 shadow-sm group cursor-pointer ${item.height} ${item.color}`}
          >
            {/* Placeholder Content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-brand-green/40 font-heading text-lg font-semibold">
                Portfolio Item #{item.id}
              </span>
            </div>

            {/* Glitch Overlay (Hidden by default, shown on hover) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-brand-green/10 mix-blend-overlay animate-glitch-1" />
              <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay animate-glitch-2" />
            </div>

            {/* Hover Effects */}
            <div className="absolute inset-0 bg-brand-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white font-heading text-xl mb-2">Artisan Collection</h3>
              <p className="text-brand-gold text-sm tracking-widest uppercase">Traditional Craft</p>
              
              {/* Decorative Lines */}
              <div className="mt-4 w-12 h-0.5 bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-brand-gold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x--2 translate-y--2 group-hover:translate-x-0 group-hover:translate-y-0" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-brand-gold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch-1 {
          0% { transform: translate(0) }
          20% { transform: translate(-5px, 5px) }
          40% { transform: translate(-5px, -5px) }
          60% { transform: translate(5px, 5px) }
          80% { transform: translate(5px, -5px) }
          100% { transform: translate(0) }
        }
        @keyframes glitch-2 {
          0% { transform: translate(0) }
          20% { transform: translate(5px, -5px) }
          40% { transform: translate(5px, 5px) }
          60% { transform: translate(-5px, -5px) }
          80% { transform: translate(-5px, 5px) }
          100% { transform: translate(0) }
        }
        .animate-glitch-1 {
          animation: glitch-1 0.2s infinite;
        }
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite reverse;
        }
      `}} />
    </div>
  );
};

export default MasonryGallery;
