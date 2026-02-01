import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const resources = [
  {
    title: 'History',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600',
    link: '#'
  },
  {
    title: 'Blog',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600',
    link: '#'
  },
  {
    title: 'Press',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600',
    link: '#'
  }
];

export default function ResourcesSection() {
  return (
    <section id="resources" className="bg-zinc-900 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[#9B8B3D] text-sm font-bold tracking-[0.3em] uppercase mb-4">Resources</h2>
          <p className="text-white text-2xl md:text-3xl font-light">
            Learn more about CDT Jamaica's history and keep up to date with our latest news.
          </p>
        </motion.div>
        
        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.a
              key={resource.title}
              href={resource.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden block"
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold flex items-center gap-3 group-hover:text-[#9B8B3D] transition-colors">
                    {resource.title}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </h3>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
