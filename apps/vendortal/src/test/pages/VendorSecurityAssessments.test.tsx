import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
// Mock i18n
const mockI18n = {
  t: (key: string) => key,
  changeLanguage: vi.fn(),
};
import VendorSecurityAssessments from '../../pages/VendorSecurityAssessments';
import { AuthProvider } from '../../context/AuthContext';

// Mock the hooks
vi.mock('../../hooks/useVendors', () => ({
  useVendors: () => ({
    vendors: [
      {
        id: 'vendor-1',
        name: 'Test Vendor',
        contact_email: 'test@vendor.com'
      }
    ],
    loading: false
  })
}));

vi.mock('../../hooks/useVendorAssessments', () => ({
  useVendorAssessments: () => ({
    assessments: [
      {
        id: 'assessment-1',
        vendor: {
          id: 'vendor-1',
          name: 'Test Vendor',
          contact_email: 'test@vendor.com'
        },
        framework: {
          id: 'framework-1',
          name: 'CMMC Level 1',
          description: 'Basic cyber hygiene',
          framework_type: 'cmmc_level_1',
          question_count: 17,
          estimated_time: '30 minutes'
        },
        status: 'pending',
        due_date: '2025-02-01',
        overall_score: null,
        created_at: '2025-01-15T10:00:00Z'
      }
    ],
    frameworks: [
      {
        id: 'framework-1',
        name: 'CMMC Level 1',
        description: 'Basic cyber hygiene',
        framework_type: 'cmmc_level_1',
        question_count: 17,
        estimated_time: '30 minutes',
        is_active: true
      }
    ],
    loading: false,
    error: null,
    createAssessment: vi.fn(),
    sendAssessment: vi.fn(),
    deleteAssessment: vi.fn(),
    getAssessmentProgress: () => 0,
    getAssessmentStats: () => ({
      total: 1,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      averageScore: 0,
      completionRate: 0
    })
  })
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={mockI18n as any}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('VendorSecurityAssessments', () => {
  test('renders assessment dashboard', async () => {
    renderWithProviders(<VendorSecurityAssessments />);
    
    await waitFor(() => {
      expect(screen.getByText('vendorAssessments.title')).toBeInTheDocument();
    });
    
    // The component renders successfully with translation keys
    expect(screen.getByText('vendorAssessments.description')).toBeInTheDocument();
  });

  test('shows create assessment button', () => {
    renderWithProviders(<VendorSecurityAssessments />);
    
    expect(screen.getByText('vendorAssessments.buttons.newAssessment')).toBeInTheDocument();
  });

  test('displays assessment progress tracker', () => {
    renderWithProviders(<VendorSecurityAssessments />);
    
    expect(screen.getByText('vendorAssessments.features.cmmcAssessments.title')).toBeInTheDocument();
    expect(screen.getByText('vendorAssessments.features.cmmcAssessments.description')).toBeInTheDocument();
  });
});