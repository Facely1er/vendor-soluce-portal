import React from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'error';
  suggestions?: string[];
  metadata?: {
    source?: string;
    confidence?: number;
    action?: string;
  };
}

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  isTyping,
  onSuggestionClick 
}) => {
  const formatTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.sender === 'bot';
    
    return (
      <div
        key={message.id}
        className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isBot 
                ? 'bg-vendorsoluce-green text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}>
              {isBot ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
            <div
              className={`px-4 py-2 rounded-lg ${
                isBot
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'bg-vendorsoluce-green text-white'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestionClick?.(suggestion)}
                      className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors text-xs"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Timestamp */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 && !isLoading && !isTyping && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-vendorsoluce-green" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to VendorSoluce Assistant!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            I'm here to help you with supply chain risk management, vendor assessments, and SBOM analysis.
          </p>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "How do I add a vendor?",
                "What is SBOM analysis?",
                "How to run an assessment?",
                "NIST compliance help"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map(renderMessage)}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="flex flex-row">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-vendorsoluce-green rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 text-vendorsoluce-green animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MessageList;
