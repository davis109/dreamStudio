import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StoryCard = ({ story, onDelete }) => {
  const { id, title, style, created_at, scenes = [] } = story;
  
  // Get the first scene's image as the cover image
  const coverImage = scenes.length > 0 && scenes[0].image_url ? scenes[0].image_url : 'https://via.placeholder.com/300x200?text=No+Image';
  
  // Format the date
  const formattedDate = new Date(created_at).toLocaleDateString();
  
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
    >
      <Link to={`/view-story/${id}`} className="flex-grow flex flex-col">
        <div className="relative h-48">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium capitalize">
            {style}
          </div>
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
            
            <span className="mx-2">•</span>
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{scenes.length} scenes</span>
          </div>
        </div>
      </Link>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
        <Link 
          to={`/view-story/${id}`}
          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
        >
          View
        </Link>
        
        <Link 
          to={`/edit-story/${id}`}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Edit
        </Link>
        
        <button 
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default StoryCard;