import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const RepertoireItem = ({ item }) => {
  const navigate = useNavigate();
  
  if (!item) return null;
  
  const { _id, title, choreographer, year, thumbnail, heroImage } = item;
  
  // Handle both thumbnail and heroImage with proper fallbacks
  const imageUrl = thumbnail?.asset?.url || heroImage?.asset?.url;
  const imageAlt = thumbnail?.alt || heroImage?.alt || title;

  console.log('Rendering item:', { 
    title, 
    choreographer, 
    year,
    thumbnail: thumbnail?.asset?.url,
    heroImage: heroImage?.asset?.url,
    finalImageUrl: imageUrl
  });

  const handleClick = () => {
    if (_id) {
      navigate(`/dance/${_id}`);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer group relative h-full flex flex-col border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl dark:shadow-gray-900/20"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="w-full aspect-video overflow-hidden"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        {imageUrl ? (
          <div className="relative w-full h-full">
            <motion.img
              src={`${imageUrl}?w=600&h=${Math.floor(600 * (9/16))}&fit=crop&auto=format`}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                console.error('Error loading image:', imageUrl);
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hidden items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">Image not available</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No image available</span>
          </div>
        )}
      </motion.div>
      
      <motion.div className="p-6 flex-1 flex flex-col">
        <div className="flex items-baseline gap-3 mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {title}
          </h3>
          {year && (
            <span className="text-base font-medium text-gray-600 dark:text-gray-400">
              ({year})
            </span>
          )}
        </div>
        {choreographer && (
          <p className="text-base text-gray-700 dark:text-gray-300 mt-1 font-medium">
          <span className="text-gray-900 dark:text-white font-semibold">{choreographer}</span>
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RepertoireItem;
