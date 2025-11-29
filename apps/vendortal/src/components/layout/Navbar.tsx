import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, Layers, FileJson, BarChart3, BookOpen, Phone, Users, DollarSign, Command, Shield } from 'lucide-react';
import { MenuItem } from '../../types';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import QuickAccessMenu from '../common/QuickAccessMenu';
import CommandPalette from '../common/CommandPalette';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleResources = () => setIsResourcesOpen(!isResourcesOpen);
  const toggleSolutions = () => setIsSolutionsOpen(!isSolutionsOpen);

  const primaryNav: MenuItem[] = [
    { title: t('navigation.home'), path: '/', icon: 'Home' },
    { title: t('navigation.vendorAssessments'), path: '/vendor-assessments', icon: 'Shield' },
    { title: t('navigation.dashboard'), path: isAuthenticated ? '/dashboard' : '/dashboard-demo', icon: 'BarChart3' },
    { title: t('navigation.howItWorks'), path: '/how-it-works', icon: 'Layers' },
    { title: t('navigation.solutions'), path: '#', icon: 'Layers' },
    { title: t('navigation.resources'), path: '#', icon: 'BookOpen' },
    { title: 'Vendor Directory', path: '/directory', icon: 'Shield' },
    { title: t('navigation.pricing'), path: '/pricing', icon: 'DollarSign' },
  ];

  const solutionItems: MenuItem[] = [
    // For Buyers: Core Platform Offerings
    { title: t('navigation.vendorAssessments'), path: '/vendor-assessments' },
    { title: 'Vendor Directory', path: '/directory' },
    // For Sellers: Vendor Portal
    { title: t('navigation.vendorPortal'), path: '/vendor/questionnaires' },
  ];

  const resourceItems: MenuItem[] = [
    // User-facing resources (top of menu)
    { title: t('navigation.howItWorks'), path: '/how-it-works' },
    { title: t('navigation.templates'), path: '/templates' },
    // Technical documentation (bottom of menu)
    { title: t('navigation.apiDocs'), path: '/api-docs' },
    { title: t('navigation.integration'), path: '/integration-guides' },
  ];


  // Helper function to determine if a link is active
  const isActiveLink = (path: string, subItems?: MenuItem[]): boolean => {
    // Direct path match
    if (location.pathname === path) return true;
    
    // For dropdown items, check if any sub-item matches
    if (subItems) {
      return subItems.some(item => location.pathname === item.path);
    }
    
    return false;
  };

  // Define active and default link classes
  const getActiveLinkClasses = (isActive: boolean) => {
    return isActive
      ? 'px-3 py-2 rounded-md text-sm font-medium text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20 flex items-center'
      : 'px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center';
  };

  const getActiveButtonClasses = (isActive: boolean) => {
    return isActive
      ? 'px-3 py-2 rounded-md text-sm font-medium text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20 flex items-center'
      : 'px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center';
  };

  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    
    const icons = {
      Home: <Home size={20} />,
      Layers: <Layers size={20} />,
      DollarSign: <DollarSign size={20} />,
      FileJson: <FileJson size={20} />,
      BarChart3: <BarChart3 size={20} />,
      BookOpen: <BookOpen size={20} />,
      Users: <Users size={20} />,
      Phone: <Phone size={20} />,
      Shield: <Shield size={20} />,
    };
    
    return iconName in icons ? icons[iconName as keyof typeof icons] : null;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0" data-tour="main-nav">
            <Link to="/" className="flex items-center">
              <img 
                src="/vendortal.png" 
                alt="VendorTal Risk Review Logo" 
                className="h-12 w-12" 
              />
              <span className="ml-2">
                <span className="block text-xl font-bold text-vendortal-purple dark:text-white">VendorTal™</span>
                <span className="block text-xs text-gray-600 dark:text-gray-400 font-normal">Risk Review</span>
                <span className="block text-xs text-gray-600 dark:text-gray-400 font-normal">by ERMITS</span>
              </span>
            </Link>
          </div>
          
          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {primaryNav.map((item) => 
              item.title === 'Vendor Directory' ? (
                <Link
                  key={item.title}
                  to={item.path}
                  className={getActiveLinkClasses(isActiveLink(item.path))}
                >
                  {getIcon(item.icon)}
                  <span className="ml-1">{item.title}</span>
                </Link>
              ) : item.title === t('navigation.solutions') ? (
                <div key={item.title} className="relative">
                  <button
                    onClick={toggleSolutions}
                    className={getActiveButtonClasses(isActiveLink(item.path, solutionItems))}
                  >
                    {getIcon(item.icon)}
                    <span className="ml-1">{item.title}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  
                  {isSolutionsOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      {solutionItems.map((solution) => (
                        <div key={solution.title}>
                          <Link
                            to={solution.path}
                            className={`block px-4 py-2 text-sm ${
                              isActiveLink(solution.path)
                                ? 'text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => setIsSolutionsOpen(false)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{solution.title}</span>
                              {(solution.path === '/vendor-assessments' || solution.path === '/vendor-security-assessments') && (
                                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                                  Premium
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.title === t('navigation.resources') ? (
                <div key={item.title} className="relative">
                  <button
                    onClick={toggleResources}
                    className={getActiveButtonClasses(isActiveLink(item.path, resourceItems))}
                  >
                    {getIcon(item.icon)}
                    <span className="ml-1">{item.title}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  
                  {isResourcesOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      {resourceItems.map((resource) => (
                        <Link
                          key={resource.title}
                          to={resource.path}
                          className={`block px-4 py-2 text-sm ${
                            isActiveLink(resource.path)
                              ? 'text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setIsResourcesOpen(false)}
                        >
                          {resource.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.title}
                  to={item.path}
                  className={getActiveLinkClasses(isActiveLink(item.path))}
                >
                  {getIcon(item.icon)}
                  <span className="ml-1">{item.title}</span>
                </Link>
              )
            )}
          </div>

          {/* Right: Utilities */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label="Open command palette"
              title="Press Cmd+K or Ctrl+K"
            >
              <Command className="h-5 w-5" />
            </button>
            <QuickAccessMenu />
            <LanguageSwitcher variant="icon" />
            <div data-tour="theme-toggle">
              <ThemeToggle />
            </div>
            <div data-tour="user-menu">
              <UserMenu />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <LanguageSwitcher variant="icon" />
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {primaryNav.map((item) => 
              item.title === t('navigation.resources') ? (
                <div key={item.title}>
                  <button
                    onClick={toggleResources}
                    className={`w-full text-left text-base font-medium flex items-center ${
                      isActiveLink(item.path, resourceItems)
                        ? 'px-3 py-2 text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20'
                        : 'px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {getIcon(item.icon)}
                    <span className="ml-2">{item.title}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  
                  {isResourcesOpen && (
                    <div className="pl-6 py-2 space-y-1">
                      {resourceItems.map((resource) => (
                        <Link
                          key={resource.title}
                          to={resource.path}
                          className={`block px-3 py-2 text-base font-medium ${
                            isActiveLink(resource.path)
                              ? 'text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20'
                              : 'text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setIsResourcesOpen(false);
                          }}
                        >
                          {resource.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.title === t('navigation.solutions') ? (
                <div key={item.title}>
                  <button
                    onClick={toggleSolutions}
                    className={`w-full text-left text-base font-medium flex items-center ${
                      isActiveLink(item.path, solutionItems)
                        ? 'px-3 py-2 text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20'
                        : 'px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {getIcon(item.icon)}
                    <span className="ml-2">{item.title}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  
                  {isSolutionsOpen && (
                    <div className="pl-6 py-2 space-y-1">
                      {solutionItems.map((solution) => (
                        <div key={solution.title}>
                          <Link
                            to={solution.path}
                            className={`block px-3 py-2 text-base font-medium ${
                              isActiveLink(solution.path)
                                ? 'text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20'
                                : 'text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => {
                              setIsOpen(false);
                              setIsSolutionsOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{solution.title}</span>
                              {solution.path === '/vendor-assessments' && (
                                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                                  Premium
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`text-base font-medium flex items-center ${
                    isActiveLink(item.path)
                      ? 'px-3 py-2 text-vendortal-purple dark:text-white bg-vendortal-purple/10 dark:bg-vendortal-purple/20'
                      : 'px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-vendortal-purple dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {getIcon(item.icon)}
                  <span className="ml-2">{item.title}</span>
                </Link>
              )
            )}
          </div>
          
          {/* Mobile User Menu Section */}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-3">
              <UserMenu />
            </div>
          </div>
        </div>
      )}

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </nav>
  );
};

export default Navbar;