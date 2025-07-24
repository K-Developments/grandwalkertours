'use client';

import { motion } from 'framer-motion';

type MotionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  initial?: object;
  whileInView?: object;
  transition?: object;
  viewport?: object;
};

const defaultInitial = { opacity: 0, y: 20 };
const defaultWhileInView = { opacity: 1, y: 0 };
const defaultTransition = { duration: 0.5 };
const defaultViewport = { once: true, amount: 0.2 };

export default function MotionWrapper({
  children,
  className,
  initial = defaultInitial,
  whileInView = defaultWhileInView,
  transition = defaultTransition,
  viewport = defaultViewport,
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}
