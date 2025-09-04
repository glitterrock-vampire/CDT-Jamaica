import React from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiList,
  FiUser,
  FiCalendar,
  FiTag,
  FiClock,
  FiMusic,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

const sortOptions = [
  { id: 'title-asc', label: 'Title (A-Z)', icon: <FiList className="mr-2" /> },
  { id: 'title-desc', label: 'Title (Z-A)', icon: <FiList className="mr-2" /> },
  { id: 'composer-asc', label: 'Composer (A-Z)', icon: <FiUser className="mr-2" /> },
  { id: 'composer-desc', label: 'Composer (Z-A)', icon: <FiUser className="mr-2" /> },
  { id: 'year-desc', label: 'Year (Newest first)', icon: <FiCalendar className="mr-2" /> },
  { id: 'year-asc', label: 'Year (Oldest first)', icon: <FiCalendar className="mr-2" /> },
  { id: 'category-asc', label: 'Category (A-Z)', icon: <FiTag className="mr-2" /> },
  { id: 'category-desc', label: 'Category (Z-A)', icon: <FiTag className="mr-2" /> },
  { id: 'duration-asc', label: 'Duration (Shortest first)', icon: <FiClock className="mr-2" /> },
  { id: 'duration-desc', label: 'Duration (Longest first)', icon: <FiClock className="mr-2" /> },
  { id: 'instruments-asc', label: 'Instruments (A-Z)', icon: <FiMusic className="mr-2" /> },
  { id: 'instruments-desc', label: 'Instruments (Z-A)', icon: <FiMusic className="mr-2" /> },
];

const RepertoireControls = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  const [showSort, setShowSort] = React.useState(false);
  
  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.id === sortBy);
    return option ? option.label : 'Sort by...';
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
      {/* Search - Left aligned */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search repertoire by title, composer, or instruments..."
          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <FiX className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Sort - Right aligned */}
      <div className="relative">
        <button
          onClick={() => setShowSort(!showSort)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          aria-haspopup="true"
          aria-expanded={showSort}
        >
          <FiFilter className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{getSortLabel()}</span>
          {showSort ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </button>

        {/* Sort Dropdown */}
        {showSort && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sort by
              </div>
              {sortOptions.map((option) => {
                const isSelected = sortBy === option.id;
                const order = sortBy.endsWith('-asc') ? 'asc' : 'desc';
                
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setShowSort(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.icon}
                    <span className="flex-1">{option.label}</span>
                    {isSelected && (
                      <span className="text-blue-500">
                        {order === 'asc' ? <FiTrendingUp /> : <FiTrendingDown />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepertoireControls;
