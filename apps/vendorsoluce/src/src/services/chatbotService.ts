import { knowledgeBase } from './knowledgeBase';
import { faqData } from './faqData';
import { logger } from '../utils/logger';

export interface ChatbotResponse {
  content: string;
  type?: 'text' | 'suggestion' | 'error';
  suggestions?: string[];
  metadata?: {
    source?: string;
    confidence?: number;
    action?: string;
  };
}

export interface ChatbotRequest {
  message: string;
  userId?: string;
  context?: {
    page?: string;
    feature?: string;
    userRole?: string;
    companySize?: string;
    industry?: string;
  };
  conversationHistory?: Array<{
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>;
}

class ChatbotService {
  private readonly RESPONSE_DELAY = 1000; // Simulate AI processing time

  async sendMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.RESPONSE_DELAY));

    const { message, context } = request;
    // conversationHistory is available for future use in request object
    const normalizedMessage = message.toLowerCase().trim();

    try {
      // Check for FAQ matches first
      const faqMatch = this.findFAQMatch(normalizedMessage);
      if (faqMatch) {
        return {
          content: faqMatch.answer,
          type: 'text',
          suggestions: faqMatch.relatedQuestions,
          metadata: {
            source: 'faq',
            confidence: 0.9,
            action: faqMatch.action
          }
        };
      }

      // Check for knowledge base matches
      const kbMatch = this.findKnowledgeBaseMatch(normalizedMessage, context);
      if (kbMatch) {
        return {
          content: kbMatch.content,
          type: 'text',
          suggestions: kbMatch.suggestions,
          metadata: {
            source: 'knowledge_base',
            confidence: kbMatch.confidence,
            action: kbMatch.action
          }
        };
      }

      // Check for contextual help based on current page/feature
      const contextualHelp = this.getContextualHelp(normalizedMessage, context);
      if (contextualHelp) {
        return contextualHelp;
      }

      // Check for common patterns
      const patternMatch = this.matchCommonPatterns(normalizedMessage);
      if (patternMatch) {
        return patternMatch;
      }

      // Default response with suggestions
      return this.getDefaultResponse(normalizedMessage, context);

    } catch (error) {
      logger.error('Chatbot service error', { error });
      return {
        content: 'I apologize, but I encountered an error processing your request. Please try rephrasing your question or contact our support team for assistance.',
        type: 'error',
        suggestions: [
          'How do I add a vendor?',
          'What is SBOM analysis?',
          'How to run an assessment?',
          'Contact support'
        ]
      };
    }
  }

  private findFAQMatch(message: string): any {
    return faqData.find(faq => 
      faq.keywords.some(keyword => message.includes(keyword.toLowerCase()))
    );
  }

  private findKnowledgeBaseMatch(message: string, context?: any): any {
    const matches = knowledgeBase.filter(kb => 
      kb.keywords.some(keyword => message.includes(keyword.toLowerCase()))
    );

    if (matches.length === 0) return null;

    // Sort by confidence and context relevance
    const sortedMatches = matches.sort((a, b) => {
      let scoreA = a.confidence;
      let scoreB = b.confidence;

      // Boost score for context relevance
      if (context?.page && a.context?.includes(context.page)) scoreA += 0.2;
      if (context?.feature && a.context?.includes(context.feature)) scoreA += 0.2;
      if (context?.userRole && a.context?.includes(context.userRole)) scoreA += 0.1;

      if (context?.page && b.context?.includes(context.page)) scoreB += 0.2;
      if (context?.feature && b.context?.includes(context.feature)) scoreB += 0.2;
      if (context?.userRole && b.context?.includes(context.userRole)) scoreB += 0.1;

      return scoreB - scoreA;
    });

    return sortedMatches[0];
  }

  private getContextualHelp(message: string, context?: any): ChatbotResponse | null {
    if (!context?.page) return null;

    const pageHelp: Record<string, ChatbotResponse> = {
      'dashboard': {
        content: 'I can help you with your dashboard! You can add vendors, run assessments, analyze SBOMs, and view your risk metrics. What would you like to do first?',
        suggestions: [
          'How do I add my first vendor?',
          'How to run a supply chain assessment?',
          'What is SBOM analysis?',
          'How to view risk metrics?'
        ]
      },
      'vendor-risk-dashboard': {
        content: 'The Vendor Risk Dashboard helps you manage and monitor your vendor ecosystem. You can add vendors, track their risk scores, and manage assessments.',
        suggestions: [
          'How do I add a new vendor?',
          'How to assess vendor risk?',
          'What do the risk scores mean?',
          'How to export vendor data?'
        ]
      },
      'sbom-analyzer': {
        content: 'The SBOM Analyzer helps you analyze Software Bills of Materials for vulnerabilities and compliance issues. Upload SPDX or CycloneDX files to get started.',
        suggestions: [
          'What file formats are supported?',
          'How to interpret vulnerability results?',
          'What is NIST compliance?',
          'How to export analysis results?'
        ]
      },
      'supply-chain-assessment': {
        content: 'Supply Chain Assessments evaluate your organization\'s security posture using NIST SP 800-161 framework. The assessment covers 6 key domains.',
        suggestions: [
          'What domains are covered?',
          'How long does an assessment take?',
          'How to interpret results?',
          'How to export assessment report?'
        ]
      }
    };

    return pageHelp[context.page] || null;
  }

  private matchCommonPatterns(message: string): ChatbotResponse | null {
    const patterns: Array<{ pattern: RegExp; response: ChatbotResponse }> = [
      {
        pattern: /hello|hi|hey|greetings/i,
        response: {
          content: 'Hello! I\'m the VendorSoluce Assistant. I\'m here to help you with supply chain risk management, vendor assessments, and SBOM analysis. How can I assist you today?',
          suggestions: [
            'How do I get started?',
            'What is VendorSoluce?',
            'How to add a vendor?',
            'What is SBOM analysis?'
          ]
        }
      },
      {
        pattern: /thank|thanks|appreciate/i,
        response: {
          content: 'You\'re welcome! I\'m glad I could help. Is there anything else you\'d like to know about VendorSoluce?',
          suggestions: [
            'How to run an assessment?',
            'What are the key features?',
            'How to contact support?',
            'View documentation'
          ]
        }
      },
      {
        pattern: /help|support|problem|issue|error/i,
        response: {
          content: 'I\'m here to help! You can ask me about features, get step-by-step guidance, or contact our support team. What specific help do you need?',
          suggestions: [
            'How to use VendorSoluce?',
            'Technical support',
            'Contact support team',
            'View user guide'
          ]
        }
      },
      {
        pattern: /what is|what are|explain|tell me about/i,
        response: {
          content: 'I\'d be happy to explain! VendorSoluce is a comprehensive supply chain risk management platform. What specific topic would you like me to explain?',
          suggestions: [
            'What is VendorSoluce?',
            'What is SBOM analysis?',
            'What is supply chain risk?',
            'What is NIST compliance?'
          ]
        }
      }
    ];

    for (const { pattern, response } of patterns) {
      if (pattern.test(message)) {
        return response;
      }
    }

    return null;
  }

  private getDefaultResponse(message: string, context?: any): ChatbotResponse {
    const suggestions = [
      'How do I add a vendor?',
      'What is SBOM analysis?',
      'How to run an assessment?',
      'What is NIST compliance?',
      'How to export reports?',
      'Contact support'
    ];

    // Add context-specific suggestions
    if (context?.page === 'dashboard') {
      suggestions.unshift('How to customize my dashboard?');
    } else if (context?.page === 'vendor-risk-dashboard') {
      suggestions.unshift('How to filter vendors?');
    } else if (context?.page === 'sbom-analyzer') {
      suggestions.unshift('What file formats are supported?');
    }

    return {
      content: `I understand you're asking about "${message}". While I may not have a specific answer for that, I can help you with VendorSoluce features, assessments, SBOM analysis, and more. What would you like to know?`,
      type: 'text',
      suggestions: suggestions.slice(0, 4),
      metadata: {
        source: 'default',
        confidence: 0.3
      }
    };
  }
}

export const chatbotService = new ChatbotService();
