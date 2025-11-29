import React from 'react';
import Card from '../components/ui/Card';

const CookiePolicy: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">COOKIE POLICY</h1>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Effective Date:</strong> October 31, 2025<br />
          <strong>Last Updated:</strong> October 31, 2025
        </p>
      </div>
      
      <Card className="p-8 mb-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This Cookie Policy explains how ERMITS LLC ("ERMITS," "we," "our," or "us") uses cookies and similar technologies when you use our Services. This policy should be read in conjunction with our Privacy Policy.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1 What Are Cookies?</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.1 Definition</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites or use applications. Cookies enable websites to remember your actions and preferences over time.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.2 Similar Technologies</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">This policy also covers similar technologies including:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Local Storage:</strong> Browser-based storage (localStorage, IndexedDB)</li>
          <li><strong>Session Storage:</strong> Temporary storage cleared when browser closes</li>
          <li><strong>Web Beacons (Pixels):</strong> Small graphics that track page views</li>
          <li><strong>SDKs:</strong> Software development kits for mobile applications</li>
          <li><strong>Fingerprinting:</strong> Device and browser characteristic collection</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2 How We Use Cookies</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.1 Cookie Categories</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We use the following categories of cookies:</p>
        
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Essential Cookies (Always Active):</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Required for basic service functionality:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Authentication and session management</li>
          <li>Security and fraud prevention</li>
          <li>Load balancing and performance</li>
          <li>User preference storage (language, theme)</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Performance Cookies (Optional):</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Help us improve service performance:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Page load time measurement</li>
          <li>Error tracking and debugging (Sentry)</li>
          <li>Feature usage analytics</li>
          <li>Service optimization</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Analytics Cookies (Optional):</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Help us understand how Services are used:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>User behavior patterns (PostHog with differential privacy)</li>
          <li>Popular features and pages</li>
          <li>User journey analysis</li>
          <li>Conversion tracking</li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Functional Cookies (Optional):</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Enable enhanced functionality:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Remember settings and preferences</li>
          <li>Personalize user experience</li>
          <li>Enable integrations with third-party services</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3 Specific Cookies We Use</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cookie Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>sb-access-token</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Supabase</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Authentication</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Essential</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 hour</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>sb-refresh-token</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Supabase</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Session renewal</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Essential</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">30 days</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>theme</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">ERMITS</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">UI theme preference (light/dark)</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Functional</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>language</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">ERMITS</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Language preference</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Functional</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>consent</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">ERMITS</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Cookie consent preferences</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Essential</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>phc_***</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">PostHog</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Anonymous analytics</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Analytics</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">1 year</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"><strong>sentry-session</strong></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Sentry</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Error tracking session</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Performance</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Session</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
          <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4 Third-Party Cookies</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.1 Third-Party Service Providers</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We use third-party services that may set cookies:</p>
        
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Supabase (Authentication & Database):</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Purpose: User authentication and session management</li>
          <li>Privacy: Essential for service functionality</li>
          <li>Control: Required for service use; cannot be disabled</li>
          <li>More info: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://supabase.com/privacy</a></li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Sentry (Error Tracking):</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Purpose: Monitor application errors and performance</li>
          <li>Privacy: Automatically scrubs PII from error reports</li>
          <li>Control: Can be disabled in privacy settings</li>
          <li>More info: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://sentry.io/privacy/</a></li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">PostHog (Analytics):</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Purpose: Anonymous usage analytics with differential privacy</li>
          <li>Privacy: Cannot identify individual users</li>
          <li>Control: Can be disabled in privacy settings (opt-out)</li>
          <li>More info: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://posthog.com/privacy</a></li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Stripe (Payment Processing):</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Purpose: Payment processing and fraud prevention</li>
          <li>Privacy: Handles payment information securely</li>
          <li>Control: Required for payment functionality</li>
          <li>More info: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://stripe.com/privacy</a></li>
        </ul>

        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">Vercel (Hosting & CDN):</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Purpose: Content delivery and performance optimization</li>
          <li>Privacy: Standard web server logs</li>
          <li>Control: Required for service delivery</li>
          <li>More info: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://vercel.com/legal/privacy-policy</a></li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">4.2 Third-Party Privacy</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS is not responsible for third-party cookie practices. We encourage you to review third-party privacy policies. We contractually require third parties to:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Use data only for specified purposes</li>
          <li>Comply with applicable privacy laws</li>
          <li>Implement appropriate security measures</li>
          <li>Respect user privacy choices</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5 Cookies and Privacy-First Architecture</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.1 Minimal Cookie Use</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Due to Privacy-First Architecture:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>No tracking cookies</strong> for advertising or marketing</li>
          <li><strong>No cross-site tracking</strong> or profiling</li>
          <li><strong>Minimal essential cookies</strong> only for functionality</li>
          <li><strong>Local processing</strong> reduces need for server-side cookies</li>
          <li><strong>Pseudonymized analytics</strong> cannot identify individual users</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.2 Data Minimization</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Cookies are designed to collect minimum data necessary:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>No PII in cookies</strong> (names, emails, addresses not stored in cookies)</li>
          <li><strong>Session tokens only</strong> for authentication</li>
          <li><strong>Hashed identifiers</strong> for analytics (cannot be reverse-engineered)</li>
          <li><strong>No sensitive data</strong> in cookies (passwords, financial info, CUI/FCI)</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6 Your Cookie Choices</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.1 Cookie Consent</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">When you first visit ERMITS Services:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Cookie Banner:</strong> You'll see a cookie consent banner</li>
          <li><strong>Granular Control:</strong> Choose which cookie categories to accept</li>
          <li><strong>Default Settings:</strong> Only essential cookies enabled by default</li>
          <li><strong>Change Anytime:</strong> Update preferences in Account Settings</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.2 Managing Cookie Preferences</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Within ERMITS Services:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Navigate to Account Settings → Privacy → Cookie Preferences</li>
          <li>Toggle categories on/off (except essential cookies)</li>
          <li>Save preferences (stored in essential consent cookie)</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Browser Controls:</strong></p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Most browsers allow cookie management:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Block all cookies:</strong> May prevent service functionality</li>
          <li><strong>Block third-party cookies:</strong> Reduces tracking</li>
          <li><strong>Delete cookies:</strong> Clear existing cookies</li>
          <li><strong>Incognito/Private mode:</strong> Cookies deleted when browser closes</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Browser-Specific Instructions:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
          <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.3 Opt-Out Tools</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Analytics Opt-Out:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Disable analytics cookies in Account Settings</li>
          <li>Use browser Do Not Track (DNT) signal (we honor DNT)</li>
          <li>PostHog opt-out: <a href="https://posthog.com/opt-out" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://posthog.com/opt-out</a></li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Error Tracking Opt-Out:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Disable performance cookies in Account Settings</li>
          <li>Sentry respects privacy settings</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7 Do Not Track (DNT)</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.1 DNT Support</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS respects browser Do Not Track signals:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>DNT Enabled:</strong> We disable optional analytics and performance cookies</li>
          <li><strong>Essential Cookies Only:</strong> Authentication and security cookies remain active</li>
          <li><strong>No Tracking:</strong> No behavioral tracking when DNT is enabled</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">7.2 Enabling DNT</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">To enable Do Not Track in your browser:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Chrome:</strong> Not supported (use cookie controls instead)</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Send websites a "Do Not Track" signal</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Website Tracking → Prevent cross-site tracking</li>
          <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Send "Do Not Track" requests</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8 Cookies and International Privacy Laws</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.1 GDPR Compliance (EU/UK/Swiss)</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">For users in the European Economic Area, United Kingdom, or Switzerland:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Consent Required:</strong> We obtain consent before setting non-essential cookies</li>
          <li><strong>Granular Control:</strong> You can accept/reject specific cookie categories</li>
          <li><strong>Easy Withdrawal:</strong> Withdraw consent anytime in Account Settings</li>
          <li><strong>Pre-Checked Boxes Prohibited:</strong> Cookie preferences start with only essential cookies enabled</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.2 CCPA Compliance (California)</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">For California residents:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>No Sale of Data:</strong> We do not sell personal information collected via cookies</li>
          <li><strong>Opt-Out Rights:</strong> You can disable optional cookies anytime</li>
          <li><strong>Disclosure:</strong> This policy discloses all cookies used</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">8.3 Other Jurisdictions</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">We comply with cookie laws in all jurisdictions where we operate, including:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Canada's PIPEDA</li>
          <li>Brazil's LGPD</li>
          <li>Australia's Privacy Act</li>
          <li>Other applicable data protection laws</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9 Cookies and Security</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">9.1 Secure Cookie Practices</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS implements secure cookie handling:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</li>
          <li><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</li>
          <li><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</li>
          <li><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</li>
          <li><strong>Short Expiration:</strong> Session cookies expire quickly</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">9.2 Cookie Security Risks</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Be aware of cookie-related security risks:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Session Hijacking:</strong> Attackers stealing session cookies</li>
          <li><strong>XSS Attacks:</strong> Malicious scripts accessing cookies</li>
          <li><strong>CSRF Attacks:</strong> Unauthorized actions using your cookies</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Protect Yourself:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Use strong, unique passwords</li>
          <li>Enable multi-factor authentication</li>
          <li>Log out when finished (especially on shared devices)</li>
          <li>Clear cookies on shared/public computers</li>
          <li>Keep browser and OS updated</li>
          <li>Use antivirus and security software</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10 Local Storage and IndexedDB</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">10.1 Privacy-First Local Storage</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ERMITS products extensively use browser local storage (localStorage, IndexedDB) for Privacy-First Architecture:</p>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Purpose:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Store assessment data locally (never transmitted to servers)</li>
          <li>Enable offline functionality</li>
          <li>Reduce server data storage</li>
          <li>Provide faster performance</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Privacy Benefits:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Data stays local:</strong> Your data remains on your device</li>
          <li><strong>No server transmission:</strong> ERMITS doesn't access local storage data</li>
          <li><strong>User control:</strong> You can clear local storage anytime</li>
          <li><strong>Encryption option:</strong> Sensitive data can be encrypted locally</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">10.2 Managing Local Storage</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Clear Local Storage:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>Within Services:</strong> Account Settings → Data → Clear Local Data</li>
          <li><strong>Browser Settings:</strong> Developer Tools → Application → Storage → Clear</li>
          <li><strong>Warning:</strong> Clearing local storage deletes locally-stored assessments and data</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Backup Local Data:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Export data before clearing: Account Settings → Export Data</li>
          <li>Download JSON/CSV backups</li>
          <li>Store backups securely</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11 Updates to This Cookie Policy</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">11.1 Policy Changes</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">We may update this Cookie Policy to reflect:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>New cookies or technologies</li>
          <li>Changes in legal requirements</li>
          <li>Service updates or new features</li>
          <li>User feedback</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">11.2 Notification</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Material Changes:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>30 days' advance notice via email</li>
          <li>Updated cookie consent banner on first visit</li>
          <li>Opportunity to review and adjust preferences</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 mb-2 mt-4"><strong>Non-Material Changes:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>Update "Last Updated" date</li>
          <li>Effective immediately upon posting</li>
        </ul>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12 Contact Information</h2>
        <div className="text-gray-600 dark:text-gray-300 space-y-4">
          <p><strong>Cookie Policy Questions:</strong><br />
          Email: contact@ermits.com<br />
          Subject: "Cookie Policy Inquiry"</p>
          
          <p><strong>Cookie Preferences:</strong><br />
          Account Settings → Privacy → Cookie Preferences</p>
          
          <p><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
          Email: contact@ermits.com<br />
          Subject: "Cookie GDPR Inquiry"</p>
          
          <p><strong>Technical Support:</strong><br />
          Email: contact@ermits.com</p>
        </div>
      </Card>
    </div>
  );
};

export default CookiePolicy;

