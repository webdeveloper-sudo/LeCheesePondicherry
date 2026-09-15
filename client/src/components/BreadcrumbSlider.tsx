import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroCheeseBoard from "@/assets/images/hero-cheese-board.webp";

export interface CarouselSlide {
  image: string;
  title?: string;
  subtitle?: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    image: heroCheeseBoard,
    title: "Handcrafted Artisan Cheeses",
    subtitle: "Made in Pondicherry with Pure Cow Milk & Traditional French Cultures",
  },
  {
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
    title: "Aged to Perfection",
    subtitle: "Explore our collection of slow-aged Baby Swiss, Daddy Swiss & Grana Chéry",
  },
  {
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
    title: "Fresh & Delicate Cheeses",
    subtitle: "Creamy Burrata, Bocconcini & Pure Mozzarella Crafted Daily",
  },
  {
    image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
    title: "Gourmet Pairings & Recipes",
    subtitle: "Elevate your dining experience with authentic artisanal European flavors",
  },
];

interface BreadcrumbSliderProps {
  slides?: CarouselSlide[] | string[];
  images?: string[];
  title?: string;
  autoPlayInterval?: number;
  showTitle?: boolean;
}

const BreadcrumbSlider: React.FC<BreadcrumbSliderProps> = ({
  slides: rawSlides,
  images: propImages,
  title,
  autoPlayInterval = 5000,
  showTitle = true,
}) => {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Normalize slides
  let normalizedSlides: CarouselSlide[] = DEFAULT_SLIDES;

  if (propImages && propImages.length > 0) {
    normalizedSlides = propImages.map((img) => ({ image: img }));
  } else if (rawSlides && rawSlides.length > 0) {
    normalizedSlides = rawSlides.map((item) =>
      typeof item === "string" ? { image: item } : item
    );
  }

  const slides = normalizedSlides;
  const hasTitle = Boolean(title && title.trim().length > 0);

  const validRoutes = new Set([
    "/",
    "/about",
    "/shop",
    "/cart",
    "/checkout",
    "/contact",
    "/faq",
    "/gifts",
    "/privacy",
    "/return",
    "/process",
    "/refund-policy",
    "/shipping-policy",
    "/stories",
    "/terms",
    "/wholesale",
    "/wishlist",
    "/orders",
    "/portfolio",
    "/portfolio/facility",
    "/portfolio/gallery",
    "/portfolio/testimonials",
    "/user",
    "/thank-you",
  ]);

  const pathnames = location.pathname.split("/").filter(Boolean);
  const isValidRoute = (routePath: string) => validRoutes.has(routePath);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, autoPlayInterval, slides.length]);

  return (
    <section
      className="w-full h-[300px] sm:h-[150px] md:h-[300px] lg:h-[400px] xl:h-[450px] relative overflow-hidden select-none bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides (Crossfade Transition) */}
      {slides.map((slide, index) => {
        const currentTitle = slide.title?.trim() || (title?.trim() || "");
        const slideHasTitle = Boolean(currentTitle.length > 0);

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Black/35 overlay with slight gradient when title is applied, or subtle base overlay */}
            {slideHasTitle ? (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.50) 100%)",
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-black/15" />
            )}

            {/* Title in Center if applied */}
            {slideHasTitle && showTitle && index === currentIndex && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 animate-in fade-in zoom-in-95 duration-500">
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {currentTitle}
                </h1>
                {slide.subtitle && (
                  <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-xl drop-shadow">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Top-Left Breadcrumb */}
      <div
        className="
          absolute top-4 left-4 sm:top-5 sm:left-6 md:top-6 md:left-10 lg:left-16
          text-xs sm:text-sm md:text-base font-medium text-white
          flex flex-wrap items-center gap-1.5 sm:gap-2 z-20
          bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm
        "
      >
        <Link to="/" className="hover:underline hover:text-brand-gold transition-colors">
          Home
        </Link>

        {pathnames.length > 0 && <span className="text-white/60">/</span>}

        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const routePath = "/" + pathnames.slice(0, index + 1).join("/");

          return isLast ? (
            <span key={name} className="capitalize text-white font-semibold">
              {name.replace(/-/g, " ")}
            </span>
          ) : (
            <span key={name} className="flex items-center gap-1.5 sm:gap-2">
              {isValidRoute(routePath) ? (
                <Link to={routePath} className="capitalize hover:underline hover:text-brand-gold transition-colors">
                  {name.replace(/-/g, " ")}
                </Link>
              ) : (
                <span className="capitalize text-white/70 pointer-events-none">
                  {name.replace(/-/g, " ")}
                </span>
              )}
              <span className="text-white/60">/</span>
            </span>
          );
        })}
      </div>

      {/* Left Navigation Arrow Button with White Shade BG */}
      {slides.length > 1 && (
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="
            absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 sm:w-12 sm:h-12 rounded-full
            bg-white/80 hover:bg-white text-gray-900
            shadow-lg backdrop-blur-xs
            flex items-center justify-center
            transition-all duration-300 hover:scale-110 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-white/50
          "
        >
          <ChevronLeft size={22} className="text-gray-900 -ml-0.5" />
        </button>
      )}

      {/* Right Navigation Arrow Button with White Shade BG */}
      {slides.length > 1 && (
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 sm:w-12 sm:h-12 rounded-full
            bg-white/80 hover:bg-white text-gray-900
            shadow-lg backdrop-blur-xs
            flex items-center justify-center
            transition-all duration-300 hover:scale-110 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-white/50
          "
        >
          <ChevronRight size={22} className="text-gray-900 -mr-0.5" />
        </button>
      )}

      {/* Bottom Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentIndex(dotIndex)}
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={`transition-all duration-300 rounded-full ${
                dotIndex === currentIndex
                  ? "w-6 h-2 bg-white shadow-xs"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BreadcrumbSlider;
export { BreadcrumbSlider as BreadcrumbSilder };
