import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import { getUpcomingPerformances, getFeaturedPerformance, getVideosByCategory, getAllVideos } from '../lib/performances';
import { getSiteSettings, urlFor } from '../lib/sanity';
import { getRepertoireItems } from '../lib/siteSettings';
import Calendar from '../components/Calendar/Calendar';
import TicketButton from '../components/TicketButton';

const Home = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [upcomingPerformances, setUpcomingPerformances] = useState([]);
  const [featuredPerformance, setFeaturedPerformance] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [repertoire, setRepertoire] = useState([]);
  const [newsArchiveVideos, setNewsArchiveVideos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(2);
  const [showFullCalendar, setShowFullCalendar] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [player, setPlayer] = useState(null);

  // Scroll bounce effect for school section
  useEffect(() => {
    const schoolSection = document.getElementById('school');
    if (!schoolSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Center the school section with bounce effect
            const elementTop = entry.target.offsetTop;
            const elementHeight = entry.target.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTo = elementTop - (windowHeight / 2) + (elementHeight / 2);

            window.scrollTo({
              top: scrollTo,
              behavior: 'smooth'
            });

            // Optional: Add a slight bounce effect
            setTimeout(() => {
              const bounceScroll = scrollTo - 20;
              window.scrollTo({
                top: bounceScroll,
                behavior: 'smooth'
              });

              setTimeout(() => {
                window.scrollTo({
                  top: scrollTo,
                  behavior: 'smooth'
                });
              }, 150);
            }, 300);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-100px 0px -100px 0px'
      }
    );

    observer.observe(schoolSection);

    return () => observer.disconnect();
  }, []);

  // Force scroll to top when component mounts
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';
  const secondaryBg = isDarkMode ? 'bg-neutral-900' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-white' : 'text-black';

  const heroWeekdayAbbrev = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];

  const formatHeroDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (Number.isNaN(dateObj.getTime())) return '';
    const weekday = heroWeekdayAbbrev[dateObj.getDay()];
    const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    return `${weekday} ${month} ${day}`;
  };

  const weekdayAbbrev = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];

  const formatPerformanceDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (Number.isNaN(dateObj.getTime())) return '';
    const weekday = weekdayAbbrev[dateObj.getDay()];
    const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    return `${weekday} ${month} ${day}`;
  };

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // This function creates an <iframe> (and YouTube player) after the API code downloads.
    window.onYouTubeIframeAPIReady = () => {
      const ytPlayer = new window.YT.Player('hero-video', {
        videoId: 'zby-l0-XkBc',
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: 'zby-l0-XkBc',
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          autohide: 1,
          disablekb: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            event.target.playVideo();
          }
        }
      });
    };

    return () => {
      if (window.onYouTubeIframeAPIReady) {
        delete window.onYouTubeIframeAPIReady;
      }
    };
  }, []);

  const toggleMute = () => {
    if (player) {
      if (isVideoMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsVideoMuted(!isVideoMuted);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcoming, featured, settings, repertoireData, allVideos] = await Promise.all([
          getUpcomingPerformances(),
          getFeaturedPerformance(),
          getSiteSettings(),
          getRepertoireItems(),
          getAllVideos() // Temporarily fetch all videos
        ]);
        setUpcomingPerformances(upcoming || []);
        setFeaturedPerformance(featured);
        setSiteSettings(settings);
        setRepertoire(repertoireData || []);
        
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
      {/* Hero Section with Video Background */}
      <div className={`relative w-full min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} overflow-hidden`}>
        {/* Video Background - YouTube Video */}
        <div className="absolute inset-0 z-0">
          <div id="hero-video" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-8 right-8 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
          >
            {isVideoMuted ? (
              // Muted icon
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              // Unmuted icon
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 min-h-screen flex flex-col md:items-center md:justify-center">
          {/* Mobile: Top content - Date and Venue */}
          <div className="md:hidden flex-shrink-0 pt-20">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={`text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {featuredPerformance 
                  ? <span className="font-light tracking-tight text-3xl md:text-4xl lg:text-5xl">{formatHeroDate(featuredPerformance.date)}</span>
                  : <span className="font-light tracking-tight text-3xl md:text-4xl lg:text-5xl">Date TBA</span>
                }
              </motion.div>
              {featuredPerformance && (
                <motion.div
                  className={`text-4xl md:text-5xl lg:text-6xl font-semibold text-white`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {featuredPerformance.venue}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Spacer for mobile - pushes content down */}
          <div className="md:hidden flex-grow"></div>

          {/* Desktop: Centered content OR Mobile: Bottom content */}
          <div className="grid gap-12 md:gap-16 lg:grid-cols-[1.2fr,1fr] items-center md:justify-center">
            {/* Left Column - Performance Info */}
            <motion.div 
              className="space-y-8 md:text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Desktop: Date and Venue */}
              <div className="hidden md:block">
                <motion.div
                  className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {featuredPerformance 
                    ? <span className="font-light tracking-tight text-4xl md:text-5xl lg:text-6xl">{formatHeroDate(featuredPerformance.date)}</span>
                    : <span className="font-light tracking-tight text-4xl md:text-5xl lg:text-6xl">Date TBA</span>
                  }
                </motion.div>
                {featuredPerformance && (
                  <motion.div
                    className={`text-6xl md:text-7xl lg:text-8xl font-semibold text-white`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {featuredPerformance.venue}
                  </motion.div>
                )}
              </div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-white"
                style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {featuredPerformance ? featuredPerformance.title : 'Featured Performance'}
              </motion.h1>
              
              <motion.p
                className={`text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed text-white/90 md:mx-auto lg:mx-0`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                {featuredPerformance?.description || 'CDT presents exceptional contemporary Caribbean dance performances that honor our cultural heritage while exploring movement, memory, and identity through expressive choreography.'}
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TicketButton href={featuredPerformance?.ticketUrl || "https://www.miramarculturalcenter.org/Events-directory/Streams"} />
              </motion.div>
            </motion.div>

            {/* Right Column - Empty for mobile spacing, could add content later */}
            <div className="hidden lg:block"></div>
          </div>

          {/* Mobile: Additional bottom spacing */}
          <div className="md:hidden h-8"></div>
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
                <div className="text-2xl md:text-3xl uppercase">Upcoming Performances</div>
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
                  className={`text-sm tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} inline-block`}
                >
                  {showFullCalendar ? 'Hide calendar' : 'Full calendar'} {showFullCalendar ? '↑' : '↓'}
                </button>
              </motion.div>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3 auto-rows-fr">
              {upcomingPerformances.slice(0, 3).map((perf, index) => {
                return (
                  <div
                    key={perf._id}
                    className="block group h-full"
                  >
                    <motion.div
                      className={`h-full flex flex-col p-3 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300 cursor-pointer`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.38 + index * 0.04 }}
                    >
                      {/* Top section - Date, Location, Venue, Title - Fixed height for alignment */}
                      <motion.div
                        className="flex flex-col h-[160px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.42 + index * 0.04 }}
                      >
                        <div className="text-lg md:text-xl font-bold tracking-[0.08em] uppercase text-orange-500 dark:text-orange-400 mb-2 leading-none">
                          {formatPerformanceDate(perf.date)}
                        </div>
                        <div className={`text-xs ${mutedText} mb-1`}>{perf.location}</div>
                        <div className={`text-lg md:text-xl font-semibold text-black dark:text-white mb-2`}>{perf.venue}</div>
                        <div className="text-base md:text-lg font-semibold uppercase mb-3 text-gray-600 dark:text-white">{perf.title}</div>
                      </motion.div>

                      {/* Middle section - Image (centered and consistent) */}
                      <div className={`relative border ${borderColor} overflow-hidden mb-4`} style={{ aspectRatio: '3/4' }}>
                        <img
                          src={perf.image?.asset?.url || perf.image?.url}
                          alt={perf.image?.alt || perf.title}
                          className="w-full h-full object-cover transition-all duration-300"
                        />
                      </div>

                      {/* Bottom section - Description and Button */}
                      <div className="flex flex-col flex-grow">
                        <motion.p
                          className={`text-lg leading-relaxed ${mutedText} mb-4 line-clamp-3 flex-grow`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.44 + index * 0.04 }}
                        >
                          {perf.description}
                        </motion.p>
                        {perf.ticketUrl && (
                          <motion.button
                            type="button"
                            className="mt-auto inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold tracking-[0.16em] uppercase bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.46 + index * 0.04 }}
                            onClick={() => window.open(perf.ticketUrl, '_blank', 'noopener,noreferrer')}
                          >
                            Get Tickets
                          </motion.button>
                        )}
                        {perf.learnMoreUrl && (
                          <motion.button
                            type="button"
                            className="mt-auto inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold tracking-[0.16em] uppercase bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.46 + index * 0.04 }}
                            onClick={() => window.open(perf.learnMoreUrl, '_blank', 'noopener,noreferrer')}
                          >
                            Learn More
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  </div>
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
                  {/* Additional Performances Grid - Show all remaining performances */}
                  <div className="grid gap-5 md:grid-cols-3 auto-rows-fr">
                    {upcomingPerformances.slice(3).map((perf, index) => {
                      return (
                        <div
                          key={perf._id}
                          className="block group h-full"
                        >
                          <motion.div
                            className={`h-full flex flex-col p-3 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300 cursor-pointer`}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.04 }}
                          >
                            {/* Top section - Date, Location, Venue, Title - Fixed height for alignment */}
                            <motion.div
                              className="flex flex-col h-[160px]"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.42 + index * 0.04 }}
                            >
                              <div className="text-lg md:text-xl font-bold tracking-[0.08em] uppercase text-orange-500 dark:text-orange-400 mb-2 leading-none">
                                {formatPerformanceDate(perf.date)}
                              </div>
                              <div className={`text-xs ${mutedText} mb-1`}>{perf.location}</div>
                              <div className={`text-lg md:text-xl font-semibold text-black dark:text-white mb-2`}>{perf.venue}</div>
                              <div className="text-base md:text-lg font-semibold uppercase mb-3 text-gray-600 dark:text-white">{perf.title}</div>
                            </motion.div>

                            {/* Middle section - Image (centered and consistent) */}
                            <div className={`relative border ${borderColor} overflow-hidden mb-4`} style={{ aspectRatio: '3/4' }}>
                              <img
                                src={perf.image?.asset?.url || perf.image?.url}
                                alt={perf.image?.alt || perf.title}
                                className="w-full h-full object-cover transition-all duration-300"
                              />
                            </div>

                            {/* Bottom section - Description and Button */}
                            <div className="flex flex-col flex-grow">
                              <motion.p
                                className={`text-lg leading-relaxed ${mutedText} mb-4 line-clamp-3 flex-grow`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.44 + index * 0.04 }}
                              >
                                {perf.description}
                              </motion.p>
                              {perf.ticketUrl && (
                                <motion.button
                                  type="button"
                                  className="mt-auto inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold tracking-[0.16em] uppercase bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.46 + index * 0.04 }}
                                  onClick={() => window.open(perf.ticketUrl, '_blank', 'noopener,noreferrer')}
                                >
                                  Get Tickets
                                </motion.button>
                              )}
                              {perf.learnMoreUrl && (
                                <motion.button
                                  type="button"
                                  className="mt-auto inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold tracking-[0.16em] uppercase bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.46 + index * 0.04 }}
                                  onClick={() => window.open(perf.learnMoreUrl, '_blank', 'noopener,noreferrer')}
                                >
                                  Learn More
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        </div>
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

      {/* REPERTOIRE PREVIEW */}
      {repertoire.length > 0 && (
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor} ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-8">
              <motion.div
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.42 }}
              >
                <div>
                  <div className="text-2xl md:text-3xl uppercase">REPERTOIRE</div>
                </div>
                <motion.button
                  type="button"
                  className={`text-sm tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} inline-block`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.46 }}
                >
                  <Link to="/repertoire">View full repertoire →</Link>
                </motion.button>
              </motion.div>

              <div className="grid gap-5 md:grid-cols-3 auto-rows-fr">
                {repertoire.slice(0, 3).map((item, index) => {
                  // Format title as "Title (Year)"
                  const formattedTitle = item.year ? `${item.title} (${item.year})` : item.title;

                  // Try multiple image field approaches
                  let imageUrl = null;

                  // Try thumbnail first (direct URL)
                  if (item.thumbnail?.url) {
                    imageUrl = item.thumbnail.url;
                  }
                  // Try heroImage (direct URL)
                  else if (item.heroImage?.url) {
                    imageUrl = item.heroImage.url;
                  }
                  // Try image field (if it exists)
                  else if (item.image?.url) {
                    imageUrl = item.image.url;
                  }

                  const imageAlt = item.thumbnail?.alt || item.heroImage?.alt || item.image?.alt || item.title;

                  const handleClick = () => {
                    if (item._id) {
                      navigate(`/dance/${item.slug?.current || item._id}`);
                    } else {
                      navigate('/repertoire');
                    }
                  };

                  return (
                    <motion.div
                      key={item._id}
                      className={`grid grid-rows-[1fr,auto] gap-3 p-3 border ${borderColor} ${cardBg} cursor-pointer`}
                      onClick={handleClick}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <div className={`h-56 border ${borderColor} overflow-hidden`}>
                        {imageUrl ? (
                          <img
                            src={`${imageUrl}?w=800&h=600&fit=crop&auto=format`}
                            alt={imageAlt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${mutedText} text-xs`}>
                            No Image
                          </div>
                        )}
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.55 + index * 0.1 }}
                      >
                        <div className="text-lg font-bold uppercase mb-1 font-heading">{formattedTitle}</div>
                        <div className={`text-base font-semibold font-body ${mutedText}`}>{item.choreographer}</div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* SCHOOL / TRAINING */}
        <motion.section
          id="school"
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
              <h2 className="text-3xl md:text-4xl uppercase">THE CDT SCHOOL</h2>
              <p className={`text-base md:text-lg max-w-md leading-relaxed ${mutedText}`}>
                From first steps to pre-professional study, The CDT School offers programmes in contemporary, ballet, and Jamaican folk forms led by working artists.
              </p>
              <div className="space-y-4 text-base mt-6">
                <div className="space-y-2">
                  <div className="text-lg font-semibold">Juniors</div>
                  <div className="text-base">Ages 3–17</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-lg font-semibold">Adults</div>
                  <div className="text-base">Evenings + weekends</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href="https://forms.gle/zASuCqPRZn2EZ3Ba7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-[0.16em] uppercase border border-transparent bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                >
                  Register – Juniors
                </a>
                <a
                  href="https://forms.gle/aqQ5kRxFjcrEmyrB7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-[0.16em] uppercase border border-transparent bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                >
                  Register – Adults
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
                {/* <div className={`text-sm tracking-[0.12em] uppercase ${mutedText}`}>Signals</div> */}
                <div className="text-2xl md:text-3xl uppercase">News + Press</div>
              </div>
              <motion.button
                type="button"
                className={`text-sm tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} inline-block`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.56 }}
              >
                <Link to="/news">SEE MORE</Link>
              </motion.button>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-[2fr,1.2fr] items-start">
              {/* YouTube Video */}
              <motion.div
                className={`border ${borderColor} ${cardBg} rounded-lg overflow-hidden`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.58 }}
              >
                <div className="relative w-full aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/D6wNlOtwi08?rel=0&autoplay=1&mute=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </motion.div>

              {/* Side cards - Featured Stories */}
              <div className="flex flex-col gap-4">
                {/* SIR 2024 - Featured */}
                <motion.div
                  className={`p-4 border ${borderColor} ${cardBg} flex flex-col gap-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className={`text-sm tracking-[0.12em] uppercase ${mutedText}`}>SIR 2024</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-base font-medium">Jamaica Gleaner</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">11/10/2024</div>
                      </div>
                      <a
                        href="https://jamaica-gleaner.com/article/entertainment/20241110/dance-companies-pay-joyful-tribute-tony-wilson#slideshow-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Read →
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* JUNE GALA 2024 - Featured */}
                <motion.div
                  className={`p-4 border ${borderColor} ${cardBg} flex flex-col gap-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.64 }}
                >
                  <div className={`text-sm tracking-[0.12em] uppercase ${mutedText}`}>JUNE GALA 2024</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-base font-medium">Jamaica Observer</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">06/20/2024</div>
                      </div>
                      <a
                        href="https://www.jamaicaobserver.com/2024/06/16/cdt-gala-bravo/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Read →
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* IGNITE 2023 - Featured */}
                <motion.div
                  className={`p-4 border ${borderColor} ${cardBg} flex flex-col gap-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.68 }}
                >
                  <div className={`text-sm tracking-[0.12em] uppercase ${mutedText}`}>IGNITE 2023</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-base font-medium">CVM @ Sunrise</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">11/9/2023</div>
                      </div>
                      <a
                        href="https://www.youtube.com/watch?v=Z_3oLcaza2A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Watch →
                      </a>
                    </div>
                  </div>
                </motion.div>
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
                className={`text-sm tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.59 }}
              >
                Partner With Us
              </motion.div>
              <motion.div
                className="text-xl md:text-2xl uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.61 }}
              >
                Philanthropy
              </motion.div>
              <motion.p
                className={`text-base max-w-md leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.63 }}
              >
                Join a community of supporters who believe in the power of dance to transform lives. Benefits include
                rehearsal access and priority booking.
              </motion.p>
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center px-6 py-2 text-sm font-semibold tracking-[0.16em] uppercase border ${borderColor} ${
                  isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                } transition-colors`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
                onClick={() => window.open('https://drive.google.com/file/d/1QFtkeI2cGyEXoaCnQoChasgnZ87Q6njT/view', '_blank', 'noopener,noreferrer')}
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
                className={`text-sm tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.61 }}
              >
                Education
              </motion.div>
              <motion.div
                className="text-xl md:text-2xl uppercase font-heading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.63 }}
              >
                Scholarship Fund
              </motion.div>
              <motion.p
                className={`text-base max-w-md leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              >
                Help us identify and train the next generation of Caribbean dance artists, regardless of their
                financial background.
              </motion.p>
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center px-6 py-2 text-sm font-semibold tracking-[0.16em] uppercase bg-orange-500 text-white hover:bg-orange-400 transition-colors`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.67 }}
                onClick={() => window.open('https://www.paypal.com/paypalme/cdtjamaica', '_blank', 'noopener,noreferrer')}
              >
                Donate now
              </motion.button>
            </motion.div>
          </div>
          </div>
        </motion.section>
        </div>
  );
};

export default Home;