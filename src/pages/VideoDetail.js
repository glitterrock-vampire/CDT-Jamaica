import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getVideoBySlug } from '../lib/performances';
import { urlFor } from '../lib/sanity';
import { Hero } from '../components/Hero';

const VideoDetail = () => {
  const { slug } = useParams();
  const { isDarkMode } = useTheme();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoBySlug(slug);
        setVideo(videoData);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVideo();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className={mutedText}>Loading video...</div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-heading">Video Not Found</h1>
          <p className={mutedText + ' mb-8'}>The video you're looking for doesn't exist.</p>
          <Link to="/" className="text-orange-500 hover:text-orange-600 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const dateObj = new Date(video.publishedAt);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <Hero
        title={video.title}
        subtitle={formattedDate}
        image={video.thumbnail?.asset?.url}
      />

      {/* Video Content */}
      <motion.section
        className={`py-10 md:py-14 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <motion.div
              className={`rounded-lg overflow-hidden border ${borderColor} mb-8`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {video?.videoFile?.asset?.url ? (
                <video
                  controls
                  className="w-full aspect-video"
                  poster={video.thumbnail?.asset?.url || ''}
                  preload="metadata"
                >
                  <source src={video.videoFile.asset.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : video?.youtubeUrl && video.youtubeUrl.includes('drive.google.com') ? (
                <div className="aspect-video">
                  <iframe
                    src={video.youtubeUrl.replace('/view', '/preview')}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : video?.youtubeUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={video.youtubeUrl.includes('youtube.com/watch') 
                      ? video.youtubeUrl.replace('watch?v=', 'embed/')
                      : video.youtubeUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : video?.vimeoUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={video.vimeoUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className={`aspect-video flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div className={`text-center ${mutedText}`}>
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <div className="text-lg mb-4">Video not available</div>
                    <div className="text-sm">
                      Please add a YouTube URL, Vimeo URL, or upload a video file in Sanity
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Video Information */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Title and Meta */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading">{video.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  {video.duration && (
                    <span className={mutedText}>
                      Duration: {video.duration}
                    </span>
                  )}
                  <span className={mutedText}>
                    Published: {formattedDate}
                  </span>
                </div>
              </div>

              {/* Description */}
              {video.description && (
                <motion.div
                  className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-base md:text-lg leading-relaxed">{video.description}</p>
                </motion.div>
              )}

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default VideoDetail;
