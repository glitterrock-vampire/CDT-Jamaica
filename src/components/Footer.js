import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getSiteSettings } from '../lib/siteSettings';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const [siteSettings, setSiteSettings] = React.useState(null);

  React.useEffect(() => {
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

  return (
    <footer className={`${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} pt-10 pb-4 px-4 border-t border-gray-200 dark:border-gray-800`}>
      {/* Top Row: Logo & Navigation */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-8">
        {/* Logo & Navigation */}
        <div className="flex flex-col sm:flex-row gap-12 lg:gap-24 items-start">
          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
            {/* CDT logo (light/dark mode) */}
            {siteSettings && (
              <img
                src={isDarkMode ? siteSettings.darkLogo?.asset?.url : siteSettings.lightLogo?.asset?.url}
                alt={siteSettings.title + ' logo'}
                className="h-24 w-auto mb-2"
                style={{ maxHeight: '96px' }}
              />
            )}

          </div>
          {/* Navigation Columns */}
          {/* CDT Navigation - Visit, About Us, Contact Us (stacked) */}
          <div className="text-left">
            <ul className="space-y-1">
              <li><a href="/repertoire" className="font-bold text-lg ml-4">VISIT</a></li>
              <li><a href="/about" className="font-bold text-lg ml-4">ABOUT US</a></li>
              <li><a href="/contact" className="font-bold text-lg ml-4">CONTACT US</a></li>
            </ul>
          </div>
        </div>
        {/* Newsletter & Social */}
        <div className="flex flex-col gap-8 w-full max-w-md lg:max-w-xs">
          {/* Newsletter */}
          <div>
            <label htmlFor="newsletter" className="block text-xs mb-2">Sign up for our newsletter</label>
            <div className="flex">
              <input
                id="newsletter"
                type="email"
                placeholder="E-MAIL ADDRESS"
                className={`flex-1 px-3 py-2 rounded-l text-xs focus:outline-none ${
                  isDarkMode 
                    ? 'bg-black border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button 
                className={`px-6 py-2 rounded-r text-xs font-semibold transition ${
                  isDarkMode 
                    ? 'bg-white text-black hover:bg-gray-100' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                SIGN UP
              </button>
            </div>
          </div>
          {/* Social Icons - Inline with Follow us */}
          <div className="flex items-center gap-4">
            <span className="text-sm whitespace-nowrap">Follow us</span>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/cdtjamaica/" 
                aria-label="Instagram" 
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'} transition-colors duration-200 flex items-center justify-center`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <InstagramIcon sx={{ fontSize: 20, color: isDarkMode ? 'white' : 'white' }} />
              </a>
              <a 
                href="https://www.facebook.com/cdtjamaica/" 
                aria-label="Facebook" 
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'} transition-colors duration-200 flex items-center justify-center`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FacebookIcon sx={{ fontSize: 20, color: isDarkMode ? 'white' : 'white' }} />
              </a>
              <a 
                href="https://www.youtube.com/c/CDTJamaica/videos" 
                aria-label="YouTube" 
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'} transition-colors duration-200 flex items-center justify-center`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <YouTubeIcon sx={{ fontSize: 20, color: isDarkMode ? 'white' : 'white' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Row: CDT copyright and developer credit */}
      <div className="mt-12 border-t border-gray-800 pt-4 flex flex-col items-center text-xs text-gray-400">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CDT Arts Ltd. All rights reserved.
          <span className="block sm:inline-block mt-1 sm:mt-0 sm:ml-2 text-sm">
            Developed by Andre Walters
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
