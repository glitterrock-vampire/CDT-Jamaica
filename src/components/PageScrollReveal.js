import React from 'react';
import { motion } from 'framer-motion';

const PageScrollReveal = ({ children, variant = 'slideUp' }) => {
  const variants = {
    // Smooth slide up with fade
    slideUp: {
      hidden: {
        y: 100,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 20,
          mass: 1,
          delay: 0.1,
        },
      },
    },
    
    // Elegant fade with slight scale
    fadeScale: {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: 30,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 25,
          duration: 0.8,
        },
      },
    },
    
    // Smooth curtain rise
    curtainRise: {
      hidden: {
        y: 60,
        opacity: 0,
        clipPath: 'inset(100% 0% 0% 0%)',
      },
      visible: {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: {
          type: "tween",
          ease: [0.22, 1, 0.36, 1], // Custom easing curve
          duration: 1,
          delay: 0.15,
        },
      },
    },
    
    // Blur fade in
    blurFade: {
      hidden: {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          type: "spring",
          stiffness: 60,
          damping: 20,
          duration: 0.9,
        },
      },
    },
    
    // Staggered entrance
    staggerFade: {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
      className="w-full"
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageScrollReveal;