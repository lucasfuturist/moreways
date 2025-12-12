"use client";

import { motion, Variants, Transition } from "framer-motion";
import { useMotionConfig } from "@/lib/motion-config";

export const FadeIn = ({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => {
  const { fadeProps } = useMotionConfig();
  
  // Merge delay. We cast to 'any' here safely because we know both 
  // config objects produce valid Framer Motion transition objects, 
  // but TS gets confused merging a Tuple ease with a number-only duration.
  const transition = { ...fadeProps.transition, delay } as Transition;

  return (
    <motion.div
      {...fadeProps}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { staggerContainerProps, isMobile } = useMotionConfig();

  // Explicitly type this as 'Variants' to prevent TS from inferring a loose object
  const variants: Variants = isMobile 
    ? {} 
    : {
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      };

  return (
    <motion.div
      {...staggerContainerProps}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const { staggerItemProps } = useMotionConfig();

  return (
    <motion.div
      variants={staggerItemProps.variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};