import React from 'react';
import { urlFor } from '../lib/sanity';

export const Hero = ({ image, title, subtitle, children }) => {
  return (
    <div className="relative w-full h-auto min-h-[60vh] overflow-hidden">
      {image && (
        <div className="relative w-full h-full">
          <div className="w-full h-[60vh] overflow-y-auto">
            <img
              src={urlFor(image).width(1920).url()}
              alt={image.alt || 'Hero Image'}
              className="w-full min-h-full object-contain"
              onError={(e) => {
                console.error('Error loading hero image:', image);
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 flex flex-col items-start justify-center text-white px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl">
              <h1 className="ailey-hero-title">{title}</h1>
              {subtitle && <p className="text-lg md:text-xl text-left text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{subtitle}</p>}
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
