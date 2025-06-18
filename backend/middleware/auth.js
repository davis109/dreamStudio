/**
 * Middleware that bypasses authentication
 * Sets a default guest user in the request object
 */
const authMiddleware = async (req, res, next) => {
  // Set a default guest user in the request object
  req.user = {
    uid: 'guest-user',
    email: 'guest@example.com',
    emailVerified: true,
    displayName: 'Guest User',
    photoURL: null,
  };
  
  next();
};

module.exports = authMiddleware;