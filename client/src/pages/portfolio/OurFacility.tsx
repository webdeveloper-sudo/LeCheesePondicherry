import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import facilityBanner from "@/assets/images/hero-cheese-board.webp";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";
import {
  fadeUp,
  staggerContainer,
  headingVariant,
  scaleIn,
  viewportConfig,
} from "@/animations/variants";
import {
  Users,
  Thermometer,
  Truck,
  Store,
  CheckCircle2,
  MapPin,
  Leaf,
  Award,
  Clock,
  ChevronRight,
} from "lucide-react";
import Outlet from "@/components/Outlet";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { number: "50+", label: "Expert Artisans" },
  { number: "12+", label: "Cheese Varieties" },
  { number: "20+", label: "Cities Served" },
  { number: "100%", label: "Natural Ingredients" },
];

const processSteps = [
  {
    step: "01",
    title: "Milk Sourcing",
    desc: "Directly from local, chemical-free farms with verified ethical practices.",
    icon: <Leaf size={28} />,
  },
  {
    step: "02",
    title: "Culturing",
    desc: "Traditional bacterial cultures carefully selected for unique, layered flavor.",
    icon: <Thermometer size={28} />,
  },
  {
    step: "03",
    title: "Curd Casting",
    desc: "Precision cutting and hand-moulding by master cheesemakers.",
    icon: <Store size={28} />,
  },
  {
    step: "04",
    title: "Cave Aging",
    desc: "Slow, patient ripening in our climate-controlled cellar for optimal affinage.",
    icon: <Clock size={28} />,
  },
];



const logisticsFeatures = [
  {
    title: "Cold-Chain Logistics",
    desc: "Precision temperature-controlled vehicles ensure freshness at every mile.",
  },
  {
    title: "Pan-India Reach",
    desc: "We distribute to 20+ cities through specialized dairy partners nationwide.",
  },
  {
    title: "Eco-Friendly Packaging",
    desc: "Insulated, biodegradable materials — minimal impact, maximum freshness.",
  },
];

const teamHighlights = [
  "Certified Master Cheesemakers",
  "Quality Assurance Specialists",
  "Traditional Aging Experts",
  "Sustainable Production Team",
];

// ─── Component ────────────────────────────────────────────────────────────────

