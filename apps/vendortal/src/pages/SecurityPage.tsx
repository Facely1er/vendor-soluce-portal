import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileCheck, CheckCircle, Award, Server, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const SecurityPage: React.FC = () => {
  const certifications = [
    {
      name: 'SOC 2 Type II',
      status: 'In Progress',
      description: 'Security, availability, and confidentiality controls',
      icon: <Shield className="h-8 w-8" />,
    },
    {
      name: 'ISO 27001',
      status: 'Planned Q2 2026',
      description: 'Information security management system',
      icon: <FileCheck className="h-8 w-8" />,
    },
    {
      name: 'FedRAMP',
      status: 'Planned Q4 2026',
      description: 'Federal Risk and Authorization Management Program',
      icon: <Award className="h-8 w-8" />,
    },
  ];

  const securityFeatures = [
    {
      title: 'Data Encryption',
      description: 'AES-256 encryption at rest and TLS 1.3 in transit',
      icon: <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: 'Row-Level Security',
      description: 'Database-level data isolation and protection',
      icon: <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'TOTP, SMS, and hardware token support',
      icon: <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: 'Access Control',
      description: 'Role-based access control (RBAC) with granular permissions',
      icon: <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
    },
    {
      title: 'Audit Logging',
      description: 'Complete activity tracking for compliance and forensics',
      icon: <FileCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Regular Security Audits',
      description: 'Annual third-party security testing and vulnerability scanning',
      icon: <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />,
    },
  ];

  const complianceFrameworks = [
    { name: 'NIST SP 800-161', status: 'Assessment Templates Available', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
    { name: 'CMMC 2.0', status: 'Assessment Templates Available', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
    { name: 'SOC 2 Type II', status: 'Assessment Templates Available', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
    { name: 'ISO 27001', status: 'Assessment Templates Available', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
    { name: 'FedRAMP', status: 'Assessment Templates Available', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
    { name: 'FISMA', status: 'Assessment Templates Available', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
    { name: 'GDPR', status: 'Data Protection Compliant', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
    { name: 'CCPA', status: 'Data Protection Compliant', icon: <CheckCircle className="h-5 w-5 text-purple-500" /> },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Security & Compliance
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Security measures and data protection for the Vendor Risk Assessment Portal
          </p>
        </div>

        {/* Security Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Security Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Compliance Frameworks */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Compliance Frameworks
          </h2>
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceFrameworks.map((framework, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {framework.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {framework.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {framework.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Certifications & Audits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 dark:text-blue-400 mr-4">
                    {cert.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {cert.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {cert.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {cert.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="mb-16">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Security Best Practices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Data Protection
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Encryption at rest and in transit</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Regular security audits and penetration testing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Automated backups with point-in-time recovery</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Access Control
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Multi-factor authentication (MFA) support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Role-based access control (RBAC)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>SSO/SAML integration support</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have Security Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our security team is available to answer your questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Contact Security Team
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                View Security Resources
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default SecurityPage;

