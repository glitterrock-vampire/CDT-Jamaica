import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const organizations = [
  {
    name: 'CDT Jamaica Company',
    description: "Our world-renowned professional dance company that brings Caribbean dance to stages across Jamaica and beyond.",
    category: 'Performances',
    color: '#8B1538',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600'
  },
  {
    name: 'CDT Jamaica II',
    description: 'The next generation of Caribbean dance talent, featuring emerging dancers and choreographers.',
    category: 'Performances',
    color: '#9B8B3D',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600'
  },
  {
    name: 'CDT Jamaica School',
    description: 'Where Caribbean dance stars are born through professional training in contemporary, ballet, and Jamaican folk forms.',
    category: 'Training',
    color: '#4A6741',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600'
  },
  {
    name: 'Community Programs',
    description: "Our enduring mission lives on through community outreach and education programs across Jamaica.",
    category: 'Community',
    color: '#5C4D7D',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600'
  },
  {
    name: 'Dance Extension',
    description: 'All are welcome to learn and embrace the power of Caribbean movement through our open dance classes.',
    category: 'Classes',
    color: '#CD7F32',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600'
  }
];

export default function OrganizationGrid() {
  const { isDarkMode } = useTheme();

  return (
    <section id="our-organization" className={`py-20 md:py-32 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Our Organization</h2>
          <p className={`${isDarkMode ? 'text-white' : 'text-black'} text-2xl md:text-3xl font-light max-w-3xl mx-auto`}>
            Our vision goes well beyond a single dance company. Today, CDT Jamaica shares the power of Caribbean dance in theaters, classrooms, and communities around the island.
          </p>
        </motion.div>
        
        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org, index) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={org.image}
                  alt={org.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Category Badge */}
                <div 
                  className="absolute top-4 right-4 px-3 py-1 text-xs font-bold tracking-wider uppercase text-white"
                  style={{ backgroundColor: org.color }}
                >
                  {org.category}
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                    {org.name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {org.description}
                  </p>
                  <span className="text-orange-500 text-sm font-medium tracking-wider uppercase inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                    Learn More 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
