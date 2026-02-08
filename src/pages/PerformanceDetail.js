import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getPerformanceBySlug } from '../lib/performances';
import TicketButton from '../components/TicketButton';

const PerformanceDetail = () => {
  const { isDarkMode } = useTheme();
  const { slug } = useParams();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!slug) {
        console.error('No slug provided');
        setLoading(false);
        return;
      }

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
    return '';
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Performance not found</h1>
          <Link to="/" className="text-orange-500 hover:text-orange-400 mt-4">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Hidden performance details - only show Get Tickets button */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TicketButton href={performance?.ticketUrl || "https://www.miramarculturalcenter.org/Events-directory/Streams"} />
            <img
              src={getImageUrl(performance.image)}
              alt={performance.image.alt || performance.title}
              className="w-full h-auto rounded-lg aspect-[3/4] object-cover"
            />
          </motion.div>
        </div>
      </div>
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
