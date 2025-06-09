const mongoose = require('mongoose');

const SceneSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Scene text is required'],
    trim: true,
    maxlength: [1000, 'Scene text cannot be more than 1000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Scene image URL is required']
  },
  imagePrompt: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  artStyle: {
    type: String,
    required: [true, 'Art style is required'],
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
    ]
  },
  scenes: [SceneSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  coverImage: {
    type: String,
    default: function() {
      // Default to the first scene's image if available
      return this.scenes && this.scenes.length > 0 ? this.scenes[0].imageUrl : '';
    }
  }
}, { timestamps: true });

// Virtual for scene count
StorySchema.virtual('sceneCount').get(function() {
  return this.scenes.length;
});

// Set toJSON option to include virtuals
StorySchema.set('toJSON', { virtuals: true });
StorySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure scenes are ordered correctly
StorySchema.pre('save', function(next) {
  // Sort scenes by order field
  if (this.scenes && this.scenes.length > 0) {
    this.scenes.sort((a, b) => a.order - b.order);
  }
  next();
});

// Static method to find public stories
StorySchema.statics.findPublic = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Method to check if user owns this story
StorySchema.methods.isOwnedBy = function(userId) {
  return this.userId === userId;
};

const Story = mongoose.model('Story', StorySchema);

module.exports = Story;