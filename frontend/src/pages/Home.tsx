import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';

// Hero section animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary-600">Feedback Collection</span>
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      authService.logout();
                      setIsAuthenticated(false);
                    }}
                    className="ml-4 btn btn-outline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="ml-4 btn btn-primary">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div className="lg:col-span-6" variants={itemVariants}>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Collect feedback</span>
              <span className="block text-primary-600">from your customers</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              Create customizable feedback forms, share them with your customers, and analyze responses to improve your business.
            </p>
            <div className="mt-10 flex gap-4">
              {isAuthenticated ? (
                <Link to="/create-form" className="btn btn-primary">
                  Create a Form
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              )}
              <a href="#features" className="btn btn-outline">
                Learn More
              </a>
            </div>
          </motion.div>
          <motion.div className="mt-12 lg:mt-0 lg:col-span-6" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="px-6 py-8 bg-gradient-to-r from-primary-500 to-secondary-500 sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl leading-6 font-medium text-white">Customer Feedback Form</h3>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-white text-primary-700">
                    Preview
                  </span>
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-white sm:p-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">How would you rate our service?</label>
                    <div className="mt-2 flex space-x-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">What did you like most about our product?</label>
                    <div className="mt-2">
                      <textarea
                        rows={3}
                        className="form-input"
                        placeholder="Your feedback..."
                      ></textarea>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Would you recommend us to a friend?</label>
                    <div className="mt-2 space-y-2">
                      {['Yes, definitely', 'Maybe', 'No'].map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="recommendation"
                            className="h-4 w-4 text-primary-600 border-gray-300"
                          />
                          <label className="ml-3 text-sm text-gray-700">{option}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary w-full">
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div id="features" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful features for collecting feedback
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to create, share, and analyze feedback forms.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <motion.div 
              className="bg-white rounded-lg shadow-soft p-6"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-md bg-primary-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Customizable Forms</h3>
              <p className="mt-2 text-base text-gray-500">
                Create forms with various question types including text and multiple-choice questions.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-white rounded-lg shadow-soft p-6"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-md bg-primary-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Easy Sharing</h3>
              <p className="mt-2 text-base text-gray-500">
                Share your forms with a public URL that anyone can access without needing to log in.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-white rounded-lg shadow-soft p-6"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-md bg-primary-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Response Analytics</h3>
              <p className="mt-2 text-base text-gray-500">
                View and analyze responses in a tabular and summary view to gain insights.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Contact Us
            </h2>
            <p className="mt-4 text-lg text-gray-500 text-center">
              Have questions or need help? Get in touch with our team.
            </p>
            <div className="mt-8 bg-white shadow-soft rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="form-input"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <div>
                    <button type="button" className="btn btn-primary w-full">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              &copy; 2025 Feedback Collection Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;