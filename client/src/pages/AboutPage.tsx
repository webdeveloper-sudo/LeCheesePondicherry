import { Link } from "react-router-dom";
import cheesemakerImage from "@/assets/images/process-hero-new.webp";
import CompanyTimeline from "@/components/CompanyTimeline";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";
import { motion } from "framer-motion";
import { fadeUp, scaleIn } from "@/animations/variants";

export default function AboutPage() {
  const timeline = [
    { year: "2018", event: "The Vision Takes Root - Dr. Arawindhan J. establishes Le Pondicherry Cheese built on ethical farming." },
    { year: "2019", event: "Learning the Language of Quality - Before a great cheese can be made, a great system must be built." },
    { year: "2020", event: "The Craft Begins - Our first wheels turn. The Kombucha-Washed Rind earns its first admirers." },
    { year: "2021", event: "From Artisan to Institution - Le Pondicherry becomes the name that premium restaurants trust." },
    { year: "2022", event: "Bringing the Cave to You - Subscription boxes and hands-on workshops turn curiosity into craft." },
    { year: "2023", event: "An Invitation to Taste - The tasting room opens. Our cave grows larger. Our welcome, warmer." },
    { year: "2024", event: "Pondicherry to Every Doorstep - Launch of our e-commerce platform. Pan-India shipping." },
    { year: "2026", event: "Still Crafting. Still Committed. Innovation, sustainability, and an unrelenting pursuit of purity." },
  ];

  const stats = [
    { number: "8+", label: "Years of Craftsmanship" },
    { number: "12", label: "Cheese Varieties" },
    { number: "50+", label: "Restaurant Partners" },
    { number: "10,000+", label: "Happy Customers" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[40vh] min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${cheesemakerImage})` }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <MotionContainer
          className="relative z-10 text-center text-white max-w-3xl mx-auto px-4"
          stagger
        >
          <MotionHeading
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white-prominent"
            style={{ fontFamily: "var(--font-heading)" }}
          >
          About Us
          </MotionHeading>
          <MotionText className="text-xl text-white-prominent">
            Where Responsible Farming Meets Refined Dairy Innovation
          </MotionText>
        </MotionContainer>
      </section>

      {/* Origin Story */}
      <div className="bg-pattern">
        <section className="py-20">
          <MotionContainer className="container mx-auto px-4" stagger>
            <div className=" mx-auto">
              <MotionText className="text-[#FAB519] text-center uppercase tracking-wider mb-4 font-medium">
                Our Origin
              </MotionText>
              <MotionHeading
                as="h2"
                className="text-3xl max-w-2xl mx-auto md:text-4xl mb-8 text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Crafting Dairy Excellence - From Our Farms to Your Table
              </MotionHeading>

              <div className="prose prose-lg max-w-3xl mx-auto text-center text-[#1A1A1A]">
                <MotionText className="mb-6">
                  <span className="font-bold">Le Pondicherry Cheese</span> is an
                  artisanal cheese brand born in the historic coastal town of
                  Pondicherry where rich dairy heritage meets refined European
                  cheese-making traditions.
                </MotionText>
                <MotionText className="mb-6">
                  Each cheese is handcrafted in small batches, using fresh,
                  locally sourced cow’s milk, time-honoured techniques, and
                  carefully controlled ageing processes. We believe in purity
                  above all. That’s why our cheeses are made with: Zero
                  preservatives, No artificial additives and Clean, honest
                  ingredients only.
                </MotionText>
                <MotionText className="mb-6 italic font-medium">
                  Patience. Purity. Craftsmanship. At Le Pondicherry Cheese, we
                  don’t just make cheese—we celebrate the art of cheese-making.
                </MotionText>
              </div>

              {/* Brand Branding Component */}
              <div className="mt-16 pt-16 border-t border-gray-200 text-center max-w-4xl mx-auto">
                <MotionHeading
                  as="h3"
                  className="text-2xl mb-2 text-[#2C5530]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  A Brand By
                </MotionHeading>
                <MotionHeading
                  as="h4"
                  className="text-xl mb-6 font-bold"
                >
                  Comatha Agro & Dairy Enterprises Private Limited
                </MotionHeading>
                <MotionText className="max-w-2xl mx-auto text-[#6B6B6B]">
                  Le Pondicherry Cheese is proudly produced by Comatha Agro &
                  Dairy Enterprises Private Limited, a dairy enterprise founded in
                  2019 by Dr. Arawindhan J. What began as a farm-based dairy
                  initiative has grown into a modern dairy processing enterprise,
                  rooted deeply in ethical practices and quality-first
                  principles.
                </MotionText>
              </div>

              {/* Founder's Message */}
              <div className="mt-16 bg-[#FDFBF7] p-8 md:p-12 rounded-3xl max-w-4xl mx-auto shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <MotionHeading
                      as="h3"
                      className="text-2xl md:text-3xl mb-4 text-[#FAB519]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Founder's Message
                    </MotionHeading>
                    <MotionText className="text-lg font-bold mb-4">
                      Dr. Arawindhan J. - Founder
                    </MotionText>
                    <MotionText className="italic text-[#1A1A1A] leading-relaxed">
                      "Our vision has always been to build a dairy enterprise that
                      respects both nature and science. Starting from a farm-based
                      foundation, we have worked with dedication to create
                      products that reflect purity, quality, and authenticity. At
                      Comatha Agro & Dairy Enterprises, we believe that great
                      dairy products begin with responsible farming, careful
                      processing, and a commitment to excellence."
                    </MotionText>
                  </div>
                </div>
              </div>
            </div>
          </MotionContainer>
        </section>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-[#2C5530] text-white">
        <MotionContainer className="container mx-auto px-4" stagger>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <p
                  className="text-4xl md:text-5xl font-bold text-[#F9B51D] mb-2"
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
              <MotionText className="text-[#FAB519] uppercase tracking-wider mb-4 font-medium">
                A Creed We Live By
              </MotionText>
              <MotionHeading
                as="h2"
                className="text-3xl md:text-4xl mb-8"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Not just cheese. A philosophy in every rind.
              </MotionHeading>
              <MotionText className="text-[#6B6B6B] text-md mb-16 max-w-3xl mx-auto">
                At Le Pondicherry, we believe what goes into our cheese matters as
                much as what comes out of it. Sourced from ethically raised herds,
                aged without shortcuts, and crafted free from compromise every
                wheel carries a promise: <span className="italic">pure goodness, from pasture to plate.</span>
              </MotionText>
             <MotionContainer
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                stagger
              >
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="md:w-[clamp(6rem,20vw,8rem)] w-[clamp(6rem,20vw,8rem)] md:h-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-[#F9B51D] rounded-full flex items-center justify-center mx-auto mb-6 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">H</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Healthy</h3>
                  <p className="text-md text-[#6B6B6B]">
                    Nourishing by nature, not design
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-3 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">O</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Organic</h3>
                  <p className="text-md text-[#6B6B6B]">
                    Farmed with care, never with chemicals
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-[#F9B51D] rounded-full flex items-center justify-center mx-auto mb-3 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">P</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Pure</h3>
                  <p className="text-md text-[#6B6B6B]">
                    Nothing hidden, nothing artificial
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-3 aspect-square">
                    <span className="text-white font-bold [font-size:clamp(2rem,10vw,4rem)] leading-none">E</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Enriched</h3>
                  <p className="text-md text-[#6B6B6B]">
                    Richer in nutrition, richer in meaning
                  </p>
                </motion.div>
              </MotionContainer>

            </div>
          </MotionContainer>
        </section>
      </div>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{
          background:
            "radial-gradient(circle,rgba(233, 215, 154, 0.77) 0%, rgba(249, 182, 25, 0.62) 100%)",
          animation: "gradientBG 20s ease infinite",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Experience the Le Pondy Difference
          </h2>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto mb-8">
            Visit our tasting room in Pondicherry or order online to taste the
            passion and craftsmanship that goes into every wheel of cheese we
            make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn btn-primary">
              Shop Our Cheeses
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Visit Our Facility
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <CompanyTimeline data={timeline} />
    </div>
  );
}
