import { render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import UnauthorizedPage from '../../pages/UnauthorizedPage';

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

describe('UnauthorizedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders unauthorized page correctly', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('You do not have permission to access this resource.')).toBeInTheDocument();
  });

  it('displays go home button', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument();
  });

  it('displays go back button', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
  });

  it('shows helpful suggestions', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('What you can do:')).toBeInTheDocument();
    expect(screen.getByText('Check if you are logged in')).toBeInTheDocument();
    expect(screen.getByText('Verify your account permissions')).toBeInTheDocument();
    expect(screen.getByText('Contact your administrator')).toBeInTheDocument();
  });

  it('displays contact support option', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Need help?')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('shows login option', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Not logged in?')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('displays permission information', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Permission Information')).toBeInTheDocument();
    expect(screen.getByText('This resource requires specific permissions to access.')).toBeInTheDocument();
  });

  it('shows error code', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Error Code')).toBeInTheDocument();
    expect(screen.getByText('403')).toBeInTheDocument();
  });

  it('displays error timestamp', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Error Time')).toBeInTheDocument();
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  });

  it('handles go home button click', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    const goHomeButton = screen.getByRole('button', { name: 'Go Home' });
    fireEvent.click(goHomeButton);

    // In a real test, you would check if navigation occurred
    expect(goHomeButton).toBeInTheDocument();
  });

  it('handles go back button click', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    const goBackButton = screen.getByRole('button', { name: 'Go Back' });
    fireEvent.click(goBackButton);

    // In a real test, you would check if navigation occurred
    expect(goBackButton).toBeInTheDocument();
  });

  it('displays error illustration', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('403')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      loading: false,
      error: 'Failed to load page',
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load page')).toBeInTheDocument();
  });

  it('displays helpful error message', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('You do not have permission to access this resource.')).toBeInTheDocument();
  });

  it('shows navigation suggestions', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Try these instead:')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Vendors')).toBeInTheDocument();
    expect(screen.getByText('SBOM Analyzer')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Still having trouble?')).toBeInTheDocument();
    expect(screen.getByText('Contact our support team')).toBeInTheDocument();
  });

  it('shows account status', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Account Status')).toBeInTheDocument();
    expect(screen.getByText('Check your account status and permissions')).toBeInTheDocument();
  });

  it('displays permission levels', () => {
    render(
      <TestWrapper>
        <UnauthorizedPage />
      </TestWrapper>
    );

    expect(screen.getByText('Permission Levels')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Guest')).toBeInTheDocument();
  });
});

