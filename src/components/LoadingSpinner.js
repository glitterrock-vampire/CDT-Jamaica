import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/loading-spinner.css';

const LoadingSpinner = () => {
  const { isDarkMode } = useTheme();
  const primaryColor = isDarkMode ? '#FFFFFF' : '#000000';
  const accentColor = isDarkMode ? '#FF3D00' : '#FF3D00';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-50 z-50">
      <div className="loader" style={{
        '--primary-color': primaryColor,
        '--accent-color': accentColor
      }}></div>
    </div>
  );
};

export default LoadingSpinner;
