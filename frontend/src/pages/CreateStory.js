import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { storyApi, imageApi } from '../services/api';

const CreateStory = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [scenes, setScenes] = useState([{ text: '', image: null }]);
  const [style, setStyle] = useState('realistic');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Story Details, 2: Scene Creation, 3: Preview

  const styleOptions = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic style with detailed textures and lighting' },
    { id: 'anime', name: 'Anime', description: 'Japanese animation style with vibrant colors and expressive features' },
    { id: 'sketch', name: 'Sketch', description: 'Hand-drawn pencil sketch style with line work and shading' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuristic neon-lit urban environments with high tech elements' },
    { id: 'fantasy', name: 'Fantasy', description: 'Magical and ethereal style with dreamlike elements' },
    { id: 'watercolor', name: 'Watercolor', description: 'Soft, flowing watercolor painting style with blended colors' },
  ];

  const addScene = () => {
    setScenes([...scenes, { text: '', image: null }]);
  };

  const removeScene = (index) => {
    const updatedScenes = [...scenes];
    updatedScenes.splice(index, 1);
    setScenes(updatedScenes);
  };

  const updateSceneText = (index, text) => {
    const updatedScenes = [...scenes];
    updatedScenes[index].text = text;
    setScenes(updatedScenes);
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
      setLoading(true);
      
      // In a real app, this would save to the backend
      // For demo purposes, we'll simulate the API call with a timeout
      // const storyData = {
      //   title,
      //   style,
      //   scenes: scenes.map((scene, index) => ({
      //     text: scene.text,
      //     image_url: scene.image,
      //     sequence: index + 1
      //   }))
      // };
      // const response = await storyApi.createStory(storyData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Story created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !title.trim()) {
      toast.error('Please enter a title for your story');
      return;
    }
    
    if (currentStep === 2 && scenes.some(scene => !scene.text.trim())) {
      toast.error('Please enter text for all scenes');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
          <p className="mt-1 text-sm text-gray-500">
            Write your story, add scenes, and generate AI images
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className="ml-2 text-sm font-medium">
                Story Details
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className="ml-2 text-sm font-medium">
                Scene Creation
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
              <div className="ml-2 text-sm font-medium">
                Preview & Save
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Story Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
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
                  Select Art Style
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
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={nextStep}
                >
                  Next: Add Scenes
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Scene Creation */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
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
                  Add scenes to your story. Each scene will be illustrated with an AI-generated image.
                </p>

                {scenes.map((scene, index) => (
                  <div
                    key={index}
                    className="mb-8 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Scene {index + 1}</h3>
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
                            Generate Image
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

              <div className="flex justify-between">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={nextStep}
                >
                  Next: Preview
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview & Save */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Story Preview</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="capitalize">{style} style</span>
                      <span className="mx-2">•</span>
                      <span>{scenes.length} scenes</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {scenes.map((scene, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-6">
                        {scene.image ? (
                          <div className="w-full md:w-1/3">
                            <img
                              src={scene.image}
                              alt={`Scene ${index + 1}`}
                              className="w-full h-auto rounded-md shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="w-full md:w-1/3 bg-gray-200 rounded-md flex items-center justify-center h-48">
                            <span className="text-gray-500">No image generated</span>
                          </div>
                        )}
                        <div className="w-full md:w-2/3">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Scene {index + 1}</h4>
                          <p className="text-gray-700">{scene.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Story'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default CreateStory;