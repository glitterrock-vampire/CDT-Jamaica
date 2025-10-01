import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import RepertoireItem from './components/Repertoire/RepertoireItem';
import RepertoireControls from './components/Repertoire/RepertoireControls';
import About from './pages/About';
import DanceDetail from './pages/DanceDetail';
import Contact from './pages/Contact';
import { getRepertoireItems, getSiteSettings } from './lib/siteSettings';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [repertoire, setRepertoire] = useState([]);
  const [filteredRepertoire, setFilteredRepertoire] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');

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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Routes>
        <Route path="/" element={
          <Layout>
            <div>
              {/* Hero Section */}
              {siteSettings?.heroImage && (
                <Hero 
                  image={siteSettings.heroImage}
                  title="Repertoire"
                />
              )}

              <div className="container mx-auto px-4 py-8">
                {/* Search and Sort Controls */}
                <RepertoireControls
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                {loading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-8 md:gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-6">
                    {filteredRepertoire.map((item) => (
                      <RepertoireItem key={item._id || item.id} item={item} />
                    ))}
                  </div>
                )}

                {filteredRepertoire.length === 0 && !loading && !error && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12 7-12 7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No repertoire items found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </Layout>
        } />
        <Route path="/dance/:id" element={
          <Layout>
            <DanceDetail />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;