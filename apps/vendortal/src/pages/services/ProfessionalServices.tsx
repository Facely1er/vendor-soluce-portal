import React, { useState } from 'react';
import { Calendar, Check, TrendingUp, Shield, Award, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import BackToDashboardLink from '../../components/common/BackToDashboardLink';
import { useAuth } from '../../context/AuthContext';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  icon: React.ReactNode;
  badge?: string;
  popular?: boolean;
}

const ProfessionalServices: React.FC = () => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services: ServicePackage[] = [
    {
      id: 'quick-start',
      name: 'Quick Start Package',
      description: 'Get up and running with VendorTal in 5 days',
      price: 5000,
      duration: '5 days',
      features: [
        'Platform setup and configuration',
        'Initial vendor import (up to 10 vendors)',
        'Assessment framework setup (NIST/CMMC)',
        'Team training (up to 5 users)',
        '30-day support included',
        'Documentation and best practices'
      ],
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      badge: 'Most Popular',
      popular: true
    },
    {
      id: 'nist-audit',
      name: 'NIST Compliance Audit',
      description: 'Comprehensive NIST SP 800-161 compliance assessment',
      price: 10000,
      duration: '30 days',
      features: [
        'Gap analysis against NIST SP 800-161',
        'Custom remediation roadmap',
        'Evidence collection assistance',
        'Compliance report generation',
        'Control mapping documentation',
        '3-month follow-up support'
      ],
      icon: <Award className="h-8 w-8 text-green-600" />,
      badge: 'Best Value'
    },
    {
      id: 'integration',
      name: 'Custom Integration',
      description: 'Connect VendorTal to your existing tools',
      price: 25000,
      duration: '60 days',
      features: [
        'Custom API integration',
        'SIEM/workflow tool connection',
        'Custom reporting dashboards',
        'Dedicated developer time',
        'Documentation and training',
        '6-month support included'
      ],
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      badge: 'Enterprise'
    },
    {
      id: 'federal-compliance',
      name: 'Federal Compliance Package',
      description: 'FedRAMP and FISMA compliance readiness',
      price: 50000,
      duration: '90 days',
      features: [
        'FedRAMP authorization support',
        'FISMA compliance framework',
        'NIST 800-53 control mapping',
        'ATO documentation preparation',
        'Federal security controls assessment',
        '12-month support included'
      ],
      icon: <Award className="h-8 w-8 text-red-600" />,
      badge: 'Federal Ready'
    }
  ];

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId);
    // In production, this would open Calendly or redirect to booking page
    window.open('https://calendly.com/vendortal/services', '_blank');
  };

  const handleGetQuote = (serviceId: string) => {
    // Open contact form with pre-filled service info
    window.location.href = `/contact?service=${serviceId}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToDashboardLink />

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Professional Services
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Accelerate your vendor risk management implementation with our expert services team
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {services.map((service) => (
          <Card key={service.id} className={`relative ${service.popular ? 'border-2 border-blue-500' : ''}`}>
            {service.badge && (
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                service.popular ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {service.badge}
              </div>
            )}

            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {service.icon}
                </div>
              </div>
              <CardTitle className="text-2xl mb-2">{service.name}</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.duration}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${service.price.toLocaleString()}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleBookService(service.id)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Free Consultation
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGetQuote(service.id)}
                >
                  Get Custom Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Services */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Ongoing Support Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Managed Services
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ongoing platform management and optimization
              </p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                25% of subscription
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                per month
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Training & Certification
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive training programs for your team
              </p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                $1,000 - $5,000
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                per session
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Hourly Consulting
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Expert guidance on NIST compliance and vendor risk
              </p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                $150 - $300
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                per hour
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Transform Your Vendor Risk Management?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our professional services team will help you implement VendorTal quickly and effectively, 
            ensuring you get maximum value from day one.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => handleBookService('consultation')}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Free Consultation
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/contact'}
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalServices;

