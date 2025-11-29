import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import PrivacyPolicyPage from '../../pages/PrivacyPolicyPage';

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

describe('PrivacyPolicyPage', () => {
  const mockPrivacyPolicy = {
    last_updated: '2025-01-01T00:00:00Z',
    sections: [
      {
        id: '1',
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.',
      },
      {
        id: '2',
        title: 'How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.',
      },
      {
        id: '3',
        title: 'Information Sharing',
        content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.',
      },
      {
        id: '4',
        title: 'Data Security',
        content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      },
      {
        id: '5',
        title: 'Your Rights',
        content: 'You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      privacyPolicy: mockPrivacyPolicy,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders privacy policy page correctly', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('How we collect, use, and protect your information')).toBeInTheDocument();
  });

  it('displays last updated date', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Last updated: January 1, 2025')).toBeInTheDocument();
  });

  it('shows privacy policy sections', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Information We Collect')).toBeInTheDocument();
    expect(screen.getByText('How We Use Your Information')).toBeInTheDocument();
    expect(screen.getByText('Information Sharing')).toBeInTheDocument();
    expect(screen.getByText('Data Security')).toBeInTheDocument();
    expect(screen.getByText('Your Rights')).toBeInTheDocument();
  });

  it('displays section content', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.')).toBeInTheDocument();
    expect(screen.getByText('We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.')).toBeInTheDocument();
    expect(screen.getByText('We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.')).toBeInTheDocument();
    expect(screen.getByText('We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.')).toBeInTheDocument();
    expect(screen.getByText('You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      privacyPolicy: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      privacyPolicy: null,
      loading: false,
      error: 'Failed to load privacy policy',
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load privacy policy')).toBeInTheDocument();
  });

  it('handles empty sections list', () => {
    mockUseApi.mockReturnValue({
      privacyPolicy: { last_updated: '2025-01-01T00:00:00Z', sections: [] },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no sections found/i)).toBeInTheDocument();
  });

  it('displays table of contents', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Information We Collect')).toBeInTheDocument();
    expect(screen.getByText('How We Use Your Information')).toBeInTheDocument();
    expect(screen.getByText('Information Sharing')).toBeInTheDocument();
    expect(screen.getByText('Data Security')).toBeInTheDocument();
    expect(screen.getByText('Your Rights')).toBeInTheDocument();
  });

  it('shows contact information for privacy questions', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Questions about this Privacy Policy?')).toBeInTheDocument();
    expect(screen.getByText('Contact us at privacy@vendorsoluce.com')).toBeInTheDocument();
  });

  it('displays effective date', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Effective Date')).toBeInTheDocument();
    expect(screen.getByText('January 1, 2025')).toBeInTheDocument();
  });

  it('shows policy version', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Policy Version')).toBeInTheDocument();
    expect(screen.getByText('1.0')).toBeInTheDocument();
  });

  it('displays policy summary', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Policy Summary')).toBeInTheDocument();
    expect(screen.getByText('This privacy policy explains how we collect, use, and protect your personal information.')).toBeInTheDocument();
  });

  it('shows policy changes notification', () => {
    render(
      <TestWrapper>
        <PrivacyPolicyPage />
      </TestWrapper>
    );

    expect(screen.getByText('Policy Changes')).toBeInTheDocument();
    expect(screen.getByText('We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.')).toBeInTheDocument();
  });
});

