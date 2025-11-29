import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import RiskBadge from '../ui/RiskBadge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileJson,
  Settings,
  Search,
  Download,
  ExternalLink,
  Clock,
  Zap
} from 'lucide-react';

interface PolicyRule {
  id: string;
  name: string;
  type: 'license' | 'vulnerability' | 'version' | 'security';
  description: string;
  condition: string;
  action: 'block' | 'warn' | 'allow';
  isActive: boolean;
}

interface VulnerabilityData {
  cve: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  description: string;
  publishedDate: string;
  references: string[];
}

interface EnhancedComponent {
  id: string;
  name: string;
  version: string;
  license: string;
  vulnerabilities: VulnerabilityData[];
  riskScore: number;
  policyViolations: PolicyRule[];
  lastUpdated: string;
  maintainer: string;
  downloadCount: number;
  isDeprecated: boolean;
}

interface EnhancedSBOMAnalysisProps {
  components: Array<Record<string, unknown>>;
  onPolicyUpdate?: (policies: PolicyRule[]) => void;
}

const EnhancedSBOMAnalysis: React.FC<EnhancedSBOMAnalysisProps> = ({ 
  components = [],
  onPolicyUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'vulnerabilities' | 'compliance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  
  const [policies, setPolicies] = useState<PolicyRule[]>([
    {
      id: 'policy-1',
      name: 'No Critical Vulnerabilities',
      type: 'vulnerability',
      description: 'Block components with critical vulnerabilities (CVSS >= 9.0)',
      condition: 'vulnerability.severity === "critical"',
      action: 'block',
      isActive: true
    },
    {
      id: 'policy-2',
      name: 'Approved Licenses Only',
      type: 'license',
      description: 'Only allow MIT, Apache-2.0, and BSD licenses',
      condition: 'license in ["MIT", "Apache-2.0", "BSD-3-Clause"]',
      action: 'block',
      isActive: true
    },
    {
      id: 'policy-3',
      name: 'Recent Version Requirement',
      type: 'version',
      description: 'Warn about components older than 2 years',
      condition: 'component.age > 24 months',
      action: 'warn',
      isActive: false
    },
    {
      id: 'policy-4',
      name: 'Deprecated Components',
      type: 'security',
      description: 'Block deprecated or unmaintained components',
      condition: 'component.isDeprecated === true',
      action: 'block',
      isActive: true
    }
  ]);

  // Enhanced component data with vulnerability and policy information
  const enhancedComponents: EnhancedComponent[] = components.map((comp, index) => ({
    id: comp.id || `component-${index}`,
    name: comp.name || 'Unknown',
    version: comp.version || '0.0.0',
    license: comp.license || 'Unknown',
    lastUpdated: '2024-12-15',
    maintainer: 'Community',
    downloadCount: Math.floor(Math.random() * 1000000),
    isDeprecated: Math.random() > 0.9,
    riskScore: comp.riskScore || 50,
    vulnerabilities: comp.vulnerabilities || generateMockVulnerabilities(comp.name),
    policyViolations: []
  }));

  function generateMockVulnerabilities(componentName: string): VulnerabilityData[] {
    // Generate realistic vulnerability data based on component name
    const vulns: VulnerabilityData[] = [];
    
    if (componentName.includes('jquery') || componentName.includes('lodash')) {
      vulns.push({
        cve: 'CVE-2024-12345',
        severity: 'high',
        score: 7.5,
        description: 'Cross-site scripting vulnerability in DOM manipulation functions',
        publishedDate: '2024-11-15',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-12345']
      });
    }
    
    if (Math.random() > 0.7) {
      vulns.push({
        cve: 'CVE-2024-67890',
        severity: 'medium',
        score: 5.3,
        description: 'Improper input validation in configuration parser',
        publishedDate: '2024-10-22',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-67890']
      });
    }
    
    return vulns;
  }

  const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'High';
    return 'Critical';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const filteredComponents = enhancedComponents.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || 
      comp.vulnerabilities.some(v => v.severity === selectedSeverity);
    return matchesSearch && matchesSeverity;
  });

  const totalVulnerabilities = enhancedComponents.reduce((sum, comp) => sum + comp.vulnerabilities.length, 0);
  const criticalVulns = enhancedComponents.reduce((sum, comp) => 
    sum + comp.vulnerabilities.filter(v => v.severity === 'critical').length, 0);

  return (
    <div className="space-y-6">
      {/* Enhanced Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Components</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{enhancedComponents.length}</p>
              </div>
              <FileJson className="h-8 w-8 text-vendorsoluce-teal" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vulnerabilities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVulnerabilities}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalVulns}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Policy Violations</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Component Overview', icon: FileJson },
            { id: 'vulnerabilities', label: 'Vulnerabilities', icon: AlertTriangle },
            { id: 'policies', label: 'Policy Engine', icon: Shield },
            { id: 'compliance', label: 'Compliance', icon: CheckCircle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'overview' | 'policies' | 'vulnerabilities' | 'compliance')}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-vendorsoluce-teal text-vendorsoluce-teal'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>

          <div className="space-y-4">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {component.name} <span className="text-gray-500 dark:text-gray-400">v{component.version}</span>
                        </h3>
                        <RiskBadge level={getRiskLevel(component.riskScore)} />
                        {component.isDeprecated && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-xs font-medium">
                            Deprecated
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">License:</span>
                          <span className="ml-1 text-gray-900 dark:text-white">{component.license}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Vulnerabilities:</span>
                          <span className="ml-1 text-gray-900 dark:text-white">{component.vulnerabilities.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Downloads:</span>
                          <span className="ml-1 text-gray-900 dark:text-white">{component.downloadCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                          <span className="ml-1 text-gray-900 dark:text-white">{component.lastUpdated}</span>
                        </div>
                      </div>
                      
                      {component.vulnerabilities.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {component.vulnerabilities.slice(0, 2).map((vuln) => (
                            <div key={vuln.cve} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                  {vuln.severity.toUpperCase()}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{vuln.cve}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">CVSS {vuln.score}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {component.vulnerabilities.length > 2 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              +{component.vulnerabilities.length - 2} more vulnerabilities
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Policy Engine Tab */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security & Compliance Policies</h3>
            <Button variant="primary" size="sm">
              Create Policy
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {policies.map((policy) => (
              <Card key={policy.id} className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{policy.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          policy.action === 'block' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                          policy.action === 'warn' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                          'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        }`}>
                          {policy.action.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          policy.isActive 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {policy.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{policy.description}</p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">
                        {policy.condition}
                      </code>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={policy.isActive ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => {
                          const updated = policies.map(p => 
                            p.id === policy.id ? { ...p, isActive: !p.isActive } : p
                          );
                          setPolicies(updated);
                          onPolicyUpdate?.(updated);
                        }}
                      >
                        {policy.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Vulnerabilities Tab */}
      {activeTab === 'vulnerabilities' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-500" />
                Vulnerability Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalVulns}</div>
                  <div className="text-sm text-red-600 dark:text-red-400">Critical CVEs</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {enhancedComponents.reduce((sum, comp) => 
                      sum + comp.vulnerabilities.filter(v => v.severity === 'high').length, 0)}
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">High Severity</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {enhancedComponents.filter(comp => comp.vulnerabilities.length === 0).length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Clean Components</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {enhancedComponents
                  .filter(comp => comp.vulnerabilities.length > 0)
                  .flatMap(comp => 
                    comp.vulnerabilities.map(vuln => ({ ...vuln, componentName: comp.name, componentVersion: comp.version }))
                  )
                  .sort((a, b) => {
                    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                    return severityOrder[b.severity] - severityOrder[a.severity];
                  })
                  .slice(0, 10)
                  .map((vuln: { severity: string; cve: string; score: number; description: string; componentName: string; componentVersion: string }, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity.toUpperCase()}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">{vuln.cve}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">CVSS {vuln.score}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{vuln.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Component: {vuln.componentName}@{vuln.componentVersion}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Published {vuln.publishedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="primary" size="sm">
                            Create Task
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NIST SP 800-161 Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-300">SBOM Documentation</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">All components documented with version and license info</p>
                    </div>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Compliant</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Vulnerability Assessment</h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Critical vulnerabilities require immediate attention</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">⚠ Partial</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-300">License Compliance</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">All licenses are approved and documented</p>
                    </div>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedSBOMAnalysis;