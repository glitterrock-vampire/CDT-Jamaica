import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSiteSettings } from '../lib/siteSettings';

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

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings) {
          setSiteSettings(settings);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading contact information..." />;
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero 
          image={siteSettings.heroImage}
          title="Contact Us"
        />
      )}

      <main className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h2>
          {/* Contact Form Section */}
          <motion.div 
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
              <form className="space-y-6">
                <motion.div 
                  className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                >
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Email</p>
                    <p>info@cdtjamaica.com</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Phone</p>
                    <p>+1 (876) 555-1234</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Address</p>
                    <p>123 Dancehall Avenue<br />Kingston 5, Jamaica</p>
                  </div>
                </motion.div>
              </form>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Send us a Message</h3>
              <form className="space-y-6">
                <AnimatePresence>
                <motion.div
                  key="name-field"
                  variants={fadeInUp}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your name"
                  />
                </motion.div>
                <motion.div
                  key="email-field"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </motion.div>
                <motion.div
                  key="message-field"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your message..."
                  ></textarea>
                </motion.div>
                <motion.button
                  key="submit-button"
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-6 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:shadow-lg"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    boxShadow: '0 5px 10px -3px rgba(37, 99, 235, 0.2)'
                  }}
                  variants={fadeInUp}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Send Message
                  </span>
                </motion.button>
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
