import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PerformanceDetail = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
      <div className="text-center">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Performance Details</h1>
        <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This page is currently disabled.</p>
        <Link to="/" className="text-orange-500 hover:text-orange-400 mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PerformanceDetail;
