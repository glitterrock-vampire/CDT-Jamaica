import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.youtube.com/embed/zby-l0-XkBc?autoplay=1&mute=1&loop=1&playlist=zby-l0-XkBc&controls=0&showinfo=0&rel=0&modestbranding=1"
          className="w-full h-full object-cover"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Company Dance Video"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
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
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tight leading-none font-sans">
         THE COMPANY
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
