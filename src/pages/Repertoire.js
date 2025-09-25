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
      {siteSettings?.heroImage &&
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
      }
  
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Repertoire
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our collection of innovative dance works, from contemporary pieces to traditional Jamaican expressions
          </p>
        </motion.div>

        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="repertoire-grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {repertoire.map((item) => (
              <motion.div
                key={item._id}
                variants={fadeInUp}
              >
                <Link 
                  to={`/repertoire/${item.slug?.current || item._id}`}
                  className="repertoire-card group"
                >
                  <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden rounded-t-lg">
                    {item.heroImage?.asset?.url ? (
                      <img 
                        src={item.heroImage.asset.url}
                        alt={item.title}
                        className="repertoire-image"
                        style={{ aspectRatio: '4/3', maxHeight: '224px' }}
                      />
                    ) : item.thumbnail?.asset?.url ? (
                      <img 
                        src={item.thumbnail.asset.url}
                        alt={item.title}
                        className="repertoire-image"
                        style={{ aspectRatio: '4/3', maxHeight: '224px' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      {item.year && (
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">{item.year}</span>
                      )}
                      {item.companyPremiere && (
                        <span className="bg-gradient-to-r from-gray-900 to-black text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">{item.companyPremiere}</span>
                      )}
                    </div>
                    <h3 className="repertoire-title">
                      {item.title}
                    </h3>
                    {item.choreographer && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">by {item.choreographer}</p>
                    )}
                    {item.description && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    {item.duration && (
                      <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Duration: {item.duration}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};