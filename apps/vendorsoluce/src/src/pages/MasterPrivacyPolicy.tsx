import React from 'react';
import Card from '../components/ui/Card';

const MasterPrivacyPolicy: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">MASTER PRIVACY POLICY</h1>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Effective Date:</strong> October 31, 2025<br />
          <strong>Last Updated:</strong> October 31, 2025
        </p>
      </div>
      
      <Card className="p-8 mb-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1 Privacy-First Architecture Overview</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.1 Core Principles</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">ERMITS implements Privacy-First Architecture built on five fundamental principles:</p>
        
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">1. Client-Side Processing</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          All core computational functions (security assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible. Your data remains under your control throughout the analysis process.
        </p>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">2. Data Sovereignty Options</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You choose where your data resides:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser or desktop application</li>
          <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control</li>
          <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
          <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">3. Zero-Knowledge Encryption</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">When using ERMITS-managed cloud features with encryption enabled:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Data is encrypted client-side using AES-256-GCM before transmission</li>
          <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
          <li>ERMITS cannot decrypt, access, or view your encrypted data</li>
          <li>You are solely responsible for maintaining access to encryption keys</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">4. Data Minimization</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">We collect only the minimum data necessary for service functionality:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, vulnerability findings, compliance data, or proprietary business information</li>
          <li><strong>Pseudonymized Telemetry:</strong> Optional, anonymous performance metrics using irreversible cryptographic hashing</li>
          <li><strong>Account Data:</strong> Only when you create an account (name, email, company for authentication and billing)</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">5. Transparency and Control</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You have complete control over your data:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Export all data at any time in standard formats (JSON, CSV, PDF)</li>
          <li>Delete all data permanently with one click</li>
          <li>Opt in or opt out of telemetry collection</li>
          <li>Choose your deployment and storage model</li>
          <li>Review detailed data flow documentation</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.2 Privacy-First Implementation by Product</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Each ERMITS product implements Privacy-First Architecture as follows:</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Processing Model</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data Storage Options</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Encryption</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>TechnoSoluce SBOM Analyzer</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">100% client-side</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Local browser storage only</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Optional local encryption</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>CyberCertitude Level 1 & 2</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Client-side with optional sync</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Local, self-managed, or ERMITS cloud</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">AES-256-GCM E2EE</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>VendorSoluce</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Client-side with optional sync</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Local, self-managed, or ERMITS cloud</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">AES-256-GCM E2EE</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>CyberCorrect Portal/Platform</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Client-side with optional sync</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Local, self-managed, or ERMITS cloud</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">AES-256-GCM E2EE</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>CyberCaution Products</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Client-side with optional sync</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Local, self-managed, or ERMITS cloud</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">AES-256-GCM E2EE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2 Information We Collect</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.1 Information You Provide Directly</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Account Information (Optional):</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">When you create an account or subscribe to paid features, we collect:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Company name and job title (optional)</li>
          <li>Billing information (processed by Stripe, not stored by ERMITS)</li>
          <li>Password (cryptographically hashed, never stored in plaintext)</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>User-Generated Content:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Support requests and communications</li>
          <li>Feedback and survey responses</li>
          <li>Customization preferences and settings</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.2 Information We Do NOT Collect</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS explicitly does NOT collect, access, store, or transmit:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>SBOM Data:</strong> Software bill of materials files, component lists, dependency graphs, or package metadata</li>
          <li><strong>Assessment Content:</strong> Security assessments, compliance evaluations, risk analyses, or audit findings</li>
          <li><strong>Vulnerability Data:</strong> Vulnerability scan results, CVE findings, or remediation plans</li>
          <li><strong>Compliance Data:</strong> CMMC documentation, POAMs, SSPs, evidence portfolios, or certification materials</li>
          <li><strong>Proprietary Business Data:</strong> Trade secrets, confidential information, or business-sensitive data</li>
          <li><strong>CUI/FCI:</strong> Controlled Unclassified Information or Federal Contract Information</li>
          <li><strong>Personal Health Information (PHI):</strong> Protected health information under HIPAA</li>
          <li><strong>Financial Records:</strong> Detailed financial data or payment card information (except via Stripe)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.3 Automatically Collected Information</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Pseudonymized Telemetry (Optional):</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">With your consent, we collect anonymous, aggregated performance data:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Feature usage statistics (which tools are used, how often)</li>
          <li>Performance metrics (page load times, API response times)</li>
          <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
          <li>Browser and device information (browser type, OS version, screen resolution)</li>
          <li>Session metadata (session duration, navigation paths)</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Telemetry Characteristics:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed and cannot be reverse-engineered</li>
          <li><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</li>
          <li><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings</li>
          <li><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Technical Data:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>IP address (used for security, rate limiting, and geolocation for service delivery; not linked to user accounts)</li>
          <li>Log data (server logs for security monitoring and debugging; retained for 90 days)</li>
          <li>Cookies and similar technologies (see Cookie Policy)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.4 Information from Third Parties</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Authentication Providers:</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">If you use OAuth (Google, Microsoft, GitHub) for authentication, we receive:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Name and email address from the provider</li>
          <li>Profile information you choose to share</li>
          <li>Provider's unique identifier for your account</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Payment Processor:</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Stripe provides us with:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Payment success/failure status</li>
          <li>Subscription status and billing cycle</li>
          <li>Last 4 digits of payment method (for your reference)</li>
          <li>Billing address (for tax compliance)</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Vulnerability Databases:</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">When you use SBOM analysis or security assessment tools, your browser makes anonymous, client-side queries to:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>OSV.dev (Google Open Source Vulnerabilities)</li>
          <li>NIST National Vulnerability Database</li>
          <li>CISA Known Exploited Vulnerabilities catalog</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300">
          These queries are performed client-side and do not transit ERMITS servers. We do not track or log your queries to these services.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3 How We Use Information</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.1 Service Delivery and Operation</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Provide, maintain, and improve the Services</li>
          <li>Process transactions and send transaction confirmations</li>
          <li>Authenticate users and maintain account security</li>
          <li>Enable features like cloud synchronization and multi-device access</li>
          <li>Provide customer support and respond to inquiries</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.2 Service Improvement and Analytics</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Analyze pseudonymized usage patterns to improve features</li>
          <li>Identify and fix bugs, errors, and performance issues</li>
          <li>Develop new features and services</li>
          <li>Conduct research and analysis (using only aggregated, anonymous data)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.3 Communication</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Send service-related announcements and updates</li>
          <li>Respond to support requests and feedback</li>
          <li>Send security alerts and critical notifications</li>
          <li>Deliver marketing communications (with your consent; opt-out available)</li>
          <li>Conduct user surveys and request feedback</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.4 Security and Fraud Prevention</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Detect and prevent security threats and abuse</li>
          <li>Monitor for unauthorized access or account compromise</li>
          <li>Enforce Terms of Service and Acceptable Use Policy</li>
          <li>Protect ERMITS, users, and third parties from harm</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.5 Legal and Compliance</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Comply with legal obligations and respond to lawful requests</li>
          <li>Enforce our legal rights and agreements</li>
          <li>Protect against legal liability</li>
          <li>Conduct audits and maintain business records</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.6 What We Do NOT Do</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS does NOT:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Sell or rent your personal information to third parties</li>
          <li>Use your data for advertising or marketing to others</li>
          <li>Share your User Data with third parties (except as disclosed in Section 2.4)</li>
          <li>Train AI models on your User Data</li>
          <li>Analyze your assessment results or SBOM data for any purpose</li>
          <li>Profile users for behavioral targeting</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4 Information Sharing and Disclosure</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.1 Service Providers (Sub-Processors)</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We share limited data with trusted third-party service providers who assist in delivering the Services:</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service Provider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data Shared</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>Supabase</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Database and authentication</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Email, encrypted user data (if cloud sync enabled)</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">United States</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>Stripe</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Payment processing</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Email, billing information</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">United States</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>Sentry</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Error monitoring</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Error logs with PII automatically scrubbed</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">United States</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>PostHog</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Analytics</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Pseudonymized usage metrics with differential privacy</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">United States / EU</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>Vercel</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Hosting and CDN</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">IP address, HTTP headers (standard web traffic)</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Global CDN</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Sub-Processor Requirements:</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">All sub-processors are contractually required to:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Use data only for specified purposes</li>
          <li>Implement appropriate security measures</li>
          <li>Comply with applicable privacy laws</li>
          <li>Not use data for their own purposes</li>
          <li>Delete data when no longer needed</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.2 Legal Requirements</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">We may disclose information if required by law or in response to:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Court orders, subpoenas, or legal process</li>
          <li>Government or regulatory investigations</li>
          <li>Law enforcement requests (where legally required)</li>
          <li>National security or public safety threats</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4">When legally permitted, we will:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Notify affected users of legal requests</li>
          <li>Challenge overly broad or improper requests</li>
          <li>Provide only the minimum information required</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5 Data Security Measures</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.1 Encryption</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Data in Transit:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>TLS 1.3 encryption for all data transmission</li>
          <li>HTTPS required for all web traffic</li>
          <li>Certificate pinning for critical connections</li>
          <li>Perfect Forward Secrecy (PFS) enabled</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Data at Rest:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>AES-256-GCM encryption for cloud-stored data</li>
          <li>Client-side encryption with user-controlled keys (zero-knowledge architecture)</li>
          <li>Encrypted database backups</li>
          <li>Secure key management practices</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Data in Use:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Local processing minimizes data exposure</li>
          <li>Memory encryption where supported by browser</li>
          <li>Secure coding practices to prevent data leakage</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.2 Access Controls</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Multi-Factor Authentication (MFA):</strong> Available for all accounts, required for administrators</li>
          <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions based on user roles</li>
          <li><strong>Row-Level Security (RLS):</strong> Database-level isolation ensuring users can only access their own data</li>
          <li><strong>Principle of Least Privilege:</strong> Internal access limited to minimum necessary</li>
          <li><strong>Access Logging:</strong> All data access logged for audit and security monitoring</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6 Your Privacy Rights</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.1 Universal Rights</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">All users have the following rights regardless of location:</p>
        
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Right to Access:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Request a copy of all personal data we hold about you</li>
          <li>Receive information about how your data is processed</li>
          <li>Request access within the Services (Account Settings → Export Data)</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Right to Rectification:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Correct inaccurate or incomplete personal data</li>
          <li>Update information directly in Account Settings</li>
          <li>Contact support for assistance: contact@ermits.com</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Right to Deletion (Right to be Forgotten):</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Request deletion of your personal data</li>
          <li>Delete account and all data via Account Settings → Delete Account</li>
          <li>Data deleted within 30 days (90 days for backups)</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Right to Data Portability:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Export your data in machine-readable formats (JSON, CSV)</li>
          <li>Transfer data to another service provider</li>
          <li>Export available anytime via Account Settings → Export Data</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Right to Restriction of Processing:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Request limitation of processing in certain circumstances</li>
          <li>Temporarily suspend processing while disputes are resolved</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Right to Object:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Object to processing based on legitimate interests</li>
          <li>Opt out of marketing communications</li>
          <li>Disable telemetry collection</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.2 Additional Rights for EU/UK/Swiss Users (GDPR/UK GDPR/Swiss DPA)</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">If you are located in the European Economic Area, United Kingdom, or Switzerland, you have additional rights:</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Legal Basis for Processing:</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">We process your data based on:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Consent:</strong> When you provide explicit consent (e.g., marketing communications, telemetry)</li>
          <li><strong>Contract:</strong> To perform our contract with you (provide Services)</li>
          <li><strong>Legitimate Interests:</strong> For service improvement, security, and fraud prevention (balanced against your rights)</li>
          <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Right to Know:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Categories of personal information collected</li>
          <li>Categories of sources of personal information</li>
          <li>Business or commercial purposes for collecting or selling personal information</li>
          <li>Categories of third parties with whom we share personal information</li>
          <li>Specific pieces of personal information collected</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Right to Opt-Out of Sale:</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS does not sell personal information and has not sold personal information in the past 12 months. We do not sell personal information of minors under 16.</p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7 Contact Information</h2>
        <div className="text-gray-600 dark:text-gray-300 space-y-4">
          <p><strong>Privacy Inquiries:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "Privacy Inquiry"</p>
          
          <p><strong>Data Rights Requests:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "Privacy Rights Request"</p>
          
          <p><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
          Email: contact@ermits.com<br />
          Subject: "GDPR Inquiry"</p>
          
          <p><strong>California Privacy Requests:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "CCPA Request"</p>
          
          <p><strong>Security Concerns:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "Security Issue"</p>
          
          <p><strong>General Inquiries:</strong><br />
          Email: contact@ermits.com<br />
          Website: www.ermits.com</p>
        </div>
      </Card>
    </div>
  );
};

export default MasterPrivacyPolicy;

