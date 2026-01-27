import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import DancersGrid from '../components/Dancers/DancersGrid';
import BoardGrid from '../components/Board/BoardGrid';
import { getSiteSettings } from '../lib/siteSettings';

const Company = () => {
  const { isDarkMode } = useTheme();
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

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
          subtitle="Meet the talented dancers and dedicated board members"
        />
      )}

      {/* Featured Dancers */}
      <DancersGrid 
        featuredOnly={true} 
        title="Featured Dancers" 
      />

      {/* Board of Directors */}
      <BoardGrid 
        featuredOnly={false} 
        title="Board of Directors" 
      />

      {/* All Dancers */}
      <DancersGrid 
        featuredOnly={false} 
        title="Complete Dance Company" 
      />
    </div>
  );
};

export default Company;
