import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { storyApi, imageApi } from '../services/api';

const EditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [scenes, setScenes] = useState([]);
  const [style, setStyle] = useState('realistic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const styleOptions = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic style with detailed textures and lighting' },
    { id: 'anime', name: 'Anime', description: 'Japanese animation style with vibrant colors and expressive features' },
    { id: 'sketch', name: 'Sketch', description: 'Hand-drawn pencil sketch style with line work and shading' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuristic neon-lit urban environments with high tech elements' },
    { id: 'fantasy', name: 'Fantasy', description: 'Magical and ethereal style with dreamlike elements' },
    { id: 'watercolor', name: 'Watercolor', description: 'Soft, flowing watercolor painting style with blended colors' },
  ];

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
        
        setTitle(mockStory.title);
        setStyle(mockStory.style);
        setScenes(mockStory.scenes.map(scene => ({
          ...scene,
          text: scene.text,
          image: scene.image_url
        })));
      } catch (error) {
        console.error('Error fetching story:', error);
        toast.error('Failed to load story. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const addScene = () => {
    const newScene = {
      id: `temp-${Date.now()}`,
      text: '',
      image: null,
      sequence: scenes.length + 1
    };
    setScenes([...scenes, newScene]);
  };

  const removeScene = (index) => {
    const updatedScenes = [...scenes];
    updatedScenes.splice(index, 1);
    // Update sequence numbers
    const resequencedScenes = updatedScenes.map((scene, idx) => ({
      ...scene,
      sequence: idx + 1
    }));
    setScenes(resequencedScenes);
  };

  const updateSceneText = (index, text) => {
    const updatedScenes = [...scenes];
    updatedScenes[index].text = text;
    setScenes(updatedScenes);
  };

  const moveSceneUp = (index) => {
    if (index === 0) return;
    const updatedScenes = [...scenes];
    const temp = updatedScenes[index];
    updatedScenes[index] = updatedScenes[index - 1];
    updatedScenes[index - 1] = temp;
    
    // Update sequence numbers
    const resequencedScenes = updatedScenes.map((scene, idx) => ({
      ...scene,
      sequence: idx + 1
    }));
    setScenes(resequencedScenes);
  };

  const moveSceneDown = (index) => {
    if (index === scenes.length - 1) return;
    const updatedScenes = [...scenes];
    const temp = updatedScenes[index];
    updatedScenes[index] = updatedScenes[index + 1];
    updatedScenes[index + 1] = temp;
    
    // Update sequence numbers
    const resequencedScenes = updatedScenes.map((scene, idx) => ({
      ...scene,
      sequence: idx + 1
    }));
    setScenes(resequencedScenes);
  };

  const generateImage = async (index) => {
    const sceneText = scenes[index].text;
    
    if (!sceneText.trim()) {
      toast.error('Please enter text for this scene before generating an image');
      return;
    }
    
    try {
      const updatedScenes = [...scenes];
      updatedScenes[index].generating = true;
      setScenes(updatedScenes);
      
      // In a real app, this would call the Segmind API
      // For demo purposes, we'll simulate the API call with a timeout
      // const response = await imageApi.generateImage(sceneText, style);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder image URL based on the style
      let placeholderImage;
      switch (style) {
        case 'anime':
          placeholderImage = `https://via.placeholder.com/512x512/FF6B6B/FFFFFF?text=Anime:+${encodeURIComponent(sceneText.substring(0, 20))}...`;
          break;
        case 'sketch':
          placeholderImage = `https://via.placeholder.com/512x512/6B66FF/FFFFFF?text=Sketch:+${encodeURIComponent(sceneText.substring(0, 20))}...`;
          break;
        case 'cyberpunk':
          placeholderImage = `https://via.placeholder.com/512x512/00F5D4/000000?text=Cyberpunk:+${encodeURIComponent(sceneText.substring(0, 20))}...`;
          break;
        case 'fantasy':
          placeholderImage = `https://via.placeholder.com/512x512/9F7AEA/FFFFFF?text=Fantasy:+${encodeURIComponent(sceneText.substring(0, 20))}...`;
          break;
        case 'watercolor':
          placeholderImage = `https://via.placeholder.com/512x512/4FD1C5/FFFFFF?text=Watercolor:+${encodeURIComponent(sceneText.substring(0, 20))}...`;
          break;
        default: // realistic
          placeholderImage = `https://via.placeholder.com/512x512/38B2AC/FFFFFF?text=Realistic:+${encodeURIComponent(sceneText.substring(0, 20))}...`;
      }
      
      updatedScenes[index].image = placeholderImage;
      updatedScenes[index].generating = false;
      setScenes(updatedScenes);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
      
      const updatedScenes = [...scenes];
      updatedScenes[index].generating = false;
      setScenes(updatedScenes);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your story');
      return;
    }
    
    if (scenes.some(scene => !scene.text.trim())) {
      toast.error('Please enter text for all scenes');
      return;
    }
    
    try {
      setSaving(true);
      
      // In a real app, this would update the backend
      // For demo purposes, we'll simulate the API call with a timeout
      // const storyData = {
      //   title,
      //   style,
      //   scenes: scenes.map((scene, index) => ({
      //     id: scene.id.toString().startsWith('temp-') ? undefined : scene.id,
      //     text: scene.text,
      //     image_url: scene.image,
      //     sequence: index + 1
      //   }))
      // };
      // const response = await storyApi.updateStory(id, storyData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Story updated successfully!');
      navigate(`/view-story/${id}`);
    } catch (error) {
      console.error('Error updating story:', error);
      toast.error('Failed to update story. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Story</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your story details, scenes, and images
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Story Title
              </label>
              <input
                type="text"
                id="title"
                className="input-field"
                placeholder="Enter a captivating title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Art Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {styleOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${style === option.id ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600' : 'border-gray-200 hover:border-primary-300'}`}
                    onClick={() => setStyle(option.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="style"
                        value={option.id}
                        checked={style === option.id}
                        onChange={() => setStyle(option.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">{option.name}</span>
                        <span className="block text-xs text-gray-500 mt-1">{option.description}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Changing the art style will require regenerating all images
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Story Scenes</h2>
                <button
                  type="button"
                  className="btn-outline text-sm"
                  onClick={addScene}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Scene
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Rearrange, edit, or add new scenes to your story.
              </p>

              {scenes.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No scenes</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a new scene.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={addScene}
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
                      Add Your First Scene
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {scenes.map((scene, index) => (
                    <div
                      key={scene.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">Scene {index + 1}</h3>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => moveSceneUp(index)}
                            disabled={index === 0}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => moveSceneDown(index)}
                            disabled={index === scenes.length - 1}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 ${index === scenes.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          {scenes.length > 1 && (
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => removeScene(index)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor={`scene-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Scene Description
                        </label>
                        <textarea
                          id={`scene-${index}`}
                          className="textarea-field"
                          rows="4"
                          placeholder="Describe this scene of your story..."
                          value={scene.text}
                          onChange={(e) => updateSceneText(index, e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          className="btn-outline text-sm"
                          onClick={() => generateImage(index)}
                          disabled={!scene.text.trim() || scene.generating}
                        >
                          {scene.generating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {scene.image ? 'Regenerate Image' : 'Generate Image'}
                            </>
                          )}
                        </button>
                        <span className="text-xs text-gray-500">
                          {scene.image ? 'Image generated' : 'No image generated yet'}
                        </span>
                      </div>

                      {scene.image && (
                        <div className="mt-4">
                          <img
                            src={scene.image}
                            alt={`Scene ${index + 1}`}
                            className="w-full h-auto rounded-md shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate(`/view-story/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditStory;