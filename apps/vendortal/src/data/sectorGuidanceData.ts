import { ServiceType } from './serviceTypes';
import { DataType } from './dataTypes';

export interface SectorGuidanceTemplate {
  sector: string;
  service_type: string;
  data_types: string[];
  required_frameworks: string[];
  recommended_assessments: string[];
  compliance_requirements: string[];
  security_controls: Record<string, string>;
  best_practices: string[];
  guidance_content: {
    overview: string;
    priority: 'High' | 'Medium' | 'Low' | 'Critical';
    implementation_timeline?: string;
  };
}

export const sectorGuidanceTemplates: SectorGuidanceTemplate[] = [
  {
    sector: 'Healthcare',
    service_type: 'healthcare_services',
    data_types: ['phi', 'pii'],
    required_frameworks: ['HIPAA', 'HITECH'],
    recommended_assessments: ['HIPAA Security Assessment', 'SOC 2 Type II'],
    compliance_requirements: [
      'HIPAA Privacy Rule',
      'HIPAA Security Rule',
      'Breach Notification Rule',
    ],
    security_controls: {
      encryption: 'Required for PHI at rest and in transit',
      access_controls: 'Role-based access with minimum necessary principle',
      audit_logging: 'Comprehensive logging of all PHI access',
    },
    best_practices: [
      'Implement strong encryption',
      'Conduct regular risk assessments',
      'Maintain audit logs',
      'Train staff on HIPAA compliance',
    ],
    guidance_content: {
      overview:
        'Healthcare services require strict compliance with HIPAA and HITECH regulations',
      priority: 'High',
      implementation_timeline: '2-3 months',
    },
  },
  {
    sector: 'Financial Services',
    service_type: 'payment_processing',
    data_types: ['financial_data', 'pii'],
    required_frameworks: ['PCI DSS', 'SOC 2'],
    recommended_assessments: ['PCI DSS Assessment', 'SOC 2 Type II'],
    compliance_requirements: ['PCI DSS Level 1', 'GLBA', 'State data breach laws'],
    security_controls: {
      encryption: 'PCI DSS compliant encryption',
      tokenization: 'Required for cardholder data',
      network_segmentation: 'Isolate cardholder data environment',
    },
    best_practices: [
      'Implement PCI DSS controls',
      'Use tokenization for card data',
      'Conduct regular security testing',
      'Maintain compliance documentation',
    ],
    guidance_content: {
      overview:
        'Payment processing requires PCI DSS compliance and strong security controls',
      priority: 'Critical',
      implementation_timeline: '3-6 months',
    },
  },
  {
    sector: 'Technology',
    service_type: 'cloud_storage',
    data_types: ['pii', 'customer_data'],
    required_frameworks: ['SOC 2', 'ISO 27001'],
    recommended_assessments: ['SOC 2 Type II', 'ISO 27001'],
    compliance_requirements: ['GDPR', 'CCPA', 'Data residency requirements'],
    security_controls: {
      encryption: 'Encryption at rest and in transit',
      access_controls: 'Multi-factor authentication',
      data_residency: 'Comply with regional requirements',
    },
    best_practices: [
      'Implement strong encryption',
      'Enable MFA',
      'Document data residency',
      'Regular security audits',
    ],
    guidance_content: {
      overview:
        'Cloud storage providers must ensure data security and compliance with privacy regulations',
      priority: 'High',
      implementation_timeline: '6-12 months',
    },
  },
  {
    sector: 'Business Operations',
    service_type: 'hr_software',
    data_types: ['employee_data', 'pii'],
    required_frameworks: ['GDPR', 'HIPAA', 'SOC 2'],
    recommended_assessments: ['GDPR Compliance Assessment', 'SOC 2 Type II'],
    compliance_requirements: ['GDPR', 'Labor laws', 'Data protection regulations'],
    security_controls: {
      encryption: 'Encryption for sensitive employee data',
      access_controls: 'Role-based access control',
      data_retention: 'Comply with retention requirements',
    },
    best_practices: [
      'Implement data encryption',
      'Restrict access to employee data',
      'Maintain data retention policies',
      'Regular compliance audits',
    ],
    guidance_content: {
      overview:
        'HR software must protect employee data and comply with privacy and labor regulations',
      priority: 'High',
      implementation_timeline: '3-6 months',
    },
  },
  {
    sector: 'Analytics',
    service_type: 'marketing_analytics',
    data_types: ['customer_data', 'pii'],
    required_frameworks: ['GDPR', 'CCPA', 'SOC 2'],
    recommended_assessments: ['GDPR Compliance Assessment', 'CCPA Assessment'],
    compliance_requirements: ['GDPR', 'CCPA', 'Cookie consent requirements'],
    security_controls: {
      encryption: 'Encryption for customer data',
      access_controls: 'Access controls for analytics data',
      consent_management: 'Track and manage customer consent',
    },
    best_practices: [
      'Implement data encryption',
      'Manage customer consent',
      'Provide data deletion capabilities',
      'Regular privacy audits',
    ],
    guidance_content: {
      overview:
        'Marketing analytics must comply with privacy regulations and respect customer consent',
      priority: 'Medium',
      implementation_timeline: '2-3 months',
    },
  },
];

export const getGuidanceBySector = (sector: string): SectorGuidanceTemplate[] => {
  return sectorGuidanceTemplates.filter((g) => g.sector === sector);
};

export const getGuidanceByServiceType = (
  serviceType: string
): SectorGuidanceTemplate[] => {
  return sectorGuidanceTemplates.filter((g) => g.service_type === serviceType);
};

export const getGuidanceByDataTypes = (
  dataTypes: string[]
): SectorGuidanceTemplate[] => {
  return sectorGuidanceTemplates.filter((g) =>
    g.data_types.some((dt) => dataTypes.includes(dt))
  );
};

export const getGuidanceForProfile = (
  serviceTypes: string[],
  dataTypes: string[],
  sector?: string
): SectorGuidanceTemplate[] => {
  let guidance = sectorGuidanceTemplates.filter(
    (g) =>
      serviceTypes.includes(g.service_type) ||
      g.data_types.some((dt) => dataTypes.includes(dt))
  );

  if (sector) {
    guidance = guidance.filter((g) => g.sector === sector);
  }

  return guidance;
};

