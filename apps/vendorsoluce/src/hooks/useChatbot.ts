import { useState, useCallback, useEffect } from 'react';
import { logger } from '../utils/logger';
import { ChatMessage } from '../components/chatbot/MessageList';
import { chatbotService } from '../services/chatbotService';

interface ChatbotContext {
  page?: string;
  feature?: string;
  userRole?: string;
  companySize?: string;
  industry?: string;
}

interface UseChatbotOptions {
  userId?: string;
  context?: ChatbotContext;
}

interface UseChatbotReturn {
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearMessages: () => void;
  loadChatHistory: () => Promise<void>;
}

export const useChatbot = ({ userId, context }: UseChatbotOptions): UseChatbotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history from localStorage
  const loadChatHistory = useCallback(async () => {
    if (!userId) return;

    try {
      const stored = localStorage.getItem(`vendorsoluce_chat_${userId}`);
      if (stored) {
        const history = JSON.parse(stored) as Array<Omit<ChatMessage, 'timestamp'> & { timestamp: string }>;
        setMessages(history.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (err) {
      logger.error('Failed to load chat history:', err);
    }
  }, [userId]);

  // Save messages to localStorage
  const saveMessages = useCallback((newMessages: ChatMessage[]) => {
    if (!userId) return;
    
    try {
      localStorage.setItem(`vendorsoluce_chat_${userId}`, JSON.stringify(newMessages));
    } catch (err) {
      logger.error('Failed to save chat history:', err);
    }
  }, [userId]);

  // Send message to chatbot service
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveMessages(newMessages);
      return newMessages;
    });

    try {
      // Get response from chatbot service
      const response = await chatbotService.sendMessage({
        message: content.trim(),
        userId,
        context,
        conversationHistory: messages.slice(-10) // Last 10 messages for context
      });

      // Add bot response
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type || 'text',
        suggestions: response.suggestions,
        metadata: response.metadata
      };

      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        saveMessages(newMessages);
        return newMessages;
      });

    } catch (err) {
      logger.error('Chatbot error', { error: err });
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: 'Sorry, I encountered an error. Please try again or contact support if the issue persists.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        saveMessages(newMessages);
        return newMessages;
      });

      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  }, [userId, context, messages, saveMessages]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    if (userId) {
      localStorage.removeItem(`vendorsoluce_chat_${userId}`);
    }
  }, [userId]);

  // Load history on mount
  useEffect(() => {
    if (userId) {
      loadChatHistory();
    }
  }, [userId, loadChatHistory]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearMessages,
    loadChatHistory
  };
};
