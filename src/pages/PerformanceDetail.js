import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import { getPerformanceBySlug } from '../lib/performances';
import { builder } from '../lib/sanityClient';

const PerformanceDetail = () => {
  const { isDarkMode } = useTheme();
  const { slug } = useParams();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!slug) {
        console.error('No slug provided');
        setLoading(false);
        return;
      }

      console.log('PerformanceDetail: Fetching performance with slug:', slug);
      console.log('PerformanceDetail: Full URL:', window.location.href);
      
      try {
        const data = await getPerformanceBySlug(slug);
        console.log('PerformanceDetail: Fetched data:', data);
        setPerformance(data);
      } catch (error) {
        console.error('PerformanceDetail: Error fetching performance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [slug]);

  const getImageUrl = (image) => {
    if (image?.asset?.url) {
      return builder.image(image.asset).width(1200).height(800).fit('crop').url();
    }
    if (image?.url) {
      return image.url;
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={mutedText}>Loading performance details...</p>
        </div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-heading">Performance Not Found</h1>
          <p className={mutedText + ' mb-6'}>The performance you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/performances" 
            className="inline-flex items-center px-6 py-2 text-sm font-semibold border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
          >
            ← Back to Performances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section - Text Only */}
      <Hero
        title={performance.title}
      subtitle={performance.venue}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Image Sidebar - 1 column */}
          {performance.image && (
            <div className="lg:col-span-1">
              <motion.div
                className={`border ${borderColor} ${cardBg} shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden sticky top-8`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.div
                  className={`text-[10px] tracking-[0.12em] uppercase ${mutedText} p-4 pb-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  Performance Image
                </motion.div>
                <div className="px-4 pb-4">
                  <img
                    src={getImageUrl(performance.image)}
                    alt={performance.image.alt || performance.title}
                    className="w-full h-auto rounded-lg aspect-[3/4] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          )}

          {/* Performance Details - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Info Card */}
            <motion.div
              className={`border ${borderColor} ${cardBg} shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-6 md:p-8`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Performance Details
              </motion.div>
              
              <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className={mutedText}>Date:</span>
                  <span className="font-semibold">
                    {new Date(performance.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={mutedText}>Time:</span>
                  <span className="font-semibold">{performance.time}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={mutedText}>Venue:</span>
                  <span className="font-semibold">{performance.venue}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={mutedText}>Location:</span>
                  <span className="font-semibold">{performance.location}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={mutedText}>Category:</span>
                  <span className="font-semibold">{performance.category}</span>
                </div>
              </div>
            </motion.div>

            {/* About Performance Card */}
            {performance.description && (
              <motion.div
                className={`border ${borderColor} ${cardBg} shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-6 md:p-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  About This Performance
                </motion.div>
                <div className={`mt-4 leading-relaxed ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {performance.description}
                </div>
                
                {performance.ticketUrl && (
                  <motion.div 
                    className="pt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <a
                      href={performance.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-orange-500 text-white hover:bg-orange-400 transition-colors w-full md:w-auto"
                    >
                      Buy Tickets
                    </a>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div 
          className="text-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link 
            to="/performances" 
            className={`inline-flex items-center px-6 py-2 text-sm font-semibold border ${borderColor} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
          >
            ← Back to All Performances
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PerformanceDetail;
