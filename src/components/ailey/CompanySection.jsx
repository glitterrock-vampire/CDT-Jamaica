import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function CompanySection() {
  const { isDarkMode } = useTheme();

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  return (
    <section id="the-company" className={`py-12 md:py-16 bg-black`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Organization</div>
              <div className="text-xl md:text-2xl uppercase">The Company</div>
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
                <span className="text-orange-500 font-semibold">CDT</span> is the legacy company of the Company Dance Theatre, committed to bringing dynamic, highly-technical, cutting-edge modern dance to the Jamaican stage and beyond.
              </p>
              <p className={`${isDarkMode ? 'text-white/90' : 'text-black/90'} text-lg leading-relaxed`}>
                The dancers of the company are volunteer students and young professionals, with a commitment and love for the art form.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
