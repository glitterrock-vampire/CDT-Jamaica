import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import { getUpcomingPerformances, getFeaturedPerformance, getVideosByCategory, getAllVideos } from '../lib/performances';
import { getSiteSettings, urlFor } from '../lib/sanity';
import Calendar from '../components/Calendar/Calendar';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [upcomingPerformances, setUpcomingPerformances] = useState([]);
  const [featuredPerformance, setFeaturedPerformance] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [newsArchiveVideos, setNewsArchiveVideos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';
  const secondaryBg = isDarkMode ? 'bg-neutral-900' : 'bg-gray-50';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcoming, featured, settings, allVideos] = await Promise.all([
          getUpcomingPerformances(),
          getFeaturedPerformance(),
          getSiteSettings(),
          getAllVideos() // Temporarily fetch all videos
        ]);
        setUpcomingPerformances(upcoming || []);
        setFeaturedPerformance(featured);
        setSiteSettings(settings);
        
        // Filter for newsArchive, videoLog, signals, and null category videos
        const newsVideos = allVideos.filter(video => 
          video.category === 'newsArchive' || 
          video.category === 'videoLog' || 
          video.category === 'signals' ||
          video.category === null
        );
        setNewsArchiveVideos(newsVideos);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const schoolImages = [
    '/images/cdt-school.jpg',
    '/images/cdt-school-2.jpg',
    '/images/cdt-school-3.jpg',
    '/images/cdt-school-4.jpg',
    '/images/cdt-school-5.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % schoolImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [schoolImages.length]);

  // Scroll-to-color effect for images
  useEffect(() => {
    const handleScroll = () => {
      const images = document.querySelectorAll('.scroll-color-image');
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const scrollY = window.scrollY;
        const imageTop = rect.top + scrollY;
        const windowHeight = window.innerHeight;
        
        // Calculate how much the image has been scrolled past
        const scrollProgress = Math.max(0, Math.min(1, (scrollY - imageTop + windowHeight) / windowHeight));
        
        // Apply grayscale based on scroll (0% = color, 100% = grayscale)
        const grayscaleAmount = Math.max(0, (1 - scrollProgress) * 100);
        img.style.filter = `grayscale(${grayscaleAmount}%)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play video when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            // Video is in view, start playing muted (browsers allow this)
            if (videoElement.paused && !videoElement.ended) {
              videoElement.muted = true; // Ensure muted for autoplay
              videoElement.play().catch(err => {
                // Autoplay might be blocked by browser, that's okay
                console.log('Autoplay blocked:', err);
              });
            }
          } else {
            // Video is out of view, pause it if it's playing
            if (!videoElement.paused) {
              videoElement.pause();
            }
          }
        });
      },
      {
        threshold: 0.5 // Start playing when 50% of video is visible
      }
    );

    // Observe all videos in the news archive
    const videos = document.querySelectorAll('[id^="video-"]');
    videos.forEach((video) => {
      observer.observe(video);
    });

    return () => {
      // Cleanup observer
      videos.forEach((video) => {
        observer.unobserve(video);
      });
    };
  }, [newsArchiveVideos]); // Re-run when videos change

  // Update mute button icons based on video state
  useEffect(() => {
    const updateMuteButtons = () => {
      const videos = document.querySelectorAll('[id^="video-"]');
      videos.forEach((video) => {
        const muteButton = video.parentElement?.querySelector('[data-mute-button]');
        if (muteButton) {
          const icon = muteButton.querySelector('svg');
          if (video.muted) {
            // Show muted icon (speaker with slash)
            icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
          } else {
            // Show unmuted icon (speaker)
            icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
          }
        }
      });
    };

    // Update icons initially and on video state changes
    updateMuteButtons();
    
    // Listen for volume changes
    const videos = document.querySelectorAll('[id^="video-"]');
    videos.forEach((video) => {
      video.addEventListener('volumechange', updateMuteButtons);
    });

    return () => {
      videos.forEach((video) => {
        video.removeEventListener('volumechange', updateMuteButtons);
      });
    };
  }, [newsArchiveVideos]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section with Full Width Performance */}
      <div className={`relative w-full min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} overflow-hidden`}>
        {/* Full Width Hero Image */}
        {featuredPerformance?.image && (
          <div className="absolute inset-0 z-0">
            <img
              src={featuredPerformance.image?.asset?.url || featuredPerformance.image?.url}
              alt={featuredPerformance.image.alt || 'Featured performance'}
              className="w-full h-full object-cover contrast-110 transition-all duration-1000 ease-in-out"
              style={{
                filter: 'grayscale(0%)',
              }}
              onLoad={(e) => {
                const handleScroll = () => {
                  const scrollY = window.scrollY;
                  const maxScroll = window.innerHeight;
                  const grayscaleAmount = Math.min(scrollY / maxScroll, 1);
                  e.target.style.filter = `grayscale(${grayscaleAmount * 100}%)`;
                };
                
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 min-h-screen flex items-center">
          <div className="grid gap-12 md:gap-16 lg:grid-cols-[1.2fr,1fr] items-center">
            {/* Left Column - Performance Info */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={`font-nova-slim text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {featuredPerformance 
                  ? <span className="font-share-tech font-light tracking-tight text-4xl md:text-5xl lg:text-6xl">{new Date(featuredPerformance.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  : <span className="font-share-tech font-light tracking-tight text-4xl md:text-5xl lg:text-6xl">Date TBA</span>
                }
              </motion.div>
              
              <motion.h1 
                className="font-nova-slim text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white"
                style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {featuredPerformance?.title || 'Featured Performance'}
              </motion.h1>
              
              <motion.div
                className={`text-lg md:text-xl text-white`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                CDT at Miramar Cultural Center
              </motion.div>
              
              <motion.p
                className={`text-base md:text-lg max-w-xl leading-relaxed text-white/90`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                CDT Jamaica presents a season of new and classic works in conversation with Caribbean sound, space, and history.
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a
                  href={featuredPerformance?.ticketUrl || "https://www.miramarculturalcenter.org/Events-directory/Streams"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold tracking-[0.16em] uppercase border border-transparent bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                >
                  Buy Tickets
                </a>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* UPCOMING PERFORMANCES - Only show if there are performances */}
      {upcomingPerformances.length > 0 && (
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor} ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8">
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
            >
              <div>
                <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>On stage</div>
                <div className="text-xl md:text-2xl uppercase">Upcoming Performances</div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.36 }}
              >
                <button
                  onClick={() => {
                    setShowFullCalendar(!showFullCalendar);
                    if (!showFullCalendar) {
                      // Smooth scroll to dropdown after a longer delay for full expansion
                      setTimeout(() => {
                        const dropdownElement = document.getElementById('performances-dropdown');
                        if (dropdownElement) {
                          dropdownElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                          });
                        }
                      }, 300);
                    }
                  }}
                  className={`text-[10px] tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} inline-block`}
                >
                  {showFullCalendar ? 'Hide calendar' : 'Full calendar'} {showFullCalendar ? '↑' : '↓'}
                </button>
              </motion.div>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">
              {upcomingPerformances.slice(0, 3).map((perf, index) => {
                const dateObj = new Date(perf.date);
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const day = dateObj.getDate();
                return (
                  <Link
                    key={perf._id}
                    to={`/performance/${perf.slug?.current}`}
                    className="block group"
                  >
                    <motion.div
                      className={`grid grid-rows-[auto,auto,1fr,auto] gap-3 p-3 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300 cursor-pointer`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.38 + index * 0.04 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.42 + index * 0.04 }}
                      >
                        <div className="text-sm font-semibold uppercase mb-1 ml-1">{perf.title}</div>
                        <div className={`text-[11px] ${mutedText} ml-1`}>{perf.venue} · {perf.location}</div>
                        <div className={`mt-3 relative border-b ${borderColor} overflow-hidden`} style={{ aspectRatio: '3/4' }}>
                          <img
                            src={perf.image?.asset?.url || perf.image?.url}
                            alt={perf.image?.alt || perf.title}
                            className="w-full h-full object-cover transition-all duration-300"
                          />
                          {/* Date Overlay */}
                          <div className="absolute top-3 left-3">
                            <span className="font-share-tech font-bold text-white text-6xl tracking-tight drop-shadow-lg">
                              {month} {day}, 2026
                            </span>
                          </div>
                        </div>
                      </motion.div>
                      <motion.p
                        className={`text-xs leading-snug ${mutedText}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.44 + index * 0.04 }}
                      >
                        {perf.description}
                      </motion.p>
                      <motion.button
                        type="button"
                        className={`mt-1 inline-flex items-center justify-center w-full px-4 py-2 text-[10px] tracking-[0.16em] uppercase border ${borderColor} ${
                          isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                        } transition-colors`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.46 + index * 0.04 }}
                      >
                        Get Tickets
                      </motion.button>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Calendar Dropdown */}
            <AnimatePresence>
              {showFullCalendar && (
                <motion.div
                  id="performances-dropdown"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  {/* Additional Performances Grid - Show 2 more (items 4-5) */}
                  <div className="grid gap-5 md:grid-cols-3">
                    {upcomingPerformances.slice(3, 5).map((perf, index) => {
                      const dateObj = new Date(perf.date);
                      const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                      const day = dateObj.getDate();
                      return (
                        <Link
                          key={perf._id}
                          to={`/performance/${perf.slug?.current}`}
                          className="block group"
                        >
                          <motion.div
                            className={`grid grid-rows-[auto,auto,1fr,auto] gap-3 p-3 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300 cursor-pointer`}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.04 }}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.42 + index * 0.04 }}
                            >
                              <div className="text-sm font-semibold uppercase mb-1">{perf.title}</div>
                              <div className={`text-[11px] ${mutedText}`}>{perf.venue} · {perf.location}</div>
                              <div className={`mt-3 relative border-b ${borderColor} overflow-hidden`} style={{ aspectRatio: '3/4' }}>
                                <img
                                  src={perf.image?.asset?.url || perf.image?.url}
                                  alt={perf.image?.alt || perf.title}
                                  className="w-full h-full object-cover transition-all duration-300"
                                />
                                {/* Date Overlay */}
                                <div className="absolute top-3 left-3">
                                  <span className="font-share-tech font-bold text-white text-6xl tracking-tight drop-shadow-lg">
                                    {month} {day}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                            <motion.p
                              className={`text-xs leading-snug ${mutedText}`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.44 + index * 0.04 }}
                            >
                              {perf.description}
                            </motion.p>
                            <motion.button
                              type="button"
                              className={`mt-1 inline-flex items-center justify-center w-full px-4 py-2 text-[10px] tracking-[0.16em] uppercase border ${borderColor} ${
                                isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                              } transition-colors`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.46 + index * 0.04 }}
                            >
                              Get Tickets
                            </motion.button>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </motion.section>
      )}

      {/* ABOUT / MISSION */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor} ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid gap-10 md:grid-cols-2 items-start">
            <div className="space-y-3">
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                About Us
              </motion.div>
              <motion.div
                className="text-2xl md:text-3xl uppercase leading-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                Moving the Caribbean forward through the language of dance.
              </motion.div>
            </div>
            <div className="space-y-4">
              <motion.p
                className={`text-sm md:text-base leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Founded in 1995, CDT Jamaica has grown into the region&apos;s premier contemporary dance company. We are
                dedicated to creating works that reflect the complexity, beauty, and resilience of our culture.
              </motion.p>
              <motion.div
                className={`flex flex-wrap gap-6 pt-4 mt-2 border-t ${borderColor}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold">30+</div>
                  <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Years Active</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold">120</div>
                  <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Original Works</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold">15k</div>
                  <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Students Taught</div>
                </div>
              </motion.div>
            </div>
          </div>
          </div>
        </motion.section>

        {/* SCHOOL / TRAINING */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor} ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] items-center">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.47 }}
            >
              <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>The school</div>
              <h2 className="text-2xl md:text-3xl uppercase">Training for all ages.</h2>
              <p className={`text-sm md:text-base max-w-md leading-relaxed ${mutedText}`}>
                From first steps to pre-professional study, CDT Jamaica School offers programmes in contemporary, ballet,
                and Jamaican folk forms led by working artists.
              </p>
              <div className="space-y-2 text-sm mt-4">
                {[
                  { label: 'Juniors', meta: 'Ages 4–10' },
                  { label: 'Adults', meta: 'Evenings + weekends' }
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between pb-2 border-b ${borderColor}`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>{item.meta}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="https://linktr.ee/cdtjamaica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors`}
                >
                  Registration
                </a>
              </div>
            </motion.div>
            <motion.div
              className={`relative h-80 md:h-96 border ${borderColor} overflow-hidden ${secondaryBg}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {schoolImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`School rehearsal ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-1000 ease-in-out scroll-color-image ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              {/* Slideshow indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {schoolImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
          </div>
        </motion.section>

        {/* NEWS / SIGNALS */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor} ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-8">
            {/* Header */}
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.52 }}
            >
              <div>
                <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Signals</div>
                <div className="text-xl md:text-2xl uppercase">News + archive</div>
              </div>
              <motion.button
                type="button"
                className={`text-[10px] tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.56 }}
              >
                Open archive index →
              </motion.button>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-[2fr,1.2fr] items-start">
              {/* Video card from Sanity */}
              {newsArchiveVideos.length > 0 && newsArchiveVideos.map((video, index) => {
                const dateObj = new Date(video.publishedAt);
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const day = dateObj.getDate();
                return (
                    <div
                      key={video._key}
                      className={`border ${borderColor} ${cardBg} rounded-lg overflow-hidden group cursor-pointer`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.58 + index * 0.1 }}
                      onClick={() => {
                        // Manual toggle play/pause with state check
                        const videoElement = document.getElementById(`video-${video._key}`);
                        if (videoElement) {
                          if (videoElement.paused) {
                            videoElement.play().catch(err => {
                              console.log('Play failed:', err);
                            });
                          } else {
                            videoElement.pause();
                          }
                        }
                      }}
                    >
                      {/* Video Player - Full Cover */}
                      <div className="relative w-full aspect-video">
                        <video
                          id={`video-${video._key}`}
                          className="w-full h-full object-cover"
                          poster={video.thumbnail?.asset?.url || ''}
                          preload="metadata"
                          muted={false}
                          playsInline
                        >
                          <source src={video.videoFile.asset.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        
                        {/* Date Overlay */}
                        <div className="absolute top-3 left-3">
                          <span className="font-share-tech font-bold text-white text-lg tracking-tight drop-shadow-lg">
                            {month} {day}
                          </span>
                        </div>
                        
                        {/* Mute/Unmute Button */}
                        <button
                          data-mute-button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent video click
                            const videoElement = document.getElementById(`video-${video._key}`);
                            if (videoElement) {
                              videoElement.muted = !videoElement.muted;
                              // Trigger volumechange event to update icon
                              const event = new Event('volumechange');
                              videoElement.dispatchEvent(event);
                            }
                          }}
                          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          title="Toggle mute"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                          </svg>
                        </button>
                        
                        {/* Play Button Overlay - Only show when paused */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                          <div className="bg-white/90 rounded-full p-4">
                            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Title Only - No Grey Section */}
                      <div className="p-4">
                        <div className="text-lg font-bold uppercase">{video.title}</div>
                      </div>
                    </div>
                );
              })}

              {/* Side cards */}
              <div className="flex flex-col gap-4">
                {/* Press card */}
                <motion.div
                  className={`p-4 border ${borderColor} ${cardBg} flex flex-col gap-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Press</div>
                  <div className="text-sm leading-snug">
                    "A bold reimagining of what Caribbean dance can be in the 21st century."
                  </div>
                  <div className="text-xs mt-1">— The Jamaica Gleaner</div>
                </motion.div>

                {/* Announcement card */}
                <motion.div
                  className={`p-4 border ${borderColor} ${cardBg} flex flex-col gap-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.64 }}
                >
                  <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>
                    Announcement · Aug 12
                  </div>
                  <div className="text-sm font-medium">New artistic director appointed</div>
                  <div className={`text-xs leading-relaxed ${mutedText}`}>
                    Choreographer James Bennett joins CDT Jamaica to lead the 2025–2028 seasons.
                  </div>
                </motion.div>

                {/* Download brochure button */}
                <motion.a
                  href="https://drive.google.com/file/d/1QFtkeI2cGyEXoaCnQoChasgnZ87Q6njT/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-3 py-2 text-sm border ${borderColor} ${cardBg} ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                  } transition-colors cursor-pointer`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.68 }}
                >
                  <span>Download Brochure</span>
                  <span className="text-xs">⤓</span>
                </motion.a>
              </div>
            </div>
          </div>
          </div>
        </motion.section>

        {/* SUPPORT TEASER */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor} ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
            {/* Philanthropy / Patron Programme */}
            <motion.div
              className={`flex flex-col items-center text-center gap-4 p-8 border ${borderColor} ${secondaryBg}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.57 }}
            >
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.59 }}
              >
                Philanthropy
              </motion.div>
              <motion.div
                className="text-lg md:text-xl uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.61 }}
              >
                Patron Programme
              </motion.div>
              <motion.p
                className={`text-sm max-w-md leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.63 }}
              >
                Join a community of supporters who believe in the power of dance to transform lives. Benefits include
                rehearsal access and priority booking.
              </motion.p>
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border ${borderColor} ${
                  isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                } transition-colors`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              >
                Learn more
              </motion.button>
            </motion.div>

            {/* Education / Scholarship Fund */}
            <motion.div
              className={`flex flex-col items-center text-center gap-4 p-8 border ${borderColor} ${
                isDarkMode ? 'border-dashed bg-black' : 'border-dashed bg-white'
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.59 }}
            >
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.61 }}
              >
                Education
              </motion.div>
              <motion.div
                className="text-lg md:text-xl uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.63 }}
              >
                Scholarship Fund
              </motion.div>
              <motion.p
                className={`text-sm max-w-md leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              >
                Help us identify and train the next generation of Caribbean dance artists, regardless of their
                financial background.
              </motion.p>
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border ${borderColor} ${
                  isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                } transition-colors`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.67 }}
              >
                Donate now
              </motion.button>
            </motion.div>
          </div>
          </div>
        </motion.section>

        {/* NEWSLETTER (kept simple because global Footer already exists) */}
        <motion.section
          className={`py-10 md:py-12 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-xl space-y-4">
            <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Newsletter</div>
            <div className="text-lg md:text-xl">
              Signals from the studio and stage, once a month.
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch sm:items-center max-w-md mt-2"
            >
              <input
                type="email"
                required
                placeholder="email@address.com"
                className={`flex-1 px-3 py-2 text-sm outline-none border ${borderColor} ${
                  isDarkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-black'
                }`}
              />
              <button
                type="submit"
                className="mt-2 sm:mt-0 sm:ml-0 px-5 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase bg-black text-white border border-black dark:bg-white dark:text-black dark:border-white"
              >
                Subscribe
              </button>
            </form>
          </div>
          </div>
        </motion.section>
    </div>
  );
};

export default Home;
