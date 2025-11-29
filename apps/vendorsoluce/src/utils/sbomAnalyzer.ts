/**
 * SBOM Analysis Utility
 * 
 * Comprehensive SBOM analysis with NTIA compliance checking,
 * deterministic risk scoring, dependency graph extraction,
 * and vulnerability summarization.
 */

export interface SBOMDocument {
  bomFormat: 'CycloneDX' | 'SPDX' | 'Unknown';
  specVersion: string;
  serialNumber?: string;
  documentNamespace?: string;
  created?: string;
  authors?: Array<{ name?: string; email?: string }>;
  generators?: Array<{ name?: string; version?: string }>;
  sourceFile?: string;
}

export interface ComponentHash {
  algorithm: string;
  content: string;
}

export interface ComponentData {
  id: string;
  name: string;
  version: string;
  type: string;
  ecosystem: string;
  license: string;
  purl?: string;
  hashes?: ComponentHash[];
  supplier?: string;
  description?: string;
  releaseDate?: string;
  maintainer?: string;
  popularity?: number;
}

export interface Vulnerability {
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

export interface DependencyEdge {
  from: string;
  to: string;
  type?: string;
}

export interface VulnerabilitySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  unknown: number;
  total: number;
}

export interface NTIACompliance {
  compliant: boolean;
  checks: {
    hasDependencyGraph: boolean;
    hasAuthorOrOriginator: boolean;
    hasSbomTimestamp: boolean;
    hasSpecVersion: boolean;
    hasSerialNumberOrDocumentNamespace: boolean;
  };
  failedChecks: string[];
  score: number;
}

export interface DataQuality {
  issues: Array<{
    componentId: string;
    field: string;
    issue: string;
  }>;
}

export interface ComponentAnalysis {
  component: ComponentData;
  vulnerabilities: Vulnerability[];
  riskScore: number;
  ntiaCompliance: NTIACompliance;
  dataQuality?: {
    missingPurl?: boolean;
    missingHashes?: boolean;
    missingSupplier?: boolean;
  };
}

export interface SBOMAnalysisResult {
  document: SBOMDocument;
  components: ComponentAnalysis[];
  dependencyEdges: DependencyEdge[];
  vulnerabilitySummary: VulnerabilitySummary;
  ntiaCompliance: NTIACompliance;
  dataQuality: DataQuality;
  overallRiskScore: number;
  analyzedAt: string;
}

/**
 * NTIA Compliance Validator
 * Validates SBOM against NTIA minimum elements requirements
 */
export function validateNTIACompliance(
  document: SBOMDocument,
  hasDependencyGraph: boolean
): NTIACompliance {
  const checks = {
    hasDependencyGraph,
    hasAuthorOrOriginator: !!(document.authors && document.authors.length > 0) ||
                           !!(document.generators && document.generators.length > 0),
    hasSbomTimestamp: !!document.created,
    hasSpecVersion: !!document.specVersion,
    hasSerialNumberOrDocumentNamespace: !!(document.serialNumber || document.documentNamespace)
  };

  const failedChecks = Object.entries(checks)
    .filter(([_, passed]) => !passed)
    .map(([check]) => check);

  const compliant = failedChecks.length === 0;
  const passedCount = Object.values(checks).filter(Boolean).length;
  const score = Math.round((passedCount / Object.keys(checks).length) * 100);

  return {
    compliant,
    checks,
    failedChecks,
    score
  };
}

/**
 * Deterministic Risk Score Calculator
 * Based on CVE presence (CVSS max), KEV/EPSS flags, package age,
 * popularity/maintainer signals, and policy/license flags
 */
