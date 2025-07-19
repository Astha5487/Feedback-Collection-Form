import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import ViewForm from './pages/ViewForm';
import PublicForm from './pages/PublicForm';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import { ThemeProvider } from './components/theme/ThemeProvider';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        const isLoggedIn = await authService.checkAuthStatus();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center animate-fade-in">
          <div className="loading-spinner h-12 w-12 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
        <Router>
          <div className="animate-fade-in">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <div className="animate-scale-in">
                  <Home />
                </div>
              } />
              <Route path="/login" element={
                isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <div className="animate-slide-up">
                  <Login onLogin={handleLogin} />
                </div>
              } />
              <Route path="/register" element={
                isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <div className="animate-slide-up">
                  <Register onRegister={handleLogin} />
                </div>
              } />
              <Route path="/form/:publicUrl" element={
                <div className="animate-fade-in">
                  <PublicForm />
                </div>
              } />

              {/* Protected routes */}
              <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                <Route element={<Layout onLogout={handleLogout} />}>
                  <Route path="/dashboard" element={
                    <div className="animate-fade-in">
                      <Dashboard />
                    </div>
                  } />
                  <Route path="/create-form" element={
                    <div className="animate-slide-up">
                      <CreateForm />
                    </div>
                  } />
                  <Route path="/forms/:id" element={
                    <div className="animate-fade-in">
                      <ViewForm />
                    </div>
                  } />
                  <Route path="/profile" element={
                    <div className="animate-scale-in">
                      <Profile />
                    </div>
                  } />
                </Route>
              </Route>

              {/* 404 route */}
              <Route path="*" element={
                <div className="animate-bounce-in">
                  <NotFound />
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;