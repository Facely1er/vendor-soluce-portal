import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import ApiIntegrationsPage from '../../pages/ApiIntegrationsPage';

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

describe('ApiIntegrationsPage', () => {
  const mockIntegrations = [
    {
      id: '1',
      name: 'OSV API',
      type: 'vulnerability',
      status: 'active',
      last_sync: '2025-01-01T00:00:00Z',
      sync_frequency: 'daily',
      description: 'Open Source Vulnerabilities database',
    },
    {
      id: '2',
      name: 'NVD API',
      type: 'vulnerability',
      status: 'inactive',
      last_sync: null,
      sync_frequency: 'weekly',
      description: 'National Vulnerability Database',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      integrations: mockIntegrations,
      loading: false,
      error: null,
      createIntegration: vi.fn(),
      updateIntegration: vi.fn(),
      deleteIntegration: vi.fn(),
      testIntegration: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders API integrations page correctly', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('API Integrations')).toBeInTheDocument();
    expect(screen.getByText('Manage external API connections')).toBeInTheDocument();
  });

  it('displays integration list', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('OSV API')).toBeInTheDocument();
    expect(screen.getByText('NVD API')).toBeInTheDocument();
  });

  it('shows integration status', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('displays integration types', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Vulnerability')).toBeInTheDocument();
  });

  it('shows sync frequency', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
  });

  it('displays last sync time', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  });

  it('shows integration descriptions', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Open Source Vulnerabilities database')).toBeInTheDocument();
    expect(screen.getByText('National Vulnerability Database')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      integrations: [],
      loading: true,
      error: null,
      createIntegration: vi.fn(),
      updateIntegration: vi.fn(),
      deleteIntegration: vi.fn(),
      testIntegration: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      integrations: [],
      loading: false,
      error: 'Failed to load integrations',
      createIntegration: vi.fn(),
      updateIntegration: vi.fn(),
      deleteIntegration: vi.fn(),
      testIntegration: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load integrations')).toBeInTheDocument();
  });

  it('handles empty integrations list', () => {
    mockUseApi.mockReturnValue({
      integrations: [],
      loading: false,
      error: null,
      createIntegration: vi.fn(),
      updateIntegration: vi.fn(),
      deleteIntegration: vi.fn(),
      testIntegration: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no integrations found/i)).toBeInTheDocument();
  });

  it('displays integration management actions', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Add Integration')).toBeInTheDocument();
    expect(screen.getByText('Test Connection')).toBeInTheDocument();
  });

  it('shows integration configuration options', () => {
    render(
      <TestWrapper>
        <ApiIntegrationsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Sync Settings')).toBeInTheDocument();
  });
});

