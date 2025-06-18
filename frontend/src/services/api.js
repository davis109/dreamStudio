import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// No authentication needed for requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error statuses
    if (response) {
      const { status, data } = response;
      
      // Authentication error
      if (status === 401) {
        toast.error('Authentication error. Please log in again.');
      }
      // Forbidden
      else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      }
      // Not found
      else if (status === 404) {
        toast.error('Resource not found.');
      }
      // Validation error
      else if (status === 400 && data.error && data.error.errors) {
        const errorMessages = data.error.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        toast.error(`Validation error:\n${errorMessages}`);
      }
      // Server error
      else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
      // Other errors
      else {
        const errorMessage = data.error?.message || 'An error occurred';
        toast.error(errorMessage);
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Story API calls
export const storyApi = {
  // Get all stories for the current user
  getUserStories: (options = {}) => {
    const { limit, page, sort, style } = options;
    let url = '/api/stories';
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    if (sort) params.append('sort', sort);
    if (style) params.append('style', style);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    return api.get(url);
  },
  
  // Get a specific story by ID
  getStory: (storyId) => api.get(`/api/stories/${storyId}`),
  
  // Create a new story
  createStory: (storyData) => api.post('/api/stories', storyData),
  
  // Update an existing story
  updateStory: (storyId, storyData) => api.put(`/api/stories/${storyId}`, storyData),
  
  // Delete a story
  deleteStory: (storyId) => api.delete(`/api/stories/${storyId}`),
  
  // Get public stories
  getPublicStories: (options = {}) => {
    const { limit, page } = options;
    let url = '/api/stories/public/featured';
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    return api.get(url);
  },
};

// Image generation API calls
export const imageApi = {
  // Generate an image from text
  generateImage: (prompt, artStyle, negativePrompt = '') => 
    api.post('/api/images/generate', { prompt, artStyle, negativePrompt }),
  
  // Upload an image
  uploadImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Delete an image
  deleteImage: (filename) => api.delete(`/api/images/${filename}`),
};

// Export API calls
export const exportApi = {
  // Export story as PDF
  exportPdf: (storyId) => api.get(`/api/exports/story/${storyId}/pdf`, { responseType: 'blob' }),
  
  // Export story as EPUB
  exportEpub: (storyId) => api.get(`/api/exports/story/${storyId}/epub`, { responseType: 'blob' }),
  
  // Export story images
  exportImages: (storyId) => api.get(`/api/exports/story/${storyId}/images`, { responseType: 'blob' }),
  
  // Export user data
  exportUserData: () => api.get('/api/exports/user/data', { responseType: 'blob' }),
};

export default api;