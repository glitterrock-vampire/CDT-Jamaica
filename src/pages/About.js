import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import SectionNav from '../components/ailey/SectionNav';
import IntroSection from '../components/ailey/IntroSection';
import FounderSection from '../components/ailey/FounderSection';
import OrganizationGrid from '../components/ailey/OrganizationGrid';
import MissionSection from '../components/ailey/MissionSection';
import PeopleSection from '../components/ailey/PeopleSection';
import LocationSection from '../components/ailey/LocationSection';
import { getSiteSettings } from '../lib/siteSettings';

const About = () => {
  const { isDarkMode } = useTheme();
  const [siteSettings, setSiteSettings] = useState(null);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  // Hide main navbar when scrolling on About page
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      const navbar = document.querySelector('nav');
      const secondaryNav = document.querySelector('[data-secondary-nav]');
      
      if (navbar && secondaryNav) {
        const scrollY = window.scrollY;
        const secondaryNavTop = secondaryNav.offsetTop;
        
        if (scrollY >= secondaryNavTop - 100) {
          // Hide main navbar completely
          navbar.style.display = 'none';
        } else {
          // Show main navbar
          navbar.style.display = '';
        }
      }
    };

    // Delay the scroll listener to allow navbar to load first
    timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial position after delay
    }, 500); // 500ms delay
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('scroll', handleScroll);
      // Reset navbar display when leaving page
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings) {
          setSiteSettings(settings);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section - Using homepage Hero component */}
      {siteSettings?.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="Our Story"
          subtitle="Discover the legacy and vision of CDT Jamaica"
        />
      )}
      
      {/* Section Navigation - Replaces main navbar on scroll */}
      <motion.div
        data-secondary-nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`sticky top-0 z-[60] py-4 md:py-6 border-b ${borderColor} ${isDarkMode ? 'bg-black/95 backdrop-blur-md shadow-black/30' : 'bg-white/95 backdrop-blur-md shadow-gray-200/30'} shadow-lg transition-all duration-300`}
        style={{ 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center">
            {[
              { id: 'our-founder', label: 'Our Founder' },
              { id: 'our-organization', label: 'Our Organization' },
              { id: 'our-mission', label: 'Our Mission' },
              { id: 'our-people', label: 'Our People' },
              { id: 'our-location', label: 'Our Location' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  const element = document.getElementById(item.id);
                  if (element) {
                    // Offset for sticky nav height
                    const navHeight = 80; // Approximate height of sticky nav
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`text-[10px] md:text-xs tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} hover:text-orange-500 transition-colors px-2 py-1`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <IntroSection />
      <FounderSection />
      <OrganizationGrid />
      <MissionSection />
      <PeopleSection />
      <LocationSection />
    </div>
  );
};

export default About;
