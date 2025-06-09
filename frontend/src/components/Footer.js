import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DreamStudio</h3>
            <p className="text-gray-300 text-sm">
              AI-Powered Visual Storytelling. Create beautiful illustrated stories with the power of AI.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-300 hover:text-white transition-colors">
                  Create Story
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm mb-2">
              Have questions or feedback? Reach out to us.
            </p>
            <a
              href="mailto:info@dreamstudio.com"
              className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
            >
              info@dreamstudio.com
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} DreamStudio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;