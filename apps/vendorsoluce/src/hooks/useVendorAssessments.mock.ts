// Mock implementation for useVendorAssessments hook
// This allows the vendor assessment page to load without database errors

export interface VendorAssessmentWithDetails {
  id: string;
  user_id: string;
  vendor_id: string;
  framework_id: string;
  assessment_name: string;
  status: string | null;
  due_date: string | null;
  sent_at: string | null;
  completed_at: string | null;
  overall_score: number | null;
  section_scores: any;
  contact_email: string | null;
  custom_message: string | null;
  send_reminders: boolean | null;
  allow_save_progress: boolean | null;
  created_at: string;
  updated_at: string;
  vendor: {
    id: string;
    name: string;
    contact_email: string | null;
  };
  framework: {
    id: string;
    name: string;
    description: string | null;
    framework_type: string;
    question_count: number | null;
    estimated_time: string | null;
  };
}

export const useVendorAssessments = () => {
  // Mock data for testing
  const mockAssessments: VendorAssessmentWithDetails[] = [
    {
      id: '1',
      user_id: 'user-1',
      vendor_id: 'vendor-1',
      framework_id: 'framework-1',
      assessment_name: 'CMMC Level 1 Assessment - Acme Corp',
      status: 'pending',
      due_date: '2024-02-15T00:00:00Z',
      sent_at: null,
      completed_at: null,
      overall_score: null,
      section_scores: null,
      contact_email: 'security@acme.com',
      custom_message: null,
      send_reminders: true,
      allow_save_progress: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      vendor: {
        id: 'vendor-1',
        name: 'Acme Corporation',
        contact_email: 'security@acme.com'
      },
      framework: {
        id: 'framework-1',
        name: 'CMMC Level 1',
        description: 'Cybersecurity Maturity Model Certification Level 1 - Basic Cyber Hygiene',
        framework_type: 'cmmc_level_1',
        question_count: 17,
        estimated_time: '30 minutes'
      }
    }
  ];

  const mockFrameworks = [
    {
      id: 'framework-1',
      name: 'CMMC Level 1',
      description: 'Cybersecurity Maturity Model Certification Level 1 - Basic Cyber Hygiene',
      framework_type: 'cmmc_level_1',
      question_count: 17,
      estimated_time: '30 minutes',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'framework-2',
      name: 'CMMC Level 2',
      description: 'Cybersecurity Maturity Model Certification Level 2 - Intermediate Cyber Hygiene',
      framework_type: 'cmmc_level_2',
      question_count: 110,
      estimated_time: '2-3 hours',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'framework-3',
      name: 'NIST Privacy Framework',
      description: 'NIST Privacy Framework Assessment for Data Protection Compliance',
      framework_type: 'nist_privacy',
      question_count: 45,
      estimated_time: '1 hour',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  const createAssessment = async (assessmentData: any) => {
    console.log('Mock: Creating assessment', assessmentData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: 'new-assessment-id', ...assessmentData };
  };

  const sendAssessment = async (id: string) => {
    console.log('Mock: Sending assessment', id);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const deleteAssessment = async (id: string) => {
    console.log('Mock: Deleting assessment', id);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const getAssessmentProgress = (assessment: VendorAssessmentWithDetails) => {
    switch (assessment.status) {
      case 'pending': return 0;
      case 'sent': return 0;
      case 'in_progress': return 50;
      case 'completed': return 100;
      case 'reviewed': return 100;
      default: return 0;
    }
  };

  const getAssessmentStats = () => {
    const total = mockAssessments.length;
    const completed = mockAssessments.filter(a => a.status === 'completed').length;
    const inProgress = mockAssessments.filter(a => a.status === 'in_progress').length;
    const overdue = mockAssessments.filter(a => {
      if (!a.due_date) return false;
      return new Date(a.due_date) < new Date() && a.status !== 'completed';
    }).length;

    const averageScore = mockAssessments
      .filter(a => a.overall_score !== null)
      .reduce((sum, a) => sum + (a.overall_score || 0), 0) / 
      Math.max(1, mockAssessments.filter(a => a.overall_score !== null).length);

    return {
      total,
      completed,
      inProgress,
      overdue,
      averageScore: Math.round(averageScore),
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  return {
    assessments: mockAssessments,
    frameworks: mockFrameworks,
    loading: false,
    error: null,
    createAssessment,
    sendAssessment,
    deleteAssessment,
    getAssessmentProgress,
    getAssessmentStats,
    refetch: async () => {}
  };
};