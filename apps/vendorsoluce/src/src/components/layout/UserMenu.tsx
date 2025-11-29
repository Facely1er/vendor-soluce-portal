import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, UserCog, Bell, Activity, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated, startTour } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Link to="/signin">
        <Button variant="primary" size="sm">
          {t('auth.login')}
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
        {...(isOpen ? { 'aria-expanded': true } : { 'aria-expanded': false })}
        aria-haspopup="menu"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-vendorsoluce-navy text-white flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        )}
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
          {user?.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-white">{user?.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
          </div>
          
          <Link
            to="/user-dashboard"
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4 mr-2" />
            {t('auth.dashboard')}
          </Link>
          
          <Link
            to="/profile"
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <UserCog className="h-4 w-4 mr-2" />
            {t('auth.profile')}
          </Link>
          
          <Link
            to="/account"
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t('auth.account')}
          </Link>
          
          <Link
            to="/admin/marketing"
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Marketing Admin
          </Link>
          
          <Link
            to="/notifications"
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Link>
          
          <Link
            to="/user-activity"
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Activity History
          </Link>
          
          <button
            onClick={() => {
              startTour();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Take Product Tour
          </button>
          
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('auth.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;