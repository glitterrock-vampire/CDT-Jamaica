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
              className="md:col-span-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`space-y-8 ${isDarkMode ? 'text-white/90' : 'text-black/90'} text-2xl leading-relaxed text-left w-full`}>
                <p className="text-3xl font-semibold mb-6">
                  Founded by Mr. Tony Wilson, OD in 1988 in Jamaica, The Company Dance Theatre rose to national acclaim. With an eclectic repertory of modern, contemporary and Jamaican-styled works, The Company Dance Theatre performed in Jamaica, wider Caribbean, and North America.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  CDT Jamaica is a legacy company formed to honor the late Mr. Tony Wilson, OD. It is headed by four alumni of The Company Dance Theatre: Dr. Sade Bully-Bell, Artistic Director, CDT; Renée I. McDonald, Associate Artistic Director, CDT; Steven Cornwall, Artistic Director, The CDT School; and Colin Blackwood, Executive Director, CDT and The CDT School. CDT's purpose is to continue Mr. Tony Wilson's legacy of bringing dynamic, highly technical, cutting-edge modern dance to the Jamaican stage and beyond.
                </p>
                <p className="text-lg leading-relaxed">
                  Our mission is to further the pioneering work of Mr. Tony Wilson, OD and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and to the world!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Separate CDT School component for bottom of page
export function CDTSchoolSection() {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';

  return (
    <section className={`py-12 md:py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column - Title */}
            <motion.div
              className="md:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="sticky top-24">
                <div className={`text-3xl md:text-4xl font-bold uppercase mb-4 font-heading`}>THE CDT SCHOOL</div>
                <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              className="md:col-span-7 md:col-start-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`text-lg ${textColor} leading-relaxed mb-6`}>
                <p>
                  From first steps to pre-professional study, The CDT School offers programmes in contemporary, ballet, and Jamaican folk forms led by working artists.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-lg font-semibold mb-2">Juniors</div>
                  <div className="text-base md:text-lg">Ages 3–17</div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-lg font-semibold mb-2">Adults</div>
                  <div className="text-base md:text-lg">Evenings + weekends</div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  <a
                    href="https://forms.gle/zASuCqPRZn2EZ3Ba7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-[0.16em] uppercase border border-transparent bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                  >
                    Register – Juniors
                  </a>
                  <a
                    href="https://forms.gle/aqQ5kRxFjcrEmyrB7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-[0.16em] uppercase border border-transparent bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                  >
                    Register – Adults
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
