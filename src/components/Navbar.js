import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { getSiteSettings } from '../lib/siteSettings';
import { urlFor } from '../lib/sanity';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Debounce ref to prevent rapid state changes
  const debounceRef = useRef(null);

  // Debounced state setter to prevent rapid changes
  const debouncedSetState = useCallback((setter, value) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setter(value);
    }, 50);
  }, []);

  // Fetch site settings (logos)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings) setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Close mobile menu when route changes (but keep dropdowns stable)
  useEffect(() => {
    debouncedSetState(setIsMenuOpen, false);
    // Only close dropdowns if navigating away from dropdown-related pages
    const isDropdownRelatedPage = ['/about', '/company'].includes(location.pathname);
    if (!isDropdownRelatedPage) {
      debouncedSetState(setIsAboutDropdownOpen, false);
      debouncedSetState(setIsCompanyDropdownOpen, false);
      debouncedSetState(setIsSchoolDropdownOpen, false);
    }
  }, [location, debouncedSetState]);

  // Cleanup function to prevent state conflicts
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
      setIsAboutDropdownOpen(false);
      setIsCompanyDropdownOpen(false);
      setIsSchoolDropdownOpen(false);
    };
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
    };

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // NavLink component for desktop
  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors`}
    >
      {children}
    </Link>
  );

  // Dropdown component for About menu
  const AboutDropdown = () => (
    <div 
      className="relative about-dropdown group"
    >
      <button
        className={`text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1`}
      >
        The Company
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`absolute top-full left-0 mt-2 w-48 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top`}>
        <Link
          to="/about"
          onClick={() => setIsAboutDropdownOpen(false)}
          className={`block px-4 py-3 text-base font-medium rounded-t-lg border-b border-black/10 dark:border-white/10 ${
            location.pathname === '/about'
              ? 'bg-gray-100 dark:bg-green-950 text-gray-900 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400'
          } transition-colors`}
        >
          The Company
        </Link>
        <Link
          to="/company#dancers"
          onClick={() => setIsAboutDropdownOpen(false)}
          className={`block px-4 py-3 text-base font-medium border-b border-black/10 dark:border-white/10 ${
            location.pathname === '/company#dancers'
              ? 'bg-gray-100 dark:bg-green-950 text-gray-900 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400'
          } transition-colors`}
        >
          Company Dancers
        </Link>
        <Link
          to="/company#board"
          onClick={() => setIsAboutDropdownOpen(false)}
          className={`block px-4 py-3 text-base font-medium rounded-b-lg ${
            location.pathname === '/company#board'
              ? 'bg-gray-100 dark:bg-green-950 text-gray-900 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400'
          } transition-colors`}
        >
          Board of Directors
        </Link>
      </div>
    </div>
  );

  // Dropdown component for CDT Company menu
  const CompanyDropdown = () => (
    <div 
      className="relative company-dropdown group"
    >
      <button
        className={`text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1`}
      >
        CDT Company
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`absolute top-full left-0 mt-2 w-48 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top`}>
        <Link
          to="/repertoire"
          onClick={() => setIsCompanyDropdownOpen(false)}
          className={`block px-4 py-3 text-base font-medium border-b border-black/10 dark:border-white/10 ${
            location.pathname === '/repertoire'
              ? 'bg-gray-100 dark:bg-green-950 text-gray-900 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400'
          } transition-colors`}
        >
          Repertoire
        </Link>
        {/* <Link
          to="/performances"
          onClick={() => setIsCompanyDropdownOpen(false)}
          className={`block px-4 py-3 text-base font-medium border-b border-black/10 dark:border-white/10 ${
            location.pathname === '/performances'
              ? 'bg-gray-100 dark:bg-green-950 text-gray-900 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400'
          } transition-colors`}
        >
          Performances
        </Link> */}
        <Link
          to="/about"
          onClick={() => setIsCompanyDropdownOpen(false)}
          className={`block px-4 py-3 text-base font-medium rounded-b-lg ${
            location.pathname === '/about'
              ? 'bg-gray-100 dark:bg-green-950 text-gray-900 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400'
          } transition-colors`}
        >
          About
        </Link>
      </div>
    </div>
  );

  // Dropdown component for CDT School menu
  const SchoolDropdown = () => (
    <div 
      className="relative school-dropdown group"
    >
      <button
        className={`text-lg font-medium ${
          location.pathname === '/school'
            ? 'text-gray-700 dark:text-gray-300 border-b-2 border-gray-700 dark:border-gray-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        } transition-colors flex items-center gap-1`}
      >
        CDT School
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`absolute top-full left-0 mt-2 w-48 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top`}>
        <a
          href="https://linktr.ee/cdtjamaica"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsSchoolDropdownOpen(false)}
          className={`block px-4 py-3 text-sm font-medium rounded-t-lg border-b border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400 transition-colors`}
        >
          Adult Registration
        </a>
        <a
          href="https://linktr.ee/cdtjamaica"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsSchoolDropdownOpen(false)}
          className={`block px-4 py-3 text-sm font-medium rounded-b-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400 transition-colors`}
        >
          Kids Registration
        </a>
      </div>
    </div>
  );

  // MobileNavLink component
  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-lg font-medium ${
        location.pathname === to
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav className={`w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-black backdrop-blur-md shadow-lg dark:shadow-black/30' 
          : 'bg-white/80 dark:bg-black backdrop-blur-sm shadow-md dark:shadow-black/20'
      }`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center h-full">
              {siteSettings?.lightLogo && siteSettings?.darkLogo ? (
                <>
                  {/* Light mode logo (hidden in dark mode) */}
                  <img
                    src={urlFor(siteSettings.lightLogo).url()}
                    // alt="CDT Jamaica Logo"
                    className={`h-14 w-auto ${isDarkMode ? 'hidden' : 'block'}`}
                  />
                  {/* Dark mode logo (hidden in light mode) */}
                  <img
                    src={urlFor(siteSettings.darkLogo).url()}
                    // alt="CDT Jamaica Logo"
                    className={`h-14 w-auto ${!isDarkMode ? 'hidden' : 'block'}`}
                  />
                </>
              ) : (
                <span className="text-2xl xl:text-3xl font-light tracking-wider">
                </span>
              )}
            </Link>
          </div>

          <nav className="flex-1 flex justify-center items-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 xl:space-x-16 2xl:space-x-20">
            <NavLink to="/" className="font-semibold tracking-[0.08em] uppercase text-sm" onClick={() => {document.documentElement.scrollTop = 0; document.body.scrollTop = 0; setTimeout(() => window.scrollTo(0, 0), 10);}}>Home</NavLink>
            <NavLink to="/about" className="font-semibold tracking-[0.08em] uppercase text-sm" onClick={() => {document.documentElement.scrollTop = 0; document.body.scrollTop = 0; setTimeout(() => window.scrollTo(0, 0), 10);}}> The Company</NavLink>
            <NavLink to="/#school" className="font-semibold tracking-[0.08em] uppercase text-sm">The School</NavLink>
            {/* <NavLink to="/performances">Performances</NavLink> */}
            <NavLink to="/news" className="font-semibold tracking-[0.08em] uppercase text-sm" onClick={() => window.scrollTo(0, 0)}>News + Press</NavLink>
            <NavLink to="/contact" className="font-semibold tracking-[0.08em] uppercase text-sm" onClick={() => window.scrollTo(0, 0)}>Contact</NavLink>
            <a
              href="https://bredsfoundation.org/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZnRzaAOP5EBleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadBWYsEy_yt9bdmCM5xe0lSlDf_G1MD1Qych57nJLXKKbywQ1QcOR1TO7YJPQ_aem_V7u0mQ6zISPvkV5ZJCXXrQ"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold tracking-[0.08em] uppercase text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Hurricane Melissa Relief
            </a>
            <a
              href="https://www.paypal.com/paypalme/cdtjamaica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Give
            </a>
          </div>
        </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="hamburger-lines">
                <span className={`line line-1 ${isMenuOpen ? 'active' : ''}`}></span>
                <span className={`line line-2 ${isMenuOpen ? 'active' : ''}`}></span>
                <span className={`line line-3 ${isMenuOpen ? 'active' : ''}`}></span>
              </div>
              <div className="notes">
                <div className="note note-1"></div>
                <div className="note note-2"></div>
                <div className="note note-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-900"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ul className="menu-items">
            <li className="menu-item"><Link to="/" onClick={() => {setIsMenuOpen(false); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; setTimeout(() => window.scrollTo(0, 0), 10);}} className="font-semibold tracking-[0.08em] uppercase text-sm">Home</Link></li>
            <li className="menu-item"><Link to="/about" onClick={() => {setIsMenuOpen(false); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; setTimeout(() => window.scrollTo(0, 0), 10);}} className="font-semibold tracking-[0.08em] uppercase text-sm">The Company</Link></li>
            <li className="menu-item"><Link to="/about" onClick={() => {setIsMenuOpen(false); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; setTimeout(() => window.scrollTo(0, 0), 10);}} className="font-semibold tracking-[0.08em] uppercase text-sm">The School</Link></li>
            {/* <li className="menu-item"><Link to="/performances" onClick={() => setIsMenuOpen(false)}>Performances</Link></li> */}
            <li className="menu-item"><Link to="/news" onClick={() => {setIsMenuOpen(false); window.scrollTo(0, 0);}} className="font-semibold tracking-[0.08em] uppercase text-sm">News + Press</Link></li>
            <li className="menu-item"><Link to="/contact" onClick={() => {setIsMenuOpen(false); window.scrollTo(0, 0);}} className="font-semibold tracking-[0.08em] uppercase text-sm">Contact</Link></li>
            <li className="menu-item">
              <a
                href="https://bredsfoundation.org/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZnRzaAOP5EBleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadBWYsEy_yt9bdmCM5xe0lSlDf_G1MD1Qych57nJLXKKbywQ1QcOR1TO7YJPQ_aem_V7u0mQ6zISPvkV5ZJCXXrQ"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
              >
                Hurricane Melissa Relief
              </a>
            </li>
            <li className="menu-item">
              <a
                href="https://www.paypal.com/paypalme/cdtjamaica"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
              >
                Give
              </a>
            </li>
          </ul>
          <div className="mt-8">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <>
                  <FiSun className="w-5 h-5 text-yellow-400" />
                  <span>Light mode</span>
                </>
              ) : (
                <>
                  <FiMoon className="w-5 h-5 text-gray-800" />
                  <span>Dark mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Floating Dark/Light Mode Toggle */}
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-900 transition-all duration-300 border border-gray-200 dark:border-gray-700"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <FiSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FiMoon className="w-5 h-5 text-gray-800" />
      )}
    </button>
    </>
  );
};

export default Navbar;
