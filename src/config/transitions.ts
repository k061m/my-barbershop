export { }; // Make this a module

import { Variants } from 'framer-motion';

// Shared transition settings
const defaultTransition = {
  duration: 1.5, // Animation duration in seconds
  ease: [0.25, 0.1, 0.25, 1.0] // Custom easing function for smooth animation
};

export const transitions = {
  defaultTransition,
  staggerChildren: 0.1, // Delay between each child animation
  delayChildren: 0.2, // Delay before starting children animations
};

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 }, // Initial state: invisible and 20px down
  animate: { opacity: 1, y: 0 }, // Animated state: fully visible and in position
  exit: { opacity: 0, y: -20 } // Exit state: invisible and 20px up
};

// Section transitions
export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 50 }, // Initial state: invisible and 50px down
  whileInView: { // Animation triggered when section comes into view
    opacity: 1, 
    y: 0,
    transition: {
      ...defaultTransition // Use the default transition settings
    }
  }
};

// Card transitions
export const cardVariants: Variants = {
  initial: { opacity: 0, x: -20 }, // Initial state: invisible and 20px left
  whileInView: { // Animation triggered when card comes into view
    opacity: 1, 
    x: 0,
    transition: {
      ...defaultTransition // Use the default transition settings
    }
  }
};

// List container transitions
export const listContainerVariants: Variants = {
  initial: { opacity: 0, x: -50 }, // Initial state: invisible and 50px left
  whileInView: { // Animation triggered when list container comes into view
    opacity: 1, 
    x: 0,
    transition: {
      ...defaultTransition // Use the default transition settings
    }
  }
};

// Slide up transitions
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },  // Start invisible and 20 pixels below final position
  animate: { opacity: 1, y: 0 }    // End fully visible at final position
};

// Fade in transitions
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },  // Start invisible
  animate: { opacity: 1 }   // End fully visible
};

// Modal transitions
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },  // Start invisible, slightly smaller, and lower
  animate: { opacity: 1, scale: 1, y: 0 },      // End visible, full size, at final position
  exit: { opacity: 0, scale: 0.95, y: 20 }      // Exit by fading out, shrinking, and moving down
};

// Navigation transitions
export const navVariants: Variants = {
  initial: { opacity: 0, y: -10 },  // Start invisible and slightly above final position
  animate: { opacity: 1, y: 0 }     // End visible at final position
};

// Create a function to add delay to any variant
export const withDelay = (variant: Variants, delay: number): Variants => {
  return Object.entries(variant).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: {
        ...value,
        transition: { ...defaultTransition, delay }  // Add specified delay to transition
      }
    };
  }, {} as Variants);
};

// Create a function to add stagger to children
export const withStagger = (variant: Variants, staggerChildren: number): Variants => {
  return {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        ...defaultTransition,
        staggerChildren  // Add stagger effect to child animations
      }
    }
  };
}; 
