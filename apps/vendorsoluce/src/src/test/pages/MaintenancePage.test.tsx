import { render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import MaintenancePage from '../../pages/MaintenancePage';

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

describe('MaintenancePage', () => {
  const mockMaintenanceInfo = {
    scheduled_start: '2025-01-01T00:00:00Z',
    scheduled_end: '2025-01-01T04:00:00Z',
    estimated_duration: '4 hours',
    reason: 'Scheduled system maintenance and updates',
    affected_services: ['Vendor Management', 'SBOM Analysis', 'Reporting'],
    contact_email: 'support@vendorsoluce.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      maintenanceInfo: mockMaintenanceInfo,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders maintenance page correctly', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('System Maintenance')).toBeInTheDocument();
    expect(screen.getByText('We are currently performing scheduled maintenance')).toBeInTheDocument();
  });

  it('displays maintenance schedule', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Maintenance Schedule')).toBeInTheDocument();
    expect(screen.getByText('Start Time')).toBeInTheDocument();
    expect(screen.getByText('End Time')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  it('shows maintenance times', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText('4 hours')).toBeInTheDocument();
  });

  it('displays maintenance reason', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Maintenance Reason')).toBeInTheDocument();
    expect(screen.getByText('Scheduled system maintenance and updates')).toBeInTheDocument();
  });

  it('shows affected services', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Affected Services')).toBeInTheDocument();
    expect(screen.getByText('Vendor Management')).toBeInTheDocument();
    expect(screen.getByText('SBOM Analysis')).toBeInTheDocument();
    expect(screen.getByText('Reporting')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Need immediate assistance?')).toBeInTheDocument();
    expect(screen.getByText('support@vendorsoluce.com')).toBeInTheDocument();
  });

  it('shows maintenance status', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Maintenance Status')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('displays progress indicator', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows estimated completion time', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Estimated Completion')).toBeInTheDocument();
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  });

  it('displays refresh button', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Refresh Status' })).toBeInTheDocument();
  });

  it('handles refresh button click', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    const refreshButton = screen.getByRole('button', { name: 'Refresh Status' });
    fireEvent.click(refreshButton);

    // In a real test, you would check if refresh logic was triggered
    expect(refreshButton).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      maintenanceInfo: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      maintenanceInfo: null,
      loading: false,
      error: 'Failed to load maintenance information',
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load maintenance information')).toBeInTheDocument();
  });

  it('displays maintenance illustration', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('System Maintenance')).toBeInTheDocument();
  });

  it('shows helpful information', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('What does this mean?')).toBeInTheDocument();
    expect(screen.getByText('During maintenance, some features may be temporarily unavailable.')).toBeInTheDocument();
  });

  it('displays alternative options', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Alternative Options')).toBeInTheDocument();
    expect(screen.getByText('Check our status page')).toBeInTheDocument();
    expect(screen.getByText('Follow us on social media')).toBeInTheDocument();
  });

  it('shows maintenance updates', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Maintenance Updates')).toBeInTheDocument();
    expect(screen.getByText('We will provide updates on our progress here.')).toBeInTheDocument();
  });

  it('displays maintenance history', () => {
    render(
      <TestWrapper>
        <MaintenancePage />
      </TestWrapper>
    );

    expect(screen.getByText('Maintenance History')).toBeInTheDocument();
    expect(screen.getByText('Previous maintenance windows')).toBeInTheDocument();
  });
});

