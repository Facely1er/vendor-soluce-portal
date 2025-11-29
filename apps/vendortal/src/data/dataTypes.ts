export interface DataType {
  code: string;
  name: string;
  description: string;
  sensitivity_level: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  compliance_requirements: string[];
  protection_requirements: string[];
  security_controls: string[];
}

export const dataTypes: DataType[] = [
  {
    code: 'pii',
    name: 'Personally Identifiable Information (PII)',
    description: 'Personal data that can identify an individual',
    sensitivity_level: 'High',
    category: 'Personal Data',
    compliance_requirements: ['GDPR', 'CCPA', 'PIPEDA'],
    protection_requirements: ['Encryption', 'Access controls', 'Data minimization'],
    security_controls: [
      'Data encryption at rest and in transit',
      'Access logging',
      'Data retention policies',
    ],
  },
  {
    code: 'phi',
    name: 'Protected Health Information (PHI)',
    description: 'Health information that can identify an individual',
    sensitivity_level: 'Critical',
    category: 'Healthcare Data',
    compliance_requirements: ['HIPAA', 'HITECH'],
    protection_requirements: ['Encryption', 'Strict access controls', 'Audit logging'],
    security_controls: [
      'End-to-end encryption',
      'Role-based access control',
      'Comprehensive audit trails',
    ],
  },
  {
    code: 'financial_data',
    name: 'Financial Data',
    description: 'Bank account numbers, credit card information, financial records',
    sensitivity_level: 'Critical',
    category: 'Financial Data',
    compliance_requirements: ['PCI DSS', 'GLBA'],
    protection_requirements: ['Strong encryption', 'Tokenization', 'Access restrictions'],
    security_controls: [
      'PCI DSS compliance',
      'Tokenization',
      'Multi-factor authentication',
    ],
  },
  {
    code: 'intellectual_property',
    name: 'Intellectual Property',
    description: 'Trade secrets, patents, proprietary information',
    sensitivity_level: 'High',
    category: 'Business Data',
    compliance_requirements: ['Trade secret laws'],
    protection_requirements: ['Access controls', 'Non-disclosure agreements'],
    security_controls: [
      'Document classification',
      'Access restrictions',
      'NDA enforcement',
    ],
  },
  {
    code: 'customer_data',
    name: 'Customer Data',
    description: 'Customer contact information, preferences, purchase history',
    sensitivity_level: 'Medium',
    category: 'Business Data',
    compliance_requirements: ['GDPR', 'CCPA'],
    protection_requirements: ['Encryption', 'Access controls'],
    security_controls: [
      'Data encryption',
      'Customer consent management',
      'Right to deletion',
    ],
  },
  {
    code: 'employee_data',
    name: 'Employee Data',
    description: 'Employee records, payroll, performance reviews',
    sensitivity_level: 'High',
    category: 'HR Data',
    compliance_requirements: ['GDPR', 'Labor laws'],
    protection_requirements: ['Access controls', 'Data retention'],
    security_controls: [
      'Role-based access',
      'HR system security',
      'Data retention policies',
    ],
  },
  {
    code: 'public_data',
    name: 'Public Data',
    description: 'Publicly available information, marketing materials',
    sensitivity_level: 'Low',
    category: 'Public Data',
    compliance_requirements: [],
    protection_requirements: ['Basic security'],
    security_controls: ['Standard security practices'],
  },
  {
    code: 'biometric_data',
    name: 'Biometric Data',
    description: 'Fingerprints, facial recognition, voice patterns',
    sensitivity_level: 'Critical',
    category: 'Personal Data',
    compliance_requirements: ['BIPA', 'GDPR'],
    protection_requirements: ['Strong encryption', 'Strict access controls', 'Consent management'],
    security_controls: [
      'Biometric data encryption',
      'Access logging',
      'Consent tracking',
    ],
  },
  {
    code: 'location_data',
    name: 'Location Data',
    description: 'GPS coordinates, location history, geolocation',
    sensitivity_level: 'Medium',
    category: 'Personal Data',
    compliance_requirements: ['GDPR', 'CCPA'],
    protection_requirements: ['Encryption', 'Access controls'],
    security_controls: [
      'Location data encryption',
      'Access restrictions',
      'Data minimization',
    ],
  },
];

export const getDataTypeByCode = (code: string): DataType | undefined => {
  return dataTypes.find((dt) => dt.code === code);
};

export const getDataTypesByCategory = (category: string): DataType[] => {
  return dataTypes.filter((dt) => dt.category === category);
};

export const getDataTypesBySensitivity = (
  sensitivity: 'Low' | 'Medium' | 'High' | 'Critical'
): DataType[] => {
  return dataTypes.filter((dt) => dt.sensitivity_level === sensitivity);
};

export const dataCategories = Array.from(new Set(dataTypes.map((dt) => dt.category)));

