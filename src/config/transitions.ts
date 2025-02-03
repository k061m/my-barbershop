export { }; // Make this a module

import { Variants } from 'framer-motion';

// Shared transition settings
const defaultTransition = {
  duration: 1.5,
  ease: [0.25, 0.1, 0.25, 1.0]
};

export const transitions = {
  defaultTransition,
  staggerChildren: 0.1,
  delayChildren: 0.2,
};

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Section transitions
export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 50 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: {
      ...defaultTransition
    }
  }
};

// Card transitions
export const cardVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  whileInView: { 
    opacity: 1, 
    x: 0,
    transition: {
      ...defaultTransition
    }
  }
};

// List container transitions
export const listContainerVariants: Variants = {
  initial: { opacity: 0, x: -50 },
  whileInView: { 
    opacity: 1, 
    x: 0,
    transition: {
      ...defaultTransition
    }
  }
};

// Slide up transitions
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Fade in transitions
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

// Modal transitions
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

// Navigation transitions
export const navVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 }
};

// Create a function to add delay to any variant
export const withDelay = (variant: Variants, delay: number): Variants => {
  return Object.entries(variant).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: {
        ...value,
        transition: { ...defaultTransition, delay }
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
        staggerChildren
      }
    }
  };
}; 