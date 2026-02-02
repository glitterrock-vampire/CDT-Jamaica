import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const RepertoireItem = ({ item }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  if (!item) return null;
  
  const { _id, title, choreographer, year, thumbnail, heroImage } = item;
  
  const imageUrl = thumbnail?.asset?.url || heroImage?.asset?.url;
  const imageAlt = thumbnail?.alt || heroImage?.alt || title;

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  const handleClick = () => {
    console.log('RepertoireItem clicked:', { _id, title });
    if (_id) {
      navigate(`/dance/${_id}`);
    } else {
      console.error('RepertoireItem: No _id available for item:', item);
    }
  };

  return (
    <motion.div 
      className={`grid grid-rows-[auto,1fr,auto] gap-3 p-3 border ${borderColor} ${cardBg} cursor-pointer`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
    >
      <motion.div
        className={`flex justify-between text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <span>Repertoire</span>
        <span>{year}</span>
      </motion.div>
      <div className={`h-40 border ${borderColor} overflow-hidden`}>
        {imageUrl ? (
          <img
            src={`${imageUrl}?w=600&h=400&fit=crop&auto=format`}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${mutedText} text-xs`}>
            No Image
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="text-lg font-bold uppercase mb-1">{title}</div>
        <div className={`text-sm font-semibold ${mutedText}`}>{choreographer}</div>
        <div className={`text-sm font-semibold ${mutedText}`}>{year}</div>
      </motion.div>
    </motion.div>
  );
};

export default RepertoireItem;
