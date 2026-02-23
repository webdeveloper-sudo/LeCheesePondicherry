import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import {
  headingVariant,
  paragraphVariant,
  containerVariant,
  staggerContainer,
  buttonHover,
  viewportConfig,
  imageVariant,
} from "../../animations/variants";

// 📦 Motion Container (Section/Div)
interface MotionContainerProps extends HTMLMotionProps<"div"> {
  stagger?: boolean;
  delay?: number;
}

export const MotionContainer: React.FC<MotionContainerProps> = ({
  children,
  stagger = false,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={stagger ? staggerContainer : containerVariant}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 📝 Motion Heading
interface MotionHeadingProps extends HTMLMotionProps<"h2"> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const MotionHeading: React.FC<MotionHeadingProps> = ({
  children,
  as = "h2",
  className,
  ...props
}) => {
  const Tag = motion[as as keyof typeof motion] as any; // Cast to avoid complex type issues with dynamic tags
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={headingVariant}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
};

// 📄 Motion Text/Paragraph
export const MotionText: React.FC<HTMLMotionProps<"p">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={paragraphVariant}
      className={className}
      {...props}
    >
      {children}
    </motion.p>
  );
};

// 🔘 Motion Button
export const MotionButton: React.FC<HTMLMotionProps<"button">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.button
      variants={buttonHover}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={className}
      // Note: We often don't want entrance animations on small buttons unless they are main CTAs.
      // If needed, wrap this in a MotionDiv with variants.
      {...props}
    >
      {children}
    </motion.button>
  );
};

// 🖼️ Motion Image
export const MotionImage: React.FC<HTMLMotionProps<"img">> = ({
  src,
  alt,
  className,
  ...props
}) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={imageVariant}
      className={className}
      {...props}
    />
  );
};
