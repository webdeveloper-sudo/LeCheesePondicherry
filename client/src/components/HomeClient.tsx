"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import YourPicks from "@/components/YourPicks";
import { useUserStore } from "@/store/useUserStore";
import heroCheeseBoardImage from "@/assets/images/hero-cheese-board.jpg";
import heroVideo from "@/assets/videos/Cheese_Video_Generation_Request.mp4";
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
      <section className="relative h-[86vh] bg-[#000] w-full min-h-[588px] overflow-hidden">
        {/* Background Video */}
        <video
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-contian"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Content */}
        <div className="relative z-10 h-full w-full flex items-center justify-start">
          <MotionContainer className="w-full px-48" stagger>
            <div className="max-w-xl">
              {/* Gold glass-effect heading */}
              <MotionHeading
                as="h1"
                className="text-4xl md:text-7xl font-extrabold leading-tight
          bg-gradient-to-r from-yellow-300 via-yellow-400 to-[#FAB519] 
          bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(255,200,0,0.35)]"
              >
                Making A Difference One Cheese At A Time{" "}
              </MotionHeading>

              {/* White paragraph */}
              <MotionText className="mt-5 text-base md:text-lg text-white/95 leading-relaxed">
                We Le Pondicherry Cheese is a cheese producer based in
                Pondicherry, focused on making well-crafted and reliable
                cheeses. Our work is driven by disciplined processes, careful
                handling, and close attention to quality at every stage. The
                cheeses we make are designed to cook well, taste clean, and
                remain consistent in everyday use.
              </MotionText>

              {/* Optional CTA */}
              <motion.div
                className="mt-7 flex gap-4 md:justify-start justify-center align-center"
                variants={fadeUp}
              >
                <MotionButton
                  className="px-6 py-3 font-semibold
            bg-gradient-to-r from-yellow-400 to-amber-200
            text-black shadow-lg"
                >
                  Shop Our Cheeses
                </MotionButton>
                <MotionButton
                  className="px-6 py-3 font-semibold
            border-2 border-yellow-400
            text-white shadow-lg"
                >
                  Contact Us
                </MotionButton>
              </motion.div>
            </div>
          </MotionContainer>
        </div>
      </section>

      <div className="relative">
        <div>
          <motion.div
            className="w-28 h-28 border border-[#FAB519] rounded-full p-1 bg-white bottom-[-50px] z-10 absolute md:right-[100px] lg:right-[250px]"
            variants={scaleIn}
          >
            <img
              src={logo}
              className="w-full h-full object-cover rounded-full"
              alt=""
            />
          </motion.div>
        </div>
      </div>
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

      <div className="bg-pattern">
        {isAuthenticated() && role === "user" ? (
          <div className="py-12">
            <div className="text-center mb-6">
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
            <YourPicks />
          </div>
        ) : (
          <section className="py-20">
            <MotionContainer className="container mx-auto px-4" stagger>
              <div className="text-center mb-6">
                <MotionHeading
                  className="text-3xl md:text-4xl mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Discover Our Signature Collection
                </MotionHeading>
                <MotionText className="text-[#6B6B6B] max-w-2xl mx-auto">
                  Handcrafted cheeses made using traditional French techniques
                  and the finest local ingredients
                </MotionText>
              </div>
              <MotionContainer
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-6"
                stagger // Enable stagger for children (ProductCards)
              >
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
              </MotionContainer>
              <div className="text-center mt-10">
                <Link to="/shop">
                  <MotionButton className="btn btn-secondary">
                    View All Cheeses
                  </MotionButton>
                </Link>
              </div>
            </MotionContainer>
          </section>
        )}
      </div>

      {/* Story Teaser Section */}
      <section className="py-20 bg-[#2C5530] text-white">
        <MotionContainer className="container mx-auto px-4" stagger>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <MotionContainer className="order-2 lg:order-1" stagger>
              <MotionText className="text-[#FAB519] uppercase tracking-wider mb-2 font-medium">
                Our Story
              </MotionText>
              <MotionHeading
                className="text-3xl md:text-5xl mb-6 text-white-prominent"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Born from a Dream in Pondicherry
              </MotionHeading>
              <MotionText className="text-white/90 mb-6 leading-relaxed">
                Le Pondicherry Cheese is built on simple principles: good milk,
                clean handling, and careful cheesemaking. Our focus is on
                producing cheeses with dependable texture, flavour, and
                performance in real kitchens.
              </MotionText>
              <MotionText className="text-white/90 mb-8 leading-relaxed">
                We prioritise control, hygiene, and consistency across our
                production, ensuring that every cheese meets the same quality
                expectations.
              </MotionText>
              <Link to="/about">
                <MotionButton className="btn btn-primary ">
                  Discover Our Journey
                </MotionButton>
              </Link>
            </MotionContainer>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] bg-[#F5E6D3] rounded-lg overflow-hidden relative">
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
      {/* Gift Collections CTA */}
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
              The Perfect Gift for Cheese Lovers
            </MotionHeading>
            <MotionText className="text-black mb-8 max-w-2xl mx-auto">
              Our curated gift collections feature the finest artisan cheeses,
              paired with premium accompaniments. Perfect for any occasion.
            </MotionText>
            <Link to="/gifts">
              <MotionButton className="btn btn-primary bg-[#C9A961] hover:bg-[#B8942F]">
                Explore Gift Collections
              </MotionButton>
            </Link>
          </MotionContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-20 "
        style={{
          background:
            "radial-gradient(circle,rgba(233, 215, 154, 0.77) 0%, rgba(249, 182, 25, 0.62) 100%)",
          animation: "gradientBG 20s ease infinite",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center items-center p-10 mx-auto">
              <img
                src={cheesslice}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-center mb-12">
                <MotionText className="text-[#2C5530] uppercase text-center tracking-wider mb-4 font-medium">
                  Our Quality
                </MotionText>
                <MotionHeading
                  className="text-3xl md:text-4xl mb-4 text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  What Our Customers Say
                </MotionHeading>
                <MotionText className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12">
                  We prioritize quality, hygiene, and consistency in our
                  production, ensuring that every cheese meets the same quality
                  expectations.
                </MotionText>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-5xl mx-auto">
                {testimonials.slice(0, 1).map((testimonial: any) => (
                  <motion.div
                    key={testimonial.id}
                    className="bg-white p-8 rounded-lg shadow-md"
                    variants={fadeUp}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <div className="text-[#FAB519] mb-4">
                      <svg
                        className="w-10 h-10"
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
                          className="w-5 h-5 text-[#FAB519] fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[#1A1A1A] text-lg mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-[#6B6B6B]">
                        {testimonial.location}
                      </p>
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
        <section className="py-20 ">
          {" "}
          <MotionContainer className="container  py-20 mx-auto px-4" stagger>
            <div>
              <MotionText className="text-[#FAB519] uppercase text-center tracking-wider mb-4 font-medium">
                Our Heritage
              </MotionText>
              <MotionHeading
                className="text-3xl md:text-4xl max-w-2xl mx-auto text-center mb-4 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Where French Heritage Meets Indian Craftsmanship
              </MotionHeading>
              <MotionText className="text-center text-gray-300 max-w-2xl mx-auto mb-16">
                Every wheel of cheese tells a story of patience, passion, and
                perfection
              </MotionText>
            </div>

            <MotionContainer
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              stagger
            >
              <motion.div className="text-center p-6" variants={fadeUp}>
                <motion.div
                  className="w-28 h-28 bg-[#FAB519] rounded-full flex items-center justify-center mx-auto mb-4"
                  variants={scaleIn}
                >
                  <svg
                    className="w-16 h-16 text-[#2C5530]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </motion.div>
                <h3
                  className="text-2xl font-semibold mb-2 text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Artisan Crafted
                </h3>
                <p className="text-gray-300">
                  Every wheel aged to perfection by master cheesemakers
                </p>
              </motion.div>
              <motion.div className="text-center p-6" variants={fadeUp}>
                <motion.div
                  className="w-28 h-28 bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-4"
                  variants={scaleIn}
                >
                  <svg
                    className="w-16 h-16 text-[#FAB519]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </motion.div>
                <h3
                  className="text-2xl font-semibold mb-2 text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Local Ingredients
                </h3>
                <p className="text-gray-300">
                  Fresh milk from trusted local farms, supporting our community
                </p>
              </motion.div>
              <motion.div className="text-center p-6" variants={fadeUp}>
                <motion.div
                  className="w-28 h-28 bg-[#FAB519] rounded-full flex items-center justify-center mx-auto mb-4"
                  variants={scaleIn}
                >
                  <svg
                    className="w-16 h-16 text-[#2C5530]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </motion.div>
                <h3
                  className="text-2xl font-semibold mb-2 text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  French Tradition
                </h3>
                <p className="text-gray-300">
                  Techniques passed through generations, perfected in
                  Pondicherry
                </p>
              </motion.div>
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
