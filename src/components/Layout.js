import React from 'react';
import Navbar from './Navbar';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
    }`}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <main className="flex-grow pt-20">
        {children}
      </main>
      <footer className={`${
        isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-900'
      } py-8 mt-16 transition-colors duration-300`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CDT Arts Ltd. All rights reserved.
            <span className="block sm:inline-block mt-1 sm:mt-0 sm:ml-2">
              Developed by Andre Walters
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
