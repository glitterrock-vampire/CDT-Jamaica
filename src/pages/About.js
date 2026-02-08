import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import SectionNav from '../components/ailey/SectionNav';
import { getUpcomingPerformances, getDancers, getBoardMembers, getManagement } from '../lib/performances';
import { getSiteSettings } from '../lib/siteSettings';
import { urlFor } from '../lib/sanity';
import BoardMemberCard from '../components/Board/BoardMemberCard';
import DancerCard from '../components/Dancers/DancerCard';
import ManagementCard from '../components/ManagementCard';
import TicketButton from '../components/TicketButton';

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

const About = () => {
  const { isDarkMode } = useTheme();
  const [siteSettings, setSiteSettings] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [dancers, setDancers] = useState([]);
  const [management, setManagement] = useState([]);
  const [upcomingPerformances, setUpcomingPerformances] = useState([]);
  const [currentPerformanceIndex, setCurrentPerformanceIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteSettings, boardData, dancersData, managementData, performancesData] = await Promise.all([
          getSiteSettings(),
          getBoardMembers(),
          getDancers(),
          getManagement(),
          getUpcomingPerformances()
        ]);
        
        if (siteSettings) setSiteSettings(siteSettings);
        if (boardData) setBoardMembers(boardData);
        if (dancersData) {
          console.log('Fetched dancers data:', dancersData);
          console.log('Number of dancers:', dancersData.length);
          
          // Show all dancers, roles will be hidden in the component
          setDancers(dancersData);
        }
        if (managementData) {
          console.log('Fetched management data:', managementData);
          console.log('Number of management members:', managementData.length);
          setManagement(managementData || []);
        }
        if (performancesData) {
          console.log('Fetched performances data:', performancesData);
          console.log('Number of performances:', performancesData.length);
          console.log('Current performance index:', currentPerformanceIndex);
        console.log('Upcoming performances length:', upcomingPerformances.length);
          setUpcomingPerformances(performancesData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Smooth navbar transition on About page
  useEffect(() => {
    let timeoutId;
    let lastScrollY = 0;
    let isTransitioning = false;
    
    const handleScroll = () => {
      const navbar = document.querySelector('nav');
      const secondaryNav = document.querySelector('[data-secondary-nav]');
      
      if (navbar && secondaryNav && !isTransitioning) {
        const scrollY = window.scrollY;
        const secondaryNavTop = secondaryNav.offsetTop;
        const threshold = secondaryNavTop - 150; // Start transition earlier
        
        // Scrolling down and approaching secondary nav
        if (scrollY >= threshold && scrollY > lastScrollY) {
          isTransitioning = true;
          
          // Smooth fade out main navbar
          navbar.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
          navbar.style.opacity = '0';
          navbar.style.transform = 'translateY(-20px)';
          
          setTimeout(() => {
            navbar.style.display = 'none';
            isTransitioning = false;
          }, 300);
        }
        // Scrolling up and away from secondary nav
        else if (scrollY < threshold - 50 || scrollY < lastScrollY) {
          isTransitioning = true;
          
          // Show navbar with smooth fade in
          navbar.style.display = '';
          navbar.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
          navbar.style.opacity = '0';
          navbar.style.transform = 'translateY(-20px)';
          
          requestAnimationFrame(() => {
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
          });
          
          setTimeout(() => {
            isTransitioning = false;
          }, 300);
        }
        
        lastScrollY = scrollY;
      }
    };

    // Delay the scroll listener to allow navbar to load first
    timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial position after delay
    }, 500);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('scroll', handleScroll);
      // Reset navbar styles when leaving page
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.transition = '';
        navbar.style.opacity = '';
        navbar.style.transform = '';
        navbar.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings) {
          setSiteSettings(settings);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section - Using homepage Hero component */}
      {siteSettings && siteSettings.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="The Company"
        />
      )}
      
      {/* Section Navigation - Replaces main navbar on scroll */}
      <motion.div
        data-secondary-nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`sticky top-0 z-[60] py-4 md:py-6 border-b ${borderColor} ${isDarkMode ? 'bg-black/95 backdrop-blur-md shadow-black/30' : 'bg-white/95 backdrop-blur-md shadow-gray-200/30'} shadow-lg transition-all duration-300`}
        style={{ 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center">
            {[
              { id: 'the-company', label: 'THE COMPANY' },
              { id: 'board-of-directors', label: 'BOARD OF DIRECTORS' },
              { id: 'management', label: 'MANAGEMENT' },
              { id: 'dancers', label: 'DANCERS' },
              { id: 'upcoming-performances', label: 'UPCOMING PERFORMANCES' },
              { id: 'bookings', label: 'BOOKINGS' }
            ].map((item, index) => (
              <button
                key={item.id}
                className="px-3 py-2 text-sm font-semibold tracking-[0.08em] uppercase hover:text-orange-500 transition-colors"
                onClick={() => {
                  const element = document.getElementById(item.id);
                  if (element) {
                    // Offset for sticky nav height
                    const navHeight = 80; // Approximate height of sticky nav
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      {/* THE COMPANY section (Intro) */}
      <section id="the-company" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            {/* Left Column - Header */}
            <motion.div
              className="md:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="sticky top-24">
                <h2 className="text-2xl md:text-3xl uppercase mb-4 font-semibold tracking-[0.08em]">
                  THE COMPANY
                </h2>
              </div>
            </motion.div>

            {/* Right Column - Content spanning to match grid below */}
           <div className="md:col-span-8">
              <div className={`space-y-6 ${isDarkMode ? 'text-white/90' : 'text-black/90'} leading-relaxed`}>
                <motion.p 
                  className="text-2xl md:text-3xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Founded by Mr. Tony Wilson, OD in 1988 in Jamaica, The Company Dance Theatre rose to national acclaim. With an eclectic repertory of modern, contemporary and Jamaican-styled works, The Company Dance Theatre performed in Jamaica, wider Caribbean, and North America.
                </motion.p>
                <motion.p 
                  className="text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  CDT Jamaica is a legacy company formed to honor the late Mr. Tony Wilson, OD. It is headed by four alumni of The Company Dance Theatre: Dr. Sade Bully-Bell, Artistic Director, CDT; Renée I. McDonald, Associate Artistic Director, CDT; Steven Cornwall, Artistic Director, The CDT School; and Colin Blackwood, Executive Director, CDT and The CDT School. CDT's purpose is to continue Mr. Tony Wilson's legacy of bringing dynamic, highly technical, cutting-edge modern dance to the Jamaican stage and beyond.
                </motion.p>
                <motion.p 
                  className="text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Our mission is to further the pioneering work of Mr. Tony Wilson, OD and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and to the world!
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Board of Directors Section */}
      <section id="board-of-directors" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8">
            <h2 className="text-2xl md:text-3xl uppercase mb-4 font-semibold tracking-[0.08em]">BOARD OF DIRECTORS</h2>
          </div>
          {loading ? (
            <div className="text-left py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className={`mt-4 ${mutedText}`}>Loading board members...</p>
            </div>
          ) : boardMembers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {boardMembers.map((member, index) => (
                <BoardMemberCard key={member._id} boardMember={member} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-left py-12">
              <p className={mutedText}>No board members found.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Management Section */}
      <section id="management" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8">
            <h2 className="text-2xl md:text-3xl uppercase mb-4 font-semibold tracking-[0.08em]">MANAGEMENT</h2>
          </div>
          {loading ? (
            <div className="text-left py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className={`mt-4 ${mutedText}`}>Loading management team...</p>
            </div>
          ) : management.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {management.map((member, index) => (
                <ManagementCard key={member._id} member={member} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-left py-12">
              <p className={mutedText}>No management team members found.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Dancers Section */}
      <section id="dancers" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8">
            <h2 className="text-2xl md:text-3xl uppercase mb-4 font-semibold tracking-[0.08em]">DANCERS</h2>
          </div>
          {loading ? (
            <div className="text-left py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className={`mt-4 ${mutedText}`}>Loading dancers...</p>
            </div>
          ) : dancers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {dancers.map((dancer, index) => (
                <DancerCard key={dancer._id} dancer={dancer} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-left py-12">
              <p className={mutedText}>No dancers found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Performances Carousel */}
      {upcomingPerformances.length > 0 && (
        <motion.section
          id="upcoming-performances"
          className={`py-16 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <motion.h2 
                className="text-2xl md:text-3xl uppercase mb-4 font-semibold tracking-[0.08em]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
               UPCOMING PERFORMANCES 
               {/* ({upcomingPerformances.length}) */}
              </motion.h2>
            </div>

            {/* Performances Horizontal Scroll */}
            <div className="relative">
              {/* Left Scroll Indicator */}
              <motion.div
                className="absolute -left-10 md:-left-16 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: [0.3, 0.8, 0.3], x: [-10, 0, -10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-white/20' : 'border-black/20'}`}>
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </motion.div>

              {/* Right Scroll Indicator */}
              <motion.div
                className="absolute -right-10 md:-right-16 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: [0.3, 0.8, 0.3], x: [10, 0, 10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-white/20' : 'border-black/20'}`}>
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>

              <div 
                className="overflow-x-auto pb-4"
                style={{
                  scrollbarWidth: 'none', /* Firefox */
                  msOverflowStyle: 'none', /* IE and Edge */
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                  }
                `}</style>
                <div className="flex gap-6 md:gap-8">
                  {upcomingPerformances.map((performance, index) => (
                    <motion.div
                      key={performance._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`border ${isDarkMode ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-white'} rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col flex-shrink-0 w-[280px] md:w-[320px]`}
                    >
                      {/* Performance Image */}
                      <div className={`relative border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'} overflow-hidden flex-shrink-0`} style={{ aspectRatio: '3/4' }}>
                        <img
                          src={performance.image?.asset?.url || performance.image?.url}
                          alt={performance.image?.alt || performance.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Performance Info */}
                      <div className="p-4 md:p-6 flex flex-col flex-grow">
                        <div className="text-base md:text-lg font-bold tracking-[0.08em] uppercase text-orange-500 mb-2 md:mb-3">
                          {formatPerformanceDate(performance.date)}
                        </div>
                        
                        <h3 className="text-lg md:text-xl font-bold mb-2">
                          {performance.title}
                        </h3>
                        
                        <div className={`space-y-6 ${isDarkMode ? 'text-white/90' : 'text-black/90'} text-lg leading-relaxed`}>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="text-xl font-semibold"
                          >
                            Founded by Mr. Tony Wilson, OD in 1988 in Jamaica, The Company Dance Theatre rose to national acclaim. With an eclectic repertory of modern, contemporary and Jamaican-styled works, The Company Dance Theatre performed in Jamaica, wider Caribbean, and North America.
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                          >
                            CDT Jamaica is a legacy company formed to honor the late Mr. Tony Wilson, OD. It is headed by four alumni of The Company Dance Theatre: Dr. Sade Bully-Bell, Artistic Director, CDT; Renée I. McDonald, Associate Artistic Director, CDT; Steven Cornwall, Artistic Director, The CDT School; and Colin Blackwood, Executive Director, CDT and The CDT School. CDT's purpose is to continue Mr. Tony Wilson's legacy of bringing dynamic, highly technical, cutting-edge modern dance to the Jamaican stage and beyond.
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                          >
                            Our mission is to further the pioneering work of Mr. Tony Wilson, OD and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and to the world!
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Booking Information - Always show */}
      <motion.section
        id="bookings"
        className={`py-16 ${isDarkMode ? 'bg-black' : 'bg-white'} border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column - Title */}
            <motion.div
              className="md:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="sticky top-24">
                <h2 className="text-2xl md:text-3xl uppercase mb-4 font-semibold tracking-[0.08em]">BOOKINGS</h2>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              className="md:col-span-7 md:col-start-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`p-8 rounded-lg border ${isDarkMode ? 'border-white/10 bg-neutral-900/50' : 'border-black/10 bg-gray-50'}`}>
                <div className="space-y-4 text-lg">
                  <p className={mutedText}>
                    To book CDT at your venue, please contact:
                  </p>
                  <div className="space-y-2 font-medium">
                    <p>Dr. Sade Bully-Bell</p>
                    <p>AISK, 2 College Green Avenue</p>
                    <p>Kingston 6</p>
                    <p>Jamaica</p>
                    <p>876-463-7395 | company@cdtjamaica.org</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;