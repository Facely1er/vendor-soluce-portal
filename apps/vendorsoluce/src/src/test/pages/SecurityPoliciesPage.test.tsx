import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import SecurityPoliciesPage from '../../pages/SecurityPoliciesPage';

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

describe('SecurityPoliciesPage', () => {
  const mockPolicies = [
    {
      id: '1',
      name: 'Password Policy',
      category: 'authentication',
      status: 'active',
      last_updated: '2025-01-01T00:00:00Z',
      description: 'Password requirements and security guidelines',
      compliance_frameworks: ['SOC 2', 'ISO 27001'],
    },
    {
      id: '2',
      name: 'Data Encryption Policy',
      category: 'data_protection',
      status: 'draft',
      last_updated: '2025-01-02T00:00:00Z',
      description: 'Data encryption standards and procedures',
      compliance_frameworks: ['PCI DSS', 'ISO 27001'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      policies: mockPolicies,
      loading: false,
      error: null,
      createPolicy: vi.fn(),
      updatePolicy: vi.fn(),
      deletePolicy: vi.fn(),
      publishPolicy: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders security policies page correctly', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Security Policies')).toBeInTheDocument();
    expect(screen.getByText('Manage and maintain security policies')).toBeInTheDocument();
  });

  it('displays policy list', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Password Policy')).toBeInTheDocument();
    expect(screen.getByText('Data Encryption Policy')).toBeInTheDocument();
  });

  it('shows policy categories', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('Data Protection')).toBeInTheDocument();
  });

  it('displays policy status', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('shows policy descriptions', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Password requirements and security guidelines')).toBeInTheDocument();
    expect(screen.getByText('Data encryption standards and procedures')).toBeInTheDocument();
  });

  it('displays compliance frameworks', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('SOC 2')).toBeInTheDocument();
    expect(screen.getByText('ISO 27001')).toBeInTheDocument();
    expect(screen.getByText('PCI DSS')).toBeInTheDocument();
  });

  it('shows last updated dates', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-02/)).toBeInTheDocument();
  });

  it('displays policy management actions', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Create Policy')).toBeInTheDocument();
    expect(screen.getByText('Edit Policy')).toBeInTheDocument();
    expect(screen.getByText('Publish Policy')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      policies: [],
      loading: true,
      error: null,
      createPolicy: vi.fn(),
      updatePolicy: vi.fn(),
      deletePolicy: vi.fn(),
      publishPolicy: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      policies: [],
      loading: false,
      error: 'Failed to load policies',
      createPolicy: vi.fn(),
      updatePolicy: vi.fn(),
      deletePolicy: vi.fn(),
      publishPolicy: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load policies')).toBeInTheDocument();
  });

  it('handles empty policies list', () => {
    mockUseApi.mockReturnValue({
      policies: [],
      loading: false,
      error: null,
      createPolicy: vi.fn(),
      updatePolicy: vi.fn(),
      deletePolicy: vi.fn(),
      publishPolicy: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no policies found/i)).toBeInTheDocument();
  });

  it('displays policy templates', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Policy Templates')).toBeInTheDocument();
    expect(screen.getByText('SOC 2 Template')).toBeInTheDocument();
    expect(screen.getByText('ISO 27001 Template')).toBeInTheDocument();
  });

  it('shows policy compliance mapping', () => {
    render(
      <TestWrapper>
        <SecurityPoliciesPage />
      </TestWrapper>
    );

    expect(screen.getByText('Compliance Mapping')).toBeInTheDocument();
    expect(screen.getByText('Map policies to compliance requirements')).toBeInTheDocument();
  });
});

