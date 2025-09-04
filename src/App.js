import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import RepertoireItem from './components/Repertoire/RepertoireItem';
import RepertoireControls from './components/Repertoire/RepertoireControls';
import DanceDetail from './pages/DanceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import { getRepertoireItems } from './lib/sanity';
import { parseDuration, formatDuration } from './utils/duration';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [repertoire, setRepertoire] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch repertoire items from Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRepertoireItems();
        console.log('Fetched repertoire items:', data);
        // Log items with their duration values
        data.forEach((item, index) => {
          console.log(`Item ${index}:`, {
            title: item.title,
            duration: item.duration,
            hasDuration: !!item.duration,
            durationType: typeof item.duration
          });
        });
        setRepertoire(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching repertoire items:', err);
        setError('Failed to load repertoire. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debug log the first item's structure
  if (repertoire.length > 0) {
    console.log('First repertoire item structure:', JSON.parse(JSON.stringify(repertoire[0])));
  }

  // Filter and sort repertoire items
  const filteredRepertoire = repertoire
    .filter(item => {
      if (!item || !item.title || !item.composer) return false;
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.composer.toLowerCase().includes(searchLower) ||
        (item.instruments && item.instruments.some(instrument => 
          instrument.toLowerCase().includes(searchLower)
        ))
      );
    })
    .sort((a, b) => {
      const [field, order] = sortBy.split('-');
      let comparison = 0;

      try {
        switch (field) {
          case 'title':
            comparison = (a.title || '').localeCompare(b.title || '', 'en', { 
              numeric: true, 
              sensitivity: 'base' 
            });
            break;
            
          case 'composer':
            comparison = (a.composer || '').localeCompare(b.composer || '', 'en', { 
              numeric: true, 
              sensitivity: 'base' 
            });
            break;
            
          case 'year':
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            comparison = yearA - yearB;
            break;
            
          case 'category':
            comparison = (a.category || '').localeCompare(b.category || '', 'en', { 
              numeric: true, 
              sensitivity: 'base' 
            });
            break;
            
          case 'duration':
            const durationA = parseDuration(a.duration);
            const durationB = parseDuration(b.duration);
            comparison = durationA - durationB;
            
            // Debug logging for duration comparisons (only for meaningful values)
            if (process.env.NODE_ENV === 'development' && 
                (durationA > 0 || durationB > 0) &&
                a.duration !== "null" && b.duration !== "null" &&
                a.duration !== null && b.duration !== null) {
              console.log(`Duration comparison: "${a.duration}" (${durationA}s) vs "${b.duration}" (${durationB}s)`);
            }
            break;
            
          case 'instruments':
            const aInstruments = (a.instruments || []).join(', ');
            const bInstruments = (b.instruments || []).join(', ');
            comparison = aInstruments.localeCompare(bInstruments, 'en', { 
              numeric: true, 
              sensitivity: 'base' 
            });
            break;
            
          default:
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Unknown sort field: ${field}`);
            }
            comparison = 0;
        }
      } catch (error) {
        console.error(`Error sorting by ${field}:`, error);
        comparison = 0;
      }

      // Handle sort order (asc/desc)
      return order === 'desc' ? -comparison : comparison;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <Layout>
            <div>
              {/* Hero Section */}
              <div className="relative bg-gray-900 text-white overflow-hidden h-96">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/images/hero-bg.jpg" 
                    alt="CDT Jamaica Performance" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                  <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                      CDT Jamaica Repertoire
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 mb-8">
                      Explore our diverse collection of classical, contemporary, and traditional Jamaican dance pieces.
                    </p>
                  </div>
                </div>
              </div>

              <div className="container mx-auto px-4 py-8">
                <RepertoireControls 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading repertoire...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <h3 className="text-lg font-medium text-gray-900">No repertoire items found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
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