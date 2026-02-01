import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function MissionSection() {
  const { isDarkMode } = useTheme();

  return (
    <section id="our-mission" className={`py-20 md:py-32 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Our Mission</h2>
          <p className={`${isDarkMode ? 'text-white' : 'text-black'} text-xl md:text-2xl font-light max-w-4xl mx-auto leading-relaxed`}>
            Our mission is to further the pioneering work of Tony Wilson and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and <span className="text-orange-500 font-semibold">to di worl</span>!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
