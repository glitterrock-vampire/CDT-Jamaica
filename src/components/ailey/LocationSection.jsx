import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Download, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function LocationSection() {
  const { isDarkMode } = useTheme();

  return (
    <section id="our-location" className="relative min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=1600"
          alt="CDT Jamaica Dance Center"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Our Location</h2>
          <h3 className="text-white text-2xl md:text-3xl font-light leading-relaxed mb-8">
            Our dance center is the premier dedicated dance facility in Kingston, the cultural capital of the Caribbean.
          </h3>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://drive.google.com/file/d/1QFtkeI2cGyEXoaCnQoChasgnZ87Q6njT/view"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-6 text-sm tracking-wider font-medium flex items-center transition-colors"
            >
              <Download className="mr-2 h-4 w-4" /> Download Brochure
            </a>
            <button className="border border-white text-white hover:bg-white hover:text-black px-8 py-6 text-sm tracking-wider flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Rentals
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
