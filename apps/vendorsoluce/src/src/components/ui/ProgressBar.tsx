import React, { useRef, useEffect } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'blue',
  className = '',
  height = 'md',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  // Set CSS custom property via ref to avoid inline styles
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--progress-width', `${clampedValue}%`);
    }
  }, [clampedValue]);

  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Prepare ARIA attributes
  const ariaProps: React.AriaAttributes = {
    'aria-valuenow': clampedValue,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': `${clampedValue}%`,
  };

  return (
    <div 
      ref={containerRef}
      className={`progress-bar-container ${isDarkMode ? 'dark' : ''} ${className}`}
    >
      <div
        className={`progress-bar-fill color-${color} height-${height}`}
        role="progressbar"
        {...ariaProps}
      />
    </div>
  );
};

export default ProgressBar;

