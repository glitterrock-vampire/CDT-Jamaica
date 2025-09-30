import React from 'react';
import { urlFor } from '../lib/sanity';

export const Hero = ({ image, title, subtitle, children }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
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
              src={urlFor(image).width(1200).url()}
              srcSet={`
                ${urlFor(image).width(800).url()} 800w,
                ${urlFor(image).width(1200).url()} 1200w,
                ${urlFor(image).width(1920).url()} 1920w
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 flex flex-col items-start justify-center text-white px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-normal tracking-wide mb-6 text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                {title}
              </h1>
              {subtitle && (
                <p className="font-sans text-xl md:text-2xl lg:text-3xl text-left text-white font-light leading-relaxed" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
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
