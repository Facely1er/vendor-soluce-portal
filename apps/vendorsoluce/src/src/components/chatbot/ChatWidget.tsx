import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePageContext } from '../../hooks/usePageContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChatbot } from '../../hooks/useChatbot';
import './ChatWidget.css';
import { logger } from '../../utils/logger';

interface ChatWidgetProps {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  initialMessage?: string;
  context?: {
    page: string;
    feature?: string;
    userRole?: string;
  };
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  isOpen: controlledIsOpen, 
  onToggle, 
  initialMessage,
  context: propContext 
}) => {
  const { user, profile } = useAuth();
  const pageContext = usePageContext();
  const [isOpen, setIsOpen] = useState(controlledIsOpen || false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    loadChatHistory
  } = useChatbot({
    userId: user?.id,
    context: {
      ...pageContext,
      ...propContext,
      userRole: profile?.role,
      companySize: profile?.company_size,
      industry: profile?.industry
    }
  });

  // Handle controlled vs uncontrolled state
  const actualIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;
  const actualOnToggle = onToggle || setIsOpen;

  useEffect(() => {
    if (actualIsOpen && initialMessage) {
      sendMessage(initialMessage);
    }
  }, [actualIsOpen, initialMessage, sendMessage]);

  useEffect(() => {
    if (actualIsOpen && user?.id) {
      loadChatHistory();
    }
  }, [actualIsOpen, user?.id, loadChatHistory]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setIsTyping(true);
    try {
      await sendMessage(message);
    } catch (err) {
      logger.error('Failed to send message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggle = () => {
    const newState = !actualIsOpen;
    actualOnToggle(newState);
    if (newState && user?.id) {
      loadChatHistory();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!actualIsOpen) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 bg-vendorsoluce-green hover:bg-vendorsoluce-green/90 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105 group"
        aria-label="Open chat support"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          !
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-vendorsoluce-green rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              VendorSoluce Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4 text-gray-500" />
            ) : (
              <Minimize2 className="h-4 w-4 text-gray-500" />
            )}
          </button>
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]"
          >
            <MessageList 
              messages={messages} 
              isLoading={isLoading}
              isTyping={isTyping}
            />
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-600 dark:text-red-400 text-xs underline mt-1"
                >
                  Try refreshing the page
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading || isTyping}
              placeholder="Ask me anything about VendorSoluce..."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
