import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import SectionNav from '../components/ailey/SectionNav';
import { getUpcomingPerformances, getDancers, getBoardMembers, getManagement } from '../lib/performances';
import { getSiteSettings, getRepertoireItems } from '../lib/sanity';
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

// Helper function to safely render description
const renderDescription = (description) => {
  if (!description) return '';
  
  // If it's a string, return as-is
  if (typeof description === 'string') {
    return description;
  }
  
  // If it's a Sanity rich text object, extract plain text
  if (description && typeof description === 'object' && description.children) {
    return description.children
      .map(child => {
        if (typeof child === 'object' && child.text) {
          return child.text;
        }
        return '';
      })
      .filter(text => text !== '')
      .join(' ');
  }
  
  // Fallback for other types
  return String(description);
};

const About = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [dancers, setDancers] = useState([]);
  const [management, setManagement] = useState([]);
  const [upcomingPerformances, setUpcomingPerformances] = useState([]);
  const [repertoire, setRepertoire] = useState([]);
  const [loading, setLoading] = useState(true);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteSettings, boardData, dancersData, managementData, performancesData, repertoireData] = await Promise.all([
          getSiteSettings(),
          getBoardMembers(),
          getDancers(),
          getManagement(),
          getUpcomingPerformances(),
          getRepertoireItems()
        ]);
        
        if (siteSettings) setSiteSettings(siteSettings);
        if (boardData) setBoardMembers(boardData);
        if (dancersData) setDancers(dancersData);
        if (managementData) setManagement(managementData || []);
        if (performancesData) setUpcomingPerformances(performancesData || []);
        if (repertoireData) setRepertoire(repertoireData || []);
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
        const threshold = secondaryNavTop - 150;
        
        if (scrollY >= threshold && scrollY > lastScrollY) {
          isTransitioning = true;
          navbar.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
          navbar.style.opacity = '0';
          navbar.style.transform = 'translateY(-20px)';
          
          setTimeout(() => {
            navbar.style.display = 'none';
            isTransitioning = false;
          }, 300);
        } else if (scrollY < threshold - 50 || scrollY < lastScrollY) {
          isTransitioning = true;
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

    timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }, 500);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.transition = '';
        navbar.style.opacity = '';
        navbar.style.transform = '';
        navbar.style.display = '';
      }
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section */}
      {siteSettings && siteSettings.heroImage && (
        <Hero
        
          image={siteSettings.heroImage}
          title="The Company"
        />
      )}
      
      {/* Section Navigation */}
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
              { id: 'repertoire', label: 'OUR REPERTOIRE' },
              { id: 'bookings', label: 'BOOKINGS' }
            ].map((item) => (
              <button
                key={item.id}
                className="px-3 py-2 text-sm font-semibold tracking-[0.08em] uppercase hover:text-orange-500 transition-colors"
                onClick={() => {
                  const element = document.getElementById(item.id);
                  if (element) {
                    const navHeight = 80;
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

      {/* THE COMPANY section */}
      <section id="the-company" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            {/* Left Column - Title and Content */}
            <div className="md:col-span-8">
              <div className="text-left mb-8">
                <div className={`text-sm tracking-[0.12em] uppercase ${mutedText} mb-2`}>About</div>
                <h2 className={`text-2xl md:text-3xl uppercase ${textColor}`}>THE COMPANY</h2>
              </div>

              <div className={`space-y-6 leading-relaxed text-justify`}>
                <motion.p 
                  className={`text-2xl md:text-3xl ${textColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Founded by Mr. Tony Wilson, OD in 1988 in Jamaica, The Company Dance Theatre rose to national acclaim. With an eclectic repertory of modern, contemporary and Jamaican-styled works, The Company Dance Theatre performed in Jamaica, wider Caribbean, and North America.
                </motion.p>
                <motion.p 
                  className={`text-lg ${textColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  CDT Jamaica is a legacy company formed to honor late Mr. Tony Wilson, OD. It is headed by four alumni of The Company Dance Theatre: Dr. Sade Bully-Bell, Artistic Director, CDT; Renée I. McDonald, Associate Artistic Director, CDT; Steven Cornwall, Artistic Director, The CDT School; and Colin Blackwood, Executive Director, CDT and The CDT School. CDT's purpose is to continue Mr. Tony Wilson's legacy of bringing dynamic, highly technical, cutting-edge modern dance to Jamaican stage and beyond.
                </motion.p>
                <motion.p 
                  className={`text-lg ${textColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Our mission is to further the pioneering work of Mr. Tony Wilson, OD and his contribution to Jamaican arts and culture by continuing to provide modern dance-focused training, inspiring performances, and community outreach in Jamaica and <span className="italic text-orange-500">to di worl!</span>
                </motion.p>
              </div>
            </div>

            {/* Right Column - Founder Image */}
            <div className="md:col-span-4">
              <motion.div
                className="sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Tony Wilson Image */}
                {management && management.length > 0 && (
                  <div className="mb-6">
                    <div className={`overflow-hidden rounded-lg border ${isDarkMode ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-white'} shadow-lg`}>
                      <div className="aspect-[4/5] overflow-hidden relative">
                        {management[0].headshot ? (
                          <>
                            <img
                              src={urlFor(management[0].headshot).width(400).height(500).fit('crop').url()}
                              alt={management[0].headshot.alt || management[0].name}
                              className="w-full h-full object-cover"
                            />
                            {/* Subtle overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent"></div>
                          </>
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                            <span className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'} mb-1`}>
                          {management[0].name}
                        </h3>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                          {management[0].title}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Board of Directors Section */}
      <section id="board-of-directors" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8">
            <h2 className={`text-2xl md:text-3xl uppercase ${textColor}`}>BOARD OF DIRECTORS</h2>
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
            <h2 className={`text-2xl md:text-3xl uppercase ${textColor}`}>MANAGEMENT</h2>
          </div>
          {loading ? (
            <div className="text-left py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className={`mt-4 ${mutedText}`}>Loading management team...</p>
            </div>
          ) : management.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {management.slice(1).map((member, index) => (
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
            <h2 className={`text-2xl md:text-3xl uppercase ${textColor}`}>DANCERS</h2>
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

      {/* Additional Dancers List */}
      <motion.section
        className={`py-8 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="w-full max-w-4xl">
            <div className={`p-6 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-900/50 border-gray-800'
                : 'bg-gray-50 border-gray-200'
            }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Assantewaa Alberts',
                'Nneka Alvaranga',
                'Nathan Campbell',
                'Kishan Carnegie',
                'Shamitha Chindepalli',
                'Kenya Harvey',
                'Matthew Johnson',
                'Kaelah Mckoy',
                'Sierra Moss-Solomon',
                'Janna Nesbeth',
                'Gina Strachan',
                'Shiloh Tracey'
              ].map((name, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 text-white'
                      : 'bg-white border-gray-200 text-black'
                  }`}
                >
                  <span className="font-medium">{name}</span>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </motion.section>

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
                className={`text-2xl md:text-3xl uppercase ${textColor}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                UPCOMING PERFORMANCES
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
                className="overflow-x-auto pb-4 no-scrollbar"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className="flex gap-5" style={{ minWidth: 'max-content' }}>
                  {upcomingPerformances.map((performance, index) => (
                    <motion.div
                      key={performance._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`flex-shrink-0 w-[320px] md:w-[360px] h-full flex flex-col p-4 border ${isDarkMode ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-white'} hover:border-orange-500/50 transition-all duration-300`}
                    >
                      {/* Top section - Date, Location, Venue, Title - Fixed height for alignment */}
                      <div className="flex flex-col h-[180px]">
                        <div className="text-xl md:text-2xl font-bold tracking-[0.08em] uppercase text-orange-500 mb-3 leading-none">
                          {formatPerformanceDate(performance.date)}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{performance.location}</div>
                        <div className={`text-xl md:text-2xl font-semibold text-black mb-3`}>{performance.venue}</div>
                        <div className="text-lg md:text-xl font-semibold uppercase mb-4 text-gray-600">{performance.title}</div>
                      </div>

                      {/* Middle section - Image (centered and consistent) */}
                      <div className={`relative border ${isDarkMode ? 'border-white/10' : 'border-black/10'} overflow-hidden mb-4`} style={{ aspectRatio: '3/4' }}>
                        <img
                          src={performance.image?.asset?.url || performance.image?.url}
                          alt={performance.image?.alt || performance.title}
                          className="w-full h-full object-cover transition-all duration-300"
                        />
                      </div>

                      {/* Bottom section - Description and Button */}
                      <div className="flex flex-col flex-grow">
                        {performance.description && (
                          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-3 flex-grow`}>
                            {performance.description}
                          </p>
                        )}
                        <div className="mt-auto space-y-2">
                          {performance.ticketUrl && (
                            <button
                              type="button"
                              className="w-full px-4 py-3 text-sm font-semibold tracking-[0.16em] uppercase bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                              onClick={() => window.open(performance.ticketUrl, '_blank', 'noopener,noreferrer')}
                            >
                              Get Tickets
                            </button>
                          )}
                          {performance.learnMoreUrl && (
                            <button
                              type="button"
                              className="w-full px-4 py-3 text-sm font-semibold tracking-[0.16em] uppercase bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                              onClick={() => window.open(performance.learnMoreUrl, '_blank', 'noopener,noreferrer')}
                            >
                              Learn More
                            </button>
                          )}
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

      {/* Repertoire Preview */}
      <motion.section
        id="repertoire"
        className={`py-16 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <motion.h2 
                className={`text-2xl md:text-3xl uppercase ${textColor}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                OUR REPERTOIRE
              </motion.h2>
              <motion.button
                type="button"
                className={`text-sm tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} inline-block`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.56 }}
              >
                <Link to="/repertoire">View more →</Link>
              </motion.button>
            </div>
          </div>

          {/* Repertoire Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {repertoire && repertoire.length > 0 && repertoire.slice(0, 3).map((item, index) => {
              // Debug logging to see what image data we have
              console.log('Repertoire item image data:', {
                title: item.title,
                thumbnail: item.thumbnail,
                heroImage: item.heroImage,
                image: item.image,
                thumbnailAsset: item.thumbnail?.asset,
                heroImageAsset: item.heroImage?.asset
              });
              
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
                console.log('Repertoire item clicked:', { _id: item._id, title: item.title });
                if (item._id) {
                  navigate(`/dance/${item._id}`);
                } else {
                  console.error('No _id available for repertoire item:', item);
                  // Fallback to general repertoire page
                  navigate('/repertoire');
                }
              };
              
              return (
              <motion.div 
                key={item._id}
                className={`grid grid-rows-[1fr,auto] gap-3 p-3 border ${borderColor} ${cardBg} cursor-pointer`}
                onClick={handleClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
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
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="text-lg font-bold uppercase mb-1 font-heading">{formattedTitle}</div>
                  <div className={`text-base font-semibold font-body ${mutedText}`}>{item.choreographer}</div>
                </motion.div>
              </motion.div>
            );
            })}
            {!repertoire || repertoire.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className={`text-lg ${mutedText}`}>
                  No repertoire items available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Booking Information */}
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
            <div className="md:col-span-4">
              <motion.div
                className="sticky top-24"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className={`text-2xl md:text-3xl uppercase ${textColor}`}>BOOKINGS</h2>
              </motion.div>
            </div>

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
                  <div className="space-y-6">

                   {/* Jamaica Inquiries */}
                    <div className="space-y-2">
                      <p className="font-semibold text-orange-600 dark:text-orange-400">For Jamaica inquiries:</p>
                      <div className="font-medium">
                        <p>Dr. Sade Bully-Bell</p>
                        <p>AISK, 2 College Green Avenue</p>
                        <p>Kingston 6</p>
                        <p>Jamaica</p>
                        <p>(876) 463-7395 | thecompany@cdtjamaica.org</p>
                      </div>
                    </div>

                    {/* US Inquiries */}
                    <div className="space-y-2">
                      <p className="font-semibold text-orange-600 dark:text-orange-400">For Global inquiries:</p>
                      <div className="font-medium">
                        <p>Colin Blackwood</p>
                        <p>100 Southeast 2nd Street, Suite 2000</p>
                        <p>Miami, Florida 33131 USA</p>
                        <p>(954) 361-5370 | thecompany@cdtjamaica.org</p>
                      </div>
                    </div>
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