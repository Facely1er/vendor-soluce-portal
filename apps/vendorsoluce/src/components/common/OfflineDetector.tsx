import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineDetector: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection quality
    const checkConnection = async () => {
      try {
        const response = await fetch('/ping.txt', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
        setShowOfflineMessage(true);
      }
    };

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${
      isOnline ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          {isOnline ? (
            <>
              <Wifi className="h-5 w-5 mr-2" />
              <span className="font-medium">Connection restored</span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 mr-2" />
              <span className="font-medium">You're offline. Some features may not work.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineDetector;