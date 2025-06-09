const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

/**
 * Middleware to verify Firebase authentication token
 * Extracts the token from the Authorization header and verifies it
 * Sets req.user with the decoded token data if valid
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: { 
          message: 'Unauthorized - No token provided', 
          status: 401 
        } 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Set the user data in the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    return res.status(401).json({ 
      error: { 
        message: 'Unauthorized - Invalid token', 
        status: 401 
      } 
    });
  }
};

module.exports = authMiddleware;