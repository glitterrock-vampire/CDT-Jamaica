import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RepertoireItem from './RepertoireItem';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const RepertoireSection = ({ title, items, isLoading = false }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden h-64 animate-pulse"
            >
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <motion.h2 
        className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h2>
      <AnimatePresence>
        <motion.div 
          variants={container}
          initial="hidden"
          animate={isMounted ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9"
        >
          {items.map((item, index) => (
            <motion.div
              key={item._id || index}
              variants={item}
              layout
            >
              <RepertoireItem item={item} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default RepertoireSection;
