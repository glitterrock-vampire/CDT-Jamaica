import React from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'our-founder', label: 'Our Founder' },
  { id: 'our-organization', label: 'Our Organization' },
  { id: 'our-mission', label: 'Our Mission' },
  { id: 'our-people', label: 'Our People' },
  { id: 'our-location', label: 'Our Location' },
  { id: 'resources', label: 'Resources' },
];

export default function SectionNav() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#9B8B3D] py-4 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium tracking-wider uppercase hidden md:block">Jump to:</span>
          <ul className="flex flex-wrap gap-2 md:gap-6 justify-center md:justify-end">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-white text-xs md:text-sm font-medium tracking-wider uppercase hover:text-white/70 transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
