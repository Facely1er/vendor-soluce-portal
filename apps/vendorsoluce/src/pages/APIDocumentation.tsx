import React, { useEffect } from 'react';
import Card from '../components/ui/Card';
import { useTranslation } from 'react-i18next';

const APIDocumentation: React.FC = () => {
  const { t } = useTranslation();
  
  // Scroll to section when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Add a slight delay to ensure smooth scrolling after page renders
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Handle initial hash on page load
    handleHashChange();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('resources.apiDocs.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
          {t('resources.apiDocs.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.overview')}</h2>
            <nav className="space-y-1">
              <a href="#authentication" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium">{t('resources.apiDocs.sections.authentication')}</a>
              <a href="#vendor-risk-api" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium">{t('resources.apiDocs.sections.vendorRiskApi')}</a>
              <a href="#sbom-api" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium">{t('resources.apiDocs.sections.sbomApi')}</a>
              <a href="#nist-controls-api" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium">{t('resources.apiDocs.sections.nistControlsApi')}</a>
              <a href="#rate-limits" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium">{t('resources.apiDocs.sections.rateLimits')}</a>
              <a href="#webhooks" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium">{t('resources.apiDocs.sections.webhooks')}</a>
            </nav>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <section id="authentication">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.sections.authentication')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('resources.apiDocs.authentication.description')}
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto leading-relaxed">
                  <code>
                    {`Authorization: Bearer YOUR_API_KEY`}
                  </code>
                </pre>
              </div>
              
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('resources.apiDocs.authentication.security')}</h3>
              <ul className="list-disc list-inside space-y-2.5 text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                <li>{t('resources.apiDocs.authentication.securityTips.clientSide')}</li>
                <li>{t('resources.apiDocs.authentication.securityTips.envVars')}</li>
                <li>{t('resources.apiDocs.authentication.securityTips.ipRestrictions')}</li>
                <li>{t('resources.apiDocs.authentication.securityTips.rotation')}</li>
              </ul>
            </Card>
          </section>
          
          <section id="vendor-risk-api">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.sections.vendorRiskApi')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('resources.apiDocs.vendorRiskApi.description')}
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.vendorRiskApi.endpoints')}</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.method')}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.endpoint')}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.description')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/vendors</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.vendorRiskApi.endpointDescriptions.listVendors')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/vendors/:id</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.vendorRiskApi.endpointDescriptions.getVendor')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">POST</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/vendors</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.vendorRiskApi.endpointDescriptions.createVendor')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">PUT</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/vendors/:id</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.vendorRiskApi.endpointDescriptions.updateVendor')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">POST</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/vendors/:id/assessments</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.vendorRiskApi.endpointDescriptions.createAssessment')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/vendors/:id/risk-score</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.vendorRiskApi.endpointDescriptions.getRiskScore')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('resources.apiDocs.common.exampleRequest')}</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto leading-relaxed">
                  <code>
                    {`curl -X GET "https://api.vendorsoluce.com/api/vendors/123/risk-score" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </code>
                </pre>
              </div>
              
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('resources.apiDocs.common.exampleResponse')}</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto leading-relaxed">
                  <code>
                    {`{
  "vendorId": "123",
  "riskScore": 85,
  "riskLevel": "Low",
  "complianceStatus": "Compliant",
  "lastAssessment": "2025-04-15T14:32:21Z",
  "nistControlsCompliance": {
    "C-SCRM-1": true,
    "C-SCRM-2": true,
    "C-SCRM-3": true,
    "C-SCRM-4": true,
    "C-SCRM-5": false,
    "C-SCRM-6": true,
    "C-SCRM-7": true,
    "C-SCRM-8": true,
    "C-SCRM-9": false,
    "C-SCRM-10": true
  }
}`}
                  </code>
                </pre>
              </div>
            </Card>
          </section>
          
          <section id="sbom-api">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.sections.sbomApi')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('resources.apiDocs.sbomApi.description')}
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.sbomApi.endpoints')}</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.method')}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.endpoint')}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.description')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">POST</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/sbom/analyze</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.sbomApi.endpointDescriptions.analyzeSbom')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/sbom/analyses/:id</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.sbomApi.endpointDescriptions.getAnalysis')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/sbom/components/:id/vulnerabilities</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.sbomApi.endpointDescriptions.getVulnerabilities')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('resources.apiDocs.sbomApi.supportedFormats')}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                <li>{t('resources.apiDocs.sbomApi.formats.spdx')}</li>
                <li>{t('resources.apiDocs.sbomApi.formats.cyclonedx')}</li>
                <li>{t('resources.apiDocs.sbomApi.formats.plainText')}</li>
              </ul>
            </Card>
          </section>
          
          <section id="nist-controls-api">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.sections.nistControlsApi')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('resources.apiDocs.nistControlsApi.description')}
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.nistControlsApi.endpoints')}</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.method')}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.endpoint')}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.common.description')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/nist/controls</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.nistControlsApi.endpointDescriptions.listControls')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/nist/controls/:id</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.nistControlsApi.endpointDescriptions.getControl')}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">GET</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm dark:text-gray-300">/api/nist/controls/:id/questions</td>
                        <td className="px-4 py-2 text-sm dark:text-gray-300">{t('resources.apiDocs.nistControlsApi.endpointDescriptions.getQuestions')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </section>
          
          <section id="rate-limits">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.sections.rateLimits')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('resources.apiDocs.rateLimits.description')}
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.rateLimits.plan')}</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.rateLimits.rateLimit')}</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('resources.apiDocs.rateLimits.burstLimit')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="dark:bg-gray-800">
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.plans.free')}</td>
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.limits.free.rate')}</td>
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.limits.free.burst')}</td>
                    </tr>
                    <tr className="dark:bg-gray-800">
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.plans.standard')}</td>
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.limits.standard.rate')}</td>
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.limits.standard.burst')}</td>
                    </tr>
                    <tr className="dark:bg-gray-800">
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.plans.enterprise')}</td>
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.limits.enterprise.rate')}</td>
                      <td className="px-4 py-2 dark:text-gray-300">{t('resources.apiDocs.rateLimits.limits.enterprise.burst')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
          
          <section id="webhooks">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.apiDocs.sections.webhooks')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('resources.apiDocs.webhooks.description')}
              </p>
              
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('resources.apiDocs.webhooks.availableEvents')}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                <li>{t('resources.apiDocs.webhooks.events.vendorCreated')}</li>
                <li>{t('resources.apiDocs.webhooks.events.vendorUpdated')}</li>
                <li>{t('resources.apiDocs.webhooks.events.assessmentCompleted')}</li>
                <li>{t('resources.apiDocs.webhooks.events.riskScoreChanged')}</li>
                <li>{t('resources.apiDocs.webhooks.events.sbomAnalyzed')}</li>
                <li>{t('resources.apiDocs.webhooks.events.vulnerabilityFound')}</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('resources.apiDocs.webhooks.payloadExample')}</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto leading-relaxed">
                  <code>
                    {`{
  "event": "risk_score.changed",
  "timestamp": "2025-04-15T14:32:21Z",
  "data": {
    "vendorId": "123",
    "previousScore": 72,
    "newScore": 85,
    "previousLevel": "Medium",
    "newLevel": "Low",
    "assessmentId": "456"
  }
}`}
                  </code>
                </pre>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;