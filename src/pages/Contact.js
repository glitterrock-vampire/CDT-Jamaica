import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSiteSettings } from '../lib/siteSettings';
import NewsletterSubscription from '../components/NewsletterSubscription';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
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
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="Contact Us"
        />
      )}

      <main className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-xl md:text-2xl font-light tracking-wide mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h2>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Left Column - Newsletter Subscription */}
            <motion.div 
              className="w-full md:w-1/2 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg sticky top-6 self-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Stay Updated</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Subscribe to our newsletter for the latest news, events, and updates from CDT Jamaica.
              </p>
              <NewsletterSubscription />
            </motion.div>

            {/* Right Column - Contact Information */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Get In Touch</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Want to reach out directly? We'd love to hear from you!
                </p>
              </div>

              <motion.div
                className="flex items-center p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 dark:text-gray-200">Email</p>
                  <a
                    href="mailto:thecompany@cdtjamaica.org"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors duration-200"
                  >
                    thecompany@cdtjamaica.org
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 dark:text-gray-200">Phone</p>
                  <a
                    href="tel:876-463-7395"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors duration-200"
                  >
                    876-463-7395
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4 flex-shrink-0">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 dark:text-gray-200">Address</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    AISK, 2 College Green Avenue,<br />
                    Kingston 6, Jamaica W.I.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;