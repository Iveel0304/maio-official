import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

// Alternative slide transitions
const slideVariants = {
  initial: {
    opacity: 0,
    x: 50
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: -50
  }
};

const fadeVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const SlideTransition = ({ children, className = '' }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={slideVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const FadeTransition = ({ children, className = '' }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={fadeVariants}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Animated page wrapper for specific page types
export const AnimatedPage = ({ children, variant = 'default' }: { 
  children: ReactNode; 
  variant?: 'default' | 'slide' | 'fade' 
}) => {
  const TransitionComponent = variant === 'slide' ? SlideTransition : 
                              variant === 'fade' ? FadeTransition : 
                              PageTransition;

  return (
    <TransitionComponent>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </TransitionComponent>
  );
};

// Default export
export default PageTransition;
