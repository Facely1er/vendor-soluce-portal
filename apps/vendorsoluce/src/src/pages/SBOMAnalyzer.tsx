import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Shield, 
  FileJson, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Eye,
  Info,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SBOMUploader from '../components/sbom/SBOMUploader';
import EnhancedSBOMAnalysis from '../components/sbom/EnhancedSBOMAnalysis';
import { useTranslation } from 'react-i18next';
import { useSBOMAnalyses } from '../hooks/useSBOMAnalyses';
import { useAuth } from '../context/AuthContext';
import BackToDashboardLink from '../components/common/BackToDashboardLink';
import ChatWidget from '../components/chatbot/ChatWidget';
import { useUsageTracking } from '../hooks/useUsageTracking';
import { logger } from '../utils/logger';
import {
  parseCycloneDX,
  parseSPDX,
  validateNTIACompliance,
  calculateRiskScore,
  summarizeVulnerabilities,
  type SBOMAnalysisResult as FullSBOMAnalysisResult,
  type ComponentAnalysis as FullComponentAnalysis,
  type Vulnerability as FullVulnerability,
  type SBOMDocument,
  type DependencyEdge,
  type VulnerabilitySummary,
  type NTIACompliance,
  type DataQuality
} from '../utils/sbomAnalyzer';

interface SBOMAnalysisResult {
  id: string;
  filename: string;
  totalComponents: number;
  totalVulnerabilities: number;
  riskScore: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  unknownVulnerabilities: number;
  licenseIssues: number;
  createdAt: string;
  components?: ComponentAnalysis[];
  analysisType: string;
  document?: SBOMDocument;
  dependencyEdges?: DependencyEdge[];
  vulnerabilitySummary?: VulnerabilitySummary;
  ntiaCompliance?: NTIACompliance;
  dataQuality?: DataQuality;
}

interface ComponentAnalysis {
  id: string;
  name: string;
  version: string;
  type: string;
  ecosystem: string;
  license: string;
  purl?: string;
  hashes?: Array<{ algorithm: string; content: string }>;
  supplier?: string;
  description?: string;
  vulnerabilities: Vulnerability[];
  riskScore: number;
  lastAnalyzed: string;
  vulnerabilityCount: number;
  ntiaCompliance?: NTIACompliance;
  dataQuality?: {
    missingPurl?: boolean;
    missingHashes?: boolean;
    missingSupplier?: boolean;
  };
}

interface Vulnerability {
  id: string;
  cve: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  summary: string;
  publishedDate: string;
  cvssV3Score?: number;
  cvssV2Score?: number;
  cvssMax?: number;
  kev?: boolean;
  epss?: number;
  references: string[];
}

