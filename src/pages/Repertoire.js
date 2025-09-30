import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching repertoire data...');
        const [settings, items] = await Promise.all([
          getSiteSettings(),
          getRepertoireItems()
        ]);
        
        console.log('📦 Received data:', {
          hasSettings: !!settings,
          itemsCount: items?.length || 0,
          sampleItem: items?.[0]
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

  // Extract unique categories
  useEffect(() => {
    if (repertoire.length > 0) {
      const uniqueCategories = [...new Set(repertoire.flatMap(item => item.categories || []))];
      setCategories(uniqueCategories);
    }
  }, [repertoire]);

  // Filter repertoire based on search term and selected category
  const filteredRepertoire = repertoire.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                          (item.categories && item.categories.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20">
      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        resultsCount={filteredRepertoire.length}
      />

      {/* Hero Section */}
      {siteSettings?.heroImage?.asset?.url && (
        <section className="relative h-96 overflow-hidden">
          <img
            src={siteSettings.heroImage.asset.url}
            alt={siteSettings.heroImage.alt || 'CDT Jamaica Repertoire'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Repertoire</h1>
              <p className="text-xl md:text-2xl">Explore our collection of dance pieces</p>
            </div>
          </div>
        </section>
      )}

      {/* Repertoire Grid */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredRepertoire.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No repertoire found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredRepertoire.map((item) => (
                <motion.div 
                  key={item._id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  variants={fadeInUp}
                >
                  <Link
                    to={`/repertoire/${item.slug || item._id}`}
                    className="block h-full"
                  >
                    {/* Image */}
                    {item.thumbnail?.asset?.url ? (
                      <img
                        src={`${item.thumbnail.asset.url}?w=800&h=600&fit=crop`}
                        alt={item.thumbnail.alt || item.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No image available</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      
                      {item.choreographer && (
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Choreographer: {item.choreographer}
                        </p>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          {item.year && (
                            <span className="inline-block bg-blue-100 dark:bg-blue-900 dark:text-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {item.year}
                            </span>
                          )}
                          {item.duration && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {item.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Repertoire;