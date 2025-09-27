import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { getSiteSettings } from '../lib/siteSettings';
import { urlFor } from '../lib/sanity';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  }, [location]);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // NavLink component for desktop
  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`text-base font-medium ${
        location.pathname === to
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
      } transition-colors`}
    >
      {children}
    </Link>
  );

  // MobileNavLink component
  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        location.pathname === to
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
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
                    alt="CDT Jamaica Logo"
                    className={`h-10 w-auto ${isDarkMode ? 'hidden' : 'block'}`}
                  />
                  {/* Dark mode logo (hidden in light mode) */}
                  <img
                    src={urlFor(siteSettings.darkLogo).url()}
                    alt="CDT Jamaica Logo"
                    className={`h-10 w-auto ${!isDarkMode ? 'hidden' : 'block'}`}
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
            <NavLink to="/">Repertoire</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-current hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="px-6 py-4 space-y-4 bg-black bg-opacity-95">
          <MobileNavLink to="/">Repertoire</MobileNavLink>
          <MobileNavLink to="/about">About</MobileNavLink>
          <MobileNavLink to="/contact">Contact</MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
