import React from 'react';
import { urlFor } from '../lib/sanity';

export const Hero = ({ image, title, subtitle, children }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  // Function to get image URL - handles both Sanity assets and regular URLs
  const getImageUrl = (img, width = 1200) => {
    if (!img) return '';
    
    // If it's a regular URL (has url property), return it directly
    if (img.url && typeof img.url === 'string') {
      return img.url;
    }
    
    // If it's a Sanity image asset, use urlFor
    try {
      return urlFor(img).width(width).url();
    } catch (error) {
      console.warn('Unable to resolve image URL, using fallback:', error);
      return img.url || '';
    }
  };
  
  return (
    <div className="relative w-full h-auto min-h-[60vh] overflow-hidden">
      {image && (
        <div className="relative w-full h-full">
          <div className="w-full h-[60vh] overflow-hidden">
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="text-gray-400 dark:text-gray-500">Loading image...</div>
              </div>
            )}
            <img
              src={getImageUrl(image, 1200)}
              srcSet={`
                ${getImageUrl(image, 800)} 800w,
                ${getImageUrl(image, 1200)} 1200w,
                ${getImageUrl(image, 1920)} 1920w
              `}
              sizes="100vw"
              alt={image.alt || 'Hero Image'}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error('Error loading hero image:', image);
                e.target.style.display = 'none';
                setImageLoaded(true);
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl w-full">
              <h1 className="font-nova-slim text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight mb-6 text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                {title}
              </h1>
              {subtitle && (
                <p className="font-raleway text-3xl md:text-4xl lg:text-5xl text-left text-white font-light leading-tight tracking-wide" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                  {subtitle}
                </p>
              )}
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;