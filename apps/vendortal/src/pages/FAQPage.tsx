import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I get started with VendorTal?',
          answer: 'Getting started is easy! Sign up for a free 14-day trial, complete the onboarding process, and send your first security questionnaire to a vendor for due diligence. No credit card required.',
        },
        {
          question: 'Do I need a credit card to start?',
          answer: 'No, you can start with a free 14-day trial without providing a credit card. You can upgrade to a paid plan at any time during or after the trial.',
        },
        {
          question: 'What happens after my trial ends?',
          answer: 'After your trial ends, you can choose to upgrade to a paid plan or continue with the free tier (with limited features). Your data is preserved, so you can pick up where you left off.',
        },
        {
          question: 'How long does it take to set up?',
          answer: 'Most users can get started in under 10 minutes. The onboarding process guides you through account setup, and you can send your first security questionnaire to a vendor immediately.',
        },
      ],
    },
    {
      category: 'Pricing & Billing',
      questions: [
        {
          question: 'What are the pricing plans?',
          answer: 'We offer four main plans: Starter ($49/month), Professional ($149/month), Enterprise ($449/month), and Federal ($899/month). All plans include a 20% discount with annual billing.',
        },
        {
          question: 'Can I change plans later?',
          answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes are prorated, so you only pay the difference for the remaining billing period.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and ACH transfers for annual plans. Enterprise customers can also pay via invoice.',
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions can be cancelled at any time with no cancellation fees.',
        },
      ],
    },
    {
      category: 'Features & Functionality',
      questions: [
        {
          question: 'How do I send a security questionnaire to a vendor?',
          answer: 'To send a security questionnaire: 1) Go to Vendor Security Assessments, 2) Click "Send Questionnaire", 3) Select a vendor and questionnaire template (NIST, CMMC, SOC2, etc.), 4) Send the questionnaire. The vendor will receive a secure link to complete the questionnaire in the portal.',
        },
        {
          question: 'What questionnaire templates are available?',
          answer: 'We offer questionnaire templates for NIST SP 800-161, CMMC 2.0, SOC 2 Type II, ISO 27001, FedRAMP, and FISMA. These templates help you send security questionnaires to vendors for due diligence aligned with these frameworks.',
        },
        {
          question: 'How do vendors complete questionnaires?',
          answer: 'Vendors receive a secure link via email. They access a dedicated portal where they can complete the questionnaire, save progress, and upload evidence. You can track their progress in real-time.',
        },
        {
          question: 'How do I review vendor responses for due diligence?',
          answer: 'Once a vendor completes the questionnaire, you can review their responses in the portal. The system generates compliance scores and due diligence reports to help you evaluate vendor security posture.',
        },
        {
          question: 'Can I customize questionnaire templates?',
          answer: 'Yes! Professional and Enterprise plans allow you to customize questionnaire templates. You can add, remove, or modify questions to fit your specific due diligence needs.',
        },
        {
          question: 'Can I integrate with other tools?',
          answer: 'Yes! Professional and Enterprise plans include API access for integrations. We also offer pre-built integrations with popular GRC and security tools.',
        },
      ],
    },
    {
      category: 'Security & Compliance',
      questions: [
        {
          question: 'How secure is my data?',
          answer: 'The Vendor Risk Assessment Portal implements security measures including encryption at rest and in transit, row-level security for data isolation, and access controls. See our Security page for detailed information about our security practices.',
        },
        {
          question: 'Where is my data stored?',
          answer: 'Data is stored in secure data centers. Enterprise customers can discuss data residency options (US, EU, etc.) based on their requirements. Contact us for specific data residency needs.',
        },
        {
          question: 'Do you comply with GDPR?',
          answer: 'We implement GDPR-compliant data protection measures. We provide data export and deletion capabilities. Data processing agreements (DPAs) are available for enterprise customers upon request.',
        },
        {
          question: 'What certifications do you have?',
          answer: 'We are pursuing SOC 2 Type II certification (in progress). ISO 27001 and FedRAMP are planned for future implementation. See our Security page for current certification status.',
        },
      ],
    },
    {
      category: 'Support & Training',
      questions: [
        {
          question: 'What support do you provide?',
          answer: 'Starter plans include email support. Professional plans get priority support with 24-hour response time. Enterprise and Federal plans include 24/7 dedicated support and account managers.',
        },
        {
          question: 'Do you offer training?',
          answer: 'Training and support are available. Please contact us to discuss training options for your organization.',
        },
        {
          question: 'Is there documentation available?',
          answer: 'Yes! We have documentation and guides available in the Help Center. Visit /help to access help articles and resources for using the Vendor Risk Assessment Portal.',
        },
        {
          question: 'Can I schedule a demo?',
          answer: 'Yes! You can schedule a demo to see the Vendor Risk Assessment Portal in action. Visit /contact to request a demonstration of the portal features.',
        },
      ],
    },
  ];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  let globalIndex = 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Find answers to common questions about the Vendor Risk Assessment Portal
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const currentIndex = globalIndex++;
                  const isOpen = openItems.has(currentIndex);
                  return (
                    <Card key={questionIndex} className="p-6">
                      <button
                        onClick={() => toggleItem(currentIndex)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our support team is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
            </a>
            <a href="/help">
              <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Visit Help Center
              </button>
            </a>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default FAQPage;

