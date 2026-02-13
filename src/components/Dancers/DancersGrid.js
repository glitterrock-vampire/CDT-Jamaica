import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import DancerCard from './DancerCard';
import { getDancers, getFeaturedDancers } from '../../lib/dancers';

const DancersGrid = ({ featuredOnly = false, title = "Our Dancers", aspectRatio = "aspect-square" }) => {
  const { isDarkMode } = useTheme();
  const [dancers, setDancers] = useState([]);
  const [loading, setLoading] = useState(true);

  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // Additional dancers to add to the grid
  const additionalDancers = [
    'Assantewaa Alberts',
    'Gina Strachan', 
    'Janna Nesbeth',
    'Kaelah Mckoy',
    'Kenya Harvey',
    'Kishan Carnegie',
    'Matthew Johnson',
    'Nathan Campbell',
    'Nneka Alvaranga',
    'Shamitha Chindepalli',
    'Shiloh Tracey',
    'Sierra Moss-Solomon'
  ];

  useEffect(() => {
    const fetchDancers = async () => {
      try {
        const data = featuredOnly ? await getFeaturedDancers() : await getDancers();
        // Add additional dancers to the end if not featuredOnly
        const allDancers = featuredOnly ? data : [...data, ...additionalDancers];
        setDancers(allDancers);
      } catch (error) {
        console.error('Error fetching dancers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDancers();
  }, [featuredOnly]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className={`mt-4 text-xl ${mutedText}`}>Loading dancers...</p>
      </div>
    );
  }

  if (dancers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className={`text-xl ${mutedText}`}>
          {featuredOnly ? 'No featured dancers found.' : 'No dancers found.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`py-12 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={`text-3xl md:text-4xl font-bold uppercase mb-4 font-heading ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {title}
          </h2>
          <div className={`w-20 h-1 bg-orange-500 mx-auto`}></div>
        </motion.div>

        {/* Dancers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dancers.map((dancer, index) => (
            <DancerCard key={dancer._id} dancer={dancer} index={index} aspectRatio={aspectRatio} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DancersGrid;
