const { validationResult } = require('express-validator');
const { ApiError } = require('./error');

/**
 * Middleware to validate request using express-validator
 * Checks for validation errors and returns a formatted response
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format validation errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    
    // Create API error with validation details
    const error = new ApiError('Validation Error', 400);
    error.errors = formattedErrors;
    
    return next(error);
  }
  
  next();
};

module.exports = validateRequest;