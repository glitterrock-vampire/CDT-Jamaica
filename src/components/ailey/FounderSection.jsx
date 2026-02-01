import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function FounderSection() {
  const { isDarkMode } = useTheme();

  return (
    <section id="our-founder" className={`relative ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Quote Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800"
                  alt="CDT Jamaica Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
            
            {/* Quote */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <blockquote className="relative">
                <span className="text-orange-500 text-8xl font-serif absolute -top-8 -left-4 opacity-50">"</span>
                <p className={`${isDarkMode ? 'text-white' : 'text-black'} text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed italic pl-8`}>
                  Dance is for everybody. I believe that dance came from the people and that it should always be delivered back to the people.
                </p>
              </blockquote>
              <p className="text-orange-500 text-xl font-medium pl-8">— CDT Jamaica Founder</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Biography Section */}
      <div className={`py-20 ${isDarkMode ? 'bg-gradient-to-b from-black to-zinc-900' : 'bg-gradient-to-b from-white to-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <h2 className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase">Our Founder</h2>
              <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} text-3xl md:text-4xl font-light leading-relaxed`}>
                Our founder was an incomparable dancer, a forward-facing visionary, and one of the most significant choreographers in Caribbean dance, whose work changed the course of modern dance in Jamaica forever. Their legacy lives on today.
              </h3>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
