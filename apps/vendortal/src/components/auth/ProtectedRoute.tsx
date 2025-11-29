import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false  // Temporarily disabled for development/demo
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-purple"></div>
      </div>
    );
  }

  // Temporarily bypass authentication for development/demo
  // TODO: Re-enable authentication checks when needed
  // if (requireAuth && !isAuthenticated) {
  //   // Redirect to login if not authenticated
  //   return <Navigate to="/signin" state={{ from: location }} replace />;
  // }

  if (!requireAuth && isAuthenticated) {
    // Redirect to home if authenticated and trying to access login/signup
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;