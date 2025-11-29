import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ToastProps {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match exit animation duration
  }, [onClose, id]);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      default: return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'border shadow-lg transition-all duration-300 transform';
    const visibilityStyles = isVisible && !isExiting 
      ? 'translate-x-0 opacity-100' 
      : position.includes('right') 
        ? 'translate-x-full opacity-0' 
        : '-translate-x-full opacity-0';

    switch (type) {
      case 'success':
        return `${baseStyles} ${visibilityStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800`;
      case 'error':
        return `${baseStyles} ${visibilityStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`;
      case 'warning':
        return `${baseStyles} ${visibilityStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800`;
      default:
        return `${baseStyles} ${visibilityStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success': return 'text-green-800 dark:text-green-300';
      case 'error': return 'text-red-800 dark:text-red-300';
      case 'warning': return 'text-yellow-800 dark:text-yellow-300';
      default: return 'text-blue-800 dark:text-blue-300';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg max-w-sm w-full ${getStyles()}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${getTextColor()}`}>
            {title}
          </h4>
          <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
            {message}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className={`flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 transition-colors ${getTextColor()}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Toast;