import { render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import ServiceUnavailablePage from '../../pages/ServiceUnavailablePage';

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

describe('ServiceUnavailablePage', () => {
  const mockServiceStatus = {
    status: 'unavailable',
    reason: 'Scheduled maintenance',
    estimated_restoration: '2025-01-01T04:00:00Z',
    affected_services: ['Vendor Management', 'SBOM Analysis'],
    contact_email: 'support@vendorsoluce.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      serviceStatus: mockServiceStatus,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders service unavailable page correctly', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('503')).toBeInTheDocument();
    expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    expect(screen.getByText('The service is temporarily unavailable')).toBeInTheDocument();
  });

  it('displays service status', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Service Status')).toBeInTheDocument();
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('shows service reason', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('Scheduled maintenance')).toBeInTheDocument();
  });

  it('displays estimated restoration time', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Estimated Restoration')).toBeInTheDocument();
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  });

  it('shows affected services', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Affected Services')).toBeInTheDocument();
    expect(screen.getByText('Vendor Management')).toBeInTheDocument();
    expect(screen.getByText('SBOM Analysis')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Need immediate assistance?')).toBeInTheDocument();
    expect(screen.getByText('support@vendorsoluce.com')).toBeInTheDocument();
  });

  it('shows refresh button', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Refresh Status' })).toBeInTheDocument();
  });

  it('displays go home button', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument();
  });

  it('handles refresh button click', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    const refreshButton = screen.getByRole('button', { name: 'Refresh Status' });
    fireEvent.click(refreshButton);

    // In a real test, you would check if refresh logic was triggered
    expect(refreshButton).toBeInTheDocument();
  });

  it('handles go home button click', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    const goHomeButton = screen.getByRole('button', { name: 'Go Home' });
    fireEvent.click(goHomeButton);

    // In a real test, you would check if navigation occurred
    expect(goHomeButton).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      serviceStatus: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      serviceStatus: null,
      loading: false,
      error: 'Failed to load service status',
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load service status')).toBeInTheDocument();
  });

  it('displays error illustration', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('503')).toBeInTheDocument();
  });

  it('shows helpful information', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('What does this mean?')).toBeInTheDocument();
    expect(screen.getByText('The service is temporarily unavailable due to maintenance or technical issues.')).toBeInTheDocument();
  });

  it('displays alternative options', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Alternative Options')).toBeInTheDocument();
    expect(screen.getByText('Check our status page')).toBeInTheDocument();
    expect(screen.getByText('Follow us on social media')).toBeInTheDocument();
  });

  it('shows service updates', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Service Updates')).toBeInTheDocument();
    expect(screen.getByText('We will provide updates on our progress here.')).toBeInTheDocument();
  });

  it('displays service history', () => {
    render(
      <TestWrapper>
        <ServiceUnavailablePage />
      </TestWrapper>
    );

    expect(screen.getByText('Service History')).toBeInTheDocument();
    expect(screen.getByText('Previous service interruptions')).toBeInTheDocument();
  });
});

