import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function IntroSection() {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <section className={`py-12 md:py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column - Header */}
            <motion.div
              className="md:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="sticky top-24">
                <div className={`text-sm tracking-[0.12em] uppercase ${mutedText}`}>About</div>
                <div className={`text-2xl md:text-3xl uppercase ${textColor}`}>The Company</div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              className="md:col-span-6 md:col-start-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`space-y-6 ${isDarkMode ? 'text-white/90' : 'text-black/90'} text-xl leading-relaxed`}>
                <p>
                  Founded by Mr. Tony Wilson, OD in 1988 in Jamaica, The Company Dance Theatre rose to national acclaim. With an eclectic repertory of modern, contemporary and Jamaican-styled works, The Company Dance Theatre performed in Jamaica, the wider Caribbean, and North America.
                </p>
                <p>
                  CDT Jamaica is a legacy company formed to honour the late Mr. Tony Wilson, OD. It is headed by four alumni of The Company Dance Theatre: Dr. Sade Bully-Bell, Artistic Director, CDT; Renée I. McDonald, Associate Artistic Director, CDT; Steven Cornwall, Artistic Director, The CDT School; and Colin Blackwood, Executive Director, CDT and The CDT School. CDT's purpose is to continue Mr. Tony Wilson's legacy of bringing dynamic, highly technical, cutting-edge modern dance to the Jamaican stage and beyond.
                </p>
                <p>
                  Our mission is to further the pioneering work of Mr. Tony Wilson, OD and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and to di worl'!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
