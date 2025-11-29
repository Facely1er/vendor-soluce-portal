// Mock implementation for useVendors hook
// This allows the vendor assessment page to load without database errors

export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  industry: string | null;
  website: string | null;
  contact_email: string | null;
  risk_score: number | null;
  risk_level: string | null;
  compliance_status: string | null;
  last_assessment_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useVendors = () => {
  // Mock data for testing
  const mockVendors: Vendor[] = [
    {
      id: 'vendor-1',
      user_id: 'user-1',
      name: 'Acme Corporation',
      industry: 'Technology',
      website: 'https://acme.com',
      contact_email: 'security@acme.com',
      risk_score: 75,
      risk_level: 'medium',
      compliance_status: 'in_progress',
      last_assessment_date: '2024-01-10T00:00:00Z',
      notes: 'Primary software vendor',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: 'vendor-2',
      user_id: 'user-1',
      name: 'Tech Solutions Inc',
      industry: 'Software',
      website: 'https://techsolutions.com',
      contact_email: 'info@techsolutions.com',
      risk_score: 45,
      risk_level: 'low',
      compliance_status: 'compliant',
      last_assessment_date: '2024-01-05T00:00:00Z',
      notes: 'Cloud services provider',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    },
    {
      id: 'vendor-3',
      user_id: 'user-1',
      name: 'Data Systems LLC',
      industry: 'Data Processing',
      website: 'https://datasystems.com',
      contact_email: 'security@datasystems.com',
      risk_score: 85,
      risk_level: 'high',
      compliance_status: 'non_compliant',
      last_assessment_date: '2023-12-15T00:00:00Z',
      notes: 'Requires immediate attention',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2023-12-15T00:00:00Z'
    }
  ];

  const createVendor = async (vendorData: any) => {
    console.log('Mock: Creating vendor', vendorData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: 'new-vendor-id', ...vendorData };
  };

  const updateVendor = async (id: string, vendorData: any) => {
    console.log('Mock: Updating vendor', id, vendorData);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const deleteVendor = async (id: string) => {
    console.log('Mock: Deleting vendor', id);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return {
    vendors: mockVendors,
    loading: false,
    error: null,
    createVendor,
    updateVendor,
    deleteVendor,
    refetch: async () => {}
  };
};