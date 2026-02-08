import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { builder } from '../../lib/sanityClient';

const BoardMemberCard = ({ boardMember, index }) => {
  const { isDarkMode } = useTheme();
  
  const getHeadshotUrl = (headshot) => {
    if (headshot?.asset?.url) {
      return builder.image(headshot.asset).width(400).height(500).fit('crop').url();
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
      <div className={`overflow-hidden rounded-lg border ${isDarkMode ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-white'} transition-all duration-300 group-hover:border-orange-500/50 group-hover:shadow-lg`}>
        {/* Headshot Image */}
        <div className="aspect-[4/5] overflow-hidden relative">
          {boardMember.headshot ? (
            <>
              <img
                src={getHeadshotUrl(boardMember.headshot)}
                alt={boardMember.headshot.alt || boardMember.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              {/* Subtle color overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 via-transparent to-transparent opacity-100 group-hover:opacity-60 transition-opacity duration-500"></div>
            </>
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
              <span className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No headshot
              </span>
            </div>
          )}
        </div>
        
        {/* Board Member Info */}
        <div className="p-4">
          <h3 className={`font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {boardMember.name}
          </h3>
          {boardMember.position && (
            <p className={`text-lg font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {boardMember.position}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BoardMemberCard;
