import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import { getPerformances } from '../lib/performances';
import { getSiteSettings } from '../lib/siteSettings';
import { builder } from '../lib/sanityClient';

const categories = ["All", "Main Stage", "International", "Showcase"];

export default function PerformancesPage() {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [performancesData, settings] = await Promise.all([
          getPerformances(),
          getSiteSettings()
        ]);
        
        setPerformances(performancesData || []);
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error loading data:', error);
        setPerformances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPerformances = selectedCategory === "All" 
    ? performances 
    : performances.filter(p => p.category === selectedCategory);

  const getImageUrl = (image) => {
    if (image?.asset?.url) {
      return builder.image(image.asset).width(800).height(600).fit('crop').url();
    }
    if (image?.url) {
      return image.url;
    }
    return null;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="Performances"
          subtitle=""
        />
      )}

      {/* Subtitle Section */}
      <div className={`py-12 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className={`text-xl md:text-2xl ${mutedText} font-light leading-tight tracking-wide max-w-3xl`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
            >
              Experience the power of dance that celebrates Caribbean culture and inspires audiences worldwide
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-md'
                  : `${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Performances Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className={`mt-4 text-xl ${mutedText}`}>Loading performances...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 md:grid-cols-3 mt-6"
            >
              {filteredPerformances.map((performance, index) => {
                const dateObj = new Date(performance.date);
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const day = dateObj.getDate();
                
                return (
                  <Link
                    key={performance._id}
                    to={`/performance/${performance.slug?.current || performance._id}`}
                    className="block group"
                  >
                    <motion.div
                      className={`grid grid-rows-[auto,1fr,auto] gap-3 p-3 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300 cursor-pointer`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.04 }}
                    >
                      <motion.div
                        className={`flex justify-between text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 + index * 0.04 }}
                      >
                        <span>{performance.category}</span>
                        <span>{month} {day}</span>
                      </motion.div>
                      <div className={`h-40 border ${borderColor} overflow-hidden`}>
                        <img
                          src={getImageUrl(performance.image)}
                          alt={performance.image?.alt || performance.title}
                          className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + index * 0.04 }}
                      >
                        <div className="text-lg font-bold uppercase mb-1">{performance.title}</div>
                        <div className={`text-sm font-semibold ${mutedText}`}>{performance.company}</div>
                        <div className={`text-sm font-semibold ${mutedText}`}>{performance.time}</div>
                      </motion.div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredPerformances.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className={`text-xl ${mutedText}`}>No performances found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
