import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/Hero';
import { getUpcomingPerformances, getFeaturedPerformance } from '../lib/performances';
import { getSiteSettings, urlFor } from '../lib/sanity';
import { getFeaturedDancers } from '../lib/dancers';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [upcomingPerformances, setUpcomingPerformances] = useState([]);
  const [featuredPerformance, setFeaturedPerformance] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [featuredDancers, setFeaturedDancers] = useState([]);

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';
  const secondaryBg = isDarkMode ? 'bg-neutral-900' : 'bg-gray-50';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcoming, featured, settings, dancers] = await Promise.all([
          getUpcomingPerformances(),
          getFeaturedPerformance(),
          getSiteSettings(),
          getFeaturedDancers()
        ]);
        setUpcomingPerformances(upcoming || []);
        setFeaturedPerformance(featured);
        setSiteSettings(settings);
        setFeaturedDancers(dancers || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section */}
      <Hero
        image={{
          url: "/images/CDT Streams Photo.jpg",
          alt: "CDT Streams Performance - Company Dance Theatre Jamaica"
        }}
        title="Celebrating"
        subtitle="dance in Jamaica."
      />

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 w-full max-w-6xl py-10 md:py-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Featured Performance Section */}
        <header className={`border-b ${borderColor} pb-10 md:pb-14`}>
          <div className="grid gap-10 md:gap-12 md:grid-cols-[2fr,1.4fr] items-stretch">
            {/* Left column */}
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <motion.div
                  className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  Season 2026 · Kingston, Jamaica
                </motion.div>
                <motion.p
                  className={`text-sm md:text-base max-w-xl leading-relaxed ${mutedText}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Company Dance Theatre Jamaica presents a season of new and classic works in conversation with
                  Caribbean sound, space, and history.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <a
                    href={featuredPerformance?.ticketUrl || "https://www.linktr.ee/cdtjamaica"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border border-transparent bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                  >
                    Buy Tickets
                  </a>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border ${borderColor} ${
                      isDarkMode ? 'bg-transparent text-white hover:bg-white/5' : 'bg-transparent text-black hover:bg-gray-100'
                    } transition-colors`}
                  >
                    Play trailer
                  </button>
                </motion.div>
              </div>

              <motion.div
                className="text-[11px] mt-4 md:mt-0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className={`border-t ${borderColor} pt-2 flex items-center justify-between ${mutedText}`}>
                  <span className="tracking-[0.12em] uppercase">Featured performance</span>
                  <span className="tracking-[0.12em] uppercase text-xs text-inherit">
                    {featuredPerformance 
                      ? `${new Date(featuredPerformance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${featuredPerformance.time}`
                      : 'TBA'
                    }
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Hero Poster */}
            <motion.div
              className={`border ${borderColor} ${secondaryBg} h-[380px] md:h-[420px] grid grid-rows-[auto,1fr,auto]`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <div className={`px-3 py-2 text-[10px] tracking-[0.12em] uppercase flex items-center justify-between border-t ${borderColor}`}>
                <span>{featuredPerformance?.title || 'Featured Performance'}</span>
                <span>{featuredPerformance?.venue || 'Venue'}</span>
              </div>
              <div className="relative overflow-hidden">
                {featuredPerformance?.image ? (
                  <Link to={`/performance/${featuredPerformance.slug?.current || featuredPerformance._id}`}>
                    <img
                      src={featuredPerformance.image?.asset?.url || featuredPerformance.image?.url}
                      alt={featuredPerformance.image.alt || 'Featured performance'}
                      className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-300 cursor-pointer"
                    />
                  </Link>
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${mutedText} ${secondaryBg}`}>
                    <span className="text-sm">No featured performance image</span>
                  </div>
                )}
              </div>
              <div className={`px-3 py-2 text-[10px] tracking-[0.12em] uppercase flex items-center justify-between border-t ${borderColor}`}>
                <span>
                  {featuredPerformance 
                    ? new Date(featuredPerformance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Date'
                  }
                </span>
                <span>{featuredPerformance?.venue || 'Venue'}</span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ABOUT / MISSION */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="grid gap-10 md:grid-cols-2 items-start">
            <div className="space-y-3">
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                About Us
              </motion.div>
              <motion.div
                className="text-2xl md:text-3xl uppercase leading-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Moving the Caribbean forward through the language of dance.
              </motion.div>
            </div>
            <div className="space-y-4">
              <motion.p
                className={`text-sm md:text-base leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Founded in 1995, CDT Jamaica has grown into the region&apos;s premier contemporary dance company. We are
                dedicated to creating works that reflect the complexity, beauty, and resilience of our culture.
              </motion.p>
              <motion.div
                className={`flex flex-wrap gap-6 pt-4 mt-2 border-t ${borderColor}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl">30+</div>
                  <div className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>Years Active</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl">120</div>
                  <div className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>Original Works</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl">15k</div>
                  <div className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>Students Taught</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ON STAGE / EVENTS */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col gap-8">
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
            >
              <div>
                <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>On stage</div>
                <div className="text-xl md:text-2xl uppercase">Upcoming Performances</div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.36 }}
              >
                <Link
                  to="/performances"
                  className={`text-[10px] tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} inline-block`}
                >
                  Full calendar →
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">
              {upcomingPerformances.slice(0, 3).map((perf, index) => {
                const dateObj = new Date(perf.date);
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const day = dateObj.getDate();
                return (
                  <Link
                    key={perf._id}
                    to={`/performance/${perf.slug?.current || perf._id}`}
                    className="block group"
                  >
                    <motion.div
                      className={`grid grid-rows-[auto,auto,1fr,auto] gap-3 p-3 border ${borderColor} ${cardBg} hover:border-orange-500/50 transition-all duration-300 cursor-pointer`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.38 + index * 0.04 }}
                    >
                      <motion.div
                        className={`flex justify-between text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.04 }}
                      >
                        <span>{perf.category}</span>
                        <span>{month} {day}</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.42 + index * 0.04 }}
                      >
                        <div className="text-sm font-semibold uppercase mb-1">{perf.title}</div>
                        <div className={`text-[11px] ${mutedText}`}>{perf.venue} · {perf.location}</div>
                        <div className={`mt-3 h-40 border ${borderColor} overflow-hidden`}>
                          <img
                            src={perf.image?.asset?.url || perf.image?.url}
                            alt={perf.image?.alt || perf.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      </motion.div>
                      <motion.p
                        className={`text-xs leading-snug ${mutedText}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.44 + index * 0.04 }}
                      >
                        {perf.description}
                      </motion.p>
                      <motion.button
                        type="button"
                        className={`mt-1 inline-flex items-center justify-center w-full px-4 py-2 text-[10px] tracking-[0.16em] uppercase border ${borderColor} ${
                          isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                        } transition-colors`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.46 + index * 0.04 }}
                      >
                        Get Tickets
                      </motion.button>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* THE COMPANY / DANCERS */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="flex flex-col gap-8">
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.37 }}
            >
              <div>
                <motion.div
                  className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.39 }}
                >
                  The Company
                </motion.div>
                <motion.div
                  className="text-xl md:text-2xl uppercase"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.41 }}
                >
                  Meet the Company
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.43 }}
              >
                <Link
                  to="/company"
                  className={`text-[10px] tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText} inline-block`}
                >
                  Full roster →
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {featuredDancers.slice(0, 6).map((dancer, index) => (
                <motion.div
                  key={dancer._id}
                  className={`flex flex-col gap-2 border ${borderColor} ${cardBg} p-3 group cursor-pointer`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.36 + index * 0.04 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`relative w-full pb-[120%] overflow-hidden ${secondaryBg}`}>
                    {dancer.headshot ? (
                      <img
                        src={dancer.headshot.asset?.url}
                        alt={dancer.headshot.alt || dancer.name}
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className={`absolute inset-0 w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No photo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] tracking-[0.05em] uppercase mt-2 group-hover:text-orange-500 transition-colors">
                    {dancer.name}
                  </div>
                  {dancer.role && (
                    <div className={`text-[9px] ${mutedText}`}>
                      {dancer.role}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* SUPPORT TEASER */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Philanthropy / Patron Programme */}
            <motion.div
              className={`flex flex-col items-center text-center gap-4 p-8 border ${borderColor} ${secondaryBg}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
            >
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.44 }}
              >
                Philanthropy
              </motion.div>
              <motion.div
                className="text-lg md:text-xl uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.46 }}
              >
                Patron Programme
              </motion.div>
              <motion.p
                className={`text-sm max-w-md leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.48 }}
              >
                Join a community of supporters who believe in the power of dance to transform lives. Benefits include
                rehearsal access and priority booking.
              </motion.p>
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border ${borderColor} ${
                  isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                } transition-colors`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                Learn more
              </motion.button>
            </motion.div>

            {/* Education / Scholarship Fund */}
            <motion.div
              className={`flex flex-col items-center text-center gap-4 p-8 border ${borderColor} ${
                isDarkMode ? 'border-dashed bg-black' : 'border-dashed bg-white'
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44 }}
            >
              <motion.div
                className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.46 }}
              >
                Education
              </motion.div>
              <motion.div
                className="text-lg md:text-xl uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.48 }}
              >
                Scholarship Fund
              </motion.div>
              <motion.p
                className={`text-sm max-w-md leading-relaxed ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                Help us identify and train the next generation of Caribbean dance artists, regardless of their
                financial background.
              </motion.p>
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border ${borderColor} ${
                  isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                } transition-colors`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.52 }}
              >
                Donate now
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* SCHOOL / TRAINING */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] items-center">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.47 }}
            >
              <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>The school</div>
              <h2 className="text-2xl md:text-3xl uppercase">Training for all ages.</h2>
              <p className={`text-sm md:text-base max-w-md leading-relaxed ${mutedText}`}>
                From first steps to pre-professional study, CDT Jamaica School offers programmes in contemporary, ballet,
                and Jamaican folk forms led by working artists.
              </p>
              <div className="space-y-2 text-sm mt-4">
                {[
                  { label: 'Junior division', meta: 'Ages 4–10' },
                  { label: 'Pre-professional', meta: 'Ages 11–18' },
                  { label: 'Adult open', meta: 'Evenings + weekends' }
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between pb-2 border-b ${borderColor}`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[11px] tracking-[0.12em] uppercase ${mutedText}`}>{item.meta}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border ${borderColor} ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                  } transition-colors`}
                >
                  Class schedule
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center px-6 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase border border-transparent ${
                    isDarkMode ? 'text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Faculty list
                </button>
              </div>
            </motion.div>
            <motion.div
              className={`relative h-80 md:h-96 border ${borderColor} overflow-hidden ${secondaryBg}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <img
                src="https://storage.googleapis.com/banani-generated-images/generated-images/5af85720-d5f2-47cd-ae66-b06199a02abb.jpg"
                alt="School rehearsal"
                className="w-full h-full object-cover grayscale"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* NEWS / SIGNALS */}
        <motion.section
          className={`py-10 md:py-14 border-b ${borderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col gap-8">
            {/* Header */}
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.52 }}
            >
              <div>
                <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Signals</div>
                <div className="text-xl md:text-2xl uppercase">News + archive</div>
              </div>
              <motion.button
                type="button"
                className={`text-[10px] tracking-[0.12em] uppercase underline-offset-2 hover:underline ${mutedText}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.56 }}
              >
                Open archive index →
              </motion.button>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-[2fr,1.2fr] items-start">
              {/* Video log card */}
              <motion.div
                className={`grid grid-rows-[auto,1fr,auto] border ${borderColor} ${cardBg}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.58 }}
              >
                <motion.div
                  className={`flex items-center justify-between px-3 py-2 text-[10px] tracking-[0.12em] uppercase border-b ${borderColor} ${mutedText}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <span>Video log 07</span>
                  <span>Play</span>
                </motion.div>
                <motion.div
                  className="relative overflow-hidden min-h-[220px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.62 }}
                >
                  <img
                    src="https://storage.googleapis.com/banani-generated-images/generated-images/a462e780-9779-4d37-8f9b-2e99bbe0dc2b.jpg"
                    alt="Studio log"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="px-3 py-3 space-y-1"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.64 }}
                >
                  <div className="text-sm font-medium">Studio notes: Island Pulse</div>
                  <div className={`text-[11px] ${mutedText}`}>Rehearsal footage · 06 min</div>
                </motion.div>
              </motion.div>

              {/* Side cards */}
              <div className="flex flex-col gap-4">
                {/* Press card */}
                <motion.div
                  className={`p-4 border ${borderColor} ${cardBg} flex flex-col gap-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Press</div>
                  <div className="text-sm leading-snug">
                    "A bold reimagining of what Caribbean dance can be in the 21st century."
                  </div>
                  <div className="text-xs mt-1">— The Jamaica Gleaner</div>
                </motion.div>

                {/* Announcement card */}
                <motion.div
                  className={`p-4 border ${borderColor} ${cardBg} flex flex-col gap-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.64 }}
                >
                  <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>
                    Announcement · Aug 12
                  </div>
                  <div className="text-sm font-medium">New artistic director appointed</div>
                  <div className={`text-xs leading-relaxed ${mutedText}`}>
                    Choreographer James Bennett joins CDT Jamaica to lead the 2025–2028 seasons.
                  </div>
                </motion.div>

                {/* Download brochure button */}
                <motion.button
                  type="button"
                  className={`flex items-center justify-between px-3 py-2 text-sm border ${borderColor} ${cardBg} ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                  } transition-colors`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.68 }}
                >
                  <span>Download 2025 Brochure</span>
                  <span className="text-xs">⤓</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* NEWSLETTER (kept simple because global Footer already exists) */}
        <motion.section
          className="py-10 md:py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="max-w-xl space-y-4">
            <div className={`text-[10px] tracking-[0.12em] uppercase ${mutedText}`}>Newsletter</div>
            <div className="text-lg md:text-xl">
              Signals from the studio and stage, once a month.
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch sm:items-center max-w-md mt-2"
            >
              <input
                type="email"
                required
                placeholder="email@address.com"
                className={`flex-1 px-3 py-2 text-sm outline-none border ${borderColor} ${
                  isDarkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-black'
                }`}
              />
              <button
                type="submit"
                className="mt-2 sm:mt-0 sm:ml-0 px-5 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase bg-black text-white border border-black dark:bg-white dark:text-black dark:border-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Home;
