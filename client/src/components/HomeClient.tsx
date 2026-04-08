"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import YourPicks from "@/components/YourPicks";
import { useUserStore } from "@/store/useUserStore";
import heroCheeseBoardImage from "@/assets/images/hero-cheese-board.webp";
import heroVideo from "@/assets/videos/hero.mp4";
import cheesemaker from "@/assets/images/cheesemaker.webp";
import GiftsPage from "@/pages/GiftsPage";
import { GiftItems } from "./GiftItems";
import AllBlogs from "@/pages/blogs/AllBlogs";
import { BlogsGrid } from "@/pages/blogs/components/BlogsGrid";
import logo from "@/assets/images/logo.webp";
import DecorativeWrapper from "./DecorativeWrapper";
import cheesesparks from "@/assets/images/bg-elements/—Pngtree—sliced cheese with crumbs_18128831.webp";
import cheesslice from "@/assets/images/bg-elements/—Pngtree—sliced cheese with crumbs_18128831.webp";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
  MotionButton,
  MotionImage,
} from "@/components/ui/MotionPrimitives";
import { fadeUp, staggerContainer, scaleIn } from "@/animations/variants";
import { motion } from "framer-motion";
import { FETCH_MODE } from "@/config";
import { products as staticProducts } from "@/data/products";
import axios from "axios";
import { HomeBlogsGrid } from "./HomeBlogsGrid";
import TestimonialsSlider from "./portfolio/TestimonialsSlider";

interface HomeClientProps {
  featuredProducts: Product[];
  subscriptionPlans: Product[];
  testimonials: any[];
}

