import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const organizations = []; // Empty array to remove all tiles

export default function OrganizationGrid() {
  const { isDarkMode } = useTheme();

  return (
    <section id="our-organization" className={`py-20 md:py-32 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Our Organization</h2>
          <p className={`${isDarkMode ? 'text-white' : 'text-black'} text-2xl md:text-3xl font-light max-w-3xl mx-auto`}>
            Our vision goes well beyond a single dance company. Today, CDT Jamaica shares the power of Caribbean dance in theaters, classrooms, and communities around the island.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
