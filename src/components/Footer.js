import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getSiteSettings } from '../lib/siteSettings';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import NewsletterSubscription from './NewsletterSubscription';

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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-8">
          {/* Logo & Navigation */}
          <div className="flex flex-col sm:flex-row gap-12 lg:gap-24 items-start">
            {/* Logo */}
            <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
              {siteSettings && (
                <img
                  src={isDarkMode ? siteSettings?.darkLogo?.asset?.url : siteSettings?.lightLogo?.asset?.url}
                  alt={siteSettings?.title + ' logo'}
                  className="h-24 w-auto mb-2"
                  style={{ maxHeight: '96px' }}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="hover:underline">Home</a></li>
                  <li><a href="/repertoire" className="hover:underline">Repertoire</a></li>
                  <li><a href="/about" className="hover:underline">About Us</a></li>
                  <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter & Social Media */}
          <div className="w-full lg:w-96 mt-8 lg:mt-0">
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            
            {/* Newsletter Subscription */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <NewsletterSubscription />
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <span className="text-sm whitespace-nowrap">Follow us</span>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/cdtjamaica/"
                  aria-label="Instagram"
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'} transition-colors duration-200`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon sx={{ fontSize: 20 }} />
                </a>
                <a
                  href="https://www.facebook.com/cdtjamaica/"
                  aria-label="Facebook"
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'} transition-colors duration-200`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon sx={{ fontSize: 20 }} />
                </a>
                <a
                  href="https://www.youtube.com/c/CDTJamaica/videos"
                  aria-label="YouTube"
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'} transition-colors duration-200`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon sx={{ fontSize: 20 }} />
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
      </div>
    </footer>
  );
};

export default Footer;
