"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Award,
  Factory,
  Package,
  Truck,
  Users,
  Home,
  Calendar,
} from "lucide-react";

interface TimelineItem {
  year: string;
  event: string;
}

interface CompanyTimelineProps {
  data: TimelineItem[];
}

const iconMap: { [key: string]: any } = {
  "2018": Factory,
  "2019": Package,
  "2020": Award,
  "2021": Users,
  "2022": Home,
  "2023": Home,
  "2024": Truck,
  "2026": Calendar,
};

export default function CompanyTimeline({ data }: CompanyTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / rect.height),
      );
      setProgress(scrollProgress * 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={timelineRef}
      className="relative py-20 border-t border-[#D4AF37] bg-gradient-to-b from-[#FAF7F2] to-[#F5E8C7]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
           <p className="text-[#FAB519] uppercase tracking-wider mb-4 font-medium">
              Our Philosophy
            </p>
            <h2
              className="text-3xl md:text-4xl mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              HOPE - Healthy, Organic, Pure, Enriched
            </h2>
            <p className="text-[#6B6B6B] text-md mb-16">
              As part of the AGOC family, Le Pondy Cheese embodies the HOPE
              philosophy. Our cheeses are made from milk sourced from farms that
              practice ethical animal husbandry, free from artificial hormones.
              We use natural aging processes, minimal additives, and traditional
              methods that preserve the nutritional integrity of our products.
            </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-[#8B7355] via-[#D4AF37] to-[#FAB519] opacity-30" />

          {/* Progress Line */}
          <motion.div
            className="absolute left-1/2 top-0 w-1 -translate-x-1/2 bg-gradient-to-b from-[#FAB519] to-[#D4AF37]"
            style={{ height: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />

          {/* Timeline Items */}
          <div className="space-y-16">
            {data.map((item, index) => {
              const Icon = iconMap[item.year] || Calendar;
              const isLeft = index % 2 === 0;

              return (
                <TimelineItem
                  key={item.year}
                  item={item}
                  index={index}
                  isLeft={isLeft}
                  Icon={Icon}
                  isActive={activeIndex === index}
                  onHover={() => setActiveIndex(index)}
                  onLeave={() => setActiveIndex(null)}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {data.map((item, index) => {
            const Icon = iconMap[item.year] || Calendar;
            return (
              <MobileTimelineItem
                key={item.year}
                item={item}
                index={index}
                Icon={Icon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  item,
  index,
  isLeft,
  Icon,
  isActive,
  onHover,
  onLeave,
}: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"} gap-8`}
      >
        {/* Content Card */}
        <motion.div
          className={`w-5/12 bg-white p-6 shadow-lg border-2 border-[#F5E8C7] relative group cursor-pointer ${
            isActive ? "shadow-2xl scale-105" : ""
          }`}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FAB519] to-transparent opacity-20" />

          <p className="text-sm text-[#D4AF37] font-bold uppercase tracking-widest mb-2">
            {item.year}
          </p>
          <p className="text-[#1A1A1A] leading-relaxed">{item.event}</p>

          {/* Hover Glow Effect */}
          {isActive && (
            <motion.div
              className="absolute inset-0 border-2 border-[#FAB519] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        {/* Center Dot */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          whileHover={{ scale: 1.2 }}
        >
          <div
            className={`w-16 h-16 bg-gradient-to-br from-[#FAB519] to-[#D4AF37] flex items-center justify-center shadow-lg 
            }`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Pulse Ring */}
          {/* {isActive && (
            <motion.div
              className="absolute inset-0 border-4 border-[#FAB519] opacity-50"
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )} */}
        </motion.div>

        {/* Year Badge */}
        <div className="w-5/12 flex justify-center">
          <motion.div
            className="text-6xl font-bold text-[#2C5530] opacity-100"
            style={{ fontFamily: "Playfair Display, serif" }}
            whileHover={{ opacity: 0.4, scale: 1.1 }}
          >
            {item.year}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function MobileTimelineItem({ item, index, Icon }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-4"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FAB519] to-[#D4AF37] flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white p-4 shadow-md border-l-4 border-[#FAB519]">
        <p
          className="text-2xl font-bold text-[#D4AF37] mb-2"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {item.year}
        </p>
        <p className="text-[#1A1A1A] text-sm leading-relaxed">{item.event}</p>
      </div>
    </motion.div>
  );
}
