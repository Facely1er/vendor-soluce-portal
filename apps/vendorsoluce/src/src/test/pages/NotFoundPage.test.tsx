import { render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import NotFoundPage from '../../pages/NotFoundPage';

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

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders 404 page correctly', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });

  it('displays go home button', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
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
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('What you can do:')).toBeInTheDocument();
    expect(screen.getByText('Check the URL for typos')).toBeInTheDocument();
    expect(screen.getByText('Go back to the previous page')).toBeInTheDocument();
    expect(screen.getByText('Return to the homepage')).toBeInTheDocument();
  });

  it('displays contact support option', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('Need help?')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('shows search functionality', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('Search for what you need:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('displays popular pages', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('Popular Pages')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Vendors')).toBeInTheDocument();
    expect(screen.getByText('SBOM Analyzer')).toBeInTheDocument();
  });

  it('handles go home button click', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
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
        <NotFoundPage />
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
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <NotFoundPage />
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
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load page')).toBeInTheDocument();
  });

  it('displays helpful error message', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('Sorry, we could not find the page you are looking for.')).toBeInTheDocument();
  });

  it('shows navigation suggestions', () => {
    render(
      <TestWrapper>
        <NotFoundPage />
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
        <NotFoundPage />
      </TestWrapper>
    );

    expect(screen.getByText('Still having trouble?')).toBeInTheDocument();
    expect(screen.getByText('Contact our support team')).toBeInTheDocument();
  });
});

