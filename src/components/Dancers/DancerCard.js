import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { builder } from '../../lib/sanityClient';

const DancerCard = ({ dancer, index }) => {
  const { isDarkMode } = useTheme();
  
  const getHeadshotUrl = (headshot) => {
    if (headshot?.asset?.url) {
      return builder.image(headshot.asset).width(400).height(400).fit('crop').url();
    }
    return null;
  };

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className={`overflow-hidden rounded-lg border ${isDarkMode ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-white'} transition-all duration-300 group-hover:border-orange-500/50`}>
        {/* Headshot Image */}
        <div className="aspect-square overflow-hidden">
          {dancer.headshot ? (
            <img
              src={getHeadshotUrl(dancer.headshot)}
              alt={dancer.headshot.alt || dancer.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No headshot
              </span>
            </div>
          )}
        </div>
        
        {/* Dancer Info */}
        <div className="p-4">
          <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {dancer.name}
          </h3>
          {dancer.role && (
            <p className={`text-sm font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {dancer.role}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DancerCard;
