import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Building2,
  Users,
  ArrowRight,
  Lock,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stakeholder {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  challenges: string[];
  solutions: {
    title: string;
    description: string;
    benefits: string[];
    cta: string;
    link: string;
  }[];
}

const ValuePropositionSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeStakeholder, setActiveStakeholder] = useState<string>('security');

  const stakeholders: Stakeholder[] = [
    {
      id: 'security',
      title: t('home.stakeholders.security.title'),
      description: t('home.stakeholders.security.description'),
      icon: <Shield className="h-8 w-8 text-vendorsoluce-green" />,
      challenges: [
        t('home.stakeholders.security.challenges.visibility'),
        t('home.stakeholders.security.challenges.manual'),
        t('home.stakeholders.security.challenges.tracking'),
        t('home.stakeholders.security.challenges.compliance')
      ],
      solutions: [
        {
          title: t('home.stakeholders.security.solutions.sbom.title'),
          description: t('home.stakeholders.security.solutions.sbom.description'),
          benefits: [
            t('home.stakeholders.security.solutions.sbom.benefits.vulnerabilities'),
            t('home.stakeholders.security.solutions.sbom.benefits.licenses'),
            t('home.stakeholders.security.solutions.sbom.benefits.reports'),
            t('home.stakeholders.security.solutions.sbom.benefits.monitoring')
          ],
          cta: t('home.stakeholders.security.solutions.sbom.cta'),
          link: '/sbom-analyzer'
        }
      ]
    },
    {
      id: 'procurement',
      title: t('home.stakeholders.procurement.title'),
      description: t('home.stakeholders.procurement.description'),
      icon: <Building2 className="h-8 w-8 text-vendorsoluce-navy" />,
      challenges: [
        t('home.stakeholders.procurement.challenges.balancing'),
        t('home.stakeholders.procurement.challenges.lifecycle'),
        t('home.stakeholders.procurement.challenges.contracts'),
        t('home.stakeholders.procurement.challenges.diligence')
      ],
      solutions: [
        {
          title: t('home.stakeholders.procurement.solutions.calculator.title'),
          description: t('home.stakeholders.procurement.solutions.calculator.description'),
          benefits: [
            t('home.stakeholders.procurement.solutions.calculator.benefits.criteria'),
            t('home.stakeholders.procurement.solutions.calculator.benefits.scoring'),
            t('home.stakeholders.procurement.solutions.calculator.benefits.comparison'),
            t('home.stakeholders.procurement.solutions.calculator.benefits.integration')
          ],
          cta: t('home.stakeholders.procurement.solutions.calculator.cta'),
          link: '/tools/vendor-risk-radar'
        },
        {
          title: t('home.stakeholders.procurement.solutions.dashboard.title'),
          description: t('home.stakeholders.procurement.solutions.dashboard.description'),
          benefits: [
            t('home.stakeholders.procurement.solutions.dashboard.benefits.monitoring'),
            t('home.stakeholders.procurement.solutions.dashboard.benefits.tracking'),
            t('home.stakeholders.procurement.solutions.dashboard.benefits.alerts'),
            t('home.stakeholders.procurement.solutions.dashboard.benefits.reporting')
          ],
          cta: t('home.stakeholders.procurement.solutions.dashboard.cta'),
          link: '/vendors'
        }
      ]
    },
    {
      id: 'compliance',
      title: t('home.stakeholders.compliance.title'),
      description: t('home.stakeholders.compliance.description'),
      icon: <Lock className="h-8 w-8 text-vendorsoluce-teal" />,
      challenges: [
        t('home.stakeholders.compliance.challenges.evolving'),
        t('home.stakeholders.compliance.challenges.documenting'),
        t('home.stakeholders.compliance.challenges.obligations'),
        t('home.stakeholders.compliance.challenges.frameworks')
      ],
      solutions: [
        {
          title: t('home.stakeholders.compliance.solutions.nist.title'),
          description: t('home.stakeholders.compliance.solutions.nist.description'),
          benefits: [
            t('home.stakeholders.compliance.solutions.nist.benefits.templates'),
            t('home.stakeholders.compliance.solutions.nist.benefits.scoring'),
            t('home.stakeholders.compliance.solutions.nist.benefits.documentation'),
            t('home.stakeholders.compliance.solutions.nist.benefits.analysis')
          ],
          cta: t('home.stakeholders.compliance.solutions.nist.cta'),
          link: '/supply-chain-assessment'
        },
        {
          title: t('home.stakeholders.compliance.solutions.templates.title'),
          description: t('home.stakeholders.compliance.solutions.templates.description'),
          benefits: [
            t('home.stakeholders.compliance.solutions.templates.benefits.federal'),
            t('home.stakeholders.compliance.solutions.templates.benefits.industry'),
            t('home.stakeholders.compliance.solutions.templates.benefits.matrices'),
            t('home.stakeholders.compliance.solutions.templates.benefits.executive')
          ],
          cta: t('home.stakeholders.compliance.solutions.templates.cta'),
          link: '/templates'
        }
      ]
    },
    {
      id: 'executives',
      title: t('home.stakeholders.executives.title'),
      description: t('home.stakeholders.executives.description'),
      icon: <Users className="h-8 w-8 text-vendorsoluce-blue" />,
      challenges: [
        t('home.stakeholders.executives.challenges.understanding'),
        t('home.stakeholders.executives.challenges.investment'),
        t('home.stakeholders.executives.challenges.demonstrating'),
        t('home.stakeholders.executives.challenges.balancing')
      ],
      solutions: [
        {
          title: t('home.stakeholders.executives.solutions.dashboards.title'),
          description: t('home.stakeholders.executives.solutions.dashboards.description'),
          benefits: [
            t('home.stakeholders.executives.solutions.dashboards.benefits.metrics'),
            t('home.stakeholders.executives.solutions.dashboards.benefits.portfolio'),
            t('home.stakeholders.executives.solutions.dashboards.benefits.compliance'),
            t('home.stakeholders.executives.solutions.dashboards.benefits.recommendations')
          ],
          cta: t('home.stakeholders.executives.solutions.dashboards.cta'),
          link: '/checkout?plan=professional'
        },
        {
          title: t('home.stakeholders.executives.solutions.reporting.title'),
          description: t('home.stakeholders.executives.solutions.reporting.description'),
          benefits: [
            t('home.stakeholders.executives.solutions.reporting.benefits.automated'),
            t('home.stakeholders.executives.solutions.reporting.benefits.customizable'),
            t('home.stakeholders.executives.solutions.reporting.benefits.analysis'),
            t('home.stakeholders.executives.solutions.reporting.benefits.presentations')
          ],
          cta: t('home.stakeholders.executives.solutions.reporting.cta'),
          link: '/vendors'
        }
      ]
    }
  ];

  const activeStakeholderData = stakeholders.find(s => s.id === activeStakeholder) || stakeholders[0];

  return (
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t('home.stakeholders.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('home.stakeholders.description')}
          </p>
        </div>

        {/* Stakeholder Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {stakeholders.map((stakeholder) => (
            <button
              key={stakeholder.id}
              onClick={() => setActiveStakeholder(stakeholder.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeStakeholder === stakeholder.id
                  ? 'bg-vendorsoluce-green text-white shadow-md'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {stakeholder.icon}
              <span className="ml-3">{stakeholder.title}</span>
            </button>
          ))}
        </div>

        {/* Active Stakeholder Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Challenges */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader className="pb-4">
              <h3 className="flex items-center text-xl font-bold text-gray-900 dark:text-white mb-3">
                <AlertTriangle className="h-5 w-5 mr-3 text-orange-500" />
                {t('home.stakeholders.common.challenges')}
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {activeStakeholderData.description}
              </p>
              <ul className="space-y-4">
                {activeStakeholderData.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Solutions */}
          <div className="lg:col-span-2 space-y-8">
            {activeStakeholderData.solutions.map((solution, index) => (
              <Card key={index} className="border-l-4 border-l-vendorsoluce-green">
                <CardContent className="px-8 pt-8 pb-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {solution.title}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {solution.description}
                    </p>
                    <div className="mb-4 text-center">
                      <Link to={solution.link}>
                        <Button variant="primary" size="sm">
                          {solution.cta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {solution.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-vendorsoluce-green mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action 
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-vendorsoluce-green to-vendorsoluce-light-green rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">{t('home.stakeholders.cta.title')}</h3>
            <p className="text-xl text-gray-100 mb-6">
              {t('home.stakeholders.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/supply-chain-assessment">
                <Button variant="secondary" size="lg" className="bg-white text-vendorsoluce-green hover:bg-gray-100">
                  <Target className="h-5 w-5 mr-2" />
                  {t('home.stakeholders.cta.startAssessment')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Users className="h-5 w-5 mr-2" />
                  {t('home.stakeholders.cta.scheduleDemo')}
                </Button>
              </Link>
            </div>
          </div>
        </div>*/}
      </div>
    </section>
  );
};

export default ValuePropositionSection;