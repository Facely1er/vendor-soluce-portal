import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'text' | 'dashboard' | 'list';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
            <div className={`h-6 ${baseClasses} mb-4 w-3/4`} />
            <div className={`h-4 ${baseClasses} mb-2 w-full`} />
            <div className={`h-4 ${baseClasses} mb-2 w-5/6`} />
            <div className={`h-4 ${baseClasses} w-4/6`} />
          </div>
        );

      case 'table':
        return (
          <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className={`h-6 ${baseClasses} w-1/4`} />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center space-x-4">
                  <div className={`h-10 w-10 ${baseClasses} rounded-full`} />
                  <div className="flex-1">
                    <div className={`h-4 ${baseClasses} mb-2 w-1/3`} />
                    <div className={`h-3 ${baseClasses} w-1/2`} />
                  </div>
                  <div className={`h-8 w-20 ${baseClasses}`} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={className}>
            <div className={`h-4 ${baseClasses} mb-2 w-full`} />
            <div className={`h-4 ${baseClasses} mb-2 w-5/6`} />
            <div className={`h-4 ${baseClasses} w-4/6`} />
          </div>
        );

      case 'dashboard':
        return (
          <div className={`space-y-6 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className={`h-4 ${baseClasses} mb-3 w-1/2`} />
                  <div className={`h-8 ${baseClasses} w-3/4`} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className={`h-6 ${baseClasses} mb-4 w-1/3`} />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className={`h-4 ${baseClasses} w-1/4`} />
                      <div className={`h-4 ${baseClasses} w-1/6`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className={`h-6 ${baseClasses} mb-4 w-1/3`} />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className={`h-10 w-10 ${baseClasses} rounded-full`} />
                      <div className="flex-1">
                        <div className={`h-4 ${baseClasses} mb-2 w-3/4`} />
                        <div className={`h-3 ${baseClasses} w-1/2`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-4"
              >
                <div className={`h-12 w-12 ${baseClasses} rounded`} />
                <div className="flex-1">
                  <div className={`h-4 ${baseClasses} mb-2 w-1/3`} />
                  <div className={`h-3 ${baseClasses} w-1/2`} />
                </div>
                <div className={`h-8 w-20 ${baseClasses}`} />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
};

export default LoadingSkeleton;
