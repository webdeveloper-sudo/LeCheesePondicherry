import { Link } from "react-router-dom";
import cheesemakerImage from "@/assets/images/process-hero-new.webp";
import cow from "@/assets/icons/process/cow.webp";
import curd from "@/assets/icons/process/curd.webp";
import caves from "@/assets/icons/process/cave.webp";
import quality from "@/assets/icons/process/badge.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";

export default function ProcessPage() {
  const steps = [
    {
      title: "Step 1: Fresh Milk Collection",
      description: "Milk is collected at dawn from trusted local farms.",
      icon: cow,
    },
    {
      title: "Step 2: Gentle Heating & Culture Addition",
      description: "We use natural cultures to develop flavour and texture.",
      icon: curd,
    },
    {
      title: "Step 3: Curd Cutting & Hand Stirring",
      description: "Curds are cut and stirred manually for perfect consistency.",
      icon: curd,
    },
    {
      title: "Step 4: Shaping & Pressing",
      description: "Each cheese is shaped in small moulds to ensure quality.",
      icon: curd,
    },
    {
      title: "Step 5: Natural Ageing",
      description: "Our Swiss and hard cheeses are aged for weeks or months under controlled humidity.",
      icon: caves,
    },
    {
      title: "Step 6: Hand-Cutting & Packing",
      description: "Every batch is tested, cut, and packed with care.",
      icon: quality,
    },
  ];

  return (
    <div className="min-h-screen bg-pattern">
      {/* Hero Banner */}
      <BannerAndBreadCrumb title="The Artisan Process" img={cheesemakerImage} />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <MotionContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
            stagger
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white p-8 rounded-lg shadow-lg border border-border-light text-center"
              >
                <img className="w-36 mx-auto h-36 mb-6" src={step.icon} />
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {step.title}
                </h3>
                <p className="text-text-secondary">{step.description}</p>
              </motion.div>
            ))}
          </MotionContainer>

          <div className="mt-20 text-center">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
            >
              Explore the Collection
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
