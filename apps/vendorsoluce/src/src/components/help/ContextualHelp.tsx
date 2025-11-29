import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../chatbot/ChatbotProvider';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { 
  HelpCircle, 
  X, 
  Video, 
  MessageSquare,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { logger } from '../../utils/logger';

interface ContextualHelpProps {
  helpId?: string;
  title: string;
  content: string;
  videoUrl?: string;
  articleUrl?: string;
  relatedTopics?: string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  helpId: _helpId,
  title,
  content,
  videoUrl,
  articleUrl,
  relatedTopics = [],
  position = 'top',
  className = ''
}) => {
  const { openChatbot } = useChatbot();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpRef.current &&
        !helpRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHelpClick = () => {
    if (isVisible && isExpanded) {
      setIsVisible(false);
      setIsExpanded(false);
    } else {
      setIsVisible(true);
      setIsExpanded(true);
    }
  };

  const handleOpenChatbot = () => {
    openChatbot('general');
    setIsVisible(false);
    setIsExpanded(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-200 dark:border-t-gray-700';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-200 dark:border-b-gray-700';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-200 dark:border-l-gray-700';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-200 dark:border-r-gray-700';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-200 dark:border-t-gray-700';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Help Trigger Button */}
      <Button
        ref={triggerRef}
        variant="ghost"
        size="sm"
        onClick={handleHelpClick}
        className="p-1 h-6 w-6 text-gray-400 hover:text-vendorsoluce-green hover:bg-vendorsoluce-pale-green"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>

      {/* Help Tooltip */}
      {isVisible && (
        <div
          ref={helpRef}
          className={`absolute z-50 w-80 ${getPositionClasses()}`}
        >
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-vendorsoluce-green" />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {title}
                  </h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {content}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {videoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(videoUrl, '_blank')}
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Watch Video
                  </Button>
                )}
                {articleUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(articleUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Read More
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={handleOpenChatbot}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Ask Assistant
                </Button>
              </div>

              {/* Related Topics */}
              {relatedTopics.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Related Topics:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {relatedTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={() => {
                          // In a real app, this would search for the topic
                          logger.log('Search for:', topic);
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()} ${
              position === 'top' ? 'border-t-white dark:border-t-gray-800' :
              position === 'bottom' ? 'border-b-white dark:border-b-gray-800' :
              position === 'left' ? 'border-l-white dark:border-l-gray-800' :
              'border-r-white dark:border-r-gray-800'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ContextualHelp;

