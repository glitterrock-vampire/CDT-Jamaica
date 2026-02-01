import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image Collage */}
      <div className="absolute inset-0 flex">
        {/* Left panels */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800" 
            alt="Dance performance"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        
        {/* Center - darker */}
        <div className="flex-1 relative bg-black/90">
          <img 
            src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800" 
            alt="Historical dance"
            className="w-full h-full object-cover opacity-30 grayscale"
          />
        </div>
        
        {/* Right panels */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1547153760-18fc86324498?w=800" 
            alt="Dance performance"
            className="w-full h-full object-cover opacity-70 hue-rotate-15"
          />
        </div>
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20" />
      
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-24 left-8 md:left-16 z-30"
      >
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tight leading-none font-['Inter']">
          OUR STORY
        </h1>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
