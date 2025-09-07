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

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings) {
          setSiteSettings(settings);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading about us..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero 
          image={siteSettings.heroImage}
          title="Our Story"
        />
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-1 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Our Story</h3>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  CDT is a legacy organization formed to honour Mr. Tony Wilson, O.D. who founded The Company Dance Theatre in 1988. It is headed by four alumni of The Company Dance Theatre: Dr. Sade Bully-Bell, Artistic Director of the Company; Renée I. McDonald, Associate Artistic Director of the Company; Steven Cornwall, Artistic Director of the School; and Colin Blackwood, Executive Director of the Company and the School. CDT's purpose is to continue Mr. Tony Wilson's legacy of bringing dynamic, highly technical, cutting-edge modern dance to the Jamaican stage and beyond.
                </p>
                <p>
                  Our mission is to further the pioneering work of Tony Wilson and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and <i>to di worl'!</i>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