export default function HomeClient({
  featuredProducts,
  subscriptionPlans,
  testimonials,
}: HomeClientProps) {
  const { addToCart } = useCart();
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const { name, isAuthenticated, wishlistCount, role } = useUserStore();

  const handleSubscribe = async (planId: string) => {
    setSubscribingId(planId);

    // Find plan details
    const plan = subscriptionPlans.find((p) => p.id === planId);

    // Simulate API/Notification lag
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const content = `
Brand: Le Pondicherry Cheese
Activity: User clicked Subscribe for ${plan?.name}
Price: ₹${plan?.price}/month
Timestamp: ${new Date().toLocaleString()}
Action: Item added to cart for checkout.
    `.trim();

    // Send Real Email via API
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "technicalhead@achariya.org",
          subject: `Subscription Interest: ${plan?.name}`,
          content: content,
        }),
      });
    } catch (err) {
      console.error("Email API Error:", err);
    }

    // Add to cart
    if (plan) {
      addToCart(plan.id, 1, plan.weight, plan.price);
    }

    setSubscribingId(null);
    setSuccessId(planId);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessId(null), 3000);
  };

  const { preferences, wishlistIds = [] } = useUserStore();
  const { items: cartItems } = useCart();

  const [allProducts, setAllProducts] = useState<Product[]>(
    FETCH_MODE === "static" ? staticProducts : [],
  );
  const [loading, setLoading] = useState(FETCH_MODE === "dynamic");

  useEffect(() => {
    if (FETCH_MODE !== "dynamic") return;

    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
        );
        if (response.data) {
          const fetchedData = response.data.data || response.data;
          const mappedProducts = fetchedData.map((p: any) => {
            let hash = 0;
            const id = p._id || "";
            for (let i = 0; i < id.length; i++) {
              hash = id.charCodeAt(i) + ((hash << 5) - hash);
            }
            const assignedRating = 4.0 + (Math.abs(hash) % 6) / 10;
            return {
              ...p,
              id: p._id,
              rating: p.rating && p.rating > 0 ? p.rating : assignedRating,
            };
          });
          setAllProducts(mappedProducts);
        }
      } catch (error) {
        console.error("YourPicks: Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // 1. Top Picks based on preferences
  const recommendedProducts = (preferences || [])
    .map((pref: any) =>
      allProducts.find((p) => p.id === (pref.productId || pref.id || pref)),
    )
    .filter(Boolean)
    .slice(0, 4);

  // 2. From Your Cart
  const cartProducts = cartItems
    .map((item) => allProducts.find((p) => p.id === item.productId))
    .filter(Boolean)
    .slice(0, 4);

  // 3. Your Wishlist
  const wishlistProducts = wishlistIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const combinedProducts = [...cartProducts, ...wishlistProducts];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[92vh] bg-black w-full min-h-[560px] overflow-hidden">
        {/* Background Video */}
        <video
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Cinematic gradient overlay — symmetric for centered layout */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Content — centered */}
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          <MotionContainer className="w-full px-6 md:px-16 text-center max-w-4xl mx-auto" stagger>
            <div className="flex flex-col items-center">

              {/* Gold eyebrow label */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-3 mb-6"
              >
                <span className="h-px w-8 bg-brand-gold opacity-80" />
                <span className="text-brand-gold uppercase tracking-[0.25em] text-xs font-semibold">
                  Le Pondicherry Cheese
                </span>
                <span className="h-px w-8 bg-brand-gold opacity-80" />
              </motion.div>

              {/* Main Heading */}
              <MotionHeading
                as="h1"
                className="text-4xl sm:text-5xl md:text-5xl xl:text-6xl font-heading text-white leading-[1.1] mb-6 text-center"
                style={{
                  fontFamily: "var(--font-heading)",
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                Crafting Dairy{" "}
                <span className="text-brand-gold italic">Excellence</span>
                <br />
                From Farm to Table
              </MotionHeading>

              {/* Gold divider — centered */}
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <span className="h-px w-12 bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                <span className="h-px w-12 bg-white/20" />
              </motion.div>

              {/* Subtitle */}
              <MotionText className="text-white/80 text-base md:text-md leading-relaxed mb-10 max-w-2xl text-center">
                Where Responsible Farming Meets Refined Dairy Innovation.
                Artisanal cheese, crafted in small batches with{" "}
                <span className="text-brand-gold font-medium">zero preservatives</span> and honest ingredients.
              </MotionText>

              {/* CTA Buttons — centered */}
              <motion.div
                className="flex flex-wrap gap-4 justify-center"
                variants={fadeUp}
              >
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                >
                  Shop Our Cheeses
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                < Link
                  to="/about"
                  className="group inline-flex items-center gap-2 border border-white/40 text-white hover:border-brand-gold hover:text-brand-gold font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
                >
                  Our Story
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>

              {/* Trust badges — centered */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-6 justify-center mt-12 pt-8 border-t border-white/10 w-full max-w-lg"
              >
                {["FSSAI Certified", "Zero Preservatives", "100% Vegetarian"].map((badge) => (
                  <span key={badge} className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                    {badge}
                  </span>
                ))}
              </motion.div>

            </div>
          </MotionContainer>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* <div className="relative">
        <div>
          <motion.div
            className="w-20 h-20 md:w-28 md:h-28 border border-[#FAB519] rounded-full p-1 bg-white bottom-[-40px] md:bottom-[-50px] z-10 absolute right-4 md:right-[100px] lg:right-[250px]"
            variants={scaleIn}
          >
            <img
              src={logo}
              className="w-full h-full object-cover rounded-full"
              alt="Logo"
            />
          </motion.div>
        </div>
      </div> */}
      {/* <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCheeseBoardImage})` }}
        >
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up text-white-prominent"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Handcrafted in Pondicherry
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animate-delay-100 text-white-prominent">
            Experience the fusion of French tradition and Indian craftsmanship
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-200">
            <Link to="/shop" className="btn btn-primary text-lg px-8 py-4">
              Discover Our Collection
            </Link>
            <Link
              to="/about"
              className="btn text-lg px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-brand-green font-semibold"
            >
              Our Story
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div> */}

      {/* Featured Products Section */}

      <div className="bg-pattern relative z-10 w-full">
        {isAuthenticated() &&
        role === "user" &&
        (preferences?.length || 0) +
          (cartItems?.length || 0) +
          (wishlistCount || 0) >
          3 ? (
          <div className="py-12 w-full">
            <div className="text-center mb-6 px-4">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Discover Our Signature Collection
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Handcrafted cheeses made using traditional French techniques and
                the finest local ingredients
              </p>
            </div>
            <div className="w-full">
              <YourPicks />
            </div>
          </div>
        ) : (
          <section className="py-12 md:py-20 w-full overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-8 md:mb-12">
                <MotionText className="text-brand-gold uppercase tracking-wider mb-2 font-medium">
                  Discover
                </MotionText>
                <h2
                  className="text-3xl md:text-4xl mb-4 block"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                   Our Signature Collection
                </h2>
                <p className="text-GRAY-800 max-w-2xl mx-auto break-words">
                  Handcrafted cheeses made using traditional French techniques
                  and the finest local ingredients
                </p>
              </div>

              {/* Product Grid - Fixed missing grid styles on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-6 md:gap-8 w-full">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.shortDescription}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                ))}
              </div>
              <div className="text-center mt-10 md:mt-12">
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                >
                  View All Cheeses
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Story Teaser Section */}
      <section className="py-12 md:py-20 bg-brand-green-subtle text-white">
        <MotionContainer className="container mx-auto px-6 md:px-8" stagger>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <MotionContainer
              className="order-2 lg:order-1 text-center lg:text-left"
              stagger
            >
              <MotionText className="text-brand-gold uppercase tracking-wider mb-2 font-medium">
                Our Story
              </MotionText>
              <MotionHeading
                className="text-2xl md:text-4xl mb-6 text-white-prominent"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Le Pondicherry Cheese
              </MotionHeading>
              <MotionText className="text-white/90 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                Le Pondicherry Cheese is an artisanal cheese brand born in the
                historic coastal town of Pondicherry where rich dairy heritage
                meets refined European cheese-making traditions. Each cheese is
                handcrafted in small batches, using fresh, locally sourced cow’s
                milk, time-honoured techniques, and carefully controlled ageing
                processes.
              </MotionText>
              <MotionText className="hidden md:block text-white/90 mb-8 leading-relaxed">
                We believe in purity above all. That’s why our cheeses are made
                with zero preservatives, no artificial additives and clean,
                honest ingredients only.
              </MotionText>
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
              >
                Discover Our Journey
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </MotionContainer>
            <div className="order-1 lg:order-2">
              <div className="aspect-video md:aspect-[4/3] bg-bg-cream rounded-2xl overflow-hidden relative shadow-2xl">
                <MotionImage
                  src={cheesemaker}
                  alt="Cheesemaker"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </MotionContainer>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden ">
        <TestimonialsSlider />
      </section>

      {/* Brand Promise Section */}
      <div className="bg-dark-cheese">
        <section className="py-12 md:py-20">
          <MotionContainer
            className="container py-8 md:py-20 mx-auto px-6 md:px-8"
            stagger
          >
            <div className="text-center">
              <MotionText className="text-brand-gold uppercase tracking-wider mb-4 font-medium">
                Our Heritage
              </MotionText>
              <MotionHeading
                className="text-2xl md:text-4xl max-w-2xl mx-auto mb-4 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Where French Heritage Meets Indian Craftsmanship
              </MotionHeading>
              <MotionText className="text-gray-300 max-w-2xl mx-auto mb-10 md:mb-16 text-sm md:text-base">
                Every wheel of cheese tells a story of patience, passion, and
                perfection
              </MotionText>
            </div>

            <MotionContainer
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
              stagger
            >
              {[
                {
                  title: "Artisan Crafted",
                  desc: "Every wheel aged to perfection by master cheesemakers",
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  color: "var(--color-brand-gold)",
                  iconColor: "var(--color-brand-green)",
                  border: "border border-brand-gold",
                },
                {
                  title: "Local Ingredients",
                  desc: "Fresh milk from trusted local farms, supporting our community",
                  icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
                  color: "var(--color-brand-green)",
                  iconColor: "var(--color-brand-gold)",
                  border: "border border-brand-gold",
                },
                {
                  title: "French Tradition",
                  desc: "Techniques passed through generations, perfected in Pondicherry",
                  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                  color: "var(--color-brand-gold)",
                  iconColor: "var(--color-brand-green)",
                  border: "border border-brand-gold",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`text-center p-8 bg-black/20 backdrop-blur-sm rounded-2xl ${item.border || ""}`}
                  variants={fadeUp}
                >
                  <motion.div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: item.color }}
                    variants={scaleIn}
                  >
                    <svg
                      className="w-10 h-10 md:w-12 md:h-12"
                      style={{ color: item.iconColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </motion.div>
                  <h3
                    className="text-xl md:text-2xl font-bold mb-3 text-white"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </MotionContainer>
          </MotionContainer>
        </section>
      </div>
      {/* Journals Section */}
      <div className="bg-pattern">
        <section className="py-20 ">
          <MotionContainer className=" mx-auto px-4" stagger>
            <MotionHeading
              className="text-3xl md:text-4xl text-center mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The Cheese Journal
            </MotionHeading>
            <MotionText className="text-center text-text-secondary max-w-2xl mx-auto mb-12">
              Stories of tradition, craft, and the slow art of affinage from the
              artisan cellars of Pondicherry.
            </MotionText>

            <motion.div className="pb-16" variants={fadeUp}>
              <HomeBlogsGrid />
            </motion.div>
          </MotionContainer>
        </section>
      </div>
      {/* Wholesale Partnership CTA */}

      <section className="py-16 bg-yellow-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl mb-4 font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Wholesale & Partnerships
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg">
            Elevate your menu with Pondicherry's finest handcrafted artisan
            cheeses. We partner with premium restaurants, hotels, and cafes
            across India.
          </p>
          <div className="flex justify-center">
            <Link
              to="/wholesale"
              className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
            >
              Enquire for Wholesale
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
