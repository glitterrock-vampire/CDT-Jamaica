import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRepertoireItemById } from '../lib/sanity';
import { fetchVideoDuration, formatDuration } from '../lib/youtube';
import LoadingSpinner from '../components/LoadingSpinner';

const DanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dance, setDance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoDuration, setVideoDuration] = useState('');

  const fetchVideoDetails = useCallback(async (youtubeUrl) => {
    if (!youtubeUrl) return;
    
    try {
      const videoId = youtubeUrl.split('v=')[1];
      if (videoId) {
        const duration = await fetchVideoDuration(videoId);
        if (duration) {
          setVideoDuration(formatDuration(duration));
        }
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
    }
  }, []);

  useEffect(() => {
    const fetchDance = async () => {
      if (!id) {
        console.error('No ID provided in URL');
        setError('Invalid dance ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getRepertoireItemById(id);
        if (data) {
          setDance(data);
          
          // If there's a YouTube URL, extract the video ID
          if (data.youtubeUrl) {
            fetchVideoDetails();
          }
        }
      } catch (err) {
        console.error('Error fetching dance details:', err);
        setError(err.message || 'Failed to load dance details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDance();
  }, [id, fetchVideoDetails]);

  if (loading) {
    return <LoadingSpinner text="Loading dance details..." />;
  }

  if (error || !dance) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dance not found</h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Back to Repertoire
          </button>
        </div>
      </div>
    );
  }

  // Get the display duration (from YouTube or fallback to stored duration)
  const displayDuration = videoDuration || dance?.duration || '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden h-96">
        <div className="absolute inset-0 z-0">
          {dance.heroImage?.asset?.url ? (
            <>
              <img 
                src={dance.heroImage.asset.url} 
                alt={dance.heroImage.alt || `${dance.title} performance`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </>
          ) : dance.thumbnail?.asset?.url ? (
            // Fallback to thumbnail if heroImage is not available
            <>
              <img 
                src={dance.thumbnail.asset.url} 
                alt={dance.thumbnail.alt || dance.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </>
          ) : dance.image?.asset?.url ? (
            // Fallback to main image if neither heroImage nor thumbnail is available
            <>
              <img 
                src={dance.image.asset.url} 
                alt={dance.image.alt || dance.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </>
          ) : (
            // Fallback to gradient background if no images are available
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900">
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
          )}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white dark:text-gray-100">
                {dance.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-blue-100 dark:text-blue-200">
                <p className="text-xl text-gray-100 dark:text-gray-300">{dance.composer}</p>
                {dance.year && <span className="text-xl text-gray-100">•</span>}
                {dance.year && <p className="text-xl text-gray-100 dark:text-gray-300">{dance.year}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {dance.youtubeId && (
              <motion.div 
                className="w-full overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <iframe 
                  src={`https://www.youtube.com/embed/${dance.youtubeId}`} 
                  className="w-full h-96" 
                  allowFullScreen 
                  title={dance.title}
                />
              </motion.div>
            )}

            {dance.description && (
              <motion.div 
                className="prose max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">{dance.description}</div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Metadata */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300"
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.4, delay: 0.2 }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
              <div className="space-y-4">
                {dance.style && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Style</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.style}</p>
                  </div>
                )}

                {displayDuration && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{displayDuration}</p>
                  </div>
                )}

                {dance.category && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200 capitalize">{dance.category}</p>
                  </div>
                )}

                {dance.instruments && dance.instruments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Instruments</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.instruments.join(', ')}</p>
                    <ul className="mt-1 space-y-1">
                      {dance.instruments.map((instrument, index) => (
                        <li key={index} className="text-gray-900 dark:text-gray-300">{instrument}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {dance.notableRecordings && dance.notableRecordings.length > 0 && (
              <motion.div 
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 mt-6"
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: { duration: 0.4, delay: 0.3 }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <h3>Notable Recordings</h3>
                <ul className="space-y-3 mt-4">
                  {dance.notableRecordings.map((recording, index) => (
                    <li key={index}>
                      <a 
                        href={recording.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-start"
                      >
                        <span className="truncate">
                          {recording.title} - {recording.artist}
                        </span>
                        <svg className="w-4 h-4 ml-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default DanceDetail;
