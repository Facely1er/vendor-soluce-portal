export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  relatedQuestions: string[];
  action?: string;
}

export const faqData: FAQItem[] = [
  {
    id: 'add-vendor',
    question: 'How do I add a vendor?',
    answer: 'To add a vendor: 1) Go to the Vendor Risk Dashboard, 2) Click "Add Vendor" button, 3) Fill in vendor details (name, contact info, services), 4) Select risk category, 5) Save. You can also use the Quick Tools section for rapid vendor addition.',
    keywords: ['add vendor', 'new vendor', 'vendor creation', 'vendor setup'],
    relatedQuestions: [
      'How to edit vendor information?',
      'What information is required for vendors?',
      'How to categorize vendors?',
      'How to bulk import vendors?'
    ],
    action: 'navigate:/vendor-risk-dashboard'
  },
  {
    id: 'sbom-formats',
    question: 'What SBOM file formats are supported?',
    answer: 'VendorSoluce supports both SPDX (Software Package Data Exchange) and CycloneDX formats. These are the industry-standard formats for Software Bills of Materials. You can upload .spdx, .json, .xml, and .yaml files.',
    keywords: ['sbom format', 'file format', 'spdx', 'cyclonedx', 'upload', 'supported'],
    relatedQuestions: [
      'How to generate SBOM files?',
      'What is SPDX format?',
      'What is CycloneDX format?',
      'How to convert between formats?'
    ],
    action: 'navigate:/sbom-analyzer'
  },
  {
    id: 'assessment-time',
    question: 'How long does a supply chain assessment take?',
    answer: 'A complete supply chain assessment typically takes 15-20 minutes to complete. It includes 24 questions across 6 domains: Governance, Supplier Management, Product Security, Incident Response, Information Sharing, and Continuous Monitoring. Your progress is automatically saved.',
    keywords: ['assessment time', 'how long', 'duration', 'minutes', 'complete'],
    relatedQuestions: [
      'What domains are covered?',
      'Can I save progress?',
      'How to resume assessment?',
      'What happens after completion?'
    ],
    action: 'navigate:/supply-chain-assessment'
  },
  {
    id: 'risk-scores',
    question: 'What do the risk scores mean?',
    answer: 'Risk scores range from 0-100 with color-coded levels: Green (0-25) = Low Risk, Yellow (26-50) = Medium Risk, Orange (51-75) = High Risk, Red (76-100) = Critical Risk. Scores are calculated based on data access, criticality, security controls, compliance, and system exposure.',
    keywords: ['risk score', 'score meaning', 'color code', 'low risk', 'high risk', 'critical'],
    relatedQuestions: [
      'How are scores calculated?',
      'How to improve risk scores?',
      'What factors affect scoring?',
      'How to set risk thresholds?'
    ]
  },
  {
    id: 'export-reports',
    question: 'How do I export reports?',
    answer: 'To export reports: 1) Navigate to the report section, 2) Select the data you want to include, 3) Choose format (PDF, Excel, CSV), 4) Click "Export" button. Reports can be customized with your company branding and include executive summaries.',
    keywords: ['export', 'report', 'pdf', 'excel', 'csv', 'download'],
    relatedQuestions: [
      'What report formats are available?',
      'How to customize reports?',
      'Can I schedule reports?',
      'How to add company branding?'
    ]
  },
  {
    id: 'nist-compliance',
    question: 'What is NIST SP 800-161 compliance?',
    answer: 'NIST SP 800-161 is the Cybersecurity Supply Chain Risk Management (C-SCRM) framework. It provides guidelines for managing cybersecurity risks in supply chains and is required for federal agencies and contractors. It covers governance, supplier management, and continuous monitoring.',
    keywords: ['nist', 'compliance', 'c-scrm', 'cybersecurity', 'supply chain', 'federal'],
    relatedQuestions: [
      'How to achieve NIST compliance?',
      'What are the key controls?',
      'How to prepare for audits?',
      'What documentation is needed?'
    ]
  },
  {
    id: 'vulnerability-analysis',
    question: 'How do I interpret SBOM vulnerability results?',
    answer: 'SBOM vulnerability results show: Critical vulnerabilities (immediate action needed), High vulnerabilities (address within 30 days), Medium/Low vulnerabilities (address in next update cycle). Results include CVE details, affected components, and remediation recommendations.',
    keywords: ['vulnerability', 'sbom results', 'cve', 'critical', 'high', 'remediation'],
    relatedQuestions: [
      'What is a CVE?',
      'How to prioritize vulnerabilities?',
      'How to remediate issues?',
      'How to track remediation progress?'
    ]
  },
  {
    id: 'user-roles',
    question: 'What user roles and permissions are available?',
    answer: 'VendorSoluce supports role-based access control with roles like Admin (full access), Manager (vendor and assessment management), Analyst (view and analyze data), and Viewer (read-only access). Permissions can be customized based on your organization\'s needs.',
    keywords: ['user roles', 'permissions', 'access control', 'admin', 'manager', 'analyst'],
    relatedQuestions: [
      'How to manage user access?',
      'How to assign roles?',
      'What can each role do?',
      'How to customize permissions?'
    ]
  },
  {
    id: 'data-security',
    question: 'How is my data protected?',
    answer: 'VendorSoluce implements enterprise-grade security: encryption at rest and in transit, SOC 2 Type II compliance, ISO 27001 certification, regular security audits, and data residency options. Your data is never shared with third parties without consent.',
    keywords: ['data security', 'encryption', 'privacy', 'protection', 'soc2', 'iso27001'],
    relatedQuestions: [
      'Where is data stored?',
      'What encryption is used?',
      'How to request data deletion?',
      'What compliance standards are met?'
    ]
  },
  {
    id: 'support-contact',
    question: 'How do I contact support?',
    answer: 'You can contact support through: 1) In-app chat (this assistant), 2) Email support@vendorsoluce.com, 3) Support tickets in your account, 4) Phone support for Enterprise customers. Response times: Chat (immediate), Email (24 hours), Phone (4 hours for Enterprise).',
    keywords: ['support', 'contact', 'help', 'email', 'phone', 'ticket'],
    relatedQuestions: [
      'What are support hours?',
      'How to submit a ticket?',
      'What information to include?',
      'How to escalate issues?'
    ],
    action: 'navigate:/contact'
  },
  {
    id: 'pricing-plans',
    question: 'What pricing plans are available?',
    answer: 'VendorSoluce offers: Starter (free tier with basic features), Professional ($99/month for small teams), Enterprise ($299/month for large organizations), and Custom plans for specific needs. All plans include core features with varying limits and support levels.',
    keywords: ['pricing', 'plans', 'cost', 'subscription', 'free', 'enterprise'],
    relatedQuestions: [
      'What\'s included in each plan?',
      'How to upgrade plans?',
      'What are usage limits?',
      'How to get custom pricing?'
    ],
    action: 'navigate:/pricing'
  },
  {
    id: 'mobile-access',
    question: 'Is VendorSoluce available on mobile?',
    answer: 'Yes! VendorSoluce is fully responsive and works on mobile devices. You can access all core features including vendor management, assessments, SBOM analysis, and reports. Native mobile apps are planned for iOS and Android.',
    keywords: ['mobile', 'phone', 'tablet', 'responsive', 'app', 'ios', 'android'],
    relatedQuestions: [
      'What features work on mobile?',
      'How to optimize mobile experience?',
      'When will native apps be available?',
      'How to enable mobile notifications?'
    ]
  }
];
