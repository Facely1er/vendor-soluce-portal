import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useVendors } from '../../hooks/useVendors';
import { useSBOMAnalyses } from '../../hooks/useSBOMAnalyses';
import { useSubscription } from '../../hooks/useSubscription';
import DashboardPage from '../../pages/DashboardPage';

// Mock hooks
vi.mock('../../hooks/useVendors');
vi.mock('../../hooks/useSBOMAnalyses');
vi.mock('../../hooks/useSubscription');

const mockUseVendors = vi.mocked(useVendors);
const mockUseSBOMAnalyses = vi.mocked(useSBOMAnalyses);
const mockUseSubscription = vi.mocked(useSubscription);

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

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseVendors.mockReturnValue({
      vendors: [
        { id: '1', name: 'Vendor 1', risk_level: 'High', risk_score: 75 },
        { id: '2', name: 'Vendor 2', risk_level: 'Low', risk_score: 25 },
      ],
      loading: false,
      error: null,
      createVendor: vi.fn(),
      updateVendor: vi.fn(),
      deleteVendor: vi.fn(),
      refetch: vi.fn(),
    });

    mockUseSBOMAnalyses.mockReturnValue({
      analyses: [
        { id: '1', filename: 'test.json', total_components: 10, total_vulnerabilities: 5 },
      ],
      loading: false,
      error: null,
      createAnalysis: vi.fn(),
      deleteAnalysis: vi.fn(),
      refetch: vi.fn(),
    });

    mockUseSubscription.mockReturnValue({
      subscription: { tier: 'professional', status: 'active' },
      loading: false,
      error: null,
      tier: 'professional',
      checkFeatureAccess: vi.fn(() => true),
      getLimit: vi.fn(() => 50),
      isActive: vi.fn(() => true),
      isTrialing: vi.fn(() => false),
      isCanceled: vi.fn(() => false),
      daysUntilRenewal: vi.fn(() => 15),
      refetch: vi.fn(),
    });
  });

  it('renders dashboard overview correctly', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
  });

  it('displays vendor statistics', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Total Vendors')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Total vendors count
  });

  it('displays SBOM analysis statistics', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('SBOM Analyses')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Total analyses count
  });

  it('shows risk distribution', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Risk Distribution')).toBeInTheDocument();
    expect(screen.getByText('High Risk')).toBeInTheDocument();
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  it('displays recent activity', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('shows quick actions', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Add Vendor')).toBeInTheDocument();
    expect(screen.getByText('Upload SBOM')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    mockUseVendors.mockReturnValue({
      vendors: [],
      loading: true,
      error: null,
      createVendor: vi.fn(),
      updateVendor: vi.fn(),
      deleteVendor: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles error state', () => {
    mockUseVendors.mockReturnValue({
      vendors: [],
      loading: false,
      error: 'Failed to load vendors',
      createVendor: vi.fn(),
      updateVendor: vi.fn(),
      deleteVendor: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load vendors')).toBeInTheDocument();
  });

  it('shows subscription tier information', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Professional')).toBeInTheDocument();
  });

  it('displays feature usage for professional tier', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Feature Usage')).toBeInTheDocument();
    expect(screen.getByText('SBOM Scans')).toBeInTheDocument();
    expect(screen.getByText('Vendors')).toBeInTheDocument();
  });
});

