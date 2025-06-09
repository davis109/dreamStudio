const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  displayName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  photoURL: {
    type: String,
    default: ''
  },
  preferences: {
    defaultArtStyle: {
      type: String,
      enum: [
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
      ],
      default: 'realistic'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
  },
  usage: {
    storiesCreated: {
      type: Number,
      default: 0
    },
    imagesGenerated: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Virtual for user's full name
UserSchema.virtual('fullName').get(function() {
  return this.displayName || this.email.split('@')[0];
});

// Set toJSON option to include virtuals
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Method to update usage statistics
UserSchema.methods.updateUsage = async function(storyCreated = false, imagesCount = 0) {
  if (storyCreated) {
    this.usage.storiesCreated += 1;
  }
  
  if (imagesCount > 0) {
    this.usage.imagesGenerated += imagesCount;
  }
  
  this.usage.lastActive = Date.now();
  return this.save();
};

// Static method to find or create a user from Firebase auth data
UserSchema.statics.findOrCreateFromFirebase = async function(firebaseUser) {
  try {
    // Try to find existing user
    let user = await this.findOne({ firebaseUid: firebaseUser.uid });
    
    // If user doesn't exist, create a new one
    if (!user) {
      user = await this.create({
        firebaseUid: firebaseUser.uid,
        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || ''
      });
    }
    
    return user;
  } catch (error) {
    console.error('Error in findOrCreateFromFirebase:', error);
    throw error;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;