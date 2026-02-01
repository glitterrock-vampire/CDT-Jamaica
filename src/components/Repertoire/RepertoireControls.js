import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiList,
  FiUser,
  FiCalendar
} from 'react-icons/fi';

const sortOptions = [
  { id: 'title-asc', label: 'Title (A-Z)', icon: <FiList className="mr-2" /> },
  { id: 'title-desc', label: 'Title (Z-A)', icon: <FiList className="mr-2" /> },
  { id: 'choreographer-asc', label: 'Choreographer (A-Z)', icon: <FiUser className="mr-2" /> },
  { id: 'choreographer-desc', label: 'Choreographer (Z-A)', icon: <FiUser className="mr-2" /> },
  { id: 'year-desc', label: 'Year (Newest first)', icon: <FiCalendar className="mr-2" /> },
  { id: 'year-asc', label: 'Year (Oldest first)', icon: <FiCalendar className="mr-2" /> }
];

const RepertoireControls = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  const { isDarkMode } = useTheme();
  const [showSort, setShowSort] = React.useState(false);
  
  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.id === sortBy);
    return option ? option.label : 'Sort by...';
  };

  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
      {/* Search - Left aligned */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className={mutedText} />
        </div>
        <input
          type="text"
          placeholder="Search by title, choreographer, or year..."
          className={`pl-10 pr-4 py-2 border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent w-full ${cardBg} ${isDarkMode ? 'text-white' : 'text-black'} transition-colors duration-200`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <FiX className={`${mutedText} hover:text-orange-500 transition-colors`} />
          </button>
        )}
      </div>

      {/* Sort - Right aligned */}
      <div className="relative">
        <button
          onClick={() => setShowSort(!showSort)}
          className={`flex items-center space-x-2 px-4 py-2 border ${borderColor} ${cardBg} rounded-md hover:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-200`}
          aria-haspopup="true"
          aria-expanded={showSort}
        >
          <FiFilter className={mutedText} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{getSortLabel()}</span>
          {showSort ? (
            <FiChevronUp className={mutedText} />
          ) : (
            <FiChevronDown className={mutedText} />
          )}
        </button>

        {/* Sort Dropdown */}
        {showSort && (
          <div className={`absolute right-0 mt-2 w-64 ${cardBg} rounded-md shadow-lg z-10 border ${borderColor}`}>
            <div className="py-1">
              <div className={`px-4 py-2 text-xs font-semibold ${mutedText} uppercase tracking-wider`}>
                Sort by
              </div>
              {sortOptions.map((option) => {
                const isSelected = sortBy === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setShowSort(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
                      isSelected
                        ? `${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`}
                  >
                    <span className={isSelected ? 'text-orange-500' : ''}>
                      {option.icon}
                    </span>
                    {option.label}
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