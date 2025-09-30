import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import SlideGallery from '../components/SlideGallery';
import { getRepertoireItemById } from '../lib/sanity';
import LoadingSpinner from '../components/LoadingSpinner';

const DanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dance, setDance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [, setSelectedImageIndex] = useState(0);

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
          
        }
      } catch (err) {
        console.error('Error fetching dance details:', err);
        setError(err.message || 'Failed to load dance details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDance();
  }, [id]);

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
            className="w-full mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Back to Repertoire
          </button>
        </div>
      </div>
    );
  }

  const displayDuration = dance?.runTime || '';

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {dance.heroImage?.asset?.url ? (
            <>
              <img
                src={`${dance.heroImage.asset.url}?auto=format&fit=crop&w=1920&h=1080&q=80`}
                alt={dance.heroImage.alt || `${dance.title} performance`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20"></div>
            </>
          ) : dance.thumbnail?.asset?.url ? (
            <>
              <img
                src={`${dance.thumbnail.asset.url}?auto=format&fit=crop&w=1920&h=1080&q=80`}
                alt={dance.thumbnail.alt || dance.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ailey-gradient-overlay"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              <div className="absolute inset-0 ailey-gradient-overlay"></div>
            </div>
          )}
        </div>

        <div className="relative z-10 h-full w-full flex items-end pb-12 pl-8 md:pl-16 lg:pl-24">
          <motion.div
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-normal leading-none tracking-tight text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              {dance.title}
            </h1>
            {dance.subtitle && (
              <h2 className="mt-4 text-2xl md:text-3xl font-light text-gray-200" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                {dance.subtitle}
              </h2>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="ailey-two-column">
          <div className="ailey-main-content text-gray-900 dark:text-gray-100">
            {dance.youtubeId && dance.description && (
              <div className="space-y-8">
                <motion.div
                  className="w-full max-w-7xl mx-auto overflow-hidden rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${dance.youtubeId}`}
                      className="w-full h-full"
                      allowFullScreen
                      title={dance.title}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="prose prose-lg max-w-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="text-gray-700 dark:text-gray-100 leading-relaxed prose dark:prose-invert max-w-none">
                    <PortableText value={dance.description} />
                  </div>
                </motion.div>
              </div>
            )}

            {dance.youtubeId && !dance.description && (
              <motion.div
                className="w-full max-w-7xl mx-auto overflow-hidden rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${dance.youtubeId}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={dance.title}
                  />
                </div>
              </motion.div>
            )}

            {dance.description && !dance.youtubeId && (
              <motion.div
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-gray-700 dark:text-gray-100 leading-relaxed whitespace-pre-line">
                  {dance.description}
                </div>
              </motion.div>
            )}

            {(dance.mediaReviews && dance.mediaReviews.length > 0) && (
              <motion.div
                className="ailey-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="ailey-subtitle mb-6">Media Reviews</h3>
                <div className="space-y-8">
                  {dance.mediaReviews.map((review, index) => (
                    <blockquote key={index} className="ailey-quote">
                      <p className="ailey-body dark:text-gray-100 italic mb-4">
                        "{review.quote}"
                      </p>
                      <footer className="flex items-center justify-between">
                        <div>
                          <cite className="text-gray-900 dark:text-gray-100 font-medium">{review.source}</cite>
                          {review.year && (
                            <span className="text-gray-500 dark:text-gray-400 ml-2">({review.year})</span>
                          )}
                        </div>
                        {review.url && (
                          <a
                            href={review.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </motion.div>
            )}

            {dance.movements && dance.movements.length > 0 && (
              <motion.div
                className="ailey-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="ailey-subtitle">
                  {dance.movements.length > 1 ? 'Movements' : 'Movement'}
                </h3>
                <ol className="space-y-4">
                  {dance.movements.map((movement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="ailey-movement-number">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-200 leading-relaxed">
                        {movement}
                      </span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}

            {(dance.galleryImages && dance.galleryImages.length > 0) && (
              <motion.div
                className="ailey-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="ailey-subtitle mb-6">Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dance.galleryImages.slice(0, 5).map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                      {image.asset?.url ? (
                        <img
                          src={`${image.asset.url}?auto=format&fit=crop&w=400&h=400&q=80`}
                          alt={image.alt || `${dance.title} - Gallery Image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setGalleryOpen(true);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {dance.galleryImages.length > 5 && (
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-4 text-center">
                    And {dance.galleryImages.length - 5} more images...
                  </p>
                )}
              </motion.div>
            )}
          </div>

          <div className="ailey-sidebar">
            <motion.div
              className="ailey-section sticky top-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="space-y-6">
                {dance.choreographer && (
                  <div>
                    <h4 className="ailey-metadata-label">Choreographer</h4>
                    <p className="ailey-metadata-value">{dance.choreographer}</p>
                  </div>
                )}

                {dance.companyPremiere && (
                  <div>
                    <h4 className="ailey-metadata-label">Company Premiere</h4>
                    <p className="ailey-metadata-value">{dance.companyPremiere}</p>
                  </div>
                )}

                {dance.music && dance.music.length > 0 && (
                  <div>
                    <h4 className="ailey-metadata-label">Music</h4>
                    <p className="ailey-metadata-value">
                      {Array.isArray(dance.music) 
                        ? dance.music.join(', ') 
                        : dance.music}
                    </p>
                  </div>
                )}

                {dance.costumeDesign && (
                  <div>
                    <h4 className="ailey-metadata-label">Costume Design</h4>
                    <p className="ailey-metadata-value">{dance.costumeDesign}</p>
                  </div>
                )}

                {dance.lighting && (
                  <div>
                    <h4 className="ailey-metadata-label">Lighting Design</h4>
                    <p className="ailey-metadata-value">{dance.lighting}</p>
                  </div>
                )}

                {displayDuration && (
                  <div>
                    <h4 className="ailey-metadata-label">Run Time</h4>
                    <p className="ailey-metadata-value">{displayDuration}</p>
                  </div>
                )}
{/* 
                {dance.year && (
                  <div>
                    <h4 className="ailey-metadata-label">Year</h4>
                    <p className="ailey-metadata-value">{dance.year}</p>
                  </div>
                )} */}


                {dance.worldPremiere && (
                  <div>
                    <h4 className="ailey-metadata-label">World Premiere</h4>
                    <p className="ailey-metadata-value">{dance.worldPremiere}</p>
                  </div>
                )}

                {/* {dance.premieredBy && (
                  <div>
                    <h4 className="ailey-metadata-label">Premiered By</h4>
                    <p className="ailey-metadata-value">{dance.premieredBy}</p>
                  </div>
                )} */}

                {/* {dance.dedicatedTo && (
                  <div>
                    <h4 className="ailey-metadata-label">Dedicated To</h4>
                    <p className="ailey-metadata-value">{dance.dedicatedTo}</p>
                  </div>
                )} */}

                {/* {dance.category && (
                  <div>
                    <h4 className="ailey-metadata-label">Category</h4>
                    <p className="ailey-metadata-value capitalize">{dance.category}</p>
                  </div>
                )} */}

                {/* {dance.genre && dance.genre.length > 0 && (
                  <div>
                    <h4 className="ailey-metadata-label">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {dance.genre.map((g, idx) => (
                        <span
                          key={idx}
                          className="ailey-tag"
                        >
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}
{/* 
                {dance.stylePeriod && dance.stylePeriod.length > 0 && (
                  <div>
                    <h4 className="ailey-metadata-label">Style Periods</h4>
                    <div className="flex flex-wrap gap-2">
                      {dance.stylePeriod.map((period, idx) => (
                        <span
                          key={idx}
                          className="ailey-tag"
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </motion.div>
          </div>
        </div>

        <SlideGallery
          images={dance?.galleryImages || []}
          title={dance?.title || ''}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
        />
      </div>
    </div>
  );
};

export default DanceDetail;