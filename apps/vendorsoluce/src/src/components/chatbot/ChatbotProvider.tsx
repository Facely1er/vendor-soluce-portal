import React, { createContext, useContext, useState, ReactNode } from 'react';
import Chatbot from './Chatbot';

interface ChatbotContextType {
  isOpen: boolean;
  isMinimized: boolean;
  context: 'vendor-onboarding' | 'assessment' | 'general';
  openChatbot: (context?: 'vendor-onboarding' | 'assessment' | 'general') => void;
  closeChatbot: () => void;
  minimizeChatbot: () => void;
  maximizeChatbot: () => void;
  toggleChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [context, setContext] = useState<'vendor-onboarding' | 'assessment' | 'general'>('general');

  const openChatbot = (newContext: 'vendor-onboarding' | 'assessment' | 'general' = 'general') => {
    setContext(newContext);
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const maximizeChatbot = () => {
    setIsMinimized(false);
  };

  const toggleChatbot = () => {
    if (isOpen) {
      if (isMinimized) {
        maximizeChatbot();
      } else {
        closeChatbot();
      }
    } else {
      openChatbot();
    }
  };

  const value: ChatbotContextType = {
    isOpen,
    isMinimized,
    context,
    openChatbot,
    closeChatbot,
    minimizeChatbot,
    maximizeChatbot,
    toggleChatbot
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
      <Chatbot
        isOpen={isOpen}
        isMinimized={isMinimized}
        context={context}
        onClose={closeChatbot}
        onMinimize={minimizeChatbot}
      />
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};