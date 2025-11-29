import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyRoute: React.FC<LazyRouteProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  )
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyRoute;