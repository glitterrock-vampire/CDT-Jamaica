import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Filter, ChevronRight } from 'lucide-react';
import { Hero } from '../components/Hero';

// Sample performance data - replace with your Sanity CMS data
const performanceData = [
  {
    id: 1,
    title: "Caribbean Fusion",
    company: "CDT Senior Company",
    date: "2026-02-15",
    time: "7:30 PM",
    venue: "National Dance Theatre Company",
    location: "Kingston, Jamaica",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop",
    description: "An electrifying showcase of contemporary Caribbean dance traditions",
    category: "Main Stage"
  },
  {
    id: 2,
    title: "Rhythm & Movement",
    company: "CDT Junior Company",
    date: "2026-02-22",
    time: "6:00 PM",
    venue: "Little Theatre",
    location: "Kingston, Jamaica",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop",
    description: "Young dancers bring fresh energy to classical and modern pieces",
    category: "Youth Performance"
  },
  {
    id: 3,
    title: "Island Stories",
    company: "CDT Senior Company",
    date: "2026-03-08",
    time: "7:30 PM",
    venue: "Ranny Williams Entertainment Centre",
    location: "Kingston, Jamaica",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop",
    description: "Dance narratives celebrating Jamaican heritage and culture",
    category: "Main Stage"
  },
  {
    id: 4,
    title: "Spring Showcase",
    company: "CDT All Companies",
    date: "2026-03-29",
    time: "5:00 PM",
    venue: "National Dance Theatre Company",
    location: "Kingston, Jamaica",
    image: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&h=600&fit=crop",
    description: "Annual spring presentation featuring all CDT companies",
    category: "Showcase"
  }
];

const categories = ["All", "Main Stage", "Youth Performance", "Showcase", "Workshop"];

export default function PerformancesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filteredPerformances = selectedCategory === "All" 
    ? performanceData 
    : performanceData.filter(p => p.category === selectedCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return { month, day, weekday };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      {/* Hero Section */}
      <Hero
        image={{
          url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1920&h=1080&fit=crop",
          alt: "CDT Dance Performance"
        }}
        title="Performances"
        subtitle="Experience the power of dance that celebrates Caribbean culture and inspires audiences worldwide"
      />

      {/* Filter Section */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto py-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-dark-muted flex-shrink-0" />
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-dark hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Performances Grid */}
      <div className="container py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPerformances.map((performance, index) => {
              const { month, day, weekday } = formatDate(performance.date);
              
              return (
                <motion.div
                  key={performance.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(performance.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group cursor-pointer bg-white dark:bg-dark-surface rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={performance.image}
                      alt={performance.title}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredCard === performance.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-white dark:bg-dark-surface rounded-lg shadow-lg p-3 text-center min-w-[70px]">
                      <div className="text-xs font-semibold text-primary uppercase">{month}</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-dark">{day}</div>
                      <div className="text-xs text-gray-500 dark:text-dark-muted uppercase">{weekday}</div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {performance.category}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-primary">
                        {performance.company}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-dark mb-3 group-hover:text-primary transition-colors font-amarante">
                      {performance.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-dark-muted mb-4 line-clamp-2">
                      {performance.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{performance.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{performance.venue}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredPerformances.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-gray-500 dark:text-dark-muted">No performances found in this category.</p>
          </motion.div>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-nova-slim">
              Join Us for an Unforgettable Experience
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-raleway">
              CDT performances celebrate Caribbean dance traditions while pushing artistic boundaries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors font-raleway"
              >
                View Full Calendar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors font-raleway"
              >
                Subscribe for Updates
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-dark-surface py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark mb-8 text-center font-nova-slim">
            Performance FAQs
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "How can I purchase tickets?",
                a: "Tickets can be purchased online through our ticketing partner or at the venue box office on the day of the performance, subject to availability."
              },
              {
                q: "What should I wear to a performance?",
                a: "We welcome all patrons to dress according to their comfort level. Some choose smart casual while others prefer more formal attire."
              },
              {
                q: "Are there group discounts available?",
                a: "Yes! Groups of 10 or more can receive special rates. Contact our box office for more information on group bookings."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-gray-200 dark:border-gray-700 pb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark mb-2 font-raleway">{faq.q}</h3>
                <p className="text-gray-600 dark:text-dark-muted font-raleway">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
