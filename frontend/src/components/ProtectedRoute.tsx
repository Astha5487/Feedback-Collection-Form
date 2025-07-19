import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
}

/**
 * A wrapper component that protects routes by checking if the user is authenticated.
 * If not authenticated, it redirects to the login page with the original destination in the state.
 */
const ProtectedRoute = ({
  isAuthenticated,
  redirectPath = '/login'
}: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;