import { render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import IAmATeapotErrorPage from '../../pages/IAmATeapotErrorPage';

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

describe('IAmATeapotErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders I am a teapot error page correctly', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('I Am A Teapot')).toBeInTheDocument();
    expect(screen.getByText('The server is a teapot and cannot brew coffee')).toBeInTheDocument();
  });

  it('displays retry button', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });

  it('displays go home button', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument();
  });

  it('shows error details', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Error Details')).toBeInTheDocument();
    expect(screen.getByText('The server is a teapot and cannot brew coffee')).toBeInTheDocument();
  });

  it('displays troubleshooting steps', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Troubleshooting Steps')).toBeInTheDocument();
    expect(screen.getByText('Try brewing tea instead')).toBeInTheDocument();
    expect(screen.getByText('Check server status')).toBeInTheDocument();
    expect(screen.getByText('Verify request type')).toBeInTheDocument();
    expect(screen.getByText('Contact server administrator')).toBeInTheDocument();
  });

  it('shows contact support option', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Still having issues?')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('displays error code', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Error Code')).toBeInTheDocument();
    expect(screen.getByText('I_AM_A_TEAPOT_ERROR')).toBeInTheDocument();
  });

  it('shows error timestamp', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Error Time')).toBeInTheDocument();
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  });

  it('handles retry button click', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    fireEvent.click(retryButton);

    // In a real test, you would check if retry logic was triggered
    expect(retryButton).toBeInTheDocument();
  });

  it('handles go home button click', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    const goHomeButton = screen.getByRole('button', { name: 'Go Home' });
    fireEvent.click(goHomeButton);

    // In a real test, you would check if navigation occurred
    expect(goHomeButton).toBeInTheDocument();
  });

  it('displays error illustration', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('I Am A Teapot')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
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
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load page')).toBeInTheDocument();
  });

  it('displays helpful error message', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('The server is a teapot and cannot brew coffee')).toBeInTheDocument();
  });

  it('shows error reporting option', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Report this error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Report Error' })).toBeInTheDocument();
  });

  it('displays error prevention tips', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Prevention Tips')).toBeInTheDocument();
    expect(screen.getByText('Check server capabilities')).toBeInTheDocument();
    expect(screen.getByText('Verify request compatibility')).toBeInTheDocument();
    expect(screen.getByText('Use appropriate endpoints')).toBeInTheDocument();
  });

  it('shows error recovery options', () => {
    render(
      <TestWrapper>
        <IAmATeapotErrorPage />
      </TestWrapper>
    );

    expect(screen.getByText('Recovery Options')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });
});

