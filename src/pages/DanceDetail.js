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
                src={`${dance.heroImage.asset.url}?auto=format&fit=crop&t=${dance.heroImage.asset._updatedAt || Date.now()}${dance.heroImage.hotspot ? `&rect=${Math.round(dance.heroImage.crop.left * dance.heroImage.asset.metadata.dimensions.width)},${Math.round(dance.heroImage.crop.top * dance.heroImage.asset.metadata.dimensions.height)},${Math.round((dance.heroImage.crop.right - dance.heroImage.crop.left) * dance.heroImage.asset.metadata.dimensions.width)},${Math.round((dance.heroImage.crop.bottom - dance.heroImage.crop.top) * dance.heroImage.asset.metadata.dimensions.height)}` : ''}`}
                alt={dance.heroImage.alt || `${dance.title} performance`}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: dance.heroImage.hotspot 
                    ? `${dance.heroImage.hotspot.x * 100}% ${dance.heroImage.hotspot.y * 100}%`
                    : 'center'
                }}
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </>
          ) : dance.thumbnail?.asset?.url ? (
            // Fallback to thumbnail if heroImage is not available
            <>
              <img 
                src={`${dance.thumbnail.asset.url}?auto=format&fit=crop&t=${dance.thumbnail.asset._updatedAt || Date.now()}${dance.thumbnail.hotspot ? `&rect=${Math.round(dance.thumbnail.crop.left * dance.thumbnail.asset.metadata.dimensions.width)},${Math.round(dance.thumbnail.crop.top * dance.thumbnail.asset.metadata.dimensions.height)},${Math.round((dance.thumbnail.crop.right - dance.thumbnail.crop.left) * dance.thumbnail.asset.metadata.dimensions.width)},${Math.round((dance.thumbnail.crop.bottom - dance.thumbnail.crop.top) * dance.thumbnail.asset.metadata.dimensions.height)}` : ''}`}
                alt={dance.thumbnail.alt || dance.title}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: dance.thumbnail.hotspot 
                    ? `${dance.thumbnail.hotspot.x * 100}% ${dance.thumbnail.hotspot.y * 100}%`
                    : 'center'
                }}
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </>
          ) : dance.image?.asset?.url ? (
            // Fallback to main image if neither heroImage nor thumbnail is available
            <>
              <img 
                src={`${dance.image.asset.url}?auto=format&fit=crop&t=${dance.image.asset._updatedAt || Date.now()}${dance.image.hotspot ? `&rect=${Math.round(dance.image.crop.left * dance.image.asset.metadata.dimensions.width)},${Math.round(dance.image.crop.top * dance.image.asset.metadata.dimensions.height)},${Math.round((dance.image.crop.right - dance.image.crop.left) * dance.image.asset.metadata.dimensions.width)},${Math.round((dance.image.crop.bottom - dance.image.crop.top) * dance.image.asset.metadata.dimensions.height)}` : ''}`}
                alt={dance.image.alt || dance.title}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: dance.image.hotspot 
                    ? `${dance.image.hotspot.x * 100}% ${dance.image.hotspot.y * 100}%`
                    : 'center'
                }}
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
          {/* Left Column - Video and Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video */}
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

            {/* Description */}
            {dance.description && (
              <motion.div 
                className="prose max-w-none bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Piece</h2>
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">{dance.description}</div>
              </motion.div>
            )}

            {/* Media Reviews */}
            {(dance.mediaReviews && dance.mediaReviews.length > 0) && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Media Reviews</h3>
                <div className="space-y-6">
                  {dance.mediaReviews.map((review, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-1">
                      <p className="text-gray-700 dark:text-gray-300 italic">"{review.quote}"</p>
                      <div className="mt-2 flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{review.source}</span>
                        {review.year && (
                          <span className="mx-2 text-gray-400">•</span>
                        )}
                        {review.year && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">{review.year}</span>
                        )}
                        {review.url && (
                          <a 
                            href={review.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center"
                          >
                            Read more
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Movements */}
            {dance.movements && dance.movements.length > 0 && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {dance.movements.length > 1 ? 'Movements' : 'Movement'}
                </h3>
                <ol className="space-y-3">
                  {dance.movements.map((movement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium mr-3 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {movement}
                        {dance.durations && dance.durations[idx] && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            ({dance.durations[idx]})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Production Details</h3>
              <div className="space-y-4">
                {dance.choreographer && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Choreographer</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.choreographer}</p>
                  </div>
                )}

                {dance.music && dance.music.length > 0 && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Music</h4>
                    <ul className="mt-1 space-y-1">
                      {Array.isArray(dance.music) ? (
                        dance.music.map((music, idx) => (
                          <li key={idx} className="text-gray-900 dark:text-gray-200">{music}</li>
                        ))
                      ) : (
                        <li className="text-gray-900 dark:text-gray-200">{dance.music}</li>
                      )}
                    </ul>
                  </div>
                )}

                {dance.costumeDesign && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Costume Design</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.costumeDesign}</p>
                  </div>
                )}

                {dance.lightingDesign && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Lighting Design</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.lightingDesign}</p>
                  </div>
                )}

                {dance.genre && dance.genre.length > 0 && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Genre</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {dance.genre.map((g, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {dance.stylePeriod && dance.stylePeriod.length > 0 && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Style Period</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {dance.stylePeriod.map((period, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {dance.premieredBy && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Premiered By</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.premieredBy}</p>
                  </div>
                )}

                {dance.dedicatedTo && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Dedicated To</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.dedicatedTo}</p>
                  </div>
                )}

                {dance.companyPremiere && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Company Premiere</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.companyPremiere}</p>
                  </div>
                )}

                {dance.worldPremiere && (
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">World Premiere</h4>
                    <p className="mt-1 text-gray-900 dark:text-gray-200">{dance.worldPremiere}</p>
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

          </div>
        </div>
      </main>
    </div>
  );
}

export default DanceDetail;
