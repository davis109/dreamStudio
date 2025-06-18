import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ViewStory = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [viewMode, setViewMode] = useState('slideshow'); // 'slideshow' or 'all'

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would fetch from the backend
        // For demo purposes, we'll create a mock story
        // const response = await storyApi.getStory(id);
        
        // Mock story data
        const mockStory = {
          id,
          title: 'The Enchanted Forest Adventure',
          style: 'fantasy',
          created_at: new Date().toISOString(),
          scenes: [
            {
              id: 1,
              text: 'Deep within the ancient forest, towering trees with luminescent leaves created a magical canopy overhead. The air was filled with floating specks of light that danced around like curious fireflies.',
              image_url: 'https://via.placeholder.com/512x512/9F7AEA/FFFFFF?text=Fantasy:+Enchanted+Forest',
              sequence: 1
            },
            {
              id: 2,
              text: 'A small cottage appeared between the trees, its windows glowing with warm light. Smoke curled from the chimney, and the door was adorned with strange symbols that seemed to shift and change when looked at directly.',
              image_url: 'https://via.placeholder.com/512x512/9F7AEA/FFFFFF?text=Fantasy:+Magical+Cottage',
              sequence: 2
            },
            {
              id: 3,
              text: 'Inside, an old wizard with a flowing silver beard worked at a table covered in ancient tomes and bubbling potions. His eyes, bright as stars, looked up as if he had been expecting visitors all along.',
              image_url: 'https://via.placeholder.com/512x512/9F7AEA/FFFFFF?text=Fantasy:+Wizard+Workshop',
              sequence: 3
            },
            {
              id: 4,
              text: '"You have come at last," he said with a smile, gesturing to a map that showed a path leading to a crystal mountain. "The journey ahead is perilous, but the fate of our realm depends on your courage."',
              image_url: 'https://via.placeholder.com/512x512/9F7AEA/FFFFFF?text=Fantasy:+Crystal+Mountain',
              sequence: 4
            },
          ]
        };
        
        setStory(mockStory);
      } catch (error) {
        console.error('Error fetching story:', error);
        toast.error('Failed to load story. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const nextScene = () => {
    if (story && currentScene < story.scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'slideshow' ? 'all' : 'slideshow');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900">Story not found</h2>
          <p className="mt-2 text-gray-600">The story you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="mt-6 inline-block btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{story.title}</h1>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span className="capitalize">{story.style} style</span>
              <span className="mx-2">•</span>
              <span>{story.scenes.length} scenes</span>
              <span className="mx-2">•</span>
              <span>{new Date(story.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={toggleViewMode}
              className="btn-outline text-sm"
            >
              {viewMode === 'slideshow' ? 'View All Scenes' : 'Slideshow Mode'}
            </button>
            <Link to={`/edit-story/${story.id}`} className="btn-outline text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Story
            </Link>
            <Link to="/dashboard" className="btn-outline text-sm">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {viewMode === 'slideshow' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={story.scenes[currentScene].image_url}
                alt={`Scene ${currentScene + 1}`}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">Scene {currentScene + 1} of {story.scenes.length}</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-800 text-lg leading-relaxed">
                {story.scenes[currentScene].text}
              </p>
              
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={prevScene}
                  disabled={currentScene === 0}
                  className={`btn-outline ${currentScene === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Previous Scene
                </button>
                
                <div className="text-sm text-gray-500">
                  {currentScene + 1} of {story.scenes.length}
                </div>
                
                <button
                  onClick={nextScene}
                  disabled={currentScene === story.scenes.length - 1}
                  className={`btn-outline ${currentScene === story.scenes.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next Scene
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {story.scenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={scene.image_url}
                      alt={`Scene ${scene.sequence}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-1/2">
                    <h3 className="text-xl font-semibold mb-4">Scene {scene.sequence}</h3>
                    <p className="text-gray-800 leading-relaxed">
                      {scene.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Your Story</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              Share this story with friends and family:
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-outline text-sm flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
              <button className="btn-outline text-sm flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </button>
              <button className="btn-outline text-sm flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>
                LinkedIn
              </button>
              <button className="btn-outline text-sm flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-1.25 16.92v-4.042h-1.345V11.57h1.345V10.24c0-1.11.656-1.719 1.67-1.719.475 0 .885.035 1.004.051v1.168h-.687c-.54 0-.645.255-.645.631v1.199h1.29l-.169 1.308h-1.121v4.042h-1.342zm5.161-9.66a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm-.75 9.66V9.236h1.5v7.684h-1.5z" />
                </svg>
                Email
              </button>
            </div>
            <div className="mt-4">
              <label htmlFor="share-link" className="block text-sm font-medium text-gray-700 mb-1">
                Story Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="share-link"
                  className="input-field rounded-r-none"
                  value={`https://dreamstudio.com/story/${story.id}`}
                  readOnly
                />
                <button
                  className="btn-primary rounded-l-none"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://dreamstudio.com/story/${story.id}`);
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Options</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              Export your story in different formats:
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-outline text-sm flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                PDF
              </button>
              <button className="btn-outline text-sm flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 8v12.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8zm-2 1h-5V4H5v16h14V9z" />
                </svg>
                EPUB
              </button>
              <button className="btn-outline text-sm flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11h-8v6h8v-6zm4 8V4.5A2.5 2.5 0 0 0 20.5 2h-17A2.5 2.5 0 0 0 1 4.5v15A2.5 2.5 0 0 0 3.5 22h17a2.5 2.5 0 0 0 2.5-2.5V19zm-2 0v.5a.5.5 0 0 1-.5.5h-17a.5.5 0 0 1-.5-.5v-15a.5.5 0 0 1 .5-.5h17a.5.5 0 0 1 .5.5V19z" />
                </svg>
                Images
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewStory;