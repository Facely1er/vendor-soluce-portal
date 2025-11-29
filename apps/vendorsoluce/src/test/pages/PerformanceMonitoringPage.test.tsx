import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { usePerformanceMonitoring } from '../../hooks/usePerformanceMonitoring';
import PerformanceMonitoringPage from '../../pages/PerformanceMonitoringPage';

// Mock the usePerformanceMonitoring hook
vi.mock('../../hooks/usePerformanceMonitoring');
const mockUsePerformanceMonitoring = vi.mocked(usePerformanceMonitoring);

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

describe('PerformanceMonitoringPage', () => {
  const mockMetrics = {
    response_time: 150,
    error_rate: 0.02,
    throughput: 1000,
    uptime: 99.9,
    memory_usage: 75,
    cpu_usage: 45,
  };

  const mockAlerts = [
    {
      id: '1',
      type: 'error_rate',
      severity: 'high',
      message: 'Error rate exceeded threshold',
      timestamp: '2025-01-01T00:00:00Z',
      resolved: false,
    },
    {
      id: '2',
      type: 'response_time',
      severity: 'medium',
      message: 'Response time increased',
      timestamp: '2025-01-02T00:00:00Z',
      resolved: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePerformanceMonitoring.mockReturnValue({
      metrics: mockMetrics,
      alerts: mockAlerts,
      loading: false,
      error: null,
      fetchMetrics: vi.fn(),
      fetchAlerts: vi.fn(),
      resolveAlert: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders performance monitoring page correctly', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Performance Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Monitor system performance and health')).toBeInTheDocument();
  });

  it('displays performance metrics', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Response Time')).toBeInTheDocument();
    expect(screen.getByText('150ms')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
    expect(screen.getByText('2%')).toBeInTheDocument();
    expect(screen.getByText('Throughput')).toBeInTheDocument();
    expect(screen.getByText('1,000 req/min')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('shows system resource usage', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('displays performance alerts', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Performance Alerts')).toBeInTheDocument();
    expect(screen.getByText('Error rate exceeded threshold')).toBeInTheDocument();
    expect(screen.getByText('Response time increased')).toBeInTheDocument();
  });

  it('shows alert severity levels', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('displays alert status', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('shows alert timestamps', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-02/)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUsePerformanceMonitoring.mockReturnValue({
      metrics: null,
      alerts: [],
      loading: true,
      error: null,
      fetchMetrics: vi.fn(),
      fetchAlerts: vi.fn(),
      resolveAlert: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUsePerformanceMonitoring.mockReturnValue({
      metrics: null,
      alerts: [],
      loading: false,
      error: 'Failed to load metrics',
      fetchMetrics: vi.fn(),
      fetchAlerts: vi.fn(),
      resolveAlert: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load metrics')).toBeInTheDocument();
  });

  it('handles empty alerts list', () => {
    mockUsePerformanceMonitoring.mockReturnValue({
      metrics: mockMetrics,
      alerts: [],
      loading: false,
      error: null,
      fetchMetrics: vi.fn(),
      fetchAlerts: vi.fn(),
      resolveAlert: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no alerts found/i)).toBeInTheDocument();
  });

  it('displays performance charts', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Performance Trends')).toBeInTheDocument();
    expect(screen.getByText('Resource Usage')).toBeInTheDocument();
  });

  it('shows monitoring configuration', () => {
    render(
      <TestWrapper>
        <PerformanceMonitoringPage />
      </TestWrapper>
    );

    expect(screen.getByText('Monitoring Settings')).toBeInTheDocument();
    expect(screen.getByText('Alert Thresholds')).toBeInTheDocument();
  });
});

