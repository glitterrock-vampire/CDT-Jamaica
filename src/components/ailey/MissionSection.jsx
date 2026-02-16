import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function MissionSection() {
  const { isDarkMode } = useTheme();

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  return (
    <section id="our-mission" className={`py-12 md:py-16 bg-black`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Purpose</div>
              <div className="text-xl md:text-2xl uppercase">Our Mission</div>
            </div>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            className={`p-4 md:p-6 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <p className={`${isDarkMode ? 'text-white/90' : 'text-black/90'} text-lg leading-relaxed`}>
                Our mission is to further the pioneering work of Tony Wilson and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and <span className="text-orange-500 font-semibold">to di worl</span>!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
