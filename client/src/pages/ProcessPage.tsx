import { Link } from "react-router-dom";
import cheesemakerImage from "@/assets/images/process-hero-new.webp";
import cow from "@/assets/icons/process/cow.webp";
import curd from "@/assets/icons/process/curd.webp";
import caves from "@/assets/icons/process/cave.webp";
import quality from "@/assets/icons/process/badge.webp";
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
            The Artisan Process
          </MotionHeading>
          <MotionText className="text-xl text-white-prominent">
            Discover the journey from farm to table, where time and tradition
            meet.
          </MotionText>
        </MotionContainer>
      </section>

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
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 text-center"
              >
                <img className="w-36 mx-auto h-36 mb-6" src={step.icon} />
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#6B6B6B]">{step.description}</p>
              </motion.div>
            ))}
          </MotionContainer>

          <div className="mt-20 text-center">
            <Link to="/shop" className="btn btn-primary">
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
