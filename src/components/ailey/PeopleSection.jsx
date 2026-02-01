import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import DancersGrid from '../../components/Dancers/DancersGrid';
import BoardGrid from '../../components/Board/BoardGrid';

export default function PeopleSection() {
  const { isDarkMode } = useTheme();

  return (
    <section id="our-people" className={`py-20 md:py-32 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Our People</h2>
          <p className={`${isDarkMode ? 'text-white' : 'text-black'} text-2xl md:text-3xl font-light leading-relaxed`}>
            Meet the talented dancers and dedicated board members who make CDT Jamaica possible.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Board of Directors Section */}
          <div>
            <div className="text-center mb-8">
              <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} text-xl font-bold mb-2`}>Board of Directors</h3>
            </div>
            <BoardGrid featuredOnly={false} title="" />
          </div>

          {/* Company Dancers Section */}
          <div>
            <div className="text-center mb-8">
              <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} text-xl font-bold mb-2`}>Company Dancers</h3>
            </div>
            <DancersGrid featuredOnly={false} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
