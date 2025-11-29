export interface ServiceType {
  code: string;
  name: string;
  description: string;
  category: string;
  risk_profile: {
    data_sensitivity: number;
    access_control: number;
    compliance_framework: number;
  };
  framework_requirements: string[];
  common_use_cases: string[];
}

export const serviceTypes: ServiceType[] = [
  {
    code: 'cloud_storage',
    name: 'Cloud Storage',
    description: 'Data storage and backup services in the cloud',
    category: 'Infrastructure',
    risk_profile: {
      data_sensitivity: 4,
      access_control: 3,
      compliance_framework: 3,
    },
    framework_requirements: ['SOC 2', 'ISO 27001', 'GDPR'],
    common_use_cases: ['File storage', 'Backup and recovery', 'Data archiving'],
  },
  {
    code: 'payment_processing',
    name: 'Payment Processing',
    description: 'Payment gateway and transaction processing services',
    category: 'Financial',
    risk_profile: {
      data_sensitivity: 5,
      access_control: 4,
      compliance_framework: 5,
    },
    framework_requirements: ['PCI DSS', 'SOC 2', 'ISO 27001'],
    common_use_cases: ['Online payments', 'Payment gateway', 'Transaction processing'],
  },
  {
    code: 'hr_software',
    name: 'HR Software',
    description: 'Human resources management and employee data systems',
    category: 'Business Operations',
    risk_profile: {
      data_sensitivity: 5,
      access_control: 4,
      compliance_framework: 4,
    },
    framework_requirements: ['GDPR', 'HIPAA', 'SOC 2'],
    common_use_cases: ['Payroll management', 'Employee records', 'Benefits administration'],
  },
  {
    code: 'marketing_analytics',
    name: 'Marketing Analytics',
    description: 'Marketing data analysis and customer insights',
    category: 'Analytics',
    risk_profile: {
      data_sensitivity: 4,
      access_control: 3,
      compliance_framework: 3,
    },
    framework_requirements: ['GDPR', 'CCPA', 'SOC 2'],
    common_use_cases: ['Customer analytics', 'Campaign tracking', 'Behavioral analysis'],
  },
  {
    code: 'software_development',
    name: 'Software Development',
    description: 'Custom software development and consulting',
    category: 'Technology',
    risk_profile: {
      data_sensitivity: 3,
      access_control: 3,
      compliance_framework: 2,
    },
    framework_requirements: ['ISO 27001', 'SOC 2'],
    common_use_cases: ['Custom development', 'Software consulting', 'Application maintenance'],
  },
  {
    code: 'infrastructure',
    name: 'Infrastructure Services',
    description: 'Cloud infrastructure, hosting, and networking',
    category: 'Infrastructure',
    risk_profile: {
      data_sensitivity: 4,
      access_control: 3,
      compliance_framework: 3,
    },
    framework_requirements: ['SOC 2', 'ISO 27001'],
    common_use_cases: ['Cloud hosting', 'Network services', 'Infrastructure management'],
  },
  {
    code: 'professional_services',
    name: 'Professional Services',
    description: 'Consulting, legal, and advisory services',
    category: 'Business Operations',
    risk_profile: {
      data_sensitivity: 3,
      access_control: 2,
      compliance_framework: 2,
    },
    framework_requirements: ['ISO 27001', 'SOC 2'],
    common_use_cases: ['Business consulting', 'Legal services', 'Advisory services'],
  },
  {
    code: 'healthcare_services',
    name: 'Healthcare Services',
    description: 'Healthcare data management and patient services',
    category: 'Healthcare',
    risk_profile: {
      data_sensitivity: 5,
      access_control: 5,
      compliance_framework: 5,
    },
    framework_requirements: ['HIPAA', 'HITECH', 'SOC 2'],
    common_use_cases: ['Patient records', 'Medical billing', 'Telehealth services'],
  },
  {
    code: 'customer_support',
    name: 'Customer Support',
    description: 'Customer service and support platforms',
    category: 'Business Operations',
    risk_profile: {
      data_sensitivity: 3,
      access_control: 3,
      compliance_framework: 2,
    },
    framework_requirements: ['GDPR', 'SOC 2'],
    common_use_cases: ['Help desk', 'Live chat', 'Ticket management'],
  },
  {
    code: 'data_analytics',
    name: 'Data Analytics',
    description: 'Data processing, analytics, and business intelligence',
    category: 'Analytics',
    risk_profile: {
      data_sensitivity: 4,
      access_control: 3,
      compliance_framework: 3,
    },
    framework_requirements: ['GDPR', 'CCPA', 'SOC 2'],
    common_use_cases: ['Business intelligence', 'Data processing', 'Reporting'],
  },
];

export const getServiceTypeByCode = (code: string): ServiceType | undefined => {
  return serviceTypes.find((st) => st.code === code);
};

export const getServiceTypesByCategory = (category: string): ServiceType[] => {
  return serviceTypes.filter((st) => st.category === category);
};

export const serviceCategories = Array.from(new Set(serviceTypes.map((st) => st.category)));

