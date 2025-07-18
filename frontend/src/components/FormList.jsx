import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import formService from '../services/form.service';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    console.log('Loading forms...');
    setLoading(true);
    setError('');

    // If we're refreshing, show a toast
    if (!loading && isRefreshing) {
      toast.info('Refreshing forms...', {
        position: "top-right",
        autoClose: 2000,
      });
    }

    formService.getAllForms()
      .then(response => {
        console.log('Forms response:', response);

        // Check if the response has an error property
        if (response && response.error) {
          console.error('Error loading forms:', response.message);
          setError(response.message || 'Failed to load forms. Please try again.');
          setLoading(false);
          setIsRefreshing(false);

          toast.error(response.message || 'Failed to load forms', {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }

        // Check if response.data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          console.log('Forms loaded successfully:', response.data.length, 'forms');
          setForms(response.data);
          setLoading(false);
          setIsRefreshing(false);

          if (isRefreshing) {
            toast.success('Forms refreshed successfully!', {
              position: "top-right",
              autoClose: 2000,
            });
          }
        } else {
          console.error('Invalid response format:', response);
          setError('Received invalid data format from server');
          setForms([]);
          setLoading(false);
          setIsRefreshing(false);

          toast.error('Received invalid data from server', {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch(error => {
        console.error('Exception while loading forms:', error);
        const message = 
          (error.response && 
           error.response.data && 
           error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);
        setIsRefreshing(false);

        toast.error('Error: ' + message, {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  const handleDelete = (id) => {
    setFormToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!formToDelete) return;

    formService.deleteForm(formToDelete)
      .then((response) => {
        // Check if the response has an error property
        if (response && response.error) {
          setError(response.message || 'Failed to delete form. Please try again.');
          setShowDeleteConfirm(false);
          return;
        }

        loadForms();
        setShowDeleteConfirm(false);
      })
      .catch(error => {
        const message = 
          (error.response && 
           error.response.data && 
           error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setShowDeleteConfirm(false);
      });
  };

  const copyPublicUrl = (publicUrl) => {
    const url = `${window.location.origin}/form/${publicUrl}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Public URL copied to clipboard!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error('Failed to copy URL:', error);
        toast.error('Failed to copy URL. Please try again.', {
          position: "top-right",
          autoClose: 3000,
        });

        // Fallback method
        try {
          // Create a temporary input element
          const tempInput = document.createElement('input');
          tempInput.value = url;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);

          toast.success('Public URL copied to clipboard!', {
            position: "top-right",
            autoClose: 2000,
          });
        } catch (fallbackError) {
          console.error('Fallback copy method failed:', fallbackError);
          toast.error(`Please copy this URL manually: ${url}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
  };

  // Skeleton loading UI
  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              className="border-b border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 animate-pulse"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((btn) => (
                    <div key={btn} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <motion.div 
            className="relative w-20 h-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-500 border-r-indigo-300 border-b-indigo-200 border-l-indigo-400 animate-spin"></div>
            <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-purple-500 border-r-purple-300 border-b-purple-200 border-l-purple-400 animate-spin-slow"></div>
            <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-blue-400 animate-reverse-spin"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="max-w-3xl mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-red-200 dark:border-red-900">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }}
                  className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </motion.div>
              </div>
              <div className="ml-4">
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  We encountered an issue
                </motion.h3>
                <motion.p 
                  className="mt-1 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {error}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                onClick={loadForms}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Try Again
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="py-8">
      {/* Toast Container for notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 rounded-full p-3 mr-3 shadow-lg">
                    <motion.svg 
                      className="h-6 w-6 text-red-600 dark:text-red-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      initial={{ rotate: -5 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </motion.svg>
                  </div>
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Delete Form
                  </motion.h3>
                </div>

                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Are you sure you want to delete this form? This action cannot be undone and all responses will be permanently deleted.
                </motion.p>

                <motion.div 
                  className="flex justify-end space-x-3"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md"
                    onClick={() => setShowDeleteConfirm(false)}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    className="px-4 py-2 border border-transparent rounded-lg shadow-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    onClick={confirmDelete}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.2), 0 4px 6px -2px rgba(239, 68, 68, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <motion.h1 
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Forms
          </motion.h1>

          {/* Refresh button */}
          <motion.button
            onClick={() => {
              setIsRefreshing(true);
              loadForms();
            }}
            className="ml-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            title="Refresh forms"
            disabled={loading || isRefreshing}
          >
            <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            to="/forms/create"
            className="group px-5 py-2.5 border border-transparent rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
            title="Create a new form"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create New Form
            </div>
          </Link>
        </motion.div>
      </div>

      {forms.length === 0 ? (
        <motion.div 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full -mr-32 -mt-32 opacity-70"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full -ml-32 -mb-32 opacity-70"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-200 to-red-200 dark:from-pink-900/20 dark:to-red-900/20 rounded-full opacity-50"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2 
              }}
              className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 transform -rotate-3 relative overflow-hidden"
              whileHover={{ 
                rotate: 3,
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.1)"
              }}
            >
              {/* Animated background for the icon */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              ></motion.div>

              <motion.svg 
                className="w-16 h-16 text-white drop-shadow-lg" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </motion.svg>
            </motion.div>

            <motion.h3
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              No Forms Yet
            </motion.h3>

            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Get started by creating your first form. You can collect feedback, conduct surveys, or gather any information you need with our easy-to-use form builder.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                to="/forms/create"
                className="group inline-flex items-center px-8 py-4 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <motion.svg 
                  className="w-5 h-5 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 5
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </motion.svg>
                Create Your First Form
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {forms.map((form, index) => (
              <motion.li 
                key={form.id} 
                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Decorative gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Left accent border on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-full"></div>

                <div className="px-6 py-5 relative">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <motion.p 
                        className="text-xl font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {form.title}
                      </motion.p>
                      <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-1">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created: {new Date(form.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {form.responseCount > 0 && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              {form.responseCount} {form.responseCount === 1 ? 'Response' : 'Responses'}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {form.createdBy}
                          </p>
                        </div>
                      </div>

                      {form.description && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{form.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        onClick={() => {
                          copyPublicUrl(form.publicUrl);
                          toast.success('Public URL copied to clipboard!', {
                            position: "top-right",
                            autoClose: 2000,
                          });
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm hover:bg-indigo-50/90 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        title="Copy public URL to clipboard"
                      >
                        <svg className="w-4 h-4 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                        Copy Link
                      </motion.button>

                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }} 
                        whileTap={{ scale: 0.95 }}
                        title="View form details"
                      >
                        <Link
                          to={`/forms/${form.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm hover:bg-indigo-50/90 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          View
                        </Link>
                      </motion.div>

                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }} 
                        whileTap={{ scale: 0.95 }}
                        title="View form responses"
                      >
                        <Link
                          to={`/forms/${form.id}/responses`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm hover:bg-indigo-50/90 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                          </svg>
                          Responses ({form.responseCount})
                        </Link>
                      </motion.div>

                      <motion.button
                        onClick={() => {
                          setFormToDelete(form.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-600 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        title="Delete this form"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default FormList;
