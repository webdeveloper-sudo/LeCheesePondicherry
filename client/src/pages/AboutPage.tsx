import { Link } from "react-router-dom";
import cheesemakerImage from "@/assets/images/process-hero-new.webp";
import CompanyTimeline from "@/components/CompanyTimeline";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";
import { motion } from "framer-motion";
import { fadeUp, scaleIn } from "@/animations/variants";
import { QuoteIcon } from "lucide-react";

export default function AboutPage() {
  const timeline = [
    {
      year: "2018",
      event:
        "The Vision Takes Root - Dr. Arawindhan J. establishes Le Pondicherry Cheese built on ethical farming.",
    },
    {
      year: "2019",
      event:
        "Learning the Language of Quality - Before a great cheese can be made, a great system must be built.",
    },
    {
      year: "2020",
      event:
        "The Craft Begins - Our first wheels turn. The Kombucha-Washed Rind earns its first admirers.",
    },
    {
      year: "2021",
      event:
        "From Artisan to Institution - Le Pondicherry becomes the name that premium restaurants trust.",
    },
    {
      year: "2022",
      event:
        "Bringing the Cave to You - Subscription boxes and hands-on workshops turn curiosity into craft.",
    },
    {
      year: "2023",
      event:
        "An Invitation to Taste - The tasting room opens. Our cave grows larger. Our welcome, warmer.",
    },
    {
      year: "2024",
      event:
        "Pondicherry to Every Doorstep - Launch of our e-commerce platform. Pan-India shipping.",
    },
    {
      year: "2026",
      event:
        "Still Crafting. Still Committed. Innovation, sustainability, and an unrelenting pursuit of purity.",
    },
  ];

  const stats = [
    { number: "8+", label: "Years of Craftsmanship" },
    { number: "12", label: "Cheese Varieties" },
    { number: "50+", label: "Restaurant Partners" },
    { number: "10,000+", label: "Happy Customers" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <BannerAndBreadCrumb title="About Us" img={cheesemakerImage} />

      {/* ── Origin Story ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-pattern">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
            {/* Left — Decorative image block */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="lg:w-5/12 w-full relative flex-shrink-0"
            >
              {/* Main image tile */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square bg-brand-green">
                <img
                  src={cheesemakerImage}
                  alt="Cheesemaking in Pondicherry"
                  className="w-full h-full object-cover  opacity-80"
                />
              </div>
              {/* Floating gold card */}
              <div className="absolute -bottom-6 -right-4 md:-right-10 bg-brand-gold px-8 py-6 rounded-2xl shadow-xl">
                <p
                  className="text-brand-green text-4xl font-bold leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  2018
                </p>
                <p className="text-brand-green/80 text-xs uppercase tracking-widest font-semibold mt-1">
                  Est. Pondicherry
                </p>
              </div>
            </motion.div>

            {/* Right — Story content */}
            <MotionContainer className="lg:w-7/12" stagger>
              <MotionText className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4">
                Our Origin
              </MotionText>

              <MotionHeading
                as="h2"
                className="text-3xl md:text-3xl lg:text-4xl text-brand-green mb-6 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                From the Coasts of Pondicherry, <br />
                <span className="text-brand-gold italic">a Craft is Born</span>
              </MotionHeading>

              <MotionText className="text-text-secondary text-base md:text-lg leading-relaxed mb-5">
                <strong className="text-brand-green">
                  Le Pondicherry Cheese
                </strong>{" "}
                is an artisanal cheese brand born where rich dairy heritage
                meets refined European cheese-making traditions—in the historic
                coastal town of Pondicherry.
              </MotionText>

              <MotionText className="text-text-secondary text-base leading-relaxed mb-8">
                Each cheese is handcrafted in small batches using fresh, locally
                sourced cow's milk, time-honoured techniques, and carefully
                controlled ageing processes. We believe in purity above all —{" "}
                <span className="text-brand-green font-medium">
                  zero preservatives, no artificial additives, clean honest
                  ingredients only.
                </span>
              </MotionText>

              {/* Feature badges */}
              {/* <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
                {["Zero Preservatives", "Locally Sourced Milk", "Small-Batch Craft", "Cave-Aged"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-green border border-brand-green/20 bg-brand-green/5 px-4 py-2 rounded-full"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                    {tag}
                  </span>
                ))}
              </motion.div> */}

              <motion.p
                variants={fadeUp}
                className="italic text-brand-green font-medium text-base md:text-lg border-l-4 border-brand-gold pl-5 py-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                "Patience. Purity. Craftsmanship. We don't just make cheese — we
                celebrate the art of it."
              </motion.p>
            </MotionContainer>
          </div>
        </div>
      </section>

      {/* ── Brand By Strip ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-green py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <MotionContainer stagger>
              <MotionText className="text-brand-gold uppercase tracking-widest text-xs font-semibold mb-2">
                A Brand By
              </MotionText>
              <MotionHeading
                as="h3"
                className="text-2xl md:text-3xl text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Comatha Agro &amp; Dairy Enterprises Pvt. Ltd.
              </MotionHeading>
            </MotionContainer>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-sm text-white/70 text-sm leading-relaxed border-l border-brand-gold/40 pl-6"
            >
              Founded in 2019 by Dr. Arawindhan J., what began as a farm-based
              dairy initiative has grown into a modern dairy processing
              enterprise — rooted in ethical practices and a quality-first
              philosophy.
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Founder's Message ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-bg-cream-light">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative bg-white rounded-3xl shadow-lg border border-gray-100 px-10 md:px-16 py-14 overflow-hidden"
          >
            {/* Decorative large quote mark */}
            <span
              className="absolute top-6 left-8 text-[8rem] leading-none text-brand-gold/10 font-bold select-none pointer-events-none"
              style={{ fontFamily: "var(--font-heading)" }}
              aria-hidden
            >
              "
            </span>

            {/* Top label */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
              {/* <span className="h-px w-8 bg-brand-gold" /> */}
              <span className="text-brand-gold uppercase tracking-widest text-xs font-semibold">
                Founder's Message
              </span>
            </div>

            {/* Quote */}
            <blockquote
              className="relative z-10 text-xl md:text-2xl text-brand-green italic leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              "Our vision has always been to build a dairy enterprise that
              respects both nature and science. Starting from a farm-based
              foundation, we have worked with dedication to create products that
              reflect purity, quality, and authenticity. At Comatha Agro &amp;
              Dairy Enterprises, we believe that great dairy products begin with
              responsible farming, careful processing, and an unrelenting
              commitment to excellence."
            </blockquote>

            {/* Gold divider */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="h-px w-12 bg-brand-gold" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            </div>

            {/* Attribution */}
            <div className="flex justify-between">
              <div className="relative z-10">
                <p
                  className="text-brand-green font-bold text-base"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Dr. Arawindhan J.
                </p>
                <p className="text-text-secondary text-sm uppercase tracking-widest">
                  Founder — Le Pondicherry Cheese
                </p>
              </div>
              <div>
                <QuoteIcon className="text-brand-gold" size={54} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-brand-green text-white">
        <MotionContainer className="container mx-auto px-4" stagger>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <p
                  className="text-4xl md:text-5xl font-bold text-brand-gold mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.number}
                </p>
                <p className="text-white/90">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </MotionContainer>
      </section>

      {/* HOPE Philosophy */}
      <div className="bg-pattern">
        <section className="py-20 ">
          <MotionContainer className="container mx-auto px-4" stagger>
            <div className=" mx-auto text-center">
              <MotionText className="text-brand-gold uppercase tracking-wider mb-4 font-medium">
                A Creed We Live By
              </MotionText>
              <MotionHeading
                as="h2"
                className="text-3xl md:text-4xl mb-8"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Not just cheese. A philosophy in every rind.
              </MotionHeading>
              <MotionText className="text-text-secondary text-md mb-16 max-w-3xl mx-auto">
                At Le Pondicherry, we believe what goes into our cheese matters
                as much as what comes out of it. Sourced from ethically raised
                herds, aged without shortcuts, and crafted free from compromise
                every wheel carries a promise:{" "}
                <span className="italic">
                  pure goodness, from pasture to plate.
                </span>
              </MotionText>
              <MotionContainer
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                stagger
              >
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="md:w-[clamp(6rem,20vw,8rem)] w-[clamp(6rem,20vw,8rem)] md:h-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">
                      H
                    </span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Healthy</h3>
                  <p className="text-md text-text-secondary">
                    Nourishing by nature, not design
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-brand-green rounded-full flex items-center justify-center mx-auto mb-3 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">
                      O
                    </span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Organic</h3>
                  <p className="text-md text-text-secondary">
                    Farmed with care, never with chemicals
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-3 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">
                      P
                    </span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Pure</h3>
                  <p className="text-md text-text-secondary">
                    Nothing hidden, nothing artificial
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-brand-green rounded-full flex items-center justify-center mx-auto mb-3 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">
                      E
                    </span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Enriched</h3>
                  <p className="text-md text-text-secondary">
                    Richer in nutrition, richer in meaning
                  </p>
                </motion.div>
              </MotionContainer>
            </div>
          </MotionContainer>
        </section>
      </div>


      {/* Timeline */}
      <CompanyTimeline data={timeline} />
      
      {/* CTA Section */}
      <section className="py-20 bg-yellow-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Experience the Le Pondy Difference
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8">
            Visit our tasting room in Pondicherry or order online to taste the
            passion and craftsmanship that goes into every wheel of cheese we
            make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
            >
              Shop Our Cheeses
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 border border-brand-green/30 text-brand-green hover:border-brand-gold hover:text-brand-gold font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
            >
              Visit Our Facility
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
