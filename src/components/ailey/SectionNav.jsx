import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'our-founder', label: 'Our Founder' },
  { id: 'our-organization', label: 'Our Organization' },
  { id: 'our-mission', label: 'Our Mission' },
  { id: 'our-people', label: 'Our People' },
  { id: 'upcoming-performances', label: 'Upcoming Performances' },
  { id: 'our-location', label: 'Our Location' },
  { id: 'resources', label: 'Resources' },
];

export default function SectionNav() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(section => section.element);

      if (sections.length === 0) return;

      // Find the section that's currently in view
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      let currentSection = sections[0].id;
      
      for (const section of sections) {
        const element = section.element;
        const { offsetTop, offsetHeight } = element;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          currentSection = section.id;
          break;
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  className={`text-xs md:text-sm font-medium tracking-wider uppercase transition-colors ${
                    activeSection === item.id 
                      ? 'text-orange-300' 
                      : 'text-white hover:text-white/70'
                  }`}
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