const OurFacility: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero / Banner ─────────────────────────────────────────────────────── */}
      <BannerAndBreadCrumb title="Our Modern Facility" img={facilityBanner} />

      {/* ── Stats Bar ────────────────────────────────────────────────────────── */}
      {/* <section className="bg-brand-gold">
        <MotionContainer
          className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          stagger
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="py-2">
              <p
                className="text-3xl md:text-4xl font-bold text-brand-green mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.number}
              </p>
              <p className="text-brand-green/80 text-sm font-medium uppercase tracking-wider">
                {s.label}
              </p>
            </motion.div>
          ))}
        </MotionContainer>
      </section> */}

      {/* ── Workforce Section ─────────────────────────────────────────────────── */}
      <div className="bg-pattern">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Text */}
              <MotionContainer className="flex-1 lg:max-w-xl" stagger>
                <MotionText className="text-brand-gold uppercase tracking-wider mb-3 font-medium text-sm">
                  Expert Team
                </MotionText>
                <MotionHeading
                  as="h2"
                  className="text-3xl md:text-4xl font-heading text-brand-green mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Our Dedicated Workforce
                </MotionHeading>
                <MotionText className="text-text-secondary text-lg mb-10 leading-relaxed">
                  Our team blends generational cheesemakers with modern food
                  scientists. Each member is trained in traditional European
                  methods while adhering to the strictest international safety
                  and hygiene standards.
                </MotionText>
                <ul className="space-y-4">
                  {teamHighlights.map((item, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      className="flex items-center gap-3 text-brand-green font-medium"
                    >
                      <CheckCircle2 className="text-brand-gold flex-shrink-0" size={20} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <motion.div variants={fadeUp} className="mt-10">
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                  >
                    Our Story
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </MotionContainer>

              {/* Image */}
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="flex-1 relative w-full max-w-md lg:max-w-none"
              >
                <div className="aspect-square bg-bg-cream-light overflow-hidden shadow-2xl border border-brand-green/5 rounded-3xl">
                  <img
                    src="https://i.postimg.cc/KvvBvVn3/french-camembert-pieces-served-slate-surface.jpg"
                    alt="Our Team"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-brand-gold p-8 rounded-2xl shadow-xl hidden lg:block">
                  <p
                    className="text-brand-green font-heading text-4xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    50+
                  </p>
                  <p className="text-brand-green/80 text-sm font-semibold uppercase tracking-wider">
                    Artisans
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Process Steps ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-green">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            variants={headingVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <p className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-3">
              Craft &amp; Mastery
            </p>
            <h2
              className="text-3xl md:text-4xl font-heading text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The Cheese Making Process
            </h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto" />
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-brand-gold transition-all duration-500 cursor-default"
              >
                {/* Step number watermark */}
                <span
                  className="absolute top-4 right-4 text-5xl font-bold text-white/10 group-hover:text-brand-green/20 transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.step}
                </span>
                {/* Icon */}
                <div className="mb-6 text-brand-gold group-hover:text-brand-green transition-colors">
                  {item.icon}
                </div>
                <h3
                  className="text-xl font-heading text-white group-hover:text-brand-green mb-3 transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/60 group-hover:text-brand-green/80 transition-colors text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section>
        <Outlet />

      </section>
      {/* ── Transportation & Distribution ─────────────────────────────────────── */}
      <section className="py-20 bg-brand-green text-white overflow-hidden relative">
        {/* Ghost icon */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none flex items-center justify-end pr-8">
          <Truck size={380} className="rotate-12" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text */}
            <MotionContainer className="lg:w-1/2" stagger>
              <MotionText className="text-brand-gold uppercase tracking-wider font-semibold text-sm mb-4">
                Logistics &amp; Care
              </MotionText>
              <MotionHeading
                as="h2"
                className="text-3xl md:text-5xl font-heading mb-10"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Transportation &amp; Distribution
              </MotionHeading>

              <div className="space-y-8">
                {logisticsFeatures.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="text-brand-gold" size={20} />
                    </div>
                    <div>
                      <h4
                        className="text-lg font-heading mb-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-white/60 leading-relaxed text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </MotionContainer>

            {/* Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="lg:w-1/2 w-full"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://i.postimg.cc/KvvBvVn3/french-camembert-pieces-served-slate-surface.jpg"
                  alt="Logistics"
                  className="w-full h-full object-cover"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 to-transparent" /> */}
                <div className="absolute bottom-8 left-8">
                  <p
                    className="text-brand-gold text-2xl font-heading mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    24/7 Monitoring
                  </p>
                  <p className="text-white/60 text-sm">
                    Quality control at every mile
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Certifications / Trust Bar ────────────────────────────────────────── */}
      <section className="py-16 bg-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={headingVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <p className="text-brand-green uppercase tracking-widest text-sm font-semibold mb-2">
              Our Standards
            </p>
            <h2
              className="text-3xl md:text-4xl font-heading text-brand-green"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Certified Quality at Every Step
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {[
              { icon: <Award size={32} />, label: "FSSAI Certified" },
              { icon: <Leaf size={32} />, label: "100% Natural" },
              { icon: <CheckCircle2 size={32} />, label: "Preservative Free" },
              { icon: <Users size={32} />, label: "Ethical Sourcing" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="bg-white/60 backdrop-blur-sm border border-brand-green/10 p-6 text-center rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-brand-green mx-auto mb-3 flex justify-center">
                  {item.icon}
                </div>
                <p className="text-brand-green font-semibold text-sm uppercase tracking-wider">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-yellow-gradient text-green text-center">
        <MotionContainer className="container mx-auto px-4 max-w-2xl" stagger>
          <MotionText className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4">
            Visit Us
          </MotionText>
          <MotionHeading
            as="h2"
            className="text-3xl md:text-4xl font-heading text-brand-green mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Experience the Le Pondy Difference
          </MotionHeading>
          <MotionText className="text-brand-green-400 mb-10 leading-relaxed">
            Visit our tasting room in Pondicherry or order online to taste the
            passion and craftsmanship in every wheel we make.
          </MotionText>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
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
              className="group inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:border-brand-gold hover:text-brand-gold font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
            >
              Get in Touch
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </MotionContainer>
      </section>
    </div>
  );
};

export default OurFacility;
