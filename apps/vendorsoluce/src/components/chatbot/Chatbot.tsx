import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User, 
  Loader2,
  FileText,
  Shield,
  ExternalLink
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  attachments?: {
    type: 'document' | 'link' | 'assessment';
    title: string;
    url?: string;
  }[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  context?: 'vendor-onboarding' | 'assessment' | 'general';
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  isOpen, 
  onClose, 
  onMinimize, 
  isMinimized,
  context = 'general' 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Knowledge base for supply chain risk management
  const knowledgeBase = useMemo(() => ({
    'vendor-onboarding': {
      greetings: [
        "Welcome to the vendor onboarding process! I'm here to help you complete your registration and understand the requirements.",
        "Hi! I can assist you with the vendor onboarding process, document requirements, and answer any questions you might have.",
        "Hello! I'm your onboarding assistant. Let me help you navigate through the vendor registration process."
      ],
      topics: {
        'documents': {
          response: "For vendor onboarding, you'll need to upload several documents:\n\n**Required Documents:**\n• Business License\n• Insurance Certificate\n• Security Policy\n• Compliance Certificates\n\n**Optional but Recommended:**\n• Financial Statements\n• Data Processing Agreements\n• Incident Response Plans\n\nAll documents should be in PDF, DOC, DOCX, JPG, or PNG format and under 10MB.",
          suggestions: [
            "What documents do I need?",
            "How do I upload documents?",
            "What if I don't have all documents?"
          ]
        },
        'assessment': {
          response: "Our assessment process is designed to evaluate your security posture and compliance with industry standards:\n\n**Assessment Types:**\n• Self-Assessment: Complete at your own pace\n• Guided Assessment: Step-by-step with assistance\n• Third-Party Audit: Independent evaluation\n• Hybrid Approach: Combination of methods\n\n**Frameworks Supported:**\n• NIST SP 800-161\n• ISO 27001\n• SOC 2 Type II\n• PCI DSS\n• CMMC",
          suggestions: [
            "What assessment types are available?",
            "How long does an assessment take?",
            "What frameworks do you support?"
          ]
        },
        'compliance': {
          response: "We support various compliance frameworks to help you meet regulatory requirements:\n\n**Key Frameworks:**\n• **NIST SP 800-161**: Supply Chain Risk Management\n• **ISO 27001**: Information Security Management\n• **SOC 2 Type II**: Security, Availability, Processing Integrity\n• **PCI DSS**: Payment Card Industry Data Security\n• **CMMC**: Cybersecurity Maturity Model Certification\n\nEach framework has specific requirements and controls that we'll help you understand and implement.",
          suggestions: [
            "What is NIST SP 800-161?",
            "How do I prepare for ISO 27001?",
            "What are the CMMC requirements?"
          ]
        },
        'security': {
          response: "Security is a critical aspect of vendor risk management. Here are key areas to focus on:\n\n**Essential Security Measures:**\n• Multi-Factor Authentication (MFA)\n• Encryption at rest and in transit\n• Regular security audits\n• Incident response planning\n• Employee security training\n• Vulnerability management\n• Access controls\n• Network security\n\n**Best Practices:**\n• Implement a security-first culture\n• Regular security assessments\n• Keep systems updated\n• Monitor for threats\n• Have a response plan",
          suggestions: [
            "What security measures are required?",
            "How do I implement MFA?",
            "What is incident response planning?"
          ]
        }
      }
    },
    'assessment': {
      greetings: [
        "I'm here to help you with your assessment. What questions do you have about the process?",
        "Assessment assistant at your service! I can help explain requirements, guide you through questions, or clarify any concerns.",
        "Hi! I can assist you with understanding assessment questions, requirements, and help you complete your evaluation."
      ],
      topics: {
        'questions': {
          response: "I can help you understand assessment questions and provide guidance:\n\n**Common Question Types:**\n• Yes/No questions: Direct compliance questions\n• Scale questions (1-5): Maturity level assessments\n• Text responses: Detailed explanations\n• File uploads: Evidence submission\n\n**Tips for Answering:**\n• Be honest and accurate\n• Provide specific examples\n• Include relevant documentation\n• Ask for clarification if needed",
          suggestions: [
            "How do I answer scale questions?",
            "What evidence should I provide?",
            "Can I save my progress?"
          ]
        },
        'evidence': {
          response: "Evidence is crucial for demonstrating compliance. Here's what to include:\n\n**Types of Evidence:**\n• Policy documents\n• Procedure manuals\n• Training records\n• Audit reports\n• Certificates\n• Screenshots\n• Configuration files\n\n**Best Practices:**\n• Use clear, descriptive filenames\n• Ensure documents are current\n• Include relevant context\n• Organize by control area",
          suggestions: [
            "What documents should I upload?",
            "How do I organize evidence?",
            "What if I don't have evidence?"
          ]
        },
        'scoring': {
          response: "Our scoring system evaluates your security posture across multiple dimensions:\n\n**Scoring Factors:**\n• Implementation completeness\n• Evidence quality\n• Control effectiveness\n• Risk mitigation\n\n**Score Ranges:**\n• 80-100: Excellent (Low Risk)\n• 60-79: Good (Medium Risk)\n• 40-59: Fair (High Risk)\n• 0-39: Poor (Critical Risk)\n\n**Improvement Areas:**\n• Focus on low-scoring controls\n• Implement missing measures\n• Strengthen existing processes",
          suggestions: [
            "How is my score calculated?",
            "What does my score mean?",
            "How can I improve my score?"
          ]
        }
      }
    },
    'general': {
      greetings: [
        "Hello! I'm your VendorSoluce assistant. How can I help you today?",
        "Hi there! I can help you with supply chain risk management, assessments, compliance, and more.",
        "Welcome! I'm here to assist you with any questions about VendorSoluce and supply chain security."
      ],
      topics: {
        'features': {
          response: "VendorSoluce offers comprehensive supply chain risk management capabilities:\n\n**Core Features:**\n• **Risk Assessments**: NIST SP 800-161 aligned evaluations\n• **Vendor Management**: Complete vendor lifecycle tracking\n• **SBOM Analysis**: Software bill of materials scanning\n• **Compliance Monitoring**: Multi-framework support\n• **Threat Intelligence**: Real-time risk updates\n• **Reporting**: Comprehensive dashboards and reports\n\n**Quick Tools:**\n• Vendor Risk Calculator\n• SBOM Quick Scan\n• NIST 800-161 Checklist\n• Compliance Tracker\n\n**Premium Features (VendorTal):**\n• Advanced Vendor Security Assessments (CMMC, NIST Privacy Framework)\n• Vendor Portal for assessment completion\n• Automated compliance scoring and analytics\n\nContact sales to learn more about VendorTal premium features.",
          suggestions: [
            "What is SBOM analysis?",
            "How does vendor management work?",
            "What reporting features are available?",
            "What is VendorTal?"
          ]
        },
        'getting-started': {
          response: "Getting started with VendorSoluce is easy:\n\n**Step 1**: Complete your profile and organization setup\n**Step 2**: Add your first vendor or run an assessment\n**Step 3**: Upload relevant documents and evidence\n**Step 4**: Review results and implement recommendations\n\n**Quick Start Options:**\n• Run a supply chain assessment\n• Add a vendor to your portfolio\n• Analyze a software component (SBOM)\n• Take a guided tour",
          suggestions: [
            "How do I add a vendor?",
            "What is a supply chain assessment?",
            "How do I analyze software components?"
          ]
        },
        'support': {
          response: "We're here to help you succeed with VendorSoluce:\n\n**Support Channels:**\n• **In-App Chat**: This chatbot for immediate assistance\n• **Documentation**: Comprehensive guides and tutorials\n• **Email Support**: support@vendorsoluce.com\n• **Knowledge Base**: Searchable help articles\n• **Video Tutorials**: Step-by-step walkthroughs\n\n**Resources:**\n• User Guide\n• API Documentation\n• Integration Guides\n• Best Practices",
          suggestions: [
            "Where can I find documentation?",
            "How do I contact support?",
            "Are there video tutorials?"
          ]
        }
      }
    }
  }), []);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const contextData = knowledgeBase[context];
      const randomGreeting = contextData.greetings[Math.floor(Math.random() * contextData.greetings.length)];
      
      setMessages([{
        id: '1',
        type: 'bot',
        content: randomGreeting,
        timestamp: new Date(),
        suggestions: [
          "What documents do I need?",
          "How does the assessment work?",
          "What are the requirements?",
          "How can I get help?"
        ]
      }]);
    }
  }, [context, knowledgeBase, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    // Simulate API call delay
    setTimeout(() => {
      const response = generateBotResponse(inputValue.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        attachments: response.attachments
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const generateBotResponse = (userInput: string): { content: string; suggestions?: string[]; attachments?: any[] } => {
    const contextData = knowledgeBase[context];
    const input = userInput.toLowerCase();

    // Check for specific topics
    for (const [topic, data] of Object.entries(contextData.topics)) {
      const keywords = topic === 'documents' ? ['document', 'upload', 'file', 'paperwork'] :
                     topic === 'assessment' ? ['assessment', 'evaluation', 'test', 'question'] :
                     topic === 'compliance' ? ['compliance', 'framework', 'standard', 'certification'] :
                     topic === 'security' ? ['security', 'secure', 'protection', 'safety'] :
                     topic === 'questions' ? ['question', 'answer', 'help', 'explain'] :
                     topic === 'evidence' ? ['evidence', 'proof', 'documentation', 'support'] :
                     topic === 'scoring' ? ['score', 'rating', 'grade', 'points'] :
                     topic === 'features' ? ['feature', 'capability', 'function', 'tool'] :
                     topic === 'getting-started' ? ['start', 'begin', 'setup', 'onboard'] :
                     topic === 'support' ? ['help', 'support', 'assistance', 'contact'] :
                     [];

      if (keywords.some(keyword => input.includes(keyword))) {
        return {
          content: data.response,
          suggestions: data.suggestions
        };
      }
    }

    // Default responses based on context
    if (context === 'vendor-onboarding') {
      return {
        content: "I can help you with the vendor onboarding process. You can ask me about:\n\n• Required documents and how to upload them\n• Assessment types and requirements\n• Compliance frameworks we support\n• Security measures and best practices\n\nWhat would you like to know more about?",
        suggestions: [
          "What documents do I need?",
          "How does the assessment work?",
          "What compliance frameworks do you support?",
          "What security measures are required?"
        ]
      };
    } else if (context === 'assessment') {
      return {
        content: "I can help you with your assessment. You can ask me about:\n\n• Understanding assessment questions\n• What evidence to provide\n• How scoring works\n• Best practices for completing assessments\n\nWhat specific area would you like help with?",
        suggestions: [
          "How do I answer assessment questions?",
          "What evidence should I provide?",
          "How is my score calculated?",
          "Can I save my progress?"
        ]
      };
    } else {
      return {
        content: "I can help you with VendorSoluce features and functionality. You can ask me about:\n\n• Core features and capabilities\n• Getting started guide\n• Support and documentation\n• Best practices for supply chain risk management\n\nWhat would you like to learn about?",
        suggestions: [
          "What features are available?",
          "How do I get started?",
          "Where can I find help?",
          "What is supply chain risk management?"
        ]
      };
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-80' : 'w-96'} transition-all duration-300`}>
      <Card className={`shadow-2xl border-0 ${isMinimized ? 'h-16' : 'h-[600px]'} flex flex-col`}>
        <CardHeader className="pb-3 bg-vendorsoluce-navy text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <CardTitle className="text-lg">VendorSoluce Assistant</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-vendorsoluce-navy text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start">
                        {message.type === 'bot' && (
                          <Bot className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center p-2 bg-white/10 rounded text-xs">
                                  {attachment.type === 'document' && <FileText className="h-3 w-3 mr-1" />}
                                  {attachment.type === 'link' && <ExternalLink className="h-3 w-3 mr-1" />}
                                  {attachment.type === 'assessment' && <Shield className="h-3 w-3 mr-1" />}
                                  <span>{attachment.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <Bot className="h-4 w-4 mr-2" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length > 0 && messages[messages.length - 1].suggestions && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-7"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendorsoluce-navy"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="px-3"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default Chatbot;