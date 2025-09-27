import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  // Capitalize the first letter of each word in the loading text
  const formattedText = text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen flex items-center justify-center bg-black transition-colors duration-300">
      <motion.div 
        className="text-center p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
        />
        <motion.p 
          className="mt-6 text-white text-lg font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {formattedText}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
