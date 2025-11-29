import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import AuditLogsPage from '../../pages/AuditLogsPage';

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

describe('AuditLogsPage', () => {
  const mockLogs = [
    {
      id: '1',
      user_id: 'user-1',
      action: 'vendor_created',
      resource_type: 'vendor',
      resource_id: 'vendor-1',
      timestamp: '2025-01-01T00:00:00Z',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0...',
      details: {
        vendor_name: 'Test Vendor',
        risk_level: 'High',
      },
      user: {
        email: 'admin@example.com',
        full_name: 'Admin User',
      },
    },
    {
      id: '2',
      user_id: 'user-2',
      action: 'sbom_uploaded',
      resource_type: 'sbom',
      resource_id: 'sbom-1',
      timestamp: '2025-01-02T00:00:00Z',
      ip_address: '192.168.1.2',
      user_agent: 'Mozilla/5.0...',
      details: {
        filename: 'test-sbom.json',
        component_count: 10,
      },
      user: {
        email: 'user@example.com',
        full_name: 'Regular User',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
      fetchLogs: vi.fn(),
      exportLogs: vi.fn(),
      filterLogs: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders audit logs page correctly', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    expect(screen.getByText('Track and monitor system activities')).toBeInTheDocument();
  });

  it('displays log entries', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Vendor Created')).toBeInTheDocument();
    expect(screen.getByText('SBOM Uploaded')).toBeInTheDocument();
  });

  it('shows user information', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Regular User')).toBeInTheDocument();
  });

  it('displays timestamps', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-02/)).toBeInTheDocument();
  });

  it('shows IP addresses', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
  });

  it('displays action details', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('test-sbom.json')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows resource types', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Vendor')).toBeInTheDocument();
    expect(screen.getByText('SBOM')).toBeInTheDocument();
  });

  it('displays log filters', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Filter Logs')).toBeInTheDocument();
    expect(screen.getByText('Filter by User')).toBeInTheDocument();
    expect(screen.getByText('Filter by Action')).toBeInTheDocument();
    expect(screen.getByText('Filter by Date')).toBeInTheDocument();
  });

  it('shows export options', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Export Logs')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      logs: [],
      loading: true,
      error: null,
      fetchLogs: vi.fn(),
      exportLogs: vi.fn(),
      filterLogs: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      logs: [],
      loading: false,
      error: 'Failed to load logs',
      fetchLogs: vi.fn(),
      exportLogs: vi.fn(),
      filterLogs: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load logs')).toBeInTheDocument();
  });

  it('handles empty logs list', () => {
    mockUseApi.mockReturnValue({
      logs: [],
      loading: false,
      error: null,
      fetchLogs: vi.fn(),
      exportLogs: vi.fn(),
      filterLogs: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no logs found/i)).toBeInTheDocument();
  });

  it('displays log statistics', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Log Statistics')).toBeInTheDocument();
    expect(screen.getByText('Total Logs')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows log search functionality', () => {
    render(
      <TestWrapper>
        <AuditLogsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Search Logs')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search logs/i)).toBeInTheDocument();
  });
});

