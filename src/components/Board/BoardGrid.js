import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import BoardMemberCard from './BoardMemberCard';
import { getBoardMembers, getFeaturedBoardMembers } from '../../lib/boardMembers';

const BoardGrid = ({ featuredOnly = false, title = "Board of Directors" }) => {
  const { isDarkMode } = useTheme();
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  useEffect(() => {
    const fetchBoardMembers = async () => {
      try {
        const data = featuredOnly ? await getFeaturedBoardMembers() : await getBoardMembers();
        setBoardMembers(data);
      } catch (error) {
        console.error('Error fetching board members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardMembers();
  }, [featuredOnly]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className={`mt-4 text-xl ${mutedText}`}>Loading board members...</p>
      </div>
    );
  }

  if (boardMembers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className={`text-xl ${mutedText}`}>
          {featuredOnly ? 'No featured board members found.' : 'No board members found.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`py-12 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={`text-3xl md:text-4xl font-bold uppercase mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {title}
          </h2>
          <div className={`w-20 h-1 bg-orange-500 mx-auto`}></div>
        </motion.div>

        {/* Board Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boardMembers.map((boardMember, index) => (
            <BoardMemberCard key={boardMember._id} boardMember={boardMember} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardGrid;