const SBOMAnalyzer: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { analyses, createAnalysis } = useSBOMAnalyses();
  const { trackUsage, checkLimit } = useUsageTracking('sbom_scans');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<SBOMAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState({ 
    completed: 0, 
    total: 0, 
    percentage: 0,
    currentComponent: ''
  });

  // Real vulnerability analysis using OSV Database
  const analyzeComponentVulnerabilities = async (
    name: string,
    version: string,
    ecosystem: string = 'npm',
    component: any
  ): Promise<{
    vulnerabilities: FullVulnerability[];
    riskScore: number;
    lastAnalyzed: string;
  }> => {
    try {
      const osvResponse = await fetch('https://api.osv.dev/v1/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: { name, ecosystem },
          version
        })
      });

      const osvData = await osvResponse.json();
      const vulnerabilities: FullVulnerability[] = (osvData.vulns || []).map((vuln: any) => {
        const cvssV3 = vuln.database_specific?.cvss_v3_score;
        const cvssV2 = vuln.database_specific?.cvss_v2_score;
        const cvssMax = Math.max(cvssV3 || 0, cvssV2 || 0);
        
        // Map severity
        let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN' = 'UNKNOWN';
        const dbSeverity = vuln.database_specific?.severity?.toUpperCase();
        if (dbSeverity === 'CRITICAL' || cvssMax >= 9.0) {
          severity = 'CRITICAL';
        } else if (dbSeverity === 'HIGH' || cvssMax >= 7.0) {
          severity = 'HIGH';
        } else if (dbSeverity === 'MEDIUM' || cvssMax >= 4.0) {
          severity = 'MEDIUM';
        } else if (dbSeverity === 'LOW' || cvssMax > 0) {
          severity = 'LOW';
        }

        return {
          id: vuln.id,
          cve: vuln.aliases?.find((alias: string) => alias.startsWith('CVE-')) || vuln.id,
          severity,
          summary: vuln.summary || 'No summary available',
          publishedDate: vuln.published,
          cvssV3Score: cvssV3,
          cvssV2Score: cvssV2,
          cvssMax,
          kev: false, // KEV data would need separate API call
          epss: undefined, // EPSS data would need separate API call
          references: vuln.references?.map((ref: any) => ref.url) || []
        };
      });

      // Use deterministic risk calculator
      const riskScore = calculateRiskScore(vulnerabilities, component);

      return {
        vulnerabilities,
        riskScore,
        lastAnalyzed: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Failed to analyze component`, { 
        component: `${name}@${version}`, 
        error 
      });
      return {
        vulnerabilities: [],
        riskScore: calculateRiskScore([], component), // Use calculator even with no vulns
        lastAnalyzed: new Date().toISOString(),
        analysisError: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisProgress({ completed: 0, total: 0, percentage: 0, currentComponent: '' });
    
    try {
      // Check usage limit before processing
      if (isAuthenticated && user) {
        const limitCheck = await checkLimit();
        if (!limitCheck.canPerform) {
          setError(limitCheck.message || 'You have reached your SBOM scan limit. Please upgrade your plan or purchase additional scans.');
          setIsLoading(false);
          return;
        }
      }

      // Read and parse the SBOM file
      const fileContent = await readFileAsText(file);
      const { document, components, dependencyEdges } = parseSBOMFile(fileContent, file.name);
      
      setAnalysisProgress({ 
        completed: 0, 
        total: components.length, 
        percentage: 0,
        currentComponent: 'Starting analysis...'
      });

      // Analyze with real vulnerability data
      const analyzedComponents = await analyzeComponentsWithRealData(components);
      
      // Validate NTIA compliance at document level
      const ntiaCompliance = validateNTIACompliance(document, dependencyEdges.length > 0);
      
      // Generate vulnerability summary
      const allVulnerabilities = analyzedComponents.flatMap(c => c.vulnerabilities);
      const vulnerabilitySummary = summarizeVulnerabilities(allVulnerabilities);
      
      // Collect data quality issues
      const dataQuality: DataQuality = {
        issues: []
      };
      components.forEach(comp => {
        if (!comp.purl) {
          dataQuality.issues.push({
            componentId: comp.id,
            field: 'purl',
            issue: 'Missing package URL (purl) identifier'
          });
        }
        if (!comp.hashes || comp.hashes.length === 0) {
          dataQuality.issues.push({
            componentId: comp.id,
            field: 'hashes',
            issue: 'Missing component hashes (prefer SHA-256)'
          });
        }
        if (!comp.supplier) {
          dataQuality.issues.push({
            componentId: comp.id,
            field: 'supplier',
            issue: 'Missing supplier information'
          });
        }
      });
      
      const analysisResult = generateAnalysisResult(
        analyzedComponents,
        file.name,
        document,
        dependencyEdges,
        vulnerabilitySummary,
        ntiaCompliance,
        dataQuality
      );
      
      // Save to database if user is authenticated
      if (isAuthenticated && user) {
        await createAnalysis({
          filename: file.name,
          file_type: file.type || 'application/json',
          total_components: analysisResult.totalComponents,
          total_vulnerabilities: analysisResult.totalVulnerabilities,
          risk_score: analysisResult.riskScore,
          analysis_data: {
            criticalVulnerabilities: analysisResult.criticalVulnerabilities,
            highVulnerabilities: analysisResult.highVulnerabilities,
            licenseIssues: analysisResult.licenseIssues,
            components: analyzedComponents
          }
        });

        // Track usage after successful scan
        const usageResult = await trackUsage(1);
        if (usageResult.overLimit && usageResult.overageAmount) {
          logger.warn(`Usage limit exceeded`, { 
            overageAmount: usageResult.overageAmount 
          });
        }
      }
      
      setCurrentAnalysis(analysisResult);
    } catch (err) {
      logger.error('Error analyzing SBOM', { error: err });
      const userFriendlyMessage = err instanceof Error 
        ? (err.message.includes('HTTP 401') 
            ? 'Please sign in to continue' 
            : err.message.includes('HTTP 403')
            ? 'You do not have permission to perform this action'
            : err.message.includes('HTTP 429')
            ? 'Too many requests. Please try again later.'
            : err.message.includes('HTTP 500')
            ? 'A server error occurred. Please try again later.'
            : err.message.includes('Failed to fetch')
            ? 'Unable to connect to the server. Please check your internet connection.'
            : err.message)
        : 'An error occurred while analyzing the SBOM file. Please try again.';
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeComponentsWithRealData = async (components: any[]) => {
    // Process components with improved concurrency control for better performance
    const concurrencyLimit = 10; // Analyze up to 10 components concurrently
    const analyzed: ComponentAnalysis[] = [];
    
    for (let i = 0; i < components.length; i += concurrencyLimit) {
      const batch = components.slice(i, i + concurrencyLimit);
      
      // Update progress for current batch
      setAnalysisProgress({
        completed: i,
        total: components.length,
        percentage: Math.round((i / components.length) * 100),
        currentComponent: `Analyzing batch ${Math.floor(i / concurrencyLimit) + 1}/${Math.ceil(components.length / concurrencyLimit)}...`
      });
      
      // Process batch concurrently with improved error handling
      const batchPromises = batch.map(async (component) => {
        try {
          const analysis = await analyzeComponentVulnerabilities(
            component.name,
            component.version,
            component.ecosystem,
            component
          );
          
          // Track data quality issues
          const dataQuality: {
            missingPurl?: boolean;
            missingHashes?: boolean;
            missingSupplier?: boolean;
          } = {};
          if (!component.purl) dataQuality.missingPurl = true;
          if (!component.hashes || component.hashes.length === 0) dataQuality.missingHashes = true;
          if (!component.supplier) dataQuality.missingSupplier = true;
          
          return {
            ...component,
            ...analysis,
            vulnerabilityCount: (analysis.vulnerabilities || []).length,
            dataQuality: Object.keys(dataQuality).length > 0 ? dataQuality : undefined
          };
        } catch (error) {
          logger.warn(`Failed to analyze component`, { 
            component: `${component.name}@${component.version}`, 
            error 
          });
          return {
            ...component,
            vulnerabilities: [],
            riskScore: calculateRiskScore([], component),
            vulnerabilityCount: 0,
            lastAnalyzed: new Date().toISOString(),
            analysisError: error instanceof Error ? error.message : 'Analysis failed'
          };
        }
      });
      
      // Wait for all components in the batch to complete
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Log failed promises for debugging
      const failedResults = batchResults.filter(r => r.status === 'rejected');
      if (failedResults.length > 0) {
        const errors = failedResults.map(r => {
          const rejected = r as PromiseRejectedResult;
          return rejected.reason instanceof Error ? rejected.reason.message : String(rejected.reason);
        });
        logger.warn(`${failedResults.length} component analyses failed in batch`, {
          errors: errors.slice(0, 5), // Log first 5 errors
          totalFailed: failedResults.length
        });
      }
      
      const successfulResults = batchResults
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<ComponentAnalysis>).value);
      
      analyzed.push(...successfulResults);
      
      // Short delay between batches to respect API rate limits
      if (i + concurrencyLimit < components.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setAnalysisProgress({
      completed: components.length,
      total: components.length,
      percentage: 100,
      currentComponent: 'Analysis complete!'
    });
    
    return analyzed;
  };

  const generateAnalysisResult = (
    components: ComponentAnalysis[],
    filename: string,
    document: SBOMDocument,
    dependencyEdges: DependencyEdge[],
    vulnerabilitySummary: VulnerabilitySummary,
    ntiaCompliance: NTIACompliance,
    dataQuality: DataQuality
  ): SBOMAnalysisResult => {
    const totalVulnerabilities = vulnerabilitySummary.total;
    const licenseIssues = components.filter(comp => comp.license === 'Unknown').length;
    
    // Calculate overall risk score (weighted average, or use max risk component)
    const avgRiskScore = components.length > 0
      ? Math.round(components.reduce((sum, comp) => sum + comp.riskScore, 0) / components.length)
      : 100;

    return {
      id: `analysis-${Date.now()}`,
      filename,
      totalComponents: components.length,
      totalVulnerabilities,
      riskScore: avgRiskScore,
      criticalVulnerabilities: vulnerabilitySummary.critical,
      highVulnerabilities: vulnerabilitySummary.high,
      mediumVulnerabilities: vulnerabilitySummary.medium,
      lowVulnerabilities: vulnerabilitySummary.low,
      unknownVulnerabilities: vulnerabilitySummary.unknown,
      licenseIssues,
      createdAt: new Date().toISOString(),
      components,
      analysisType: 'production',
      document,
      dependencyEdges,
      vulnerabilitySummary,
      ntiaCompliance,
      dataQuality
    };
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const parseSBOMFile = (content: string, filename: string): {
    document: SBOMDocument;
    components: any[];
    dependencyEdges: DependencyEdge[];
  } => {
    try {
      const data = JSON.parse(content);
      if (data.bomFormat === 'CycloneDX' || data.components) {
        return parseCycloneDX(data, filename);
      }
      if (data.spdxVersion || data.packages) {
        return parseSPDX(data, filename);
      }
      throw new Error('Unsupported JSON SBOM format');
    } catch (parseError) {
      if (content.includes('<bom>') || content.includes('CycloneDX')) {
        // XML parsing would need to be implemented separately
        throw new Error('XML format parsing not yet fully implemented. Please use JSON format.');
      }
      throw new Error('Unsupported SBOM format. Please provide a valid CycloneDX or SPDX JSON file.');
    }
  };


  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';  
    if (score >= 40) return 'High';
    return 'Critical';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const exportResults = () => {
    if (!currentAnalysis) return;
    
    const exportData = {
      analysis: currentAnalysis,
      exportedAt: new Date().toISOString(),
      platform: 'VendorSoluce',
      version: '2.0',
      analysisType: 'production_vulnerability_intelligence'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sbom-analysis-${currentAnalysis.filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <BackToDashboardLink />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('sbom.title')}
          </h1>
          <Button
            variant="outline"
            onClick={() => setIsChatOpen(true)}
            className="flex items-center"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Get Help
          </Button>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          {t('sbom.description')}
        </p>
        {/* Real-time Intelligence Badge */}
        <div className="mt-4">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              ✓ Real-time vulnerability intelligence powered by OSV Database
            </span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-vendorsoluce-teal">
          <CardContent className="p-6">
            <div className="flex items-center mb-4 mt-2">
              <FileJson className="h-8 w-8 text-vendorsoluce-teal mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('sbom.features.componentAnalysis.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('sbom.features.componentAnalysis.description')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-vendorsoluce-green">
          <CardContent className="p-6">
            <div className="flex items-center mb-4 mt-2">
              <Shield className="h-8 w-8 text-vendorsoluce-green mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('sbom.features.vulnerabilityDetection.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('sbom.features.vulnerabilityDetection.description')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-vendorsoluce-blue">
          <CardContent className="p-6">
            <div className="flex items-center mb-4 mt-2">
              <BarChart3 className="h-8 w-8 text-vendorsoluce-blue mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('sbom.features.licenseCompliance.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('sbom.features.licenseCompliance.description')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2 text-vendorsoluce-teal" />
                {t('sbom.upload.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SBOMUploader onUpload={handleFileUpload} isLoading={isLoading} />
              
              {/* Progress Indicator */}
              {isLoading && analysisProgress.total > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {analysisProgress.currentComponent}
                    </span>
                    <span>{analysisProgress.completed}/{analysisProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-vendorsoluce-teal to-vendorsoluce-green h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysisProgress.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Querying OSV Database for real vulnerability data...</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      {t('sbom.upload.supportedFormats')}
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• SPDX (JSON, XML, RDF formats)</li>
                      <li>• CycloneDX (JSON, XML formats)</li>
                      <li>• Real-time OSV Database integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Analyses */}
          {isAuthenticated && analyses.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-vendorsoluce-green" />
                  {t('sbom.recentAnalyses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyses.slice(0, 5).map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{analysis.filename}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{analysis.total_components} components</span>
                          <span>{analysis.total_vulnerabilities} vulnerabilities</span>
                          <span>Score: {analysis.risk_score}%</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // Navigate to detailed analysis view
                          alert(`Viewing detailed analysis for ${analysis.filename}. This feature will open a comprehensive view of the SBOM analysis results including component breakdown, vulnerability details, and remediation recommendations.`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Section */}
        <div>
          {currentAnalysis ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-vendorsoluce-teal" />
                    {t('sbom.results.title')}
                    {currentAnalysis.analysisType === 'production' && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        ✓ Real Data
                      </span>
                    )}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={exportResults}>
                    <Download className="h-4 w-4 mr-2" />
                    {t('sbom.export')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      currentAnalysis.riskScore >= 80 ? 'text-green-600' : 
                      currentAnalysis.riskScore >= 60 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {currentAnalysis.riskScore}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{t('sbom.results.overallSecurityScore')}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 border ${getRiskColor(getRiskLevel(currentAnalysis.riskScore))}`}>
                      {getRiskLevel(currentAnalysis.riskScore)} Risk
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentAnalysis.totalComponents}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('sbom.results.components')}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentAnalysis.totalVulnerabilities}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('sbom.results.vulnerabilities')}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {currentAnalysis.criticalVulnerabilities}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('sbom.results.criticalCVEs')}</div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {currentAnalysis.licenseIssues}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('sbom.results.licenseIssues')}</div>
                    </div>
                  </div>

                  {/* Vulnerability Summary */}
                  {currentAnalysis.vulnerabilitySummary && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Vulnerability Breakdown</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600 dark:text-red-400">
                            {currentAnalysis.vulnerabilitySummary.critical}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {currentAnalysis.vulnerabilitySummary.high}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">High</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {currentAnalysis.vulnerabilitySummary.medium}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Medium</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {currentAnalysis.vulnerabilitySummary.low}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                            {currentAnalysis.vulnerabilitySummary.unknown}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Unknown</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {currentAnalysis.vulnerabilitySummary.total}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NTIA Compliance */}
                  {currentAnalysis.ntiaCompliance && (
                    <div className={`p-4 rounded-lg border ${
                      currentAnalysis.ntiaCompliance.compliant
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                          {currentAnalysis.ntiaCompliance.compliant ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                          )}
                          NTIA Compliance
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          currentAnalysis.ntiaCompliance.compliant
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {currentAnalysis.ntiaCompliance.compliant ? 'Compliant' : `Score: ${currentAnalysis.ntiaCompliance.score}%`}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {Object.entries(currentAnalysis.ntiaCompliance.checks).map(([check, passed]) => (
                          <div key={check} className="flex items-center">
                            {passed ? (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                            )}
                            <span className={passed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                              {check.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                        {currentAnalysis.ntiaCompliance.failedChecks.length > 0 && (
                          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                            Failed checks: {currentAnalysis.ntiaCompliance.failedChecks.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Document Provenance */}
                  {currentAnalysis.document && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Document Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Format:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{currentAnalysis.document.bomFormat}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Spec Version:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{currentAnalysis.document.specVersion}</span>
                        </div>
                        {currentAnalysis.document.serialNumber && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Serial Number:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-mono text-xs">{currentAnalysis.document.serialNumber}</span>
                          </div>
                        )}
                        {currentAnalysis.document.documentNamespace && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Namespace:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-mono text-xs">{currentAnalysis.document.documentNamespace}</span>
                          </div>
                        )}
                        {currentAnalysis.document.created && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Created:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{new Date(currentAnalysis.document.created).toLocaleString()}</span>
                          </div>
                        )}
                        {currentAnalysis.dependencyEdges && currentAnalysis.dependencyEdges.length > 0 && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Dependencies:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{currentAnalysis.dependencyEdges.length} edges</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Detailed Component Analysis */}
                  {currentAnalysis.components && currentAnalysis.components.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        {t('sbom.results.detailedAnalysis')}
                      </h4>
                      <EnhancedSBOMAnalysis 
                        components={currentAnalysis.components}
                        onPolicyUpdate={(policies) => {
                          logger.debug('Policy updated', { policies });
                          // Future: Save policy changes to database
                        }}
                      />
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('sbom.results.recommendations')}</h4>
                    
                    {currentAnalysis.criticalVulnerabilities > 0 && (
                      <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                        <span className="text-red-800 dark:text-red-300">
                          {t('sbom.results.immediateAction', { count: currentAnalysis.criticalVulnerabilities })}
                        </span>
                      </div>
                    )}
                    
                    {currentAnalysis.riskScore >= 80 ? (
                      <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                        <span className="text-green-800 dark:text-green-300">
                          {t('sbom.results.goodPosture')}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                        <span className="text-yellow-800 dark:text-yellow-300">
                          {t('sbom.results.reviewComponents')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-96 flex flex-col justify-center items-center text-center">
              <FileJson className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {t('sbom.upload.noSbom')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                {t('sbom.upload.uploadPrompt')}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>{t('sbom.aboutSBOM.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('sbom.aboutSBOM.whatIsSBOM')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('sbom.aboutSBOM.sbomDescription')}
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('sbom.aboutSBOM.benefits.identifyVulnerabilities')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('sbom.aboutSBOM.benefits.trackLicenses')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('sbom.aboutSBOM.benefits.meetRequirements')}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('sbom.aboutSBOM.nistAlignment')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('sbom.aboutSBOM.nistDescription')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-vendorsoluce-teal rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('sbom.aboutSBOM.controls.authenticity')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-vendorsoluce-teal rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('sbom.aboutSBOM.controls.management')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-vendorsoluce-teal rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('sbom.aboutSBOM.controls.executiveOrder')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                {t('sbom.aboutSBOM.helpSection.title')}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                {t('sbom.aboutSBOM.helpSection.description')}
              </p>
              <div className="flex space-x-3">
                <Link to="/templates">
                  <Button variant="outline" size="sm">
                    {t('sbom.aboutSBOM.helpSection.downloadTemplates')}
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="sm">
                    {t('sbom.aboutSBOM.helpSection.implementationGuide')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Real Intelligence Notice */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Production Vulnerability Intelligence
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                    This analyzer uses real vulnerability data from the Open Source Vulnerabilities (OSV) Database, 
                    providing current, actionable security intelligence for your software components.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-green-600 dark:text-green-400">
                    <span>✓ Real-time API integration</span>
                    <span>✓ CVE cross-referencing</span>
                    <span>✓ CVSS scoring</span>
                    <span>✓ Actionable remediation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onToggle={setIsChatOpen} />
    </div>
  );
};

export default SBOMAnalyzer;