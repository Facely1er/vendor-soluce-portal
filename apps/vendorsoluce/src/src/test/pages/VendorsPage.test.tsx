import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useVendors } from '../../hooks/useVendors';
import VendorsPage from '../../pages/VendorsPage';

// Mock the useVendors hook
vi.mock('../../hooks/useVendors');
const mockUseVendors = vi.mocked(useVendors);

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
};

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}));

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

describe('VendorsPage', () => {
  const mockVendors = [
    {
      id: '1',
      name: 'Test Vendor 1',
      industry: 'Technology',
      risk_level: 'High',
      risk_score: 75,
      compliance_status: 'Partial',
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Test Vendor 2',
      industry: 'Finance',
      risk_level: 'Low',
      risk_score: 25,
      compliance_status: 'Compliant',
      created_at: '2025-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseVendors.mockReturnValue({
      vendors: mockVendors,
      loading: false,
      error: null,
      createVendor: vi.fn(),
      updateVendor: vi.fn(),
      deleteVendor: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders vendor list correctly', () => {
    render(
      <TestWrapper>
        <VendorsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Vendor 1')).toBeInTheDocument();
    expect(screen.getByText('Test Vendor 2')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  it('shows loading state', () => {
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
        <VendorsPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
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
        <VendorsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load vendors')).toBeInTheDocument();
  });

  it('displays risk distribution correctly', () => {
    render(
      <TestWrapper>
        <VendorsPage />
      </TestWrapper>
    );

    // Check that risk levels are displayed
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('handles empty vendor list', () => {
    mockUseVendors.mockReturnValue({
      vendors: [],
      loading: false,
      error: null,
      createVendor: vi.fn(),
      updateVendor: vi.fn(),
      deleteVendor: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <VendorsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no vendors found/i)).toBeInTheDocument();
  });
});

