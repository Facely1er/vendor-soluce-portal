export interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  context: string[];
  confidence: number;
  suggestions?: string[];
  action?: string;
}

export const knowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 'vendor-management',
    title: 'Vendor Management',
    content: 'Vendor management in VendorSoluce allows you to add, assess, and monitor your vendor ecosystem. You can track risk scores, compliance status, and manage vendor relationships effectively.',
    keywords: ['vendor', 'vendors', 'add vendor', 'vendor management', 'supplier', 'third party'],
    context: ['vendor-risk-dashboard', 'dashboard'],
    confidence: 0.9,
    suggestions: [
      'How do I add a new vendor?',
      'How to assess vendor risk?',
      'What do risk scores mean?',
      'How to manage vendor compliance?'
    ],
    action: 'navigate:/vendor-risk-dashboard'
  },
  {
    id: 'sbom-analysis',
    title: 'SBOM Analysis',
    content: 'SBOM (Software Bill of Materials) analysis helps you identify vulnerabilities and compliance issues in your software components. VendorSoluce supports SPDX and CycloneDX formats and provides detailed vulnerability reports.',
    keywords: ['sbom', 'software bill of materials', 'vulnerability', 'security scan', 'component analysis'],
    context: ['sbom-analyzer'],
    confidence: 0.9,
    suggestions: [
      'What file formats are supported?',
      'How to interpret vulnerability results?',
      'What is NIST compliance?',
      'How to export analysis results?'
    ],
    action: 'navigate:/sbom-analyzer'
  },
  {
    id: 'supply-chain-assessment',
    title: 'Supply Chain Assessment',
    content: 'Supply Chain Assessments evaluate your organization\'s security posture using the NIST SP 800-161 framework. The assessment covers 6 key domains: Governance, Supplier Management, Product Security, Incident Response, Information Sharing, and Continuous Monitoring.',
    keywords: ['assessment', 'supply chain', 'nist', 'compliance', 'security posture', 'evaluation'],
    context: ['supply-chain-assessment'],
    confidence: 0.9,
    suggestions: [
      'What domains are covered?',
      'How long does an assessment take?',
      'How to interpret results?',
      'How to export assessment report?'
    ],
    action: 'navigate:/supply-chain-assessment'
  },
  {
    id: 'nist-compliance',
    title: 'NIST SP 800-161 Compliance',
    content: 'NIST SP 800-161 is the Cybersecurity Supply Chain Risk Management (C-SCRM) framework. It provides guidelines for managing cybersecurity risks in supply chains and is required for federal agencies and contractors.',
    keywords: ['nist', 'compliance', 'c-scrm', 'cybersecurity', 'supply chain risk', 'federal'],
    context: ['supply-chain-assessment', 'sbom-analyzer'],
    confidence: 0.8,
    suggestions: [
      'What is NIST SP 800-161?',
      'How to achieve compliance?',
      'What are the key controls?',
      'How to prepare for audits?'
    ]
  },
  {
    id: 'risk-scoring',
    title: 'Risk Scoring System',
    content: 'VendorSoluce uses a comprehensive risk scoring system that evaluates vendors across multiple dimensions including data access, criticality, security controls, compliance, and system exposure. Scores range from 0-100 with color-coded risk levels.',
    keywords: ['risk score', 'scoring', 'risk level', 'critical', 'high', 'medium', 'low'],
    context: ['vendor-risk-dashboard', 'dashboard'],
    confidence: 0.8,
    suggestions: [
      'How are risk scores calculated?',
      'What do the colors mean?',
      'How to improve risk scores?',
      'How to set risk thresholds?'
    ]
  },
  {
    id: 'reporting',
    title: 'Reports and Analytics',
    content: 'VendorSoluce provides comprehensive reporting capabilities including PDF exports, compliance reports, risk dashboards, and customizable analytics. Reports can be generated for assessments, vendor portfolios, and SBOM analyses.',
    keywords: ['report', 'reports', 'export', 'pdf', 'analytics', 'dashboard', 'metrics'],
    context: ['dashboard', 'vendor-risk-dashboard', 'sbom-analyzer'],
    confidence: 0.8,
    suggestions: [
      'How to export reports?',
      'What report formats are available?',
      'How to customize reports?',
      'How to schedule reports?'
    ]
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'To get started with VendorSoluce: 1) Complete your profile setup, 2) Add your first vendor, 3) Run a supply chain assessment, 4) Analyze SBOM files, 5) Review your risk dashboard. The platform provides guided tours and templates to help you along the way.',
    keywords: ['getting started', 'begin', 'start', 'first steps', 'onboarding', 'setup'],
    context: ['dashboard', 'onboarding'],
    confidence: 0.9,
    suggestions: [
      'How to complete profile setup?',
      'How to add my first vendor?',
      'How to run my first assessment?',
      'Take a guided tour'
    ]
  },
  {
    id: 'templates',
    title: 'Templates and Resources',
    content: 'VendorSoluce provides various templates and resources including NIST assessment templates, vendor questionnaire templates, SBOM templates, and compliance guides. These can be downloaded and customized for your organization.',
    keywords: ['template', 'templates', 'download', 'resource', 'resources', 'questionnaire'],
    context: ['templates'],
    confidence: 0.8,
    suggestions: [
      'What templates are available?',
      'How to download templates?',
      'How to customize templates?',
      'Where to find compliance guides?'
    ],
    action: 'navigate:/templates'
  },
  {
    id: 'security-features',
    title: 'Security Features',
    content: 'VendorSoluce implements enterprise-grade security including encryption at rest and in transit, role-based access control, audit logging, and compliance with SOC 2 and ISO 27001 standards.',
    keywords: ['security', 'encryption', 'access control', 'audit', 'compliance', 'soc2', 'iso27001'],
    context: ['dashboard', 'settings'],
    confidence: 0.7,
    suggestions: [
      'What security measures are in place?',
      'How is data protected?',
      'What compliance standards are met?',
      'How to manage user access?'
    ]
  },
  {
    id: 'integration',
    title: 'Integrations and API',
    content: 'VendorSoluce offers REST APIs for integration with existing systems, webhook support for real-time notifications, and planned integrations with popular tools like Jira, ServiceNow, and SIEM platforms.',
    keywords: ['api', 'integration', 'webhook', 'jira', 'servicenow', 'siem', 'connect'],
    context: ['api-docs', 'integration'],
    confidence: 0.7,
    suggestions: [
      'What APIs are available?',
      'How to set up webhooks?',
      'What integrations are planned?',
      'How to get API access?'
    ],
    action: 'navigate:/api-docs'
  }
];
