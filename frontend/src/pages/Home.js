import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Transform Your Stories with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                {" "}AI-Generated Visuals
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
              variants={itemVariants}
            >
              DreamStudio turns your words into stunning visuals. Write your story, choose a style, and watch as AI brings your imagination to life.
            </motion.p>
            <motion.div variants={itemVariants}>
              {currentUser ? (
                <Link
                  to="/create"
                  className="btn-primary text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Your Story
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-1">
                  {/* These would be actual story images in a real app */}
                  <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-primary-100 to-primary-300 rounded-md"></div>
                  <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-secondary-100 to-secondary-300 rounded-md"></div>
                  <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-blue-100 to-blue-300 rounded-md"></div>
                  <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-green-100 to-green-300 rounded-md"></div>
                  <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-md"></div>
                  <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-red-100 to-red-300 rounded-md"></div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-lg font-semibold mb-2">The Enchanted Forest</h3>
                  <p className="text-gray-600 text-sm">A magical journey through an ancient forest where trees whisper secrets and mythical creatures roam freely...</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create stunning visual stories in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Write Your Story</h3>
              <p className="text-gray-600">
                Enter your story text, dividing it into scenes or paragraphs. Each section will become a beautifully illustrated page.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Style</h3>
              <p className="text-gray-600">
                Select from various artistic styles like realistic, anime, sketch, or cyberpunk to match the mood of your story.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate & Share</h3>
              <p className="text-gray-600">
                Our AI generates unique images for each scene. View your illustrated story, download it as a PDF, or share it with friends.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Bring Your Stories to Life?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of storytellers, educators, and creators who are using DreamStudio to visualize their imagination.
          </p>
          {currentUser ? (
            <Link
              to="/create"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Your Story
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign Up for Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;