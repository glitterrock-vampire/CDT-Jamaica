import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import SectionNav from '../components/ailey/SectionNav';
import IntroSection from '../components/ailey/IntroSection';
import { getBoardMembers } from '../lib/boardMembers';
import { getDancers } from '../lib/dancers';
import BoardMemberCard from '../components/Board/BoardMemberCard';
import DancerCard from '../components/Dancers/DancerCard';
import { getSiteSettings } from '../lib/siteSettings';

const About = () => {
  const { isDarkMode } = useTheme();
  const [siteSettings, setSiteSettings] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [dancers, setDancers] = useState([]);
  const [loading, setLoading] = useState(true);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteData, boardData, dancersData] = await Promise.all([
          getSiteSettings(),
          getBoardMembers(),
          getDancers()
        ]);
        
        if (siteData) setSiteSettings(siteData);
        if (boardData) setBoardMembers(boardData);
        if (dancersData) {
          console.log('Fetched dancers data:', dancersData);
          console.log('Number of dancers:', dancersData.length);
          
          // Show all dancers, roles will be hidden in the component
          setDancers(dancersData);
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
      {siteSettings?.heroImage && (
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
              { id: 'dancers', label: 'DANCERS' }
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
      <IntroSection />
      
      {/* Board of Directors Section */}
      <section id="board-of-directors" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8">
            <h2 className="text-3xl md:text-4xl uppercase mb-4 font-semibold tracking-[0.08em] font-body">Board of Directors</h2>
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
            <h2 className="text-3xl md:text-4xl uppercase mb-4 font-heading">Management</h2>
          </div>
          <div className="text-left py-12">
            <p className={mutedText}>Management team information coming soon.</p>
          </div>
        </div>
      </section>
      
      {/* Dancers Section */}
      <section id="dancers" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8">
            <h2 className="text-3xl md:text-4xl uppercase mb-4 font-heading">Dancers</h2>
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
    </div>
  );
};

export default About;
