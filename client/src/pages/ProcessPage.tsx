import { Link } from "react-router-dom";
import cheesemakerImage from "@/assets/images/process-hero-new.jpg";
import cow from "@/assets/icons/process/cow.png";
import curd from "@/assets/icons/process/curd.png";
import caves from "@/assets/icons/process/cave.png";
import quality from "@/assets/icons/process/badge.png";
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
      title: "Sourcing the Finest Milk",
      description:
        "We source fresh, local milk from trusted farms within 50km of our facility in Pondicherry.",
      icon: cow,
    },
    {
      title: "Hand-Ladling Curds",
      description:
        "Our cheesemakers use traditional French methods, hand-ladling curds to preserve the delicate texture.",
      icon: curd,
    },
    {
      title: "Affinage in the Caves",
      description:
        "The cheese is aged in temperature-controlled caves, where it develops its unique character and flavor profile.",
      icon: caves,
    },
    {
      title: "Quality Excellence",
      description:
        "Every wheel is inspected and tested before it leaves our facility to ensure it meets our Hope standards.",
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
