const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const Story = require('../models/Story');
const User = require('../models/User');
const { ApiError } = require('../middleware/error');

// Validation middleware
const validateRequest = require('../middleware/validate');

/**
 * @route   GET /api/stories
 * @desc    Get all stories for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort = '-createdAt', style } = req.query;
    
    // Build query
    const query = { userId: req.user.uid };
    
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
    
    res.status(200).json({
      success: true,
      count: stories.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: stories
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/stories/:id
 * @desc    Get a single story by ID
 * @access  Private
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid story ID')
], validateRequest, async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return next(new ApiError('Story not found', 404));
    }
    
    // Check if user owns the story or if it's public
    if (story.userId !== req.user.uid && !story.isPublic) {
      return next(new ApiError('Not authorized to access this story', 403));
    }
    
    res.status(200).json({
      success: true,
      data: story
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/stories
 * @desc    Create a new story
 * @access  Private
 */
router.post('/', [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  body('artStyle')
    .notEmpty().withMessage('Art style is required')
    .isIn([
      'realistic', 
      'cartoon', 
      'watercolor', 
      'pixar', 
      'anime', 
      'digital-art',
      'oil-painting',
      'pencil-sketch',
      'comic-book',
      'fantasy'
    ]).withMessage('Invalid art style'),
  body('scenes').isArray().withMessage('Scenes must be an array'),
  body('scenes.*.text')
    .trim()
    .notEmpty().withMessage('Scene text is required')
    .isLength({ max: 1000 }).withMessage('Scene text cannot be more than 1000 characters'),
  body('scenes.*.imageUrl').notEmpty().withMessage('Scene image URL is required'),
  body('scenes.*.order').isNumeric().withMessage('Scene order must be a number')
], validateRequest, async (req, res, next) => {
  try {
    const { title, artStyle, scenes, isPublic = false, tags = [] } = req.body;
    
    // Create new story
    const story = await Story.create({
      title,
      userId: req.user.uid,
      artStyle,
      scenes,
      isPublic,
      tags
    });
    
    // Update user statistics
    await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { 
        $inc: { 'usage.storiesCreated': 1, 'usage.imagesGenerated': scenes.length },
        $set: { 'usage.lastActive': Date.now() }
      }
    );
    
    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/stories/:id
 * @desc    Update a story
 * @access  Private
 */
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid story ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  body('artStyle')
    .optional()
    .isIn([
      'realistic', 
      'cartoon', 
      'watercolor', 
      'pixar', 
      'anime', 
      'digital-art',
      'oil-painting',
      'pencil-sketch',
      'comic-book',
      'fantasy'
    ]).withMessage('Invalid art style'),
  body('scenes')
    .optional()
    .isArray().withMessage('Scenes must be an array')
], validateRequest, async (req, res, next) => {
  try {
    let story = await Story.findById(req.params.id);
    
    if (!story) {
      return next(new ApiError('Story not found', 404));
    }
    
    // Check if user owns the story
    if (story.userId !== req.user.uid) {
      return next(new ApiError('Not authorized to update this story', 403));
    }
    
    // Count new images if any were added
    let newImagesCount = 0;
    if (req.body.scenes) {
      const existingImageUrls = story.scenes.map(scene => scene.imageUrl);
      newImagesCount = req.body.scenes.filter(scene => 
        !existingImageUrls.includes(scene.imageUrl)
      ).length;
    }
    
    // Update story
    story = await Story.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    // Update user statistics if new images were added
    if (newImagesCount > 0) {
      await User.findOneAndUpdate(
        { firebaseUid: req.user.uid },
        { 
          $inc: { 'usage.imagesGenerated': newImagesCount },
          $set: { 'usage.lastActive': Date.now() }
        }
      );
    }
    
    res.status(200).json({
      success: true,
      data: story
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/stories/:id
 * @desc    Delete a story
 * @access  Private
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid story ID')
], validateRequest, async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return next(new ApiError('Story not found', 404));
    }
    
    // Check if user owns the story
    if (story.userId !== req.user.uid) {
      return next(new ApiError('Not authorized to delete this story', 403));
    }
    
    await story.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/stories/public
 * @desc    Get public stories
 * @access  Private (but shows public content)
 */
router.get('/public/featured', async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get public stories
    const stories = await Story.find({ isPublic: true })
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Story.countDocuments({ isPublic: true });
    
    res.status(200).json({
      success: true,
      count: stories.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: stories
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;