export function calculateRiskScore(
  vulnerabilities: Vulnerability[],
  component: ComponentData,
  policyFlags?: {
    licenseApproved?: boolean;
    maintainerActive?: boolean;
  }
): number {
  // Base score starts at 100 (best)
  let score = 100;

  // CVE presence - use max CVSS score
  if (vulnerabilities.length > 0) {
    const maxCVSS = Math.max(
      ...vulnerabilities.map(v => v.cvssMax || v.cvssV3Score || v.cvssV2Score || 0)
    );
    
    // CVSS to risk score: 10.0 = -50, 9.0 = -40, 7.0 = -30, 5.0 = -20, 3.0 = -10
    if (maxCVSS >= 9.0) {
      score -= 50;
    } else if (maxCVSS >= 7.0) {
      score -= 40;
    } else if (maxCVSS >= 5.0) {
      score -= 30;
    } else if (maxCVSS >= 3.0) {
      score -= 20;
    } else if (maxCVSS > 0) {
      score -= 10;
    }
  }

  // KEV flag (Known Exploited Vulnerabilities) - high penalty
  const hasKEV = vulnerabilities.some(v => v.kev === true);
  if (hasKEV) {
    score -= 30;
  }

  // EPSS (Exploit Prediction Scoring System) - if available
  const maxEPSS = Math.max(...vulnerabilities.map(v => v.epss || 0));
  if (maxEPSS > 0.5) {
    score -= 20; // High EPSS = likely to be exploited
  } else if (maxEPSS > 0.2) {
    score -= 10;
  }

  // Package age (release recency)
  if (component.releaseDate) {
    const releaseDate = new Date(component.releaseDate);
    const ageInMonths = (Date.now() - releaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (ageInMonths > 60) { // > 5 years old
      score -= 15;
    } else if (ageInMonths > 36) { // > 3 years old
      score -= 10;
    } else if (ageInMonths > 24) { // > 2 years old
      score -= 5;
    }
  }

  // Popularity/maintainer signals (optional)
  if (component.popularity !== undefined) {
    if (component.popularity < 100) { // Very low popularity
      score -= 5;
    }
  }

  if (component.maintainer) {
    // Active maintainer is positive (no penalty)
    // Missing maintainer could be a concern, but we don't penalize here
  }

  // Policy/license flags
  if (policyFlags) {
    if (policyFlags.licenseApproved === false) {
      score -= 10; // Unapproved license
    }
    if (policyFlags.maintainerActive === false) {
      score -= 5; // Inactive maintainer
    }
  }

  // If no vulnerabilities and no flags, return low risk score (high score)
  if (vulnerabilities.length === 0 && !hasKEV && maxEPSS === 0) {
    // Already at 100, but ensure it stays high
    return Math.max(80, score);
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Extract vulnerability summary from vulnerabilities
 */
export function summarizeVulnerabilities(
  vulnerabilities: Vulnerability[]
): VulnerabilitySummary {
  const summary: VulnerabilitySummary = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    unknown: 0,
    total: vulnerabilities.length
  };

  vulnerabilities.forEach(v => {
    switch (v.severity) {
      case 'CRITICAL':
        summary.critical++;
        break;
      case 'HIGH':
        summary.high++;
        break;
      case 'MEDIUM':
        summary.medium++;
        break;
      case 'LOW':
        summary.low++;
        break;
      case 'UNKNOWN':
        summary.unknown++;
        break;
    }
  });

  return summary;
}

/**
 * Extract hashes from component, preferring SHA-256
 */
export function extractHashes(component: any): ComponentHash[] {
  const hashes: ComponentHash[] = [];
  
  if (component.hashes && Array.isArray(component.hashes)) {
    component.hashes.forEach((hash: any) => {
      hashes.push({
        algorithm: hash.alg || hash.algorithm || 'UNKNOWN',
        content: hash.content || hash.value || ''
      });
    });
  }

  // Prefer SHA-256, sort so SHA-256 comes first
  return hashes.sort((a, b) => {
    if (a.algorithm === 'SHA-256') return -1;
    if (b.algorithm === 'SHA-256') return 1;
    return 0;
  });
}

/**
 * Parse CycloneDX SBOM
 */
export function parseCycloneDX(data: any, sourceFile?: string): {
  document: SBOMDocument;
  components: ComponentData[];
  dependencyEdges: DependencyEdge[];
} {
  const document: SBOMDocument = {
    bomFormat: 'CycloneDX',
    specVersion: data.specVersion || data.version || 'Unknown',
    serialNumber: data.serialNumber,
    created: data.metadata?.timestamp || data.metadata?.created,
    authors: data.metadata?.authors || [],
    generators: data.metadata?.tools?.components || [],
    sourceFile
  };

  const components: ComponentData[] = [];
  const dependencyEdges: DependencyEdge[] = [];
  const componentMap = new Map<string, ComponentData>();

  // Parse components
  if (data.components && Array.isArray(data.components)) {
    data.components.forEach((comp: any, index: number) => {
      const componentId = comp['bom-ref'] || `component-${index}`;
      const hashes = extractHashes(comp);
      
      const component: ComponentData = {
        id: componentId,
        name: comp.name || 'Unknown',
        version: comp.version || 'Unknown',
        type: comp.type || 'library',
        ecosystem: getEcosystemFromPurl(comp.purl) || 'npm',
        license: extractLicense(comp),
        purl: comp.purl,
        hashes: hashes.length > 0 ? hashes : undefined,
        supplier: comp.supplier?.name,
        description: comp.description,
        releaseDate: comp.releaseDate || comp.published,
        maintainer: comp.publisher || comp.maintainer?.name
      };

      components.push(component);
      componentMap.set(componentId, component);
    });
  }

  // Parse dependency graph
  if (data.dependencies && Array.isArray(data.dependencies)) {
    data.dependencies.forEach((dep: any) => {
      const fromRef = dep.ref || dep['bom-ref'];
      if (dep.dependsOn && Array.isArray(dep.dependsOn)) {
        dep.dependsOn.forEach((toRef: string) => {
          dependencyEdges.push({
            from: fromRef,
            to: toRef,
            type: 'dependsOn'
          });
        });
      }
    });
  }

  // If no explicit dependencies but we have a root component, create edges
  if (dependencyEdges.length === 0 && components.length > 0) {
    // Assume first component is root, or look for component with type 'application'
    const rootComponent = components.find(c => c.type === 'application') || components[0];
    if (rootComponent) {
      components.forEach(comp => {
        if (comp.id !== rootComponent.id) {
          dependencyEdges.push({
            from: rootComponent.id,
            to: comp.id,
            type: 'dependency'
          });
        }
      });
    }
  }

  return { document, components, dependencyEdges };
}

/**
 * Parse SPDX SBOM
 */
export function parseSPDX(data: any, sourceFile?: string): {
  document: SBOMDocument;
  components: ComponentData[];
  dependencyEdges: DependencyEdge[];
} {
  const document: SBOMDocument = {
    bomFormat: 'SPDX',
    specVersion: data.spdxVersion || 'Unknown',
    documentNamespace: data.documentNamespace,
    created: data.creationInfo?.created,
    authors: data.creationInfo?.creators?.map((c: string) => {
      const match = c.match(/^(.+?)\s*<(.+)>$/);
      return match ? { name: match[1], email: match[2] } : { name: c };
    }) || [],
    generators: data.creationInfo?.creators?.filter((c: string) => 
      c.toLowerCase().includes('tool') || c.toLowerCase().includes('generator')
    ).map((c: string) => ({ name: c })) || [],
    sourceFile
  };

  const components: ComponentData[] = [];
  const dependencyEdges: DependencyEdge[] = [];
  const packageMap = new Map<string, ComponentData>();

  // Parse packages
  if (data.packages && Array.isArray(data.packages)) {
    data.packages.forEach((pkg: any, index: number) => {
      const packageId = pkg.SPDXID || `package-${index}`;
      
      // Extract hashes from checksums
      const hashes: ComponentHash[] = [];
      if (pkg.checksums && Array.isArray(pkg.checksums)) {
        pkg.checksums.forEach((checksum: any) => {
          hashes.push({
            algorithm: checksum.algorithm || 'UNKNOWN',
            content: checksum.checksumValue || ''
          });
        });
      }

      // Extract purl from externalRefs
      let purl: string | undefined;
      if (pkg.externalRefs && Array.isArray(pkg.externalRefs)) {
        const purlRef = pkg.externalRefs.find((ref: any) => 
          ref.referenceType === 'purl' || ref.referenceCategory === 'PACKAGE-MANAGER'
        );
        if (purlRef) {
          purl = purlRef.referenceLocator;
        }
      }

      const component: ComponentData = {
        id: packageId,
        name: pkg.name || 'Unknown',
        version: pkg.versionInfo || 'Unknown',
        type: 'package',
        ecosystem: getEcosystemFromPurl(purl) || 'npm',
        license: pkg.licenseConcluded || pkg.licenseDeclared || 'Unknown',
        purl,
        hashes: hashes.length > 0 ? hashes : undefined,
        supplier: pkg.supplier || pkg.originator,
        description: pkg.description,
        releaseDate: pkg.releaseDate
      };

      components.push(component);
      packageMap.set(packageId, component);
    });
  }

  // Parse relationships (dependency graph)
  if (data.relationships && Array.isArray(data.relationships)) {
    data.relationships.forEach((rel: any) => {
      const relationshipType = rel.relationshipType || '';
      
      // Common dependency relationships
      if (relationshipType.includes('DEPENDS_ON') || 
          relationshipType.includes('DEPENDENCY_OF') ||
          relationshipType.includes('CONTAINS')) {
        dependencyEdges.push({
          from: rel.spdxElementId,
          to: rel.relatedSpdxElement,
          type: relationshipType
        });
      }
    });
  }

  return { document, components, dependencyEdges };
}

/**
 * Get ecosystem from purl
 */
function getEcosystemFromPurl(purl?: string): string | undefined {
  if (!purl) return undefined;
  const match = purl.match(/^pkg:([^/]+)/);
  return match ? match[1] : undefined;
}

/**
 * Extract license from component
 */
function extractLicense(component: any): string {
  if (!component.licenses) return 'Unknown';
  if (Array.isArray(component.licenses)) {
    const licenseIds = component.licenses
      .map((l: any) => l.license?.id || l.license?.name || l.id || l.name)
      .filter(Boolean);
    return licenseIds.length > 0 ? licenseIds.join(', ') : 'Unknown';
  }
  if (typeof component.licenses === 'string') {
    return component.licenses;
  }
  return 'Unknown';
}
