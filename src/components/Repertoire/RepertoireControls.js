import React from 'react';
import { FiSearch, FiX, FiChevronDown, FiUser, FiCalendar, FiList } from 'react-icons/fi';

const sortOptions = [
  { id: 'title-asc', label: 'Title A-Z', icon: <FiList className="mr-2" /> },
  { id: 'title-desc', label: 'Title Z-A', icon: <FiList className="mr-2" /> },
  { id: 'year-desc', label: 'Year Newest', icon: <FiCalendar className="mr-2" /> },
  { id: 'year-asc', label: 'Year Oldest', icon: <FiCalendar className="mr-2" /> },
];

const choreographerOptions = [
  { id: 'all', label: 'All Choreographers' },
  { id: 'tony-wilson', label: 'Tony Wilson' },
  { id: 'other', label: 'Other' },
];

const RepertoireControls = ({ searchTerm, setSearchTerm, sortBy, setSortBy, choreographer, setChoreographer }) => {
  const [showSort, setShowSort] = React.useState(false);
  const [showChoreographer, setShowChoreographer] = React.useState(false);
  
  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.id === sortBy);
    return option ? option.label : 'Sort by...';
  };

  const getChoreographerLabel = () => {
    const option = choreographerOptions.find(opt => opt.id === choreographer);
    return option ? option.label : 'Choreographer...';
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            aria-label="Clear search"
          >
            <FiX className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Choreographer Filter */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setShowChoreographer(!showChoreographer);
              setShowSort(false);
            }}
            className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            aria-haspopup="true"
            aria-expanded={showChoreographer}
          >
            <span className="text-gray-700 dark:text-gray-200">{getChoreographerLabel()}</span>
            <FiChevronDown className={`text-gray-500 transition-transform duration-200 ${showChoreographer ? 'rotate-180' : ''}`} />
          </button>

          {/* Choreographer Dropdown */}
          {showChoreographer && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div className="py-2">
                {choreographerOptions.map((option) => {
                  const isSelected = choreographer === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setChoreographer(option.id);
                        setShowChoreographer(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm transition-colors duration-200 $
                        {isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setShowSort(!showSort);
              setShowChoreographer(false);
            }}
            className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            aria-haspopup="true"
            aria-expanded={showSort}
          >
            <span className="text-gray-700 dark:text-gray-200">{getSortLabel()}</span>
            <FiChevronDown className={`text-gray-500 transition-transform duration-200 ${showSort ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort Dropdown */}
          {showSort && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div className="py-2">
                {sortOptions.map((option) => {
                  const isSelected = sortBy === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSort(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm transition-colors duration-200 $
                        {isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepertoireControls;
