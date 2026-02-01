import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function IntroSection() {
  const { isDarkMode } = useTheme();

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  return (
    <section className={`py-12 md:py-16 bg-black`}>
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
              <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>About</div>
              <div className="text-xl md:text-2xl uppercase">CDT Jamaica</div>
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
                <span className="text-orange-500 font-semibold">CDT</span> is a legacy organization formed to honour Mr. Tony Wilson, O.D. who founded The Company Dance Theatre in 1988. It is headed by four alumni of The Company Dance Theatre: Dr. Sade Bully-Bell, Artistic Director of the Company; Renée I. McDonald, Associate Artistic Director of the Company; Steven Cornwall, Artistic Director of the School; and Colin Blackwood, Executive Director of the Company and the School. <span className="text-orange-500 font-semibold">CDT's</span> purpose is to continue Mr. Tony Wilson's legacy of bringing dynamic, highly technical, cutting-edge modern dance to the Jamaican stage and beyond.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
