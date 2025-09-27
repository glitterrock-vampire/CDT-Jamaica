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
        console.log('🔄 Fetching repertoire data...');
        const [settings, items] = await Promise.all([
          getSiteSettings(),
          getRepertoireItems()
        ]);
        
        console.log('📥 Received data:', {
          hasSettings: !!settings,
          itemsCount: items?.length || 0,
          sampleItem: items?.[0] ? {
            id: items[0]._id,
            title: items[0].title,
            hasThumbnail: !!items[0]?.thumbnail?.asset?.url,
            hasHeroImage: !!items[0]?.heroImage?.asset?.url,
            thumbnail: items[0]?.thumbnail?.asset?.url,
            heroImage: items[0]?.heroImage?.asset?.url
          } : null
        });
        
        if (settings) {
          console.log('⚙️ Site settings loaded');
          setSiteSettings(settings);
        }
        
        if (items && items.length > 0) {
          console.log(`🎭 Loaded ${items.length} repertoire items`);
          setRepertoire(items);
        } else {
          console.warn('⚠️ No repertoire items found');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner text="Loading repertoire..." />
      </div>
    );
  }
  
  console.log('🎬 Rendering Repertoire component with', repertoire.length, 'items');
  
  if (repertoire.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No Repertoire Items Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We couldn't find any repertoire items. Please check back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20">
      {/* Hero Section - Ailey Style */}
      {siteSettings?.heroImage &&
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <img
            src={siteSettings.heroImage.asset.url}
            alt={siteSettings.heroImage.alt || 'CDT Jamaica Hero'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 ailey-gradient-overlay" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 sm:px-6 lg:px-8">
              <h1 className="ailey-hero-title text-white mb-8">
                OUR REPERTOIRE
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide">
                Explore our collection of performances and productions
              </p>
            </div>
          </div>
        </section>
      }

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-8xl">
        {/* Section Header - Ailey Style */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="ailey-subtitle">
            Our Repertoire
          </h2>
          <p className="ailey-body max-w-2xl mx-auto">
            Discover our collection of innovative dance works
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="ailey-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {repertoire.map((item) => (
              <motion.div
                key={item._id}
                variants={fadeInUp}
              >
                <Link
                  to={`/repertoire/${item.slug?.current || item._id}`}
                  className="ailey-card ailey-hover-lift group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {item.heroImage?.asset?.url ? (
                      <img
                        src={item.heroImage.asset.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : item.thumbnail?.asset?.url ? (
                      <img
                        src={item.thumbnail.asset.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Year Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-black font-medium px-3 py-1 rounded-full text-sm">
                        {item.year}
                      </span>
                    </div>

                    {/* Company Premiere Badge */}
                    {item.companyPremiere && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-black text-white font-medium px-3 py-1 rounded-full text-xs">
                          Company Premiere
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="ailey-card-title text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                      {item.title}
                    </h3>

                    {item.choreographer && (
                      <p className="text-gray-600 font-medium">{item.choreographer}</p>
                    )}

                    {item.description && (
                      <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.genre && item.genre.slice(0, 2).map((g, idx) => (
                        <span key={idx} className="ailey-tag">
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </span>
                      ))}
                    </div>

                    {item.duration && (
                      <div className="pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Duration: {item.duration}</span>
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