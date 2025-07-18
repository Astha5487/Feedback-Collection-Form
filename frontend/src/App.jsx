import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import authService from './services/auth.service'

// Import actual components
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import FormList from './components/FormList'
import FormCreate from './components/FormCreate'
import FormView from './components/FormView'
import FormSubmit from './components/FormSubmit'
import ResponseList from './components/ResponseList'
import ResponseView from './components/ResponseView'
import TestPage from './components/TestPage'


// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400 mb-4"></div>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">Verifying authentication...</p>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 dark:bg-gray-900 min-h-screen transition-colors duration-200 bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-900 dark:to-gray-800">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/test" element={<TestPage />} />

          {/* Protected routes */}
          <Route 
            path="/forms" 
            element={
              <ProtectedRoute>
                <FormList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/create" 
            element={
              <ProtectedRoute>
                <FormCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/:id" 
            element={
              <ProtectedRoute>
                <FormView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/:formId/responses" 
            element={
              <ProtectedRoute>
                <ResponseList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/responses/:id" 
            element={
              <ProtectedRoute>
                <ResponseView />
              </ProtectedRoute>
            } 
          />

          {/* Public form submission */}
          <Route path="/form/:publicUrl" element={<FormSubmit />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App
