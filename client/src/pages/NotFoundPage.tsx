import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-pattern flex items-start justify-center py-20 px-4">
      <MotionContainer
        className="max-w-md w-full text-center bg-white p-12 border border-gray-200 shadow-xl"
        stagger
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span className="text-8xl font-bold text-green" style={{ fontFamily: "var(--font-heading)" }}>
            404
          </span>
        </motion.div>
        
        <MotionHeading
          as="h1"
          className="text-3xl font-bold mb-4 text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Lost in the Caves?
        </MotionHeading>
        
        <MotionText className="text-[#6B6B6B] mb-10 leading-relaxed">
          It seems the page you're looking for has matured and moved on, or never existed in our aging caves.
        </MotionText>
        
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <Link to="/" className="btn btn-primary w-full">
            Back to Home
          </Link>
          <Link to="/shop" className="btn btn-secondary w-full">
            Browse Our Cheeses
          </Link>
        </motion.div>
      </MotionContainer>
    </div>
  );
}
