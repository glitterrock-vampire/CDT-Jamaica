import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function FounderSection() {
  const { isDarkMode } = useTheme();

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  return (
    <section id="our-founder" className={`py-12 md:py-16 bg-black`}>
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Our Legacy</div>
              <div className="text-xl md:text-2xl uppercase">Our Founder</div>
            </div>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            className={`p-4 md:p-6 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Name Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Founder</h2>
              <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} text-xl font-bold mb-2`}>
                TONY WILSON O.D.
              </h3>
            </motion.div>

            {/* Content */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <p className={`${isDarkMode ? 'text-white/90' : 'text-black/90'} text-lg leading-relaxed`}>
                <span className="text-orange-500 font-semibold">Mr. Tony Wilson</span>, our beloved "Sir", contributed immensely to the performing arts, specifically to modern dance, in Jamaica for over 30 years.
              </p>
              
              <p className={`${isDarkMode ? 'text-white/90' : 'text-black/90'} text-lg leading-relaxed`}>
                Our Sir, after having suffered a number of severe strokes, passed away on October 16, 2024.
              </p>

              {/* Legacy Info */}
              <div className={`pt-4 border-t ${borderColor}`}>
                <div className={`text-xs ${mutedText} uppercase tracking-[0.12em] mb-2`}>Legacy</div>
                <p className={`${isDarkMode ? 'text-white/80' : 'text-black/80'} text-lg leading-relaxed`}>
                  His pioneering work and contribution to Jamaican arts and culture continue to inspire and guide CDT Jamaica's mission to bring dynamic, highly-technical, cutting-edge modern dance to the Jamaican stage and beyond.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
