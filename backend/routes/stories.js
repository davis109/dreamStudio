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
 * @desc    Get all stories
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort = '-createdAt', style } = req.query;
    
    // Build query
    const query = {};
    
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
 * @access  Public
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid story ID')
], validateRequest, async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return next(new ApiError('Story not found', 404));
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
 * @access  Public
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
      userId: "anonymous",
      artStyle,
      scenes,
      isPublic: true,
      tags
    });
    
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
 * @access  Public
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
    
    // Update story
    story = await Story.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
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
    
    // No authorization check needed
    
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
 * @access  Public
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