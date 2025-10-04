import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState({ status: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscription = async (e) => {
    e.preventDefault();

    if (!email) {
      setSubscriptionStatus({ status: 'error', message: 'Please enter your email address' });
      return;
    }

    setIsSubmitting(true);
    setSubscriptionStatus({ status: 'idle', message: '' });

    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch('http://localhost:3001/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscriptionStatus({
          status: 'success',
          message: 'Welcome to our community! Thank you for joining our newsletter.'
        });
        setEmail('');
      } else {
        setSubscriptionStatus({
          status: 'error',
          message: data.error || 'Subscription failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus({
        status: 'error',
        message: error.message || 'Network error. Please check if the server is running.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <motion.div 
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            {/* Community Subscription */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Join Our Community</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Stay updated with our latest performances, events, and cultural celebrations. Join our community of dance enthusiasts and be the first to know about upcoming shows and workshops.
                </p>
              </div>

              <form onSubmit={handleSubscription} className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <div>
                  <label htmlFor="community-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="community-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 rounded-md text-sm font-semibold focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition ${
                      isSubmitting
                        ? 'bg-gray-400 text-gray-800'
                        : 'bg-black text-white hover:bg-gray-800 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isSubmitting ? 'Joining Community...' : 'JOIN OUR COMMUNITY'}
                  </motion.button>
                </div>

                {subscriptionStatus.message && (
                  <div
                    className={`mt-4 text-sm text-center p-3 rounded-md ${
                      subscriptionStatus.status === 'error'
                        ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'text-green-600 bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    {subscriptionStatus.message}
                  </div>
                )}
              </form>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>By joining, you'll receive:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Updates on upcoming performances</li>
                  <li>• Information about cultural events</li>
                  <li>• Exclusive content and behind-the-scenes</li>
                  <li>• Workshop and class announcements</li>
                </ul>
              </div>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Get In Touch</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Want to reach out directly? We'd love to hear from you!
              </p>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:thecompany@cdtjamaica.org"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors duration-200"
                    >
                      thecompany@cdtjamaica.org
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Phone</p>
                    <a
                      href="tel:+18764637395"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors duration-200"
                    >
                      876-463-7395
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Address</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=AISK%2C%202%20College%20Green%20Avenue%2C%20Kingston%206%2C%20Jamaica%20W.I."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors duration-200"
                    >
                      AISK, 2 College Green Avenue,<br />Kingston 6, Jamaica W.I.
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
