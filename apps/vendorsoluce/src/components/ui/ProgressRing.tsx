import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressRingProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-20 h-20', 
  lg: 'w-24 h-24',
  xl: 'w-32 h-32'
};

const colorClasses = {
  primary: 'text-vendorsoluce-green dark:text-vendorsoluce-light-green',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400'
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 'md',
  strokeWidth = 4,
  className,
  showPercentage = true,
  color = 'primary',
  children
}) => {
  const radius = size === 'sm' ? 24 : size === 'md' ? 30 : size === 'lg' ? 36 : 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg
        className="transform -rotate-90"
        width={size === 'sm' ? 64 : size === 'md' ? 80 : size === 'lg' ? 96 : 128}
        height={size === 'sm' ? 64 : size === 'md' ? 80 : size === 'lg' ? 96 : 128}
      >
        {/* Background circle */}
        <circle
          cx={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
          cy={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
          cy={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-1000 ease-out',
            colorClasses[color]
          )}
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className={cn(
            'font-bold',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : size === 'lg' ? 'text-lg' : 'text-2xl',
            colorClasses[color]
          )}>
            {Math.round(percentage)}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressRing;

