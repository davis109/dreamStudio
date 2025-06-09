# DreamStudio Backend API

This is the backend API for DreamStudio, an AI-powered visual storytelling application that allows users to create stories with AI-generated images.

## Features

- User authentication using Firebase Auth
- Story creation, retrieval, updating, and deletion
- AI image generation using Segmind API
- Story export functionality (PDF, EPUB, images)
- User data management

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Firebase Authentication
- Segmind API for image generation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Firebase project
- Segmind API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your configuration values:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dreamstudio

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Segmind API Configuration
SEGMIND_API_KEY=your_segmind_api_key_here
SEGMIND_API_URL=https://api.segmind.com/v1

# Storage Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760 # 10MB in bytes
```

### Running the Server

#### Development mode

```bash
npm run dev
```

#### Production mode

```bash
npm start
```

## API Endpoints

### Authentication

Authentication is handled through Firebase. The client should obtain a Firebase token and include it in the Authorization header for all protected routes.

### Stories

- `GET /api/stories` - Get all stories for the authenticated user
- `GET /api/stories/:id` - Get a single story by ID
- `POST /api/stories` - Create a new story
- `PUT /api/stories/:id` - Update a story
- `DELETE /api/stories/:id` - Delete a story
- `GET /api/stories/public/featured` - Get public stories

### Images

- `POST /api/images/generate` - Generate an image using Segmind API
- `POST /api/images/upload` - Upload an image
- `DELETE /api/images/:filename` - Delete an uploaded image

### Exports

- `GET /api/exports/story/:id/pdf` - Export a story as PDF
- `GET /api/exports/story/:id/epub` - Export a story as EPUB
- `GET /api/exports/story/:id/images` - Export all images from a story
- `GET /api/exports/user/data` - Export all user data

## Project Structure

```
├── server.js           # Entry point
├── middleware/         # Express middleware
│   ├── auth.js         # Authentication middleware
│   ├── error.js        # Error handling middleware
│   └── validate.js     # Request validation middleware
├── models/             # Mongoose models
│   ├── Story.js        # Story model
│   └── User.js         # User model
├── routes/             # API routes
│   ├── stories.js      # Story routes
│   ├── images.js       # Image routes
│   └── exports.js      # Export routes
├── services/           # Business logic
│   ├── imageService.js # Image generation service
│   ├── storyService.js # Story management service
│   └── exportService.js # Export service
└── uploads/            # Directory for uploaded/generated images
```

## Error Handling

The API uses a consistent error format:

```json
{
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

## License

This project is licensed under the MIT License.