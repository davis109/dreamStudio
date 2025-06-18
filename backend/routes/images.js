const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validate');
const { ApiError } = require('../middleware/error');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only image files are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

/**
 * @route   POST /api/images/generate
 * @desc    Generate an image using Segmind API
 * @access  Public
 */
router.post('/generate', [
  body('prompt')
    .trim()
    .notEmpty().withMessage('Prompt is required')
    .isLength({ min: 3, max: 1000 }).withMessage('Prompt must be between 3 and 1000 characters'),
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
  body('negativePrompt')
    .optional()
    .isString().withMessage('Negative prompt must be a string')
], validateRequest, async (req, res, next) => {
  try {
    const { prompt, artStyle, negativePrompt = '' } = req.body;
    
    // Enhance prompt based on art style
    let enhancedPrompt = prompt;
    let styleModifier = '';
    
    switch (artStyle) {
      case 'realistic':
        styleModifier = 'photorealistic, detailed, high resolution';
        break;
      case 'cartoon':
        styleModifier = 'cartoon style, vibrant colors, simplified shapes';
        break;
      case 'watercolor':
        styleModifier = 'watercolor painting, soft edges, flowing colors';
        break;
      case 'pixar':
        styleModifier = 'Pixar animation style, 3D, colorful, expressive';
        break;
      case 'anime':
        styleModifier = 'anime style, cel shaded, vibrant, detailed';
        break;
      case 'digital-art':
        styleModifier = 'digital art, detailed, vibrant colors, high resolution';
        break;
      case 'oil-painting':
        styleModifier = 'oil painting, textured, rich colors, classical style';
        break;
      case 'pencil-sketch':
        styleModifier = 'pencil sketch, detailed linework, shading, monochrome';
        break;
      case 'comic-book':
        styleModifier = 'comic book style, bold lines, flat colors, dynamic';
        break;
      case 'fantasy':
        styleModifier = 'fantasy art, magical, ethereal, detailed, vibrant';
        break;
      default:
        styleModifier = '';
    }
    
    // Add style modifier to prompt if not already included
    if (styleModifier && !enhancedPrompt.toLowerCase().includes(styleModifier.toLowerCase())) {
      enhancedPrompt = `${enhancedPrompt}, ${styleModifier}`;
    }
    
    // Default negative prompt additions for better quality
    const enhancedNegativePrompt = `${negativePrompt}, deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, out of focus`;
    
    // Call Segmind API for image generation
    const response = await axios.post(
      `${process.env.SEGMIND_API_URL}/txt2img`,
      {
        prompt: enhancedPrompt,
        negative_prompt: enhancedNegativePrompt,
        samples: 1,
        scheduler: 'UniPC',
        num_inference_steps: 25,
        guidance_scale: 7.5,
        strength: 0.9,
        seed: Math.floor(Math.random() * 1000000),
        img_width: 512,
        img_height: 512,
        model_id: 'sd1.5'
      },
      {
        headers: {
          'x-api-key': process.env.SEGMIND_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    // Save the generated image
    const uniqueFilename = `${uuidv4()}.png`;
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, response.data);
    
    // Generate URL for the saved image
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${uniqueFilename}`;
    
    // No user statistics update needed
    
    res.status(200).json({
      success: true,
      data: {
        imageUrl,
        prompt: enhancedPrompt,
        artStyle
      }
    });
  } catch (error) {
    console.error('Image generation error:', error);
    
    // Handle API-specific errors
    if (error.response) {
      const status = error.response.status;
      let message = 'Error generating image';
      
      if (status === 429) {
        message = 'API rate limit exceeded. Please try again later.';
      } else if (status === 402) {
        message = 'API usage limit reached. Please check your subscription.';
      }
      
      return next(new ApiError(message, status));
    }
    
    next(new ApiError('Failed to generate image', 500));
  }
});

/**
 * @route   POST /api/images/upload
 * @desc    Upload an image
 * @access  Private
 */
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError('No image file provided', 400));
    }
    
    // Generate URL for the uploaded image
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      data: {
        imageUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/images/:filename
 * @desc    Delete an uploaded image
 * @access  Private
 */
router.delete('/:filename', async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent directory traversal attacks
    if (filename.includes('/') || filename.includes('\\')) {
      return next(new ApiError('Invalid filename', 400));
    }
    
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return next(new ApiError('Image not found', 404));
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;