import React from 'react';
import Card from '../components/ui/Card';

const MasterTermsOfService: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">MASTER TERMS OF SERVICE</h1>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Effective Date:</strong> October 31, 2025<br />
          <strong>Last Updated:</strong> October 31, 2025
        </p>
      </div>
      
      <Card className="p-8 mb-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          By accessing or using any ERMITS LLC ("ERMITS," "we," "our," or "us") products, platforms, or services (collectively, the "Services"), you ("User," "you," or "your") agree to be bound by these Master Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Services.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.1 Scope and Applicability</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">These Terms govern your use of all ERMITS products, including but not limited to:</p>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">TechnoSoluce™ Brand Products:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>SBOM Analyzer - Software supply chain security and vulnerability analysis</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">CyberCertitude™ Brand Products:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>CMMC 2.0 Level 1 Implementation Suite</li>
          <li>CMMC 2.0 Level 2 Compliance Platform</li>
          <li>Original Toolkit (localStorage-based compliance management)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">VendorSoluce™ Brand Products:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Supply Chain Risk Management Platform</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">CyberCorrect™ Brand Products:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Privacy Portal (Workplace privacy compliance)</li>
          <li>Privacy Platform (Multi-regulation privacy compliance automation)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">CyberCaution™ Brand Products:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>RansomCheck (Ransomware readiness assessment)</li>
          <li>Security Toolkit (Comprehensive cybersecurity assessment platform)</li>
          <li>RiskProfessional (CISA-aligned security assessments)</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Product-specific terms may apply as set forth in Product-Specific Addendums.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.2 Definitions</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>"Privacy-First Architecture"</strong> means ERMITS' system design philosophy ensuring that user data is processed locally whenever possible, with optional encrypted cloud synchronization, pseudonymized telemetry, and zero-knowledge data handling principles.</li>
          <li><strong>"User Data"</strong> means any information, content, files, or materials that you upload, submit, generate, or process through the Services.</li>
          <li><strong>"Controlled Unclassified Information" or "CUI"</strong> means information that requires safeguarding or dissemination controls pursuant to federal law, regulations, or government-wide policies.</li>
          <li><strong>"Federal Contract Information" or "FCI"</strong> means information not intended for public release that is provided by or generated for the U.S. Government under a contract.</li>
          <li><strong>"Beta Products"</strong> means Services explicitly marked as "Beta," "Preview," "Early Access," or similar designations indicating pre-release or testing status.</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.3 Eligibility and Account Requirements</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Age Requirement:</strong> You must be at least 18 years of age to use the Services. By using the Services, you represent and warrant that you meet this age requirement.</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Authority:</strong> If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Account Security:</strong> You are responsible for:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying ERMITS immediately of any unauthorized access or security breach</li>
          <li>Using strong, unique passwords and enabling multi-factor authentication where available</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300"><strong>Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy.</p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.4 Privacy-First Architecture and Data Handling</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">ERMITS implements a Privacy-First Architecture across all products, built on the following principles:</p>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.4.1 Client-Side Processing</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          All core computational functions (assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.4.2 Data Sovereignty Options</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You have multiple deployment and storage options:</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Local Storage Options:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Browser-based local storage (IndexedDB, localStorage)</li>
          <li>Desktop application with local file storage</li>
          <li>On-premises deployment (Enterprise customers)</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Cloud Storage Options:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Self-managed cloud infrastructure (you control the environment)</li>
          <li>ERMITS-managed cloud (Supabase or alternative providers)</li>
          <li>Hybrid deployment (local processing with optional encrypted sync)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.4.4 Zero-Knowledge Principles</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">When using ERMITS-managed cloud services with encryption enabled:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Data is encrypted client-side using AES-256-GCM via WebCrypto</li>
          <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
          <li>ERMITS administrators cannot decrypt your data</li>
          <li>You are solely responsible for maintaining access to your encryption keys</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.4.5 Data Minimization</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS collects only the minimum data necessary for service functionality:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, proprietary business data, or detailed vulnerability findings remain under your exclusive control</li>
          <li><strong>Optionally Collected:</strong> Account information (name, email, company) for authentication and billing</li>
          <li><strong>Pseudonymized Telemetry:</strong> Anonymous performance metrics using irreversible cryptographic hashing (opt-in or opt-out based on product)</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.5 License Grant and Restrictions</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.5.1 License to Use Services</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Subject to your compliance with these Terms, ERMITS grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business or personal purposes.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.5.2 License Restrictions</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the Services</li>
          <li>Reverse engineer, decompile, disassemble, or attempt to discover source code or underlying algorithms (except to the extent such restriction is prohibited by applicable law)</li>
          <li>Remove, obscure, or alter any proprietary rights notices</li>
          <li>Use the Services to develop competing products or services</li>
          <li>Access the Services through automated means (bots, scrapers) without prior written authorization</li>
          <li>Attempt to circumvent security measures or gain unauthorized access</li>
          <li>Use the Services in any way that violates applicable laws or regulations</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.6 User Data Ownership and Responsibilities</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.6.1 User Data Ownership</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You retain all ownership rights in your User Data. ERMITS does not claim any ownership or intellectual property rights in your User Data.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.6.3 User Data Responsibilities</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You are solely responsible for:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>The accuracy, quality, and legality of your User Data</li>
          <li>The means by which you acquired User Data</li>
          <li>Compliance with all applicable laws regarding User Data processing</li>
          <li>Maintaining appropriate security controls for your User Data</li>
          <li>Backup and disaster recovery of locally-stored data</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.6.4 Prohibited Data</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not upload, transmit, or process through the Services:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Malware, viruses, or malicious code</li>
          <li>Content that infringes intellectual property rights</li>
          <li>Illegally obtained data or trade secrets</li>
          <li>Personal data of minors without appropriate consent</li>
          <li>Data in violation of applicable export control laws</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.11 Acceptable Use</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You agree to use the Services only for lawful purposes and in accordance with these Terms. Prohibited uses include but are not limited to:
        </p>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.11.1 Illegal Activities</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Violating any applicable laws, regulations, or third-party rights</li>
          <li>Engaging in fraud, money laundering, or other criminal activities</li>
          <li>Facilitating illegal activities or transactions</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.11.2 Security Violations</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Attempting to gain unauthorized access to Services or user accounts</li>
          <li>Interfering with or disrupting Services or servers</li>
          <li>Introducing malware, viruses, or harmful code</li>
          <li>Circumventing security measures or authentication mechanisms</li>
          <li>Conducting security testing without prior written authorization</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.11.3 Harmful Content</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Uploading or transmitting malicious software</li>
          <li>Distributing spam, phishing, or unsolicited communications</li>
          <li>Hosting or distributing pirated or illegal content</li>
          <li>Processing data in violation of applicable privacy laws</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Detailed acceptable use provisions are set forth in the <a href="/acceptable-use-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Acceptable Use Policy</a>.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.12 Payment Terms</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.12.1 Pricing and Billing</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Pricing for Services is set forth on the ERMITS website or in your subscription agreement</li>
          <li>All fees are in U.S. Dollars unless otherwise specified</li>
          <li>Fees are non-refundable except as expressly provided in the Refund & Cancellation Policy</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.12.2 Payment Processing</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Payments are processed through Stripe, Inc., a third-party payment processor</li>
          <li>You authorize ERMITS to charge your designated payment method</li>
          <li>You must provide accurate, current payment information</li>
          <li>You are responsible for all applicable taxes</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.12.3 Subscription Terms</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Subscriptions automatically renew unless cancelled</li>
          <li>Renewal pricing may change with 30 days' notice</li>
          <li>Downgrades take effect at the next billing cycle</li>
          <li>Cancellations must be submitted before renewal date</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.13 Term and Termination</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.13.2 Termination by You</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may terminate your account at any time through:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Account settings within the Services</li>
          <li>Contacting ERMITS support at contact@ermits.com</li>
          <li>Following product-specific cancellation procedures</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.13.3 Termination by ERMITS</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS may suspend or terminate your access immediately without notice if:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>You breach these Terms or any applicable policies</li>
          <li>Your account is inactive for 12+ months (free accounts)</li>
          <li>Your payment method fails or account is delinquent</li>
          <li>Required by law or regulatory authority</li>
          <li>Necessary to protect ERMITS or other users</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.14 Warranties and Disclaimers</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.14.1 Limited Warranty</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          ERMITS warrants that the Services will perform substantially in accordance with published documentation under normal use. This warranty does not apply to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Beta Products or pre-release features</li>
          <li>Free tiers or trial accounts</li>
          <li>Issues caused by user error, misuse, or modifications</li>
          <li>Third-party services or integrations</li>
          <li>Force majeure events</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.14.2 Disclaimer of Warranties</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          EXCEPT AS EXPRESSLY PROVIDED IN SECTION 1.14.1, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Fitness for Purpose:</strong> No warranty that Services will meet your specific requirements</li>
          <li><strong>Uninterrupted Access:</strong> No guarantee of continuous, error-free operation</li>
          <li><strong>Security:</strong> No guarantee that Services are completely secure or error-free</li>
          <li><strong>Accuracy:</strong> No warranty regarding accuracy, completeness, or reliability of outputs</li>
          <li><strong>Compliance:</strong> No guarantee that use of Services will result in regulatory compliance or certification</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.14.3 Compliance Disclaimer</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS products are tools to assist with security and compliance efforts but:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Do not guarantee compliance with any regulatory framework</li>
          <li>Do not constitute legal, compliance, or professional consulting advice</li>
          <li>Require users to interpret results in the context of their specific obligations</li>
          <li>Do not replace qualified security assessments or professional audits</li>
          <li>Are not certification authorities (not C3PAO, not CISA-endorsed)</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.15 Limitation of Liability</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ERMITS LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Indirect, incidental, special, consequential, or punitive damages</li>
          <li>Loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
          <li>Business interruption or lost business opportunities</li>
          <li>Regulatory fines, penalties, or compliance costs</li>
          <li>Cost of procurement of substitute services</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4">
          ERMITS' TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR USE OF THE SERVICES SHALL NOT EXCEED THE GREATER OF:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>$100 USD, or</li>
          <li>The total amount paid by you to ERMITS in the 12 months preceding the claim</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.20 Governing Law and Dispute Resolution</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.20.1 Governing Law</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          These Terms are governed by and construed in accordance with the laws of the District of Columbia, United States, without regard to conflict of law principles. The United Nations Convention on Contracts for the International Sale of Goods does not apply.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.20.3 Binding Arbitration</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof (collectively, "Disputes") shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Arbitration Procedures:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Arbitration shall be conducted in Washington, D.C.</li>
          <li>Arbitration shall be by a single arbitrator</li>
          <li>Arbitrator shall apply District of Columbia law</li>
          <li>Each party bears its own costs and fees</li>
          <li>Arbitrator's decision is final and binding</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1.22 Contact Information</h2>
        <div className="text-gray-600 dark:text-gray-300 space-y-4">
          <p>For questions, concerns, or notices regarding these Terms:</p>
          <p><strong>ERMITS LLC</strong><br />
          Email: contact@ermits.com<br />
          Website: www.ermits.com</p>
          
          <p><strong>For technical support inquiries:</strong><br />
          Email: contact@ermits.com</p>
          
          <p><strong>For privacy inquiries:</strong><br />
          Email: contact@ermits.com</p>
          
          <p><strong>For compliance and legal inquiries:</strong><br />
          Email: contact@ermits.com</p>
        </div>
      </Card>
    </div>
  );
};

export default MasterTermsOfService;

