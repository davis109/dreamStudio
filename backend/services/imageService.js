const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require('../middleware/error');

/**
 * Service for handling image generation and processing
 */
class ImageService {
  /**
   * Generate an image using Segmind API
   * @param {string} prompt - The text prompt for image generation
   * @param {string} artStyle - The art style to apply
   * @param {string} negativePrompt - Optional negative prompt
   * @param {Object} options - Additional options for image generation
   * @returns {Promise<Object>} - Object containing the image URL and metadata
   */
  static async generateImage(prompt, artStyle, negativePrompt = '', options = {}) {
    try {
      // Enhance prompt based on art style
      const enhancedPrompt = this.enhancePromptWithStyle(prompt, artStyle);
      
      // Default negative prompt additions for better quality
      const enhancedNegativePrompt = `${negativePrompt}, deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, out of focus`;
      
      // Default generation parameters
      const params = {
        prompt: enhancedPrompt,
        negative_prompt: enhancedNegativePrompt,
        samples: options.samples || 1,
        scheduler: options.scheduler || 'UniPC',
        num_inference_steps: options.steps || 25,
        guidance_scale: options.guidanceScale || 7.5,
        strength: options.strength || 0.9,
        seed: options.seed || Math.floor(Math.random() * 1000000),
        img_width: options.width || 512,
        img_height: options.height || 512,
        model_id: 'sd1.5'
      };
      
      // Call Segmind API for image generation
      const response = await axios.post(
        `${process.env.SEGMIND_API_URL}/txt2img`,
        params,
        {
          headers: {
            'x-api-key': process.env.SEGMIND_API_KEY,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      
      // Save the generated image
      const imageUrl = await this.saveImage(response.data);
      
      return {
        imageUrl,
        prompt: enhancedPrompt,
        artStyle,
        params: {
          width: params.img_width,
          height: params.img_height,
          steps: params.num_inference_steps,
          seed: params.seed
        }
      };
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
        
        throw new ApiError(message, status);
      }
      
      throw new ApiError('Failed to generate image', 500);
    }
  }
  
  /**
   * Enhance a prompt with style-specific modifiers
   * @param {string} prompt - The original prompt
   * @param {string} artStyle - The art style to apply
   * @returns {string} - The enhanced prompt
   */
  static enhancePromptWithStyle(prompt, artStyle) {
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
    if (styleModifier && !prompt.toLowerCase().includes(styleModifier.toLowerCase())) {
      return `${prompt}, ${styleModifier}`;
    }
    
    return prompt;
  }
  
  /**
   * Save an image buffer to disk
   * @param {Buffer} imageBuffer - The image data buffer
   * @returns {Promise<string>} - The URL of the saved image
   */
  static async saveImage(imageBuffer) {
    const uniqueFilename = `${uuidv4()}.png`;
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Write the file
    fs.writeFileSync(filePath, imageBuffer);
    
    // In a real implementation, we would use the actual server URL
    // For now, we'll just return the relative path
    return `/uploads/${uniqueFilename}`;
  }
  
  /**
   * Delete an image file
   * @param {string} filename - The filename to delete
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  static async deleteImage(filename) {
    try {
      // Validate filename to prevent directory traversal attacks
      if (filename.includes('/') || filename.includes('\\')) {
        throw new ApiError('Invalid filename', 400);
      }
      
      const uploadDir = process.env.UPLOAD_PATH || './uploads';
      const filePath = path.join(uploadDir, filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new ApiError('Image not found', 404);
      }
      
      // Delete the file
      fs.unlinkSync(filePath);
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}

module.exports = ImageService;