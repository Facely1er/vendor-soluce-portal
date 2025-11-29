import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import ComplianceReportingPage from '../../pages/ComplianceReportingPage';

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

describe('ComplianceReportingPage', () => {
  const mockReports = [
    {
      id: '1',
      name: 'SOC 2 Compliance Report',
      type: 'soc2',
      status: 'completed',
      generated_at: '2025-01-01T00:00:00Z',
      file_url: '/reports/soc2-report.pdf',
    },
    {
      id: '2',
      name: 'ISO 27001 Assessment',
      type: 'iso27001',
      status: 'in_progress',
      generated_at: null,
      file_url: null,
    },
  ];

  const mockComplianceData = {
    soc2: {
      score: 85,
      status: 'compliant',
      last_assessment: '2025-01-01T00:00:00Z',
    },
    iso27001: {
      score: 78,
      status: 'partial',
      last_assessment: '2025-01-02T00:00:00Z',
    },
    pci_dss: {
      score: 92,
      status: 'compliant',
      last_assessment: '2025-01-03T00:00:00Z',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      reports: mockReports,
      complianceData: mockComplianceData,
      loading: false,
      error: null,
      generateReport: vi.fn(),
      downloadReport: vi.fn(),
      scheduleReport: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders compliance reporting page correctly', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Compliance Reporting')).toBeInTheDocument();
    expect(screen.getByText('Generate and manage compliance reports')).toBeInTheDocument();
  });

  it('displays compliance overview', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Compliance Overview')).toBeInTheDocument();
    expect(screen.getByText('SOC 2')).toBeInTheDocument();
    expect(screen.getByText('ISO 27001')).toBeInTheDocument();
    expect(screen.getByText('PCI DSS')).toBeInTheDocument();
  });

  it('shows compliance scores', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('displays compliance status', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Compliant')).toBeInTheDocument();
    expect(screen.getByText('Partial')).toBeInTheDocument();
  });

  it('shows report list', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('SOC 2 Compliance Report')).toBeInTheDocument();
    expect(screen.getByText('ISO 27001 Assessment')).toBeInTheDocument();
  });

  it('displays report status', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('shows report generation date', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  });

  it('displays report types', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('SOC 2')).toBeInTheDocument();
    expect(screen.getByText('ISO 27001')).toBeInTheDocument();
  });

  it('shows report generation options', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Generate Report')).toBeInTheDocument();
    expect(screen.getByText('Schedule Report')).toBeInTheDocument();
  });

  it('displays report download options', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Download Report')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      reports: [],
      complianceData: null,
      loading: true,
      error: null,
      generateReport: vi.fn(),
      downloadReport: vi.fn(),
      scheduleReport: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      reports: [],
      complianceData: null,
      loading: false,
      error: 'Failed to load reports',
      generateReport: vi.fn(),
      downloadReport: vi.fn(),
      scheduleReport: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load reports')).toBeInTheDocument();
  });

  it('handles empty reports list', () => {
    mockUseApi.mockReturnValue({
      reports: [],
      complianceData: mockComplianceData,
      loading: false,
      error: null,
      generateReport: vi.fn(),
      downloadReport: vi.fn(),
      scheduleReport: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no reports found/i)).toBeInTheDocument();
  });

  it('displays compliance frameworks', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Compliance Frameworks')).toBeInTheDocument();
    expect(screen.getByText('SOC 2 Type II')).toBeInTheDocument();
    expect(screen.getByText('ISO 27001')).toBeInTheDocument();
    expect(screen.getByText('PCI DSS')).toBeInTheDocument();
  });

  it('shows assessment history', () => {
    render(
      <TestWrapper>
        <ComplianceReportingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Assessment History')).toBeInTheDocument();
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-02/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-03/)).toBeInTheDocument();
  });
});

