import { Variants, Transition } from "framer-motion";

// --- Fluid & Slow Physics (Refined Ethereal Flow) ---
export const fluidTransition: Transition = {
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth "parallax-like" feel
};

export const springSmooth: Transition = {
  type: "spring",
  stiffness: 100, // Much softer spring
  damping: 20, // Less bouncy, more fluid
  mass: 1,
};

export const slowHover: Transition = {
  duration: 0.4,
  ease: "easeOut",
};

// --- Reusable Variants ---

// 📦 Container (Standard)
export const containerVariant: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...fluidTransition, duration: 0.6 },
  },
};

// 📦 Container (Slow Stagger)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Slower stagger
      delayChildren: 0.2,
    },
  },
};

// 📄 Fade Up (Slower, Deeper Slide)
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60, // Deeper starting position for "parallax-like" rise
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: fluidTransition,
  },
};

// 📝 Headings (Smooth Reveal)
export const headingVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...fluidTransition, duration: 1.0 },
  },
};

// 📄 Paragraphs (Smooth Text)
export const paragraphVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...fluidTransition, delay: 0.2 },
  },
};

// 🔘 Buttons (Subtle Lift)
export const buttonHover: Variants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -3,
    transition: slowHover,
  },
  tap: { scale: 0.98 },
};

// 🟣 Circular Elements (Scale 0 -> 1 Smooth)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springSmooth, duration: 1.2 },
  },
};

// 🖼️ Images (Slow Zoom & Fade)
export const imageVariant: Variants = {
  hidden: { opacity: 0, scale: 1.1 }, // Start slightly zoomed in
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

// 🔍 Viewport Settings (Trigger earlier for smoothness)
export const viewportConfig = {
  once: true,
  amount: 0.3, // Trigger when 30% visible
  margin: "0px 0px -50px 0px", // 50px offset
};
