import React, { useEffect, useState } from 'react';
import { Accessibility } from 'lucide-react';
import { Button } from '../ui/Button';

const AccessibilityHelper: React.FC = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedContrast = localStorage.getItem('high-contrast') === 'true';
    const savedFontSize = localStorage.getItem('font-size') || 'normal';
    
    setIsHighContrast(savedContrast);
    setFontSize(savedFontSize);
    
    // Apply saved preferences
    if (savedContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    document.documentElement.classList.add(`font-size-${savedFontSize}`);
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('high-contrast', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const changeFontSize = (size: 'small' | 'normal' | 'large') => {
    // Remove existing font size classes
    document.documentElement.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');
    
    setFontSize(size);
    localStorage.setItem('font-size', size);
    document.documentElement.classList.add(`font-size-${size}`);
  };

  const skipToMain = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        onClick={skipToMain}
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 bg-vendorsoluce-navy text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Accessibility helper toggle */}
      <button
        onClick={() => setShowHelper(!showHelper)}
        className="fixed bottom-4 left-4 z-40 bg-vendorsoluce-navy text-white p-3 rounded-full shadow-lg hover:bg-vendorsoluce-dark-green focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle accessibility options"
      >
        <Accessibility className="h-5 w-5" />
      </button>

      {/* Accessibility options panel */}
      {showHelper && (
        <div className="fixed bottom-20 left-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-xs">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Accessibility Options</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <div className="flex space-x-2">
                <Button
                  variant={fontSize === 'small' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => changeFontSize('small')}
                >
                  Small
                </Button>
                <Button
                  variant={fontSize === 'normal' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => changeFontSize('normal')}
                >
                  Normal
                </Button>
                <Button
                  variant={fontSize === 'large' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => changeFontSize('large')}
                >
                  Large
                </Button>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isHighContrast}
                  onChange={toggleHighContrast}
                  className="h-4 w-4 text-vendorsoluce-navy focus:ring-vendorsoluce-navy border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  High Contrast Mode
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityHelper;