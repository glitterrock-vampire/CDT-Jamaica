import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import RepertoireItem from '../components/Repertoire/RepertoireItem';
import RepertoireControls from '../components/Repertoire/RepertoireControls';
import { getRepertoireItems, getSiteSettings } from '../lib/siteSettings';
import { useTheme } from '../context/ThemeContext';
// import LoadingSpinner from '../components/LoadingSpinner';

const Repertoire = () => {
  const { isDarkMode } = useTheme();
  const [repertoire, setRepertoire] = useState([]);
  const [filteredRepertoire, setFilteredRepertoire] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  // Fetch repertoire data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRepertoireItems();
        setRepertoire(data);
        console.log('Repertoire years:', data.map(item => ({ title: item.title, year: item.year, type: typeof item.year })));
        setFilteredRepertoire(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load repertoire items. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Replace your current useEffect with this one
  useEffect(() => {
    let result = [...repertoire];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        (item.title?.toLowerCase().includes(searchLower)) ||
        (item.choreographer?.toLowerCase().includes(searchLower)) ||
        (item.year?.toString().includes(searchTerm))
      );
    }

    // Apply sorting
    const [sortField, sortOrder] = sortBy.split('-');

    result.sort((a, b) => {
      // Helper function to handle undefined values and type conversion
      const getSortValue = (item, field) => {
        const value = item[field];

        // Handle undefined/null/empty values
        if (value === undefined || value === null || value === '') {
          return field === 'year' ? (sortOrder === 'asc' ? Infinity : -Infinity) : '';
        }

        // Convert year to number, other fields to string
        if (field === 'year') {
          const num = Number(value);
          return isNaN(num) ? (sortOrder === 'asc' ? Infinity : -Infinity) : num;
        }

        return String(value).toLowerCase();
      };

      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);

      // Handle numeric comparison for years
      if (sortField === 'year') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparison for other fields
      return sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setFilteredRepertoire(result);
  }, [searchTerm, sortBy, repertoire]);

  // Fetch site settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="Repertoire"
        />
      )}

      <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        {/* Search and Sort Controls */}
        <RepertoireControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className={`mt-4 text-xl ${mutedText}`}>Loading repertoire...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchTerm}-${sortBy}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 md:grid-cols-3 mt-6"
            >
              {filteredRepertoire.map((item, index) => (
                <Link
                  key={item._id}
                  to={`/dance/${item.slug?.current || item._id}`}
                  className="block group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RepertoireItem item={item} />
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {filteredRepertoire.length === 0 && !loading && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className={`text-xl ${mutedText}`}>
                {searchTerm ? 'No repertoire items found matching your search.' : 'No repertoire items found.'}
              </p>
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default Repertoire;
