import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../chatbot/ChatbotProvider';
import { Button } from '../ui/Button';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Video, 
  FileText,
  ChevronDown,
  X
} from 'lucide-react';

const HelpButton: React.FC = () => {
  const { openChatbot } = useChatbot();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const helpOptions = [
    {
      id: 'chatbot',
      title: 'Ask Assistant',
      description: 'Get instant help with AI',
      icon: MessageSquare,
      action: () => {
        openChatbot('general');
        setIsDropdownOpen(false);
      }
    },
    {
      id: 'video-tutorials',
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: () => {
        // In a real app, this would open video tutorials
        window.open('/tutorials', '_blank');
        setIsDropdownOpen(false);
      }
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Technical documentation',
      icon: FileText,
      action: () => {
        // In a real app, this would open documentation
        window.open('/docs', '_blank');
        setIsDropdownOpen(false);
      }
    }
  ];

  return (
    <div className="relative z-20" ref={dropdownRef}>
      {/* Main Help Button */}
      <Button
        variant="outline"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <HelpCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Help</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Get Help
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDropdownOpen(false)}
                className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {helpOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-vendorsoluce-pale-green dark:bg-vendorsoluce-green/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-vendorsoluce-green" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {option.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openChatbot('general');
                    setIsDropdownOpen(false);
                  }}
                  className="text-xs"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Start Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.open('/docs', '_blank');
                    setIsDropdownOpen(false);
                  }}
                  className="text-xs"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Docs
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpButton;

