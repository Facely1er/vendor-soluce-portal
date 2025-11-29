/**
 * NIST 800-161 Rev 1 C-SCRM Control Mapping Utility
 * Maps risk dimensions to Cybersecurity Supply Chain Risk Management controls
 */

export interface NISTControl {
  id: string;
  name: string;
  category: string;
  family: string;
  description: string;
  controlType: 'mandatory' | 'optional' | 'discretionary';
  references: string[];
}

export interface RiskDimensionMapping {
  riskDimension: string;
  nistControls: NISTControl[];
  implementationGuidance: string;
  examples: string[];
}

export const NIST_CONTROLS: Record<string, NISTControl> = {
  // ID.SC Supply Chain Risk Identification
  'ID.SC-1': {
    id: 'ID.SC-1',
    name: 'Supply Chain Risk Management Strategy',
    category: 'Identify',
    family: 'ID.SC',
    description: 'Organizations develop and implement supply chain risk management strategies, including organization-wide risk management priorities and determination of supply chain dependencies and criticality.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'ISO/IEC 27001']
  },
  'ID.SC-2': {
    id: 'ID.SC-2',
    name: 'Supply Chain Risk Assessment',
    category: 'Identify',
    family: 'ID.SC',
    description: 'Organizations identify and assess risks within the supply chain and assess supplier/vendor risk.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'C-SCRM']
  },
  'ID.SC-3': {
    id: 'ID.SC-3',
    name: 'Supply Chain Risk Monitoring',
    category: 'Identify',
    family: 'ID.SC',
    description: 'Organizations perform ongoing monitoring and assessment of supply chain security posture.',
    controlType: 'discretionary',
    references: ['NIST CSF 1.1', 'C-SCRM']
  },
  'ID.SC-4': {
    id: 'ID.SC-4',
    name: 'Supplier/Service Provider Characterization',
    category: 'Identify',
    family: 'ID.SC',
    description: 'Organizations develop and maintain characterization of suppliers and service providers to support supply chain risk management.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'C-SCRM']
  },

  // PR.IP Information Protection
  'PR.IP-1': {
    id: 'PR.IP-1',
    name: 'Access Control Policies',
    category: 'Protect',
    family: 'PR.IP',
    description: 'Organizations establish and maintain access control policies and procedures for logical and physical access.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'NIST 800-53 AC-1']
  },
  'PR.IP-6': {
    id: 'PR.IP-6',
    name: 'Data Sanitization and Disposal',
    category: 'Protect',
    family: 'PR.IP',
    description: 'Organizations implement policies and procedures for secure handling and disposal of data and information systems.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'NIST 800-88']
  },
  'PR.IP-12': {
    id: 'PR.IP-12',
    name: 'Compliance Management',
    category: 'Protect',
    family: 'PR.IP',
    description: 'Organizations establish and maintain compliance with legal, regulatory, and contractual requirements.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'GDPR', 'SOC 2']
  },

  // PR.DS Data Security
  'PR.DS-1': {
    id: 'PR.DS-1',
    name: 'Data-at-Rest Protection',
    category: 'Protect',
    family: 'PR.DS',
    description: 'Organizations protect data at rest through encryption and appropriate access controls.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'NIST 800-171']
  },
  'PR.DS-2': {
    id: 'PR.DS-2',
    name: 'Data-in-Transit Protection',
    category: 'Protect',
    family: 'PR.DS',
    description: 'Organizations protect data in transit through encryption and secure communications.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'TLS 1.3']
  },
  'PR.DS-5': {
    id: 'PR.DS-5',
    name: 'Data Encrypted',
    category: 'Protect',
    family: 'PR.DS',
    description: 'Organizations ensure sensitive data is encrypted at rest and in transit.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'AES-256']
  },

  // DE.CM Detection and Monitoring
  'DE.CM-1': {
    id: 'DE.CM-1',
    name: 'Network Monitoring',
    category: 'Detect',
    family: 'DE.CM',
    description: 'Organizations monitor network activities to detect potential security events.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1']
  },
  'DE.CM-5': {
    id: 'DE.CM-5',
    name: 'External Service Provider Monitoring',
    category: 'Detect',
    family: 'DE.CM',
    description: 'Organizations monitor activities of external service providers.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'C-SCRM']
  },

  // RS.MI Incident Response
  'RS.MI-1': {
    id: 'RS.MI-1',
    name: 'Incident Response Plan',
    category: 'Respond',
    family: 'RS.MI',
    description: 'Organizations implement incident response plans and procedures.',
    controlType: 'mandatory',
    references: ['NIST CSF 1.1', 'NIST 800-61']
  }
};

/**
 * Risk dimension to NIST control mapping
 */
