import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  className = '',
  fullPage = false 
}) => {
  const containerClasses = fullPage 
    ? 'min-h-screen flex items-center justify-center' 
    : 'flex items-center justify-center py-12';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="large" className="mb-4" />
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;