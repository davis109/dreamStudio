const Story = require('../models/Story');
const User = require('../models/User');
const { ApiError } = require('../middleware/error');
const ImageService = require('./imageService');

/**
 * Service for handling story operations
 */
class StoryService {
  /**
   * Get all stories for a user with filtering and pagination
   * @param {string} userId - The user ID
   * @param {Object} options - Query options (limit, page, sort, style)
   * @returns {Promise<Object>} - Object containing stories and pagination info
   */
  static async getUserStories(userId, options = {}) {
    try {
      const { limit = 10, page = 1, sort = '-createdAt', style } = options;
      
      // Build query
      const query = { userId };
      
      // Filter by art style if provided
      if (style) {
        query.artStyle = style;
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Execute query with pagination and sorting
      const stories = await Story.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Story.countDocuments(query);
      
      return {
        stories,
        count: stories.length,
        total,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (error) {
      console.error('Error getting user stories:', error);
      throw error;
    }
  }
  
  /**
   * Get a single story by ID
   * @param {string} storyId - The story ID
   * @param {string} userId - The user ID (for authorization)
   * @returns {Promise<Object>} - The story object
   */
  static async getStoryById(storyId, userId) {
    try {
      const story = await Story.findById(storyId);
      
      if (!story) {
        throw new ApiError('Story not found', 404);
      }
      
      // Check if user owns the story or if it's public
      if (story.userId !== userId && !story.isPublic) {
        throw new ApiError('Not authorized to access this story', 403);
      }
      
      return story;
    } catch (error) {
      console.error('Error getting story by ID:', error);
      throw error;
    }
  }
  
  /**
   * Create a new story
   * @param {Object} storyData - The story data
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - The created story
   */
  static async createStory(storyData, userId) {
    try {
      const { title, artStyle, scenes, isPublic = false, tags = [] } = storyData;
      
      // Create new story
      const story = await Story.create({
        title,
        userId,
        artStyle,
        scenes,
        isPublic,
        tags
      });
      
      // Update user statistics
      await User.findOneAndUpdate(
        { firebaseUid: userId },
        { 
          $inc: { 'usage.storiesCreated': 1, 'usage.imagesGenerated': scenes.length },
          $set: { 'usage.lastActive': Date.now() }
        }
      );
      
      return story;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing story
   * @param {string} storyId - The story ID
   * @param {Object} updateData - The data to update
   * @param {string} userId - The user ID (for authorization)
   * @returns {Promise<Object>} - The updated story
   */
  static async updateStory(storyId, updateData, userId) {
    try {
      let story = await Story.findById(storyId);
      
      if (!story) {
        throw new ApiError('Story not found', 404);
      }
      
      // Check if user owns the story
      if (story.userId !== userId) {
        throw new ApiError('Not authorized to update this story', 403);
      }
      
      // Count new images if any were added
      let newImagesCount = 0;
      if (updateData.scenes) {
        const existingImageUrls = story.scenes.map(scene => scene.imageUrl);
        newImagesCount = updateData.scenes.filter(scene => 
          !existingImageUrls.includes(scene.imageUrl)
        ).length;
      }
      
      // Update story
      story = await Story.findByIdAndUpdate(
        storyId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      // Update user statistics if new images were added
      if (newImagesCount > 0) {
        await User.findOneAndUpdate(
          { firebaseUid: userId },
          { 
            $inc: { 'usage.imagesGenerated': newImagesCount },
            $set: { 'usage.lastActive': Date.now() }
          }
        );
      }
      
      return story;
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }
  
  /**
   * Delete a story
   * @param {string} storyId - The story ID
   * @param {string} userId - The user ID (for authorization)
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  static async deleteStory(storyId, userId) {
    try {
      const story = await Story.findById(storyId);
      
      if (!story) {
        throw new ApiError('Story not found', 404);
      }
      
      // Check if user owns the story
      if (story.userId !== userId) {
        throw new ApiError('Not authorized to delete this story', 403);
      }
      
      // In a production environment, we might want to delete associated images as well
      // This would require tracking which images are used only by this story
      
      await story.deleteOne();
      
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }
  
  /**
   * Get public stories with pagination
   * @param {Object} options - Query options (limit, page)
   * @returns {Promise<Object>} - Object containing stories and pagination info
   */
  static async getPublicStories(options = {}) {
    try {
      const { limit = 10, page = 1 } = options;
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get public stories
      const stories = await Story.find({ isPublic: true })
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Story.countDocuments({ isPublic: true });
      
      return {
        stories,
        count: stories.length,
        total,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (error) {
      console.error('Error getting public stories:', error);
      throw error;
    }
  }
  
  /**
   * Generate images for all scenes in a story
   * @param {Object} story - The story object with scenes
   * @param {string} artStyle - The art style to use
   * @returns {Promise<Object>} - The updated story with generated images
   */
  static async generateImagesForStory(story, artStyle) {
    try {
      // Process each scene to generate an image
      const updatedScenes = await Promise.all(story.scenes.map(async (scene, index) => {
        // Generate image for this scene
        const result = await ImageService.generateImage(
          scene.text,
          artStyle,
          '',  // No negative prompt
          { seed: Math.floor(Math.random() * 1000000) + index }  // Different seed for each image
        );
        
        // Update scene with generated image URL
        return {
          ...scene,
          imageUrl: result.imageUrl,
          imagePrompt: result.prompt
        };
      }));
      
      // Return updated story data
      return {
        ...story,
        scenes: updatedScenes,
        artStyle
      };
    } catch (error) {
      console.error('Error generating images for story:', error);
      throw error;
    }
  }
}

module.exports = StoryService;