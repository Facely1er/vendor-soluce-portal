import React from 'react';
import Card from '../components/ui/Card';

const AcceptableUsePolicy: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">ACCEPTABLE USE POLICY</h1>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Effective Date:</strong> October 31, 2025<br />
          <strong>Last Updated:</strong> October 31, 2025
        </p>
      </div>
      
      <Card className="p-8 mb-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This Acceptable Use Policy ("AUP") governs your use of ERMITS LLC ("ERMITS") Services and supplements the Master Terms of Service. By using the Services, you agree to comply with this AUP.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1 Purpose and Scope</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This AUP defines prohibited activities and behavioral standards for all ERMITS users. Violation of this AUP may result in immediate suspension or termination of your access to the Services.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2 Prohibited Activities</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.1 Illegal Activities</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not use the Services to:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Violate any applicable laws, regulations, or ordinances</li>
          <li>Engage in, promote, or facilitate illegal activities</li>
          <li>Violate intellectual property rights, privacy rights, or other third-party rights</li>
          <li>Engage in fraud, money laundering, or financial crimes</li>
          <li>Facilitate human trafficking, child exploitation, or other serious crimes</li>
          <li>Violate export control or economic sanctions laws</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.2 Security Violations</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Attempt to gain unauthorized access to Services, user accounts, or computer systems</li>
          <li>Interfere with or disrupt Services, servers, or networks</li>
          <li>Introduce malware, viruses, worms, Trojan horses, or other harmful code</li>
          <li>Conduct vulnerability scanning, penetration testing, or security assessments without prior written authorization</li>
          <li>Circumvent or attempt to circumvent authentication mechanisms or security controls</li>
          <li>Exploit security vulnerabilities for any purpose</li>
          <li>Participate in denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks</li>
          <li>Engage in password cracking, network sniffing, or packet manipulation</li>
          <li>Use automated tools to bypass rate limits or access restrictions</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.3 Data and Privacy Violations</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Collect, store, or process personal data in violation of applicable privacy laws (GDPR, CCPA, etc.)</li>
          <li>Scrape, harvest, or collect user information without authorization</li>
          <li>Use Services to process data you do not have the right to process</li>
          <li>Upload or transmit data containing personally identifiable information (PII) without appropriate safeguards</li>
          <li>Process special categories of personal data (health, biometric, genetic, racial/ethnic origin, religious beliefs, etc.) without appropriate legal basis</li>
          <li>Violate data subject rights or ignore data deletion requests</li>
          <li>Transmit unsolicited communications (spam, phishing, etc.)</li>
          <li>Engage in identity theft, impersonation, or social engineering attacks</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.4 Abusive Behavior</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Harass, threaten, intimidate, or harm others</li>
          <li>Engage in hate speech, discrimination, or incitement of violence</li>
          <li>Impersonate any person or entity or misrepresent your affiliation</li>
          <li>Stalk or otherwise harass individuals</li>
          <li>Post or transmit sexually explicit, violent, or disturbing content (unless specifically authorized for security research purposes)</li>
          <li>Engage in cyberbullying or coordinated harassment campaigns</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.5 System Abuse</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Exceed rate limits, quotas, or resource allocations</li>
          <li>Use Services for cryptocurrency mining without authorization</li>
          <li>Consume excessive bandwidth, storage, or computational resources</li>
          <li>Interfere with other users' use of Services</li>
          <li>Attempt to reverse engineer, decompile, or disassemble Services (except as permitted by law)</li>
          <li>Create or use multiple accounts to circumvent restrictions or abuse free trials</li>
          <li>Share accounts or credentials with unauthorized users</li>
          <li>Resell, rent, or lease Services without authorization</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.6 Content Violations</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not upload, transmit, or distribute:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Pirated software, copyrighted materials, or illegally obtained content</li>
          <li>Malware, exploit code, or hacking tools (except for authorized security research)</li>
          <li>Content that violates export control laws</li>
          <li>Misleading, deceptive, or fraudulent content</li>
          <li>Content promoting dangerous or illegal activities</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.7 Competitive Activities</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Use Services to develop competing products or services</li>
          <li>Conduct competitive benchmarking or analysis without consent</li>
          <li>Copy, reproduce, or reverse engineer Services for competitive purposes</li>
          <li>Publicly disclose performance or benchmark data without authorization</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3 Acceptable Security Research</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.1 Bug Bounty and Responsible Disclosure</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          ERMITS encourages responsible security research. If you discover a security vulnerability:
        </p>
        
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Permitted Activities:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Responsibly report vulnerabilities to contact@ermits.com</li>
          <li>Conduct good-faith security research on your own accounts</li>
          <li>Test security features within scope of your own data</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Required Practices:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Do not access or modify data belonging to other users</li>
          <li>Do not perform testing that degrades service performance</li>
          <li>Do not publicly disclose vulnerabilities before ERMITS has had reasonable time to remediate</li>
          <li>Provide detailed vulnerability reports with reproduction steps</li>
          <li>Allow ERMITS reasonable time to respond (90 days recommended)</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Prohibited Activities:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Social engineering of ERMITS employees or users</li>
          <li>Denial-of-service testing or performance degradation</li>
          <li>Physical attacks on ERMITS facilities</li>
          <li>Testing on production systems without authorization</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.2 Security Tool Use</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Authorized use of security tools and malware samples:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Security professionals may use Services to analyze malware samples and vulnerabilities</li>
          <li>Analysis must be conducted in isolated environments</li>
          <li>Malicious code must not be executed against ERMITS infrastructure or other users</li>
          <li>Results of security research may not be used for illegal purposes</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4 Federal Contractor and CUI/FCI Handling</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.1 CUI Marking and Handling</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Users processing CUI or FCI must:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Properly mark CUI according to NIST SP 800-171 and 32 CFR Part 2002</li>
          <li>Use encryption features and self-managed deployment options</li>
          <li>Implement appropriate access controls and authentication</li>
          <li>Maintain audit logs of CUI access</li>
          <li>Report cyber incidents as required by DFARS 252.204-7012</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.2 Prohibited CUI Activities</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You may not:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Process CUI without appropriate safeguards</li>
          <li>Share CUI with unauthorized users or countries</li>
          <li>Export CUI in violation of export control laws</li>
          <li>Fail to report cyber incidents involving CUI within required timeframes (72 hours to DoD)</li>
          <li>Store CUI on unauthorized systems or in unauthorized locations</li>
          <li>Transmit CUI over unsecured channels without encryption</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5 Resource Limits and Fair Use</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.1 Resource Quotas</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Services include resource limits based on your subscription tier:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>API Rate Limits:</strong> Requests per minute/hour/day</li>
          <li><strong>Storage Limits:</strong> Total data storage allocation</li>
          <li><strong>Concurrent Users:</strong> Maximum simultaneous users</li>
          <li><strong>File Upload Limits:</strong> Maximum file size and quantity</li>
          <li><strong>Bandwidth Limits:</strong> Data transfer quotas</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.2 Fair Use</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You agree to use resources reasonably and not to:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Significantly exceed your allocated resource quotas</li>
          <li>Use automated tools to generate excessive requests</li>
          <li>Store unnecessary or redundant data</li>
          <li>Hoard resources to the detriment of other users</li>
          <li>Circumvent usage tracking or metering</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.3 Consequences of Excessive Use</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS may, at its discretion:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Throttle or rate-limit excessive usage</li>
          <li>Suspend access until usage returns to normal levels</li>
          <li>Request upgrade to higher-tier subscription</li>
          <li>Charge overage fees for excessive usage (with prior notice)</li>
          <li>Terminate accounts engaging in persistent abuse</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6 Reporting Violations</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.1 How to Report</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">If you become aware of violations of this AUP:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Email:</strong> contact@ermits.com (Subject: "AUP Violation Report")</li>
          <li><strong>Include:</strong> Detailed description, evidence, affected accounts/systems</li>
          <li><strong>Confidential:</strong> Reports are treated confidentially</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.2 Good Faith Reporting</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS will not take adverse action against users who:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Report violations in good faith</li>
          <li>Discover violations in the course of authorized security research</li>
          <li>Report their own accidental violations and take corrective action</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.3 False Reports</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Making false or malicious reports is prohibited and may result in:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Account suspension or termination</li>
          <li>Legal action for damages</li>
          <li>Reporting to law enforcement if appropriate</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7 Enforcement and Consequences</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.1 Investigation</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS may investigate suspected violations by:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Reviewing account activity and usage patterns</li>
          <li>Examining audit logs and system logs (pseudonymized)</li>
          <li>Requesting information from the user</li>
          <li>Cooperating with law enforcement or regulatory authorities</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mb-4 mt-4">
          <strong>Privacy Note:</strong> Due to Privacy-First Architecture, ERMITS cannot access encrypted User Data. Investigations rely on metadata, logs, and user cooperation.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.2 Enforcement Actions</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Depending on violation severity, ERMITS may:</p>
        
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Warning:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Email notification of violation</li>
          <li>Request for corrective action</li>
          <li>Monitoring of future compliance</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Temporary Suspension:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Immediate suspension of account access</li>
          <li>Opportunity to respond and remediate</li>
          <li>Reinstatement upon resolution</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Permanent Termination:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Immediate and permanent account closure</li>
          <li>No refund of fees</li>
          <li>Ban from future use of Services</li>
          <li>Reporting to authorities if required</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Legal Action:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Pursuit of damages for harm caused</li>
          <li>Injunctive relief to prevent ongoing violations</li>
          <li>Cooperation with law enforcement investigations</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.3 Appeals</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">If you believe an enforcement action was made in error:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Contact contact@ermits.com (Subject: "AUP Enforcement Appeal")</li>
          <li>Provide detailed explanation and evidence</li>
          <li>ERMITS will review and respond within 10 business days</li>
          <li>Decision is final and at ERMITS' sole discretion</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8 Cooperation with Law Enforcement</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.1 Legal Requests</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS will cooperate with lawful requests from:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Law enforcement agencies</li>
          <li>Regulatory authorities</li>
          <li>Court orders and subpoenas</li>
          <li>National security investigations</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.2 User Notification</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">When legally permitted, ERMITS will:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Notify affected users of legal requests</li>
          <li>Provide reasonable time to challenge requests</li>
          <li>Disclose only information required by law</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.3 Emergency Situations</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">In emergencies involving imminent threat to life or serious bodily harm:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>ERMITS may disclose information without prior notice</li>
          <li>Users will be notified after emergency resolution</li>
          <li>Disclosure limited to minimum necessary</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9 Third-Party Services and Integrations</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">When using third-party integrations through ERMITS Services:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>You are subject to third-party acceptable use policies</li>
          <li>ERMITS is not responsible for third-party service violations</li>
          <li>Violations of third-party policies may result in integration termination</li>
          <li>You must comply with all applicable third-party terms</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10 Updates to This Policy</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS may update this AUP to reflect:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Evolving security threats and abuse patterns</li>
          <li>Legal and regulatory changes</li>
          <li>New Services or features</li>
          <li>Industry best practices</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Notification:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Material changes: 30 days' advance notice</li>
          <li>Non-material changes: Effective immediately upon posting</li>
          <li>Continued use constitutes acceptance</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11 Contact Information</h2>
        <div className="text-gray-600 dark:text-gray-300 space-y-2">
          <p><strong>AUP Violation Reports:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "AUP Violation Report"</p>
          
          <p><strong>AUP Questions:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "AUP Inquiry"</p>
          
          <p><strong>Appeals:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "AUP Enforcement Appeal"</p>
        </div>
      </Card>
    </div>
  );
};

export default AcceptableUsePolicy;

