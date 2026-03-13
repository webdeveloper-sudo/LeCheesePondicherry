"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import YourPicks from "@/components/YourPicks";
import { useUserStore } from "@/store/useUserStore";
import heroCheeseBoardImage from "@/assets/images/hero-cheese-board.jpg";
import heroVideo from "@/assets/videos/hero.mp4";
import cheesemaker from "@/assets/images/cheesemaker.webp";
import GiftsPage from "@/pages/GiftsPage";
import { GiftItems } from "./GiftItems";
import AllBlogs from "@/pages/blogs/AllBlogs";
import { BlogsGrid } from "@/pages/blogs/components/BlogsGrid";
import logo from "@/assets/images/logo.jpg";
import DecorativeWrapper from "./DecorativeWrapper";
import cheesesparks from "@/assets/images/bg-elements/—Pngtree—sliced cheese with crumbs_18128831.png";
import cheesslice from "@/assets/images/bg-elements/—Pngtree—sliced cheese with crumbs_18128831.png";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
  MotionButton,
  MotionImage,
} from "@/components/ui/MotionPrimitives";
import { fadeUp, staggerContainer, scaleIn } from "@/animations/variants";
import { motion } from "framer-motion";

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[86vh] bg-[#000] w-full min-h-[500px] md:min-h-[588px] overflow-hidden">
        {/* Background Video */}
        <video
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover md:object-cover"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Content */}
        <div className="relative z-10 h-full w-full flex items-center justify-start">
          <MotionContainer className="w-full px-6 md:px-16 lg:px-48" stagger>
            <div className=" text-center md:text-center">
              {/* Gold glass-effect heading */}
              <MotionHeading
                as="h1"
                className="text-3xl max-w-6xl mx-auto sm:text-5xl lg:text-7xl font-extrabold text-white "
                style={{ textShadow: "2px 2px 8px rgba(0,0,0, 0.8)" }}
              >
                Savor the Story. Taste the Tradition.
              </MotionHeading>

              {/* White paragraph */}
              <MotionText className="mt-4 md:mt-5 max-w-4xl mx-auto text-[14px] text-white/95 leading-relaxed">
                Hand-crafted, aged, and perfected—discover the world's most
                irresistible artisan cheeses, delivered from our farm to your
                table.
              </MotionText>

              {/* Optional CTA */}
              <motion.div
                className="mt-6 md:mt-7 flex  gap-4 justify-center md:justify-center"
                variants={fadeUp}
              >
                <MotionButton
                  className="px-10 py-2 
            bg-gradient-to-r from-yellow-400 to-amber-200
            text-sm shadow-lg rounded-full md:flex gap-1 items-center"
                >
                  Shop <span className="hidden md:block">Our</span> Cheeses
                </MotionButton>
                <MotionButton
                  className="px-6 py-2
            border-2 border-yellow-400
            text-white shadow-lg rounded-full flex gap-1 items-center"
                >
                  Contact <span className="hidden md:block">Us</span>
                </MotionButton>
              </motion.div>
            </div>
          </MotionContainer>
        </div>
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
              className="btn text-lg px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#2C5530] font-semibold"
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
        {isAuthenticated() && role === "user" ? (
          <div className="py-12 w-full">
            <div className="text-center mb-6 px-4">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Discover Our Signature Collection
              </h2>
              <p className="text-[#6B6B6B] max-w-2xl mx-auto">
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
                <h2
                  className="text-3xl md:text-4xl mb-4 block"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Discover Our Signature Collection
                </h2>
                <p className="text-[#6B6B6B] max-w-2xl mx-auto break-words">
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
                    reviews={product.reviews}
                  />
                ))}
              </div>
              <div className="text-center mt-10 md:mt-12">
                <Link to="/shop">
                  <button className="btn btn-secondary w-full sm:w-auto">
                    View All Cheeses
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Story Teaser Section */}
      <section className="py-12 md:py-20 bg-[#2C5530] text-white">
        <MotionContainer className="container mx-auto px-6 md:px-8" stagger>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <MotionContainer
              className="order-2 lg:order-1 text-center lg:text-left"
              stagger
            >
              <MotionText className="text-[#FAB519] uppercase tracking-wider mb-2 font-medium">
                Our Story
              </MotionText>
              <MotionHeading
                className="text-2xl md:text-5xl mb-6 text-white-prominent"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Born from a Dream in Pondicherry
              </MotionHeading>
              <MotionText className="text-white/90 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                Le Pondicherry Cheese is built on simple principles: good milk,
                clean handling, and careful cheesemaking. Our focus is on
                producing cheeses with dependable texture, flavour, and
                performance in real kitchens.
              </MotionText>
              <MotionText className="hidden md:block text-white/90 mb-8 leading-relaxed">
                We prioritise control, hygiene, and consistency across our
                production, ensuring that every cheese meets the same quality
                expectations.
              </MotionText>
              <Link to="/about">
                <MotionButton className="btn btn-primary rounded-full px-8">
                  Discover Our Journey
                </MotionButton>
              </Link>
            </MotionContainer>
            <div className="order-1 lg:order-2">
              <div className="aspect-video md:aspect-[4/3] bg-[#F5E6D3] rounded-2xl overflow-hidden relative shadow-2xl">
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
      {/* Wholesale Partnership CTA */}
      <section className="p-2 py-10 bg-pattern">
        <div className=" mx-auto px-2">
          <MotionContainer
            className=" p-8 md:p-12  text-white text-center"
            stagger
          >
            <MotionHeading
              className="text-3xl md:text-4xl mb-4  text-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Wholesale & Partnerships
            </MotionHeading>
            <MotionText className="text-black mb-8 max-w-2xl mx-auto">
              Elevate your menu with Pondicherry's finest handcrafted artisan
              cheeses. We partner with premium restaurants, hotels, and cafes
              across India.
            </MotionText>
            <Link to="/wholesale">
              <MotionButton className="btn btn-primary bg-[#2C5530] hover:bg-[#1a3a20]">
                Bulk Inquiry
              </MotionButton>
            </Link>
          </MotionContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-12 md:py-20 overflow-hidden"
        style={{
          background:
            "radial-gradient(circle,rgba(233, 215, 154, 0.77) 0%, rgba(249, 182, 25, 0.62) 100%)",
          animation: "gradientBG 20s ease infinite",
        }}
      >
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center font-medium">
            <div className="hidden lg:flex justify-center items-center p-10 mx-auto">
              <img
                src={cheesslice}
                alt="Cheese Slice"
                className="w-full max-w-sm object-cover"
              />
            </div>
            <div>
              <div className="text-center lg:text-left mb-8 md:mb-12">
                <MotionText className="text-[#2C5530] uppercase tracking-wider mb-4 font-bold">
                  Our Quality
                </MotionText>
                <MotionHeading
                  className="text-2xl md:text-4xl mb-4 text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  What Our Customers Say
                </MotionHeading>
                <MotionText className="text-[#6B6B6B] max-w-2xl mx-auto lg:mx-0 mb-8 md:mb-12 text-sm md:text-base">
                  We prioritize quality, hygiene, and consistency in our
                  production.
                </MotionText>
              </div>
              <div className="max-w-xl mx-auto lg:mx-0">
                {testimonials.slice(0, 1).map((testimonial: any) => (
                  <motion.div
                    key={testimonial.id}
                    className="bg-white p-6 md:p-8 rounded-2xl shadow-xl"
                    variants={fadeUp}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div className="text-[#FAB519] mb-4">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 md:w-5 md:h-5 text-[#FAB519] fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[#1A1A1A] text-base md:text-lg mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#FAB519]/20 rounded-full flex items-center justify-center text-[#2C5530] font-bold">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1A1A]">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <div className="bg-dark-cheese">
        <section className="py-12 md:py-20">
          <MotionContainer
            className="container py-8 md:py-20 mx-auto px-6 md:px-8"
            stagger
          >
            <div className="text-center">
              <MotionText className="text-[#FAB519] uppercase tracking-wider mb-4 font-bold">
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
                  color: "#FAB519",
                  iconColor: "#2C5530",
                  border: "border border-[#FAB519]",
                },
                {
                  title: "Local Ingredients",
                  desc: "Fresh milk from trusted local farms, supporting our community",
                  icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
                  color: "#2C5530",
                  iconColor: "#FAB519",
                  border: "border border-[#FAB519]",
                },
                {
                  title: "French Tradition",
                  desc: "Techniques passed through generations, perfected in Pondicherry",
                  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                  color: "#FAB519",
                  iconColor: "#2C5530",
                  border: "border border-[#FAB519]",
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
            <MotionText className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12">
              Stories of tradition, recipes, and the artisan life from the heart
              of Pondicherry.
            </MotionText>

            <motion.div className="pb-16" variants={fadeUp}>
              <BlogsGrid />
            </motion.div>
          </MotionContainer>
        </section>
      </div>
    </>
  );
}
