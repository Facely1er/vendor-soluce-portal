import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import TermsOfServicePage from '../../pages/TermsOfServicePage';

// Mock the useApi hook
vi.mock('../../hooks/useApi');
const mockUseApi = vi.mocked(useApi);

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  </BrowserRouter>
);

describe('TermsOfServicePage', () => {
  const mockTermsOfService = {
    last_updated: '2025-01-01T00:00:00Z',
    sections: [
      {
        id: '1',
        title: 'Acceptance of Terms',
        content: 'By accessing and using VendorSoluce, you accept and agree to be bound by the terms and provision of this agreement.',
      },
      {
        id: '2',
        title: 'Use License',
        content: 'Permission is granted to temporarily download one copy of VendorSoluce for personal, non-commercial transitory viewing only.',
      },
      {
        id: '3',
        title: 'Disclaimer',
        content: 'The materials on VendorSoluce are provided on an "as is" basis. VendorSoluce makes no warranties, expressed or implied.',
      },
      {
        id: '4',
        title: 'Limitations',
        content: 'In no event shall VendorSoluce or its suppliers be liable for any damages arising out of the use or inability to use the materials on VendorSoluce.',
      },
      {
        id: '5',
        title: 'Accuracy of Materials',
        content: 'The materials appearing on VendorSoluce could include technical, typographical, or photographic errors.',
      },
      {
        id: '6',
        title: 'Links',
        content: 'VendorSoluce has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site.',
      },
      {
        id: '7',
        title: 'Modifications',
        content: 'VendorSoluce may revise these terms of service for its website at any time without notice.',
      },
      {
        id: '8',
        title: 'Governing Law',
        content: 'These terms and conditions are governed by and construed in accordance with the laws of California.',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      termsOfService: mockTermsOfService,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders terms of service page correctly', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Terms and conditions for using VendorSoluce')).toBeInTheDocument();
  });

  it('displays last updated date', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Last updated: January 1, 2025')).toBeInTheDocument();
  });

  it('shows terms of service sections', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Acceptance of Terms')).toBeInTheDocument();
    expect(screen.getByText('Use License')).toBeInTheDocument();
    expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    expect(screen.getByText('Limitations')).toBeInTheDocument();
    expect(screen.getByText('Accuracy of Materials')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('Modifications')).toBeInTheDocument();
    expect(screen.getByText('Governing Law')).toBeInTheDocument();
  });

  it('displays section content', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('By accessing and using VendorSoluce, you accept and agree to be bound by the terms and provision of this agreement.')).toBeInTheDocument();
    expect(screen.getByText('Permission is granted to temporarily download one copy of VendorSoluce for personal, non-commercial transitory viewing only.')).toBeInTheDocument();
    expect(screen.getByText('The materials on VendorSoluce are provided on an "as is" basis. VendorSoluce makes no warranties, expressed or implied.')).toBeInTheDocument();
    expect(screen.getByText('In no event shall VendorSoluce or its suppliers be liable for any damages arising out of the use or inability to use the materials on VendorSoluce.')).toBeInTheDocument();
    expect(screen.getByText('The materials appearing on VendorSoluce could include technical, typographical, or photographic errors.')).toBeInTheDocument();
    expect(screen.getByText('VendorSoluce has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site.')).toBeInTheDocument();
    expect(screen.getByText('VendorSoluce may revise these terms of service for its website at any time without notice.')).toBeInTheDocument();
    expect(screen.getByText('These terms and conditions are governed by and construed in accordance with the laws of California.')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      termsOfService: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      termsOfService: null,
      loading: false,
      error: 'Failed to load terms of service',
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load terms of service')).toBeInTheDocument();
  });

  it('handles empty sections list', () => {
    mockUseApi.mockReturnValue({
      termsOfService: { last_updated: '2025-01-01T00:00:00Z', sections: [] },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText(/no sections found/i)).toBeInTheDocument();
  });

  it('displays table of contents', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Acceptance of Terms')).toBeInTheDocument();
    expect(screen.getByText('Use License')).toBeInTheDocument();
    expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    expect(screen.getByText('Limitations')).toBeInTheDocument();
    expect(screen.getByText('Accuracy of Materials')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('Modifications')).toBeInTheDocument();
    expect(screen.getByText('Governing Law')).toBeInTheDocument();
  });

  it('shows contact information for terms questions', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Questions about these Terms?')).toBeInTheDocument();
    expect(screen.getByText('Contact us at legal@vendorsoluce.com')).toBeInTheDocument();
  });

  it('displays effective date', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Effective Date')).toBeInTheDocument();
    expect(screen.getByText('January 1, 2025')).toBeInTheDocument();
  });

  it('shows terms version', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Terms Version')).toBeInTheDocument();
    expect(screen.getByText('1.0')).toBeInTheDocument();
  });

  it('displays terms summary', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Terms Summary')).toBeInTheDocument();
    expect(screen.getByText('These terms of service govern your use of VendorSoluce and our services.')).toBeInTheDocument();
  });

  it('shows terms changes notification', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Terms Changes')).toBeInTheDocument();
    expect(screen.getByText('We may update these terms of service from time to time. We will notify you of any changes by posting the new terms on this page.')).toBeInTheDocument();
  });

  it('displays acceptance checkbox', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByText('I have read and agree to the Terms of Service')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('shows acceptance button', () => {
    render(
      <TestWrapper>
        <TermsOfServicePage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Accept Terms' })).toBeInTheDocument();
  });
});

