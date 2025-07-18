import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logOut = () => {
    authService.logout();
    setCurrentUser(undefined);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-indigo-700 to-purple-800 shadow-xl' 
        : 'bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg'
    } text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold tracking-tight hover:text-indigo-100 transition-colors duration-200 flex items-center">
                <svg className="w-7 h-7 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  Feedback Collection
                </span>
              </Link>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700/70 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 relative group"
              >
                <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                Home
              </Link>
              <Link 
                to="/test" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700/70 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 relative group"
              >
                <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                API Test
              </Link>
              {currentUser && (
                <>
                  <Link 
                    to="/forms" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700/70 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 relative group"
                  >
                    <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                    My Forms
                  </Link>
                  <Link 
                    to="/forms/create" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700/70 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 relative group"
                  >
                    <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
                    Create Form
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {/* Theme toggle button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-indigo-700/80 hover:bg-indigo-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-indigo-500/50"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5 text-yellow-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-200 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  )}
                </button>

                <div className="relative group">
                  <span className="text-sm font-medium bg-indigo-700/80 backdrop-blur-sm px-3 py-2 rounded-full cursor-pointer flex items-center border border-indigo-500/30 shadow-lg">
                    <svg className="w-4 h-4 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                      {currentUser.username}
                    </span>
                  </span>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold">Signed in as</p>
                      <p className="truncate">{currentUser.email || currentUser.username}</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
                  </div>
                </div>

                <button
                  onClick={logOut}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-indigo-500/30"
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                  </span>
                </button>

                {/* About dropdown */}
                <div className="relative group">
                  <button className="px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700/70 transition-all duration-300 transform hover:-translate-y-0.5 border border-indigo-400/30 hover:border-indigo-400/60 backdrop-blur-sm">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      About
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-lg mb-1">Feedback Collection Platform</p>
                      <p className="mb-2">A powerful tool for creating forms and collecting feedback from users.</p>
                      <p className="font-medium mt-2">How to use:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Create an account or log in</li>
                        <li>Create custom forms with various question types</li>
                        <li>Share your form with a unique URL</li>
                        <li>Collect and analyze responses</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Theme toggle button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-indigo-700/80 hover:bg-indigo-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-indigo-500/50"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5 text-yellow-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-200 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  )}
                </button>

                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700/70 transition-all duration-300 transform hover:-translate-y-0.5 border border-indigo-400/30 hover:border-indigo-400/60 backdrop-blur-sm"
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Login
                  </span>
                </Link>

                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-indigo-500/30"
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Sign Up
                  </span>
                </Link>

                {/* About dropdown */}
                <div className="relative group">
                  <button className="px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700/70 transition-all duration-300 transform hover:-translate-y-0.5 border border-indigo-400/30 hover:border-indigo-400/60 backdrop-blur-sm">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      About
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-lg mb-1">Feedback Collection Platform</p>
                      <p className="mb-2">A powerful tool for creating forms and collecting feedback from users.</p>
                      <p className="font-medium mt-2">How to use:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Create an account or log in</li>
                        <li>Create custom forms with various question types</li>
                        <li>Share your form with a unique URL</li>
                        <li>Collect and analyze responses</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
