import React from 'react';
import { useI18n } from '../../context/I18nContext';
import { Globe } from 'lucide-react';
import { Button } from '../ui/Button';

interface LanguageSwitcherProps {
  variant?: 'icon' | 'dropdown' | 'buttons';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'dropdown', 
  className = '' 
}) => {
  const { changeLanguage, currentLanguage, supportedLanguages } = useI18n();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Find the current language label
  const currentLanguageLabel = supportedLanguages.find(
    lang => lang.code === currentLanguage
  )?.name || 'English';

  // For icon-only variant
  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`}>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Change language"
          className="p-2"
        >
          <Globe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  changeLanguage(language.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  currentLanguage === language.code
                    ? 'bg-gray-100 dark:bg-gray-700 text-vendortal-navy dark:text-trust-blue font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // For buttons variant
  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`px-2 py-1 text-xs rounded ${
              currentLanguage === language.code
                ? 'bg-vendortal-navy text-white dark:bg-trust-blue'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {language.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Globe className="h-4 w-4 mr-2" />
        <span>{currentLanguageLabel}</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          ></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                changeLanguage(language.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm ${
                currentLanguage === language.code
                  ? 'bg-gray-100 dark:bg-gray-700 text-vendortal-navy dark:text-trust-blue font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;