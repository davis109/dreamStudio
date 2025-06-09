import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { storyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'oldest'
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await storyApi.getUserStories();
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
        toast.error('Failed to load your stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await storyApi.deleteStory(storyId);
        setStories(stories.filter(story => story.id !== storyId));
        toast.success('Story deleted successfully');
      } catch (error) {
        console.error('Error deleting story:', error);
        toast.error('Failed to delete story');
      }
    }
  };

  const filteredStories = () => {
    switch (filter) {
      case 'recent':
        return [...stories].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return [...stories].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      default:
        return stories;
    }
  };

  // For demo purposes, let's create some placeholder stories
  const placeholderStories = [
    {
      id: '1',
      title: 'The Enchanted Forest',
      created_at: '2023-11-15T10:30:00Z',
      scene_count: 5,
      style: 'fantasy',
      cover_image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Enchanted+Forest',
    },
    {
      id: '2',
      title: 'Journey to the Stars',
      created_at: '2023-11-10T14:20:00Z',
      scene_count: 3,
      style: 'sci-fi',
      cover_image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Space+Journey',
    },
    {
      id: '3',
      title: 'The Lost City',
      created_at: '2023-11-05T09:15:00Z',
      scene_count: 4,
      style: 'adventure',
      cover_image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Lost+City',
    },
  ];

  const displayStories = stories.length > 0 ? filteredStories() : placeholderStories;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Your Stories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all your created stories
          </p>
        </motion.div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            className="input-field py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Stories</option>
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
          
          <Link
            to="/create"
            className="btn-primary flex items-center justify-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Story
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : displayStories.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-gray-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stories</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new story.</p>
          <div className="mt-6">
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Story
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStories.map((story, index) => (
            <motion.div
              key={story.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={story.cover_image}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {story.scene_count} scenes
                  </span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{story.style}</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/stories/${story.id}`}
                    className="flex-1 btn-primary py-2 text-sm text-center"
                  >
                    View
                  </Link>
                  <Link
                    to={`/stories/${story.id}/edit`}
                    className="flex-1 btn-outline py-2 text-sm text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;