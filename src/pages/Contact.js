import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
// import LoadingSpinner from '../components/LoadingSpinner';
import { getSiteSettings } from '../lib/siteSettings';
import NewsletterSubscription from '../components/NewsletterSubscription';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="Get In Touch"
          subtitle="Connect with CDT Jamaica"
        />
      )}

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 w-full max-w-6xl py-10 md:py-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <header className={`border-b ${borderColor} pb-10 md:pb-14`}>
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className={`text-sm font-semibold tracking-[0.08em] uppercase ${mutedText} font-body`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Get In Touch
            </motion.div>
            <motion.div
              className="text-2xl md:text-3xl uppercase leading-tight font-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Connect with CDT Jamaica
            </motion.div>
          </motion.div>
        </header>

        {/* Contact Grid */}
        <div className="grid gap-5 md:grid-cols-2 mt-10">
          {/* Newsletter Subscription */}
          <motion.div
            className={`border ${borderColor} ${cardBg} shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-6 md:p-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-4">
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                Stay Updated
              </motion.div>
              <motion.div
                className="text-xl md:text-2xl uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Newsletter
              </motion.div>
              <motion.p
                className={`text-sm md:text-base leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                Subscribe to our newsletter for the latest news, events, and updates from CDT Jamaica.
              </motion.p>
            </div>
            <div className="mt-6">
              <NewsletterSubscription />
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className={`border ${borderColor} ${cardBg} shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-6 md:p-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="space-y-6">
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                Contact Information
              </motion.div>
              <motion.div
                className="text-xl md:text-2xl uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                Reach Out Directly
              </motion.div>

              {/* Email */}
              <motion.div
                className="pt-4 border-t border-black/10 dark:border-white/10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>Email</p>
                    <a
                      href="mailto:thecompany@cdtjamaica.org"
                      className={`text-sm md:text-base font-medium font-body hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200`}
                    >
                      thecompany@cdtjamaica.org
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                className="pt-4 border-t border-black/10 dark:border-white/10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>Phone</p>
                    <a
                      href="tel:876-463-7395"
                      className={`text-sm md:text-base font-medium font-body hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200`}
                    >
                      876-463-7395
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                className="pt-4 border-t border-black/10 dark:border-white/10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full flex-shrink-0">
                    <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>Address</p>
                    <p className={`text-sm md:text-base`}>
                      AISK, 2 College Green Avenue,<br />
                      Kingston 6, Jamaica W.I.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;