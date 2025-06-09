# DreamStudio - AI-Powered Visual Storytelling(not completed)

DreamStudio is a web application where users can create visual stories with AI-generated images. Users input text descriptions for each scene, and the application automatically illustrates them using the Segmind API. It's perfect for creators, educators, storytellers, and anyone who wants to bring their stories to life visually.

## 🔧 Key Features

- ✍️ **Multi-Scene Text Input**: Users write a story, split into scenes with individual descriptions.
- 🖼️ **AI Image Generation**: Each scene is converted into a unique image using Segmind's text-to-image model.
- 🎨 **Style Customization**: Choose from styles like realistic, anime, watercolor, pixar, and more.
- 📖 **Interactive Story Viewer**: Read your story with AI-generated visuals in both slideshow and full-view modes.
- 📂 **User Dashboard**: View, edit, and manage your story collection.
- 📤 **Export Options**: Download as PDF, EPUB, or image collection.
- 🔒 **User Authentication**: Secure login and registration with Firebase.

## 🧰 Tech Stack

| Layer | Technologies Used |
|-------|-------------------|
| Frontend | React.js, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js |
| AI Integration | Segmind Text-to-Image API |
| Auth | Firebase Authentication |
| Storage | Local file storage with UUID naming |
| Database | MongoDB with Mongoose |
| State Management | React Context API |
| Notifications | React Toastify |

## Project Structure

```
segmind/
├── frontend/                # React.js application
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page components
│       ├── contexts/        # React contexts
│       ├── hooks/           # Custom React hooks
│       ├── services/        # API services
│       └── utils/           # Utility functions
├── backend/                 # Node.js Express application
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   └── uploads/             # Directory for uploaded/generated images
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Firebase project
- Segmind API key

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/dreamstudio
   JWT_SECRET=your_jwt_secret_key_here
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY="your-firebase-private-key"
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   SEGMIND_API_KEY=your_segmind_api_key_here
   SEGMIND_API_URL=https://api.segmind.com/v1
   UPLOAD_PATH=./uploads
   ```

4. Start the Express server:
   ```bash
   npm run dev
   ```

## Usage

1. Register or log in to your account
2. Create a new story by clicking "Create Story"
3. Enter a title and select an art style
4. Add scenes with text descriptions
5. Generate images for each scene
6. Preview and save your story
7. View, edit, or share your stories from the dashboard

## API Endpoints

### Authentication
- Firebase Authentication is used for user management

### Stories
- `GET /api/stories` - Get all stories for authenticated user (with pagination, sorting, filtering)
- `GET /api/stories/public` - Get public stories (with pagination)
- `GET /api/stories/:id` - Get a specific story by ID
- `POST /api/stories` - Create a new story
- `PUT /api/stories/:id` - Update an existing story
- `DELETE /api/stories/:id` - Delete a story

### Images
- `POST /api/images/generate` - Generate an image using Segmind API
- `POST /api/images/upload` - Upload an image
- `DELETE /api/images/:filename` - Delete an uploaded image

### Exports
- `GET /api/exports/story/:id/pdf` - Export a story as PDF
- `GET /api/exports/story/:id/epub` - Export a story as EPUB
- `GET /api/exports/story/:id/images` - Export all images from a story
- `GET /api/exports/user/data` - Export all user data

## License

This project is licensed under the MIT License.
