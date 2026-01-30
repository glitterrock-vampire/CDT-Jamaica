import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { getSiteSettings } from '../lib/siteSettings';
import { urlFor } from '../lib/sanity';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAboutDropdownOpen(false);
  }, [location]);

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
      className={`text-base font-medium ${
        location.pathname === to
          ? 'text-gray-700 dark:text-gray-300 border-b-2 border-gray-700 dark:border-gray-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      } transition-colors`}
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
        className={`text-base font-medium ${
          location.pathname === '/about' || location.pathname === '/company'
            ? 'text-gray-700 dark:text-gray-300 border-b-2 border-gray-700 dark:border-gray-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        } transition-colors flex items-center gap-1`}
      >
        About
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
          className={`block px-4 py-3 text-sm font-medium rounded-t-lg border-b border-black/10 dark:border-white/10 ${
            location.pathname === '/about'
              ? 'bg-gray-100 dark:bg-green-950 text-gray-900 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-green-950/50 hover:text-gray-900 dark:hover:text-green-400'
          } transition-colors`}
        >
          Our Story
        </Link>
        <Link
          to="/company#dancers"
          onClick={() => setIsAboutDropdownOpen(false)}
          className={`block px-4 py-3 text-sm font-medium border-b border-black/10 dark:border-white/10 ${
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
          className={`block px-4 py-3 text-sm font-medium rounded-b-lg ${
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

  // MobileNavLink component
  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        location.pathname === to
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  );

  return (
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 xl:space-x-16 2xl:space-x-20">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/repertoire">Repertoire</NavLink>
            <NavLink to="/performances">Performances</NavLink>
            <div className="about-dropdown">
              <AboutDropdown />
            </div>
            <NavLink to="/contact">Contact</NavLink>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200 shadow-sm"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <FiSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-800" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <FiSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-800" />
              )}
            </button>
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
            <li className="menu-item"><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li className="menu-item"><Link to="/repertoire" onClick={() => setIsMenuOpen(false)}>Repertoire</Link></li>
            <li className="menu-item"><Link to="/performances" onClick={() => setIsMenuOpen(false)}>Performances</Link></li>
            <li className="menu-item">
              <div className="py-2">
                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-2">About</div>
                <ul className="space-y-1">
                  <li><Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Our Story</Link></li>
                  <li><Link to="/company#dancers" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Company Dancers</Link></li>
                  <li><Link to="/company#board" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Board of Directors</Link></li>
                </ul>
              </div>
            </li>
            <li className="menu-item"><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
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
  );
};

export default Navbar;
