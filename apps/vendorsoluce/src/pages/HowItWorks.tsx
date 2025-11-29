import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClipboardCheck, BarChart3, HeartHandshake, CheckCircle, Upload, Users, Activity, Target, TrendingUp, FileJson, AlertTriangle, Download, PlayCircle, Zap, Clock, Star, ArrowRight, Eye, Layers, Network, Globe, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      title: t('howItWorks.steps.assess.title'),
      description: t('howItWorks.steps.assess.description'),
      icon: <ClipboardCheck className="h-12 w-12 text-vendorsoluce-green" />,
      features: [
        t('howItWorks.steps.assess.features.nist'),
        t('howItWorks.steps.assess.features.questions'),
        t('howItWorks.steps.assess.features.scoring'),
        t('howItWorks.steps.assess.features.recommendations')
      ],
      ctaText: t('howItWorks.steps.assess.cta'),
      ctaLink: '/supply-chain-assessment',
      gradient: 'from-green-500 to-emerald-600',
      visualElements: {
        primary: <ClipboardCheck className="h-8 w-8" />,
        secondary: <Shield className="h-6 w-6" />,
        tertiary: <CheckCircle className="h-4 w-4" />
      }
    },
    {
      id: 2,
      title: t('howItWorks.steps.vendors.title'),
      description: t('howItWorks.steps.vendors.description'),
      icon: <HeartHandshake className="h-12 w-12 text-vendorsoluce-navy" />,
      features: [
        t('howItWorks.steps.vendors.features.assessment'),
        t('howItWorks.steps.vendors.features.monitoring'),
        t('howItWorks.steps.vendors.features.scoring'),
        t('howItWorks.steps.vendors.features.reporting')
      ],
      ctaText: t('howItWorks.steps.vendors.cta'),
      ctaLink: '/vendors',
      gradient: 'from-blue-600 to-indigo-700',
      visualElements: {
        primary: <Users className="h-8 w-8" />,
        secondary: <Network className="h-6 w-6" />,
        tertiary: <Eye className="h-4 w-4" />
      }
    },
    {
      id: 3,
      title: t('howItWorks.steps.sbom.title'),
      description: t('howItWorks.steps.sbom.description'),
      icon: <FileJson className="h-12 w-12 text-vendorsoluce-teal" />,
      features: [
        t('howItWorks.steps.sbom.features.formats'),
        t('howItWorks.steps.sbom.features.vulnerability'),
        t('howItWorks.steps.sbom.features.license'),
        t('howItWorks.steps.sbom.features.compliance')
      ],
      ctaText: t('howItWorks.steps.sbom.cta'),
      ctaLink: '/sbom-analyzer',
      gradient: 'from-teal-500 to-cyan-600',
      visualElements: {
        primary: <Layers className="h-8 w-8" />,
        secondary: <FileJson className="h-6 w-6" />,
        tertiary: <Upload className="h-4 w-4" />
      }
    },
    {
      id: 4,
      title: t('howItWorks.steps.monitor.title'),
      description: t('howItWorks.steps.monitor.description'),
      icon: <Activity className="h-12 w-12 text-vendorsoluce-blue" />,
      features: [
        t('howItWorks.steps.monitor.features.dashboard'),
        t('howItWorks.steps.monitor.features.alerts'),
        t('howItWorks.steps.monitor.features.trends'),
        t('howItWorks.steps.monitor.features.reports')
      ],
      ctaText: t('howItWorks.steps.monitor.cta'),
      ctaLink: '/dashboard',
      gradient: 'from-purple-500 to-violet-600',
      visualElements: {
        primary: <BarChart3 className="h-8 w-8" />,
        secondary: <TrendingUp className="h-6 w-6" />,
        tertiary: <Globe className="h-4 w-4" />
      }
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-vendorsoluce-green" />,
      title: t('howItWorks.benefits.compliance.title'),
      description: t('howItWorks.benefits.compliance.description')
    },
    {
      icon: <Clock className="h-8 w-8 text-vendorsoluce-navy" />,
      title: t('howItWorks.benefits.efficiency.title'),
      description: t('howItWorks.benefits.efficiency.description')
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-vendorsoluce-teal" />,
      title: t('howItWorks.benefits.insights.title'),
      description: t('howItWorks.benefits.insights.description')
    },
    {
      icon: <Zap className="h-8 w-8 text-vendorsoluce-blue" />,
      title: t('howItWorks.benefits.automation.title'),
      description: t('howItWorks.benefits.automation.description')
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {t('howItWorks.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          {t('howItWorks.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/supply-chain-assessment">
            <Button variant="primary" size="lg" className="group">
              <PlayCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              {t('howItWorks.hero.tryNow')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Process Overview */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('howItWorks.process.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('howItWorks.process.description')}
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-vendorsoluce-green">{step.id}</span>
                  </div>
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {step.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-vendorsoluce-green mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={step.ctaLink}>
                  <Button variant="primary" className="group">
                    {step.ctaText}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="flex-1 max-w-lg">
                <Card className="relative p-8 border-0 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-10`}></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-current rounded-full animate-ping"></div>
                    <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-current rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-current rounded-full animate-ping delay-700"></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Header with step number and visual elements */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {step.id}
                      </div>
                      <div className="flex space-x-2">
                        <div className={`w-8 h-8 bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center text-white opacity-80`}>
                          {step.visualElements.tertiary}
                        </div>
                        <div className={`w-10 h-10 bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center text-white`}>
                          {step.visualElements.secondary}
                        </div>
                      </div>
                    </div>
                    
                    {/* Main visual element */}
                    <div className="text-center mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl transform hover:scale-105 transition-transform`}>
                        {step.visualElements.primary}
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="flex justify-center space-x-1 mb-3">
                        {[1, 2, 3, 4].map((dot) => (
                          <div
                            key={dot}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              dot <= step.id 
                                ? `bg-gradient-to-r ${step.gradient}` 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {t('howItWorks.process.stepTitle')} {step.id} - Interactive workflow
                      </p>
                      
                      {/* Mini feature indicators */}
                      <div className="flex justify-center space-x-2 mt-4">
                        {step.features.slice(0, 3).map((_, featureIndex) => (
                          <div
                            key={featureIndex}
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.gradient} opacity-60`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section with enhanced styling */}
      <section className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('howItWorks.benefits.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('howItWorks.benefits.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Tools Preview */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('howItWorks.quickTools.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('howItWorks.quickTools.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="w-12 h-12 bg-gradient-to-br from-vendorsoluce-green to-vendorsoluce-light-green rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.quickTools.vendorIQ.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('howItWorks.quickTools.vendorIQ.description')}
            </p>
            <Link to="/tools/vendor-iq">
              <Button variant="outline" size="sm" className="w-full group">
                {t('howItWorks.quickTools.vendorIQ.cta')}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="w-12 h-12 bg-gradient-to-br from-vendorsoluce-navy to-vendorsoluce-blue rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.quickTools.riskRadar.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('howItWorks.quickTools.riskRadar.description')}
            </p>
            <Link to="/tools/vendor-risk-radar">
              <Button variant="outline" size="sm" className="w-full group">
                {t('howItWorks.quickTools.riskRadar.cta')}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.quickTools.riskCalculator.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('howItWorks.quickTools.riskCalculator.description')}
            </p>
            <Link to="/tools/vendor-risk-calculator">
              <Button variant="outline" size="sm" className="w-full group">
                {t('howItWorks.quickTools.riskCalculator.cta')}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.quickTools.sbomScan.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('howItWorks.quickTools.sbomScan.description')}
            </p>
            <Link to="/tools/sbom-quick-scan">
              <Button variant="outline" size="sm" className="w-full group">
                {t('howItWorks.quickTools.sbomScan.cta')}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.quickTools.nistChecklist.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('howItWorks.quickTools.nistChecklist.description')}
            </p>
            <Link to="/tools/nist-checklist">
              <Button variant="outline" size="sm" className="w-full group">
                {t('howItWorks.quickTools.nistChecklist.cta')}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Integration Preview */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('howItWorks.integration.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('howItWorks.integration.description')}
          </p>
        </div>

        <div className="bg-gradient-to-r from-vendorsoluce-navy to-vendorsoluce-teal rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-16 right-16 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-12 left-16 w-2.5 h-2.5 bg-white rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-white rounded-full animate-ping delay-1000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-all">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">{t('howItWorks.integration.features.api')}</h3>
                <p className="text-sm text-gray-100">{t('howItWorks.integration.features.apiDesc')}</p>
              </div>
              
              <div className="text-center group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-all">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">{t('howItWorks.integration.features.export')}</h3>
                <p className="text-sm text-gray-100">{t('howItWorks.integration.features.exportDesc')}</p>
              </div>
              
              <div className="text-center group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-all">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">{t('howItWorks.integration.features.alerts')}</h3>
                <p className="text-sm text-gray-100">{t('howItWorks.integration.features.alertsDesc')}</p>
              </div>
              
              <div className="text-center group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-all">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">{t('howItWorks.integration.features.templates')}</h3>
                <p className="text-sm text-gray-100">{t('howItWorks.integration.features.templatesDesc')}</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/integration-guides">
                <Button variant="secondary" size="lg" className="bg-white text-vendorsoluce-navy hover:bg-gray-100 group">
                  {t('howItWorks.integration.cta')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started CTA */}
      <section className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('howItWorks.getStarted.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t('howItWorks.getStarted.description')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
            <div className="text-3xl font-bold text-vendorsoluce-green mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">1</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.getStarted.steps.step1.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('howItWorks.getStarted.steps.step1.description')}
            </p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="text-3xl font-bold text-vendorsoluce-blue mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">2</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.getStarted.steps.step2.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('howItWorks.getStarted.steps.step2.description')}
            </p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200 dark:border-teal-700">
            <div className="text-3xl font-bold text-vendorsoluce-teal mb-3 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">3</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {t('howItWorks.getStarted.steps.step3.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('howItWorks.getStarted.steps.step3.description')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/supply-chain-assessment">
            <Button variant="primary" size="lg" className="group">
              {t('howItWorks.getStarted.cta.signup')}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/templates">
            <Button variant="outline" size="lg">
              {t('howItWorks.getStarted.cta.resources')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks; 