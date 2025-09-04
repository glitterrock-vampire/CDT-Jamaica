import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const About = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading about us..." />;
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden h-80 md:h-96">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="CDT Jamaica Performance" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About CDT Jamaica
            </motion.h1>
            <motion.p 
              className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Preserving and promoting Jamaican dance heritage through innovative performances.
            </motion.p>
          </div>
        </div>
      </div>

      <main className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-1 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Our Story</h3>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  CDT Jamaica is a premier dance company dedicated to preserving and promoting Jamaican dance heritage through innovative performances and educational programs. Our repertoire showcases a unique blend of contemporary, classical, and traditional Jamaican dance forms, creating a distinctive style that reflects our rich cultural heritage.
                </p>
                <p>
                  Founded in 2003, we have been at the forefront of the region's dance scene, pushing boundaries and inspiring audiences with our innovative performances that celebrate Jamaica's vibrant cultural identity.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About;
