import { Link } from "react-router-dom";
import cheesemakerImage from "@/assets/images/process-hero-new.jpg";
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
    {
      year: "2018",
      event:
        "Le Pondicherry Cheese founded, facility established in Pondicherry",
    },
    {
      year: "2019",
      event: "First aged cheddar wheels released after 12-month maturation",
    },
    {
      year: "2020",
      event:
        "Launched signature Kombucha-Washed Rind, winning regional food awards",
    },
    {
      year: "2021",
      event:
        "Expanded product line to 12 varieties, began supplying premium restaurants",
    },
    {
      year: "2022",
      event: "Introduced subscription boxes and cheese-making workshops",
    },
    { year: "2023", event: "Opened tasting room and expanded aging caves" },
    {
      year: "2024",
      event: "Launched e-commerce platform, now shipping pan-India",
    },
    { year: "2026", event: "Celebrating 8 years of artisan excellence" },
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
            Our Story
          </MotionHeading>
          <MotionText className="text-xl text-white-prominent">
            Born from a Dream in Pondicherry
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
                Where French Heritage Meets Indian Craftsmanship
              </MotionHeading>

              <div className="prose prose-lg max-w-none text-justify text-[#1A1A1A]">
                <MotionText className="mb-6 font-medium">
                  Le Pondicherry Cheese was born from a simple dream: to bring
                  the art of French cheesemaking to the sun-kissed shores of
                  Pondicherry. Founded in 2018 by the Achariya Group of
                  Companies (AGOC), our journey began when our founder, inspired
                  by Pondicherry's rich French colonial heritage, envisioned
                  creating authentic artisan cheeses that honor European
                  tradition while celebrating local ingredients.
                </MotionText>
                <MotionText className="mb-6">
                  Pondicherry, with its unique blend of French and Indian
                  cultures, provided the perfect setting for our cheese-making
                  venture. The region's temperate climate, access to fresh local
                  milk, and centuries-old connection to French culinary
                  traditions made it an ideal location to craft premium cheeses.
                </MotionText>
                <MotionText className="mb-6">
                  Our master cheesemakers trained in traditional French
                  techniques, studying under European artisans before returning
                  to establish our facility in Pondicherry. We combine
                  time-honored methods—hand-ladling curds, natural aging in
                  temperature-controlled caves, and careful affinage—with the
                  finest local ingredients sourced from trusted dairy farms
                  within 50 kilometers of our facility.
                </MotionText>
                <MotionText>
                  What sets Le Pondicherry Cheese apart is our commitment to
                  authenticity without compromise. We don't take shortcuts. Each
                  wheel of cheese is crafted by hand, aged patiently, and
                  monitored daily by our cheesemakers. Our aged cheddar rests
                  for a minimum of 12 months, developing the complex flavors and
                  crystalline texture that cheese connoisseurs seek.
                </MotionText>
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
                Our Philosophy
              </MotionText>
              <MotionHeading
                as="h2"
                className="text-3xl md:text-4xl mb-8"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                HOPE - Healthy, Organic, Pure, Enriched
              </MotionHeading>
              <MotionText className="text-[#6B6B6B] text-md mb-16">
                As part of the AGOC family, Le Pondy Cheese embodies the HOPE
                philosophy. Our cheeses are made from milk sourced from farms
                that practice ethical animal husbandry, free from artificial
                hormones. We use natural aging processes, minimal additives, and
                traditional methods that preserve the nutritional integrity of
                our products.
              </MotionText>
              <MotionContainer
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                stagger
              >
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-32 h-32 bg-[#F9B51D] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-5xl">H</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Healthy</h3>
                  <p className="text-md text-[#6B6B6B]">
                    Nutritious, wholesome ingredients
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-32 h-32 bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-5xl">O</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Organic</h3>
                  <p className="text-md text-[#6B6B6B]">
                    Natural, sustainable practices
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-32 h-32 bg-[#F9B51D] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-5xl">P</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Pure</h3>
                  <p className="text-md text-[#6B6B6B]">
                    No artificial additives
                  </p>
                </motion.div>
                <motion.div
                  className="bg-white p-6 border-gray-200 border shadow-lg"
                  variants={scaleIn}
                >
                  <div className="w-32 h-32 bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-5xl">E</span>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">Enriched</h3>
                  <p className="text-md text-[#6B6B6B]">
                    Value-added nutrition
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
