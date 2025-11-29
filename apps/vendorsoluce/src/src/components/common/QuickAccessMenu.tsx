import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, TrendingUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/logger';

interface QuickAccessItem {
  id: string;
  label: string;
  path: string;
  timestamp: number;
  icon?: React.ReactNode;
}

const QuickAccessMenu: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<QuickAccessItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<QuickAccessItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem('vendorsoluce_recent_items');
      if (stored) {
        try {
          const items = JSON.parse(stored);
          setRecentItems(items.slice(0, 5));
        } catch (e) {
          logger.error('Error loading recent items:', e);
        }
      }

      const storedFavorites = localStorage.getItem('vendorsoluce_favorites');
      if (storedFavorites) {
        try {
          const items = JSON.parse(storedFavorites);
          setFavoriteItems(items);
        } catch (e) {
          logger.error('Error loading favorites:', e);
        }
      }
    }
  }, [isAuthenticated]);

  const trackVisit = (label: string, path: string) => {
    const newItem: QuickAccessItem = {
      id: `${path}-${Date.now()}`,
      label,
      path,
      timestamp: Date.now(),
    };

    const stored = localStorage.getItem('vendorsoluce_recent_items');
    let items: QuickAccessItem[] = [];

    if (stored) {
      try {
        items = JSON.parse(stored);
      } catch (e) {
        logger.error('Error parsing recent items:', e);
      }
    }

    const filteredItems = items.filter(item => item.path !== path);
    const updatedItems = [newItem, ...filteredItems].slice(0, 10);

    localStorage.setItem('vendorsoluce_recent_items', JSON.stringify(updatedItems));
    setRecentItems(updatedItems.slice(0, 5));
    setIsOpen(false);
  };

  const toggleFavorite = (label: string, path: string) => {
    const stored = localStorage.getItem('vendorsoluce_favorites');
    let items: QuickAccessItem[] = [];

    if (stored) {
      try {
        items = JSON.parse(stored);
      } catch (e) {
        logger.error('Error parsing favorites:', e);
      }
    }

    const existingIndex = items.findIndex(item => item.path === path);

    if (existingIndex > -1) {
      items.splice(existingIndex, 1);
    } else {
      items.push({
        id: `${path}-fav`,
        label,
        path,
        timestamp: Date.now(),
      });
    }

    localStorage.setItem('vendorsoluce_favorites', JSON.stringify(items));
    setFavoriteItems(items);
  };

  const isFavorite = (path: string) => {
    return favoriteItems.some(item => item.path === path);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-vendorsoluce-green dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center"
        aria-label="Quick access menu"
        {...(isOpen ? { 'aria-expanded': true } : { 'aria-expanded': false })}
      >
        <TrendingUp className="h-5 w-5" />
        <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {favoriteItems.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center text-xs font-medium text-gray-700 dark:text-gray-300">
                    <Star className="h-3 w-3 mr-1" />
                    Favorites
                  </div>
                </div>
                <div className="py-1">
                  {favoriteItems.map((item) => (
                    <div key={item.id} className="flex items-center group">
                      <Link
                        to={item.path}
                        onClick={() => trackVisit(item.label, item.path)}
                        className="flex-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() => toggleFavorite(item.label, item.path)}
                        className="px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove from favorites"
                      >
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentItems.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center text-xs font-medium text-gray-700 dark:text-gray-300">
                    <Clock className="h-3 w-3 mr-1" />
                    Recent
                  </div>
                </div>
                <div className="py-1">
                  {recentItems.map((item) => (
                    <div key={item.id} className="flex items-center group">
                      <Link
                        to={item.path}
                        onClick={() => trackVisit(item.label, item.path)}
                        className="flex-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() => toggleFavorite(item.label, item.path)}
                        className="px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={isFavorite(item.path) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isFavorite(item.path)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentItems.length === 0 && favoriteItems.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No recent or favorite items yet
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuickAccessMenu;
