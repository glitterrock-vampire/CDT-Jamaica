import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import DancersGrid from '../components/Dancers/DancersGrid';
import BoardGrid from '../components/Board/BoardGrid';
import { getSiteSettings } from '../lib/sanity';

const Company = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // Handle hash scrolling
  useEffect(() => {
    const scrollToSection = () => {
      const hash = location.hash;
      if (hash) {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          // Wait for content to load and page to render
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    };

    // Scroll immediately if hash exists
    scrollToSection();
    
    // Also scroll after a short delay to ensure content is loaded
    const timer = setTimeout(scrollToSection, 500);
    
    return () => clearTimeout(timer);
  }, [location.hash, loading]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={mutedText}>Loading company information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="Our Company"
          subtitle="Meet our board members, management team, and talented dancers"
        />
      )}

      {/* Meet Our Board Members */}
      <div id="board">
        <BoardGrid 
          featuredOnly={false} 
          title="Board of Directors" 
        />
      </div>

      {/* Management Team */}
      <div id="management">
        <motion.div
          className="py-16 md:py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-heading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Management
              </motion.h2>
              <motion.p 
                className={`text-lg max-w-2xl mx-auto ${mutedText}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Meet the dedicated team that manages CDT Jamaica's operations and artistic vision
              </motion.p>
            </div>
            
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className={`text-center py-12 px-8 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-900/50 border-gray-800' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-3 font-heading">Management Team Coming Soon</h3>
                <p className={mutedText}>
                  Our management team information will be available shortly. Please check back soon to meet the talented professionals who help keep CDT Jamaica running smoothly.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Meet Our Dancers */}
      <div id="dancers">
        <DancersGrid 
          featuredOnly={false} 
          title="Company Dancers"
          aspectRatio="aspect-[4/5]"
        />
      </div>
    </div>
  );
};

export default Company;
