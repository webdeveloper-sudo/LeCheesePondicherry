import { ReactNode } from "react";
import { motion } from "framer-motion";

// Import background images from assets
import cheeseElementOne from "@/assets/images/bg-elements/cheese_element_one.png";
import cheeseElementTwo from "@/assets/images/bg-elements/cheese_element_two.png";

interface DecorativeWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Non-intrusive decorative wrapper component with cheese-themed background elements.
 * Preserves 100% of child component styling, spacing, and functionality.
 *
 * USAGE: Wrap individual sections where you want subtle background decoration.
 * Uses absolute positioning - suitable for wrapping specific sections, not entire app.
 *
 * Example:
 * <DecorativeWrapper>
 *   <section className="py-20 bg-white">
 *     Your content here
 *   </section>
 * </DecorativeWrapper>
 *
 * Background images: src/assets/images/bg-elements/
 * - cheese_element_one.png (top-left)
 * - cheese_element_two.png (bottom-right)
 */
export default function DecorativeWrapper({
  children,
  className = "",
}: DecorativeWrapperProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background Layer - Behind section content with z-[0] */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[0] overflow-hidden">
        {/* Main Cheese Element One - Top Left with Floating Animation */}
        <motion.div
          className="absolute w-[200px] h-[200px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px]
                     opacity-50 md:opacity-70 lg:opacity-80
                     top-[5%] left-[5%] md:top-15 md:left-15 lg:top-15 lg:left-15
                     bg-contain bg-no-repeat bg-center
                     transition-opacity duration-700 hover:opacity-90"
          style={{
            backgroundImage: `url('${cheeseElementOne}')`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Cheese Element Two - Bottom Right with Floating Animation */}
        <motion.div
          className="absolute w-[200px] h-[200px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px]
                     opacity-30 md:opacity-60 lg:opacity-70
                     bottom-[5%] right-[5%] md:bottom-15 md:right-15 lg:bottom-15 lg:right-15
                     bg-contain bg-no-repeat bg-center
                     transition-opacity duration-700 hover:opacity-90"
          style={{
            backgroundImage: `url('${cheeseElementTwo}')`,
          }}
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
            rotate: [0, -3, 0, 3, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1, // Offset animation for variety
          }}
        />
      </div>

      {/* Content Layer - Renders above background with relative positioning */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
