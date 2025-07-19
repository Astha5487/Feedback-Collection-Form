import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  DocumentPlusIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from './theme/ThemeToggle';

interface LayoutProps {
  onLogout: () => void;
}

const Layout = ({ onLogout }: LayoutProps) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Feedback Platform</h1>
            <ThemeToggle />
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <HomeIcon className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/create-form"
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <DocumentPlusIcon className="mr-3 h-5 w-5" />
              Create Form
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <UserIcon className="mr-3 h-5 w-5" />
              Profile
            </NavLink>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">Feedback Platform</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed inset-0 z-20 bg-gray-800 bg-opacity-75 dark:bg-black dark:bg-opacity-80"
          onClick={closeMobileMenu}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">Feedback Platform</h1>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                  onClick={closeMobileMenu}
                >
                  <HomeIcon className="mr-3 h-5 w-5" />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/create-form"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                  onClick={closeMobileMenu}
                >
                  <DocumentPlusIcon className="mr-3 h-5 w-5" />
                  Create Form
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                  onClick={closeMobileMenu}
                >
                  <UserIcon className="mr-3 h-5 w-5" />
                  Profile
                </NavLink>
              </nav>
              <div className="flex-shrink-0 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1">
          <div className="pt-2 md:pt-0">
            {/* Add padding on mobile to account for the fixed header */}
            <div className="md:py-0 py-14 transition-colors duration-200">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;