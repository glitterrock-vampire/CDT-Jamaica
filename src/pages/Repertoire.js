import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSiteSettings, getRepertoireItems } from '../lib/siteSettings';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Repertoire = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [repertoire, setRepertoire] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, items] = await Promise.all([
          getSiteSettings(),
          getRepertoireItems()
        ]);
        
        if (settings) setSiteSettings(settings);
        if (items) setRepertoire(items);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading repertoire..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20">
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <div className="relative w-full h-96 overflow-hidden">
          <img
            src={siteSettings.heroImage.asset.url}
            alt={siteSettings.heroImage.alt || 'CDT Jamaica Hero'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center px-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Repertoire</h1>
              <p className="text-xl md:text-2xl text-gray-200">Explore our collection of performances and productions</p>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {repertoire.map((item, index) => (
              <motion.div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-48 overflow-hidden">
                  {item.image && (
                    <img 
                      src={item.image.asset.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  {item.choreographer && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Choreographer: {item.choreographer}
                    </p>
                  )}
                  {item.composer && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Composer: {item.composer}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Repertoire;
