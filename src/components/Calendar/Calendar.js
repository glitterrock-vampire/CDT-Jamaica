import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Calendar = ({ performances }) => {
  const { isDarkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'

  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format month name
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Get performances for a specific date
  const getPerformancesForDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    return performances.filter(performance => {
      const performanceDate = new Date(performance.date).toISOString().split('T')[0];
      return performanceDate === dateStr;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // List view - group performances by date
  const getPerformancesGroupedByDate = () => {
    const grouped = {};
    
    performances.forEach(performance => {
      const date = new Date(performance.date);
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(performance);
    });

    return Object.entries(grouped).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();

  return (
    <div className="py-8">
      {/* Calendar Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={previousMonth}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <h2 className={`text-2xl font-bold font-heading ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {formatMonth(currentDate)}
          </h2>

          <motion.button
            onClick={nextMonth}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className={`inline-flex rounded-lg border ${borderColor} p-1`}>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-orange-500 text-white'
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'month' ? (
            <motion.div
              key="month"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Month View */}
              <div className={`border ${borderColor} rounded-lg overflow-hidden ${cardBg}`}>
                {/* Week days header */}
                <div className="grid grid-cols-7 border-b ${borderColor}">
                  {weekDays.map(day => (
                    <div key={day} className={`p-3 text-center text-sm font-medium ${mutedText}`}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    const dayPerformances = day ? getPerformancesForDate(day) : [];
                    const hasPerformance = dayPerformances.length > 0;
                    const isToday = day === new Date().getDate() && 
                                   currentDate.getMonth() === new Date().getMonth() && 
                                   currentDate.getFullYear() === new Date().getFullYear();

                    return (
                      <motion.div
                        key={index}
                        className={`min-h-[80px] p-2 border-r ${borderColor} ${
                          day ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
                        } ${isToday ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
                        onClick={() => day && setSelectedDate(day)}
                        whileHover={day ? { scale: 1.02 } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        {day && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${
                              isToday ? 'text-orange-600 dark:text-orange-400' : 
                              isDarkMode ? 'text-white' : 'text-black'
                            }`}>
                              {day}
                            </div>
                            {hasPerformance && (
                              <div className="space-y-1">
                                {dayPerformances.slice(0, 2).map((perf, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs p-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded truncate"
                                  >
                                    {perf.title}
                                  </div>
                                ))}
                                {dayPerformances.length > 2 && (
                                  <div className="text-xs text-orange-600 dark:text-orange-400">
                                    +{dayPerformances.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* List View */}
              <div className="space-y-4">
                {getPerformancesGroupedByDate().length > 0 ? (
                  getPerformancesGroupedByDate().map(([dateStr, dayPerformances], index) => (
                    <motion.div
                      key={dateStr}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`border ${borderColor} rounded-lg p-4 ${cardBg}`}
                    >
                      <h3 className={`text-lg font-semibold mb-3 font-heading ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {dateStr}
                      </h3>
                      <div className="space-y-3">
                        {dayPerformances.map((performance, perfIndex) => (
                          <div
                            key={performance._id}
                            className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                          >
                            <div>
                              <div className="font-medium">{performance.title}</div>
                              <div className={`text-sm ${mutedText}`}>
                                {performance.company} • {performance.time} • {performance.venue}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs ${mutedText}`}>{performance.category}</div>
                              {performance.ticketUrl && (
                                <a
                                  href={performance.ticketUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-1 px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
                                >
                                  Tickets
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className={`text-xl ${mutedText}`}>No performances scheduled</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;
