import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function IntroSection() {
  const { isDarkMode } = useTheme();

  return (
    <section className={`py-20 md:py-32 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`${isDarkMode ? 'text-white/90' : 'text-black/90'} text-lg md:text-2xl leading-relaxed font-light`}
          >
            <span className="text-orange-500 font-semibold">CDT JAMAICA</span> is Caribbean Dance in Motion. From our first performances to our impact across the island and beyond, <span className="text-orange-500 font-semibold">CDT JAMAICA</span> enriches the field of dance and shares the Jamaican cultural experience through performances, training, classes, and community programs.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
