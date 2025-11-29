import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const levelClasses = {
    Low: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    Medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    High: 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    Critical: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };
  
  const icons = {
    Low: '✓',
    Medium: '!',
    High: '!!',
    Critical: '!!!',
  };
  
  return (
    <span className={`${baseClasses} ${levelClasses[level]} ${className}`}>
      <span className="mr-1 text-xs">{icons[level]}</span>
      {level}
    </span>
  );
};

export default RiskBadge;