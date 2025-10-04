import React from 'react';
import { motion } from 'framer-motion';

const PageBounce = ({ children }) => {
  const bounceVariants = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={bounceVariants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageBounce;
