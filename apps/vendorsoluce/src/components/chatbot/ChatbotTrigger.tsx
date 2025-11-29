import React from 'react';
import { Button } from '../ui/Button';
import { MessageCircle, Bot } from 'lucide-react';
import { useChatbot } from './ChatbotProvider';

interface ChatbotTriggerProps {
  context?: 'vendor-onboarding' | 'assessment' | 'general';
  variant?: 'floating' | 'inline' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const ChatbotTrigger: React.FC<ChatbotTriggerProps> = ({
  context = 'general',
  variant = 'floating',
  size = 'md',
  className = '',
  children
}) => {
  const { openChatbot, isOpen } = useChatbot();

  const handleClick = () => {
    openChatbot(context);
  };

  if (variant === 'floating') {
    return (
      <Button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${className}`}
        size={size}
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        {children || 'Ask Assistant'}
      </Button>
    );
  }

  if (variant === 'minimal') {
    return (
      <Button
        onClick={handleClick}
        variant="ghost"
        size={size}
        className={`hover:bg-vendorsoluce-green/10 hover:text-vendorsoluce-green ${className}`}
      >
        <Bot className="h-4 w-4 mr-2" />
        {children || 'Assistant'}
      </Button>
    );
  }

  // inline variant
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size={size}
      className={className}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {children || 'Get Help'}
    </Button>
  );
};

export default ChatbotTrigger;