export const RISK_DIMENSION_MAPPINGS: RiskDimensionMapping[] = [
  {
    riskDimension: 'Data Sensitivity',
    nistControls: [
      NIST_CONTROLS['ID.SC-2'],
      NIST_CONTROLS['PR.DS-1'],
      NIST_CONTROLS['PR.DS-2']
    ],
    implementationGuidance: 'Assess the sensitivity of data being processed by vendors, including PII, financial data, and health information. Implement encryption controls for data at rest and in transit.',
    examples: [
      'Conduct data classification assessment',
      'Identify sensitive data types',
      'Document data processing activities'
    ]
  },
  {
    riskDimension: 'Access Control',
    nistControls: [
      NIST_CONTROLS['PR.IP-1'],
      NIST_CONTROLS['DE.CM-1']
    ],
    implementationGuidance: 'Ensure vendors implement appropriate access control policies including logical and physical access management, user authentication, and privilege management.',
    examples: [
      'Review vendor access control policies',
      'Assess authentication mechanisms',
      'Verify role-based access controls'
    ]
  },
  {
    riskDimension: 'Data Residency',
    nistControls: [
      NIST_CONTROLS['ID.SC-4'],
      NIST_CONTROLS['PR.DS-1']
    ],
    implementationGuidance: 'Characterize vendor data residency and cross-border data flow. Ensure compliance with data protection regulations in relevant jurisdictions.',
    examples: [
      'Map data storage locations',
      'Assess cross-border data transfers',
      'Verify compliance with local regulations'
    ]
  },
  {
    riskDimension: 'Retention Control',
    nistControls: [
      NIST_CONTROLS['PR.IP-6'],
      NIST_CONTROLS['RS.MI-1']
    ],
    implementationGuidance: 'Ensure vendors implement data retention and deletion policies aligned with regulatory requirements. Verify data sanitization procedures.',
    examples: [
      'Review data retention policies',
      'Assess data deletion procedures',
      'Verify secure deletion capabilities'
    ]
  },
  {
    riskDimension: 'Encryption Standards',
    nistControls: [
      NIST_CONTROLS['PR.DS-1'],
      NIST_CONTROLS['PR.DS-2'],
      NIST_CONTROLS['PR.DS-5']
    ],
    implementationGuidance: 'Verify that vendors implement strong encryption standards for data at rest and in transit. Assess key management practices.',
    examples: [
      'Review encryption algorithms and key lengths',
      'Assess TLS/SSL configurations',
      'Verify key management practices'
    ]
  },
  {
    riskDimension: 'Compliance Framework',
    nistControls: [
      NIST_CONTROLS['PR.IP-12'],
      NIST_CONTROLS['ID.SC-1']
    ],
    implementationGuidance: 'Assess vendor compliance with relevant frameworks including SOC 2, ISO 27001, GDPR, and industry-specific regulations. Review audit reports and certifications.',
    examples: [
      'Request compliance certifications',
      'Review audit reports',
      'Assess regulatory compliance status'
    ]
  }
];

/**
 * Get NIST controls for a specific risk dimension
 */
export function getNISTControlsForRiskDimension(dimension: string): NISTControl[] {
  const mapping = RISK_DIMENSION_MAPPINGS.find(
    m => m.riskDimension.toLowerCase() === dimension.toLowerCase()
  );
  return mapping?.nistControls || [];
}

/**
 * Get implementation guidance for a risk dimension
 */
export function getImplementationGuidance(dimension: string): string {
  const mapping = RISK_DIMENSION_MAPPINGS.find(
    m => m.riskDimension.toLowerCase() === dimension.toLowerCase()
  );
  return mapping?.implementationGuidance || 'No specific guidance available.';
}

/**
 * Get all controls for a specific NIST family
 */
export function getControlsByFamily(family: string): NISTControl[] {
  return Object.values(NIST_CONTROLS).filter(control => control.family === family);
}

/**
 * Generate NIST compliance report for assessment results
 */
export function generateNISTComplianceReport(
  riskDimensions: Array<{ dimension: string; score: number; notes?: string }>
): {
  complianceScore: number;
  coveredControls: string[];
  gaps: Array<{ control: string; reason: string }>;
} {
  const allControls = new Set<string>();
  const gaps: Array<{ control: string; reason: string }> = [];

  riskDimensions.forEach(({ dimension, score, notes }) => {
    const controls = getNISTControlsForRiskDimension(dimension);
    
    controls.forEach(control => {
      allControls.add(control.id);
      
      // Identify gaps based on score
      if (score < 70 && control.controlType === 'mandatory') {
        gaps.push({
          control: control.id,
          reason: `${dimension} score is below threshold (${score}/100). ${notes || ''}`
        });
      }
    });
  });

  const complianceScore = gaps.length === 0 ? 100 : Math.max(0, 100 - (gaps.length * 10));

  return {
    complianceScore,
    coveredControls: Array.from(allControls),
    gaps
  };
}

/**
 * Validate NIST control implementation
 */
export function validateControlImplementation(
  controlId: string,
  evidence: string[]
): { isValid: boolean; gaps: string[] } {
  const control = NIST_CONTROLS[controlId];
  if (!control) {
    return { isValid: false, gaps: ['Unknown control'] };
  }

  const requiredEvidence = [
    `${control.name} policy documentation`,
    'Implementation evidence',
    'Ongoing monitoring or assessment records'
  ];

  const gaps = requiredEvidence.filter(req => 
    !evidence.some(ev => ev.toLowerCase().includes(req.toLowerCase().split(' ')[0]))
  );

  return {
    isValid: gaps.length === 0,
    gaps
  };
}

