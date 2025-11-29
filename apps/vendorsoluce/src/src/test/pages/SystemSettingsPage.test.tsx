import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import SystemSettingsPage from '../../pages/SystemSettingsPage';

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

describe('SystemSettingsPage', () => {
  const mockSettings = {
    general: {
      site_name: 'VendorSoluce',
      site_description: 'Vendor Security Management Platform',
      timezone: 'UTC',
      language: 'en',
    },
    security: {
      password_min_length: 8,
      password_require_special: true,
      session_timeout: 30,
      two_factor_enabled: false,
    },
    notifications: {
      email_enabled: true,
      sms_enabled: false,
      webhook_enabled: true,
      webhook_url: 'https://example.com/webhook',
    },
    integrations: {
      osv_api_enabled: true,
      nvd_api_enabled: false,
      threat_intel_enabled: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null,
      updateSettings: vi.fn(),
      resetSettings: vi.fn(),
      testWebhook: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders system settings page correctly', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('System Settings')).toBeInTheDocument();
    expect(screen.getByText('Configure system-wide settings and preferences')).toBeInTheDocument();
  });

  it('displays general settings', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('General Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('VendorSoluce')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Vendor Security Management Platform')).toBeInTheDocument();
  });

  it('shows security settings', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Security Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('displays notification settings', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/webhook')).toBeInTheDocument();
  });

  it('shows integration settings', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Integration Settings')).toBeInTheDocument();
    expect(screen.getByText('OSV API')).toBeInTheDocument();
    expect(screen.getByText('NVD API')).toBeInTheDocument();
    expect(screen.getByText('Threat Intelligence')).toBeInTheDocument();
  });

  it('handles setting updates', async () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    const siteNameInput = screen.getByDisplayValue('VendorSoluce');
    fireEvent.change(siteNameInput, { target: { value: 'New Site Name' } });

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUseApi().updateSettings).toHaveBeenCalled();
    });
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      settings: null,
      loading: true,
      error: null,
      updateSettings: vi.fn(),
      resetSettings: vi.fn(),
      testWebhook: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      settings: null,
      loading: false,
      error: 'Failed to load settings',
      updateSettings: vi.fn(),
      resetSettings: vi.fn(),
      testWebhook: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load settings')).toBeInTheDocument();
  });

  it('displays timezone selection', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Timezone')).toBeInTheDocument();
    expect(screen.getByDisplayValue('UTC')).toBeInTheDocument();
  });

  it('shows language selection', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByDisplayValue('en')).toBeInTheDocument();
  });

  it('displays password requirements', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Password Requirements')).toBeInTheDocument();
    expect(screen.getByText('Minimum Length')).toBeInTheDocument();
    expect(screen.getByText('Require Special Characters')).toBeInTheDocument();
  });

  it('shows session timeout setting', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Session Timeout (minutes)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('displays two-factor authentication setting', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
  });

  it('shows email notification setting', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
  });

  it('displays SMS notification setting', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
  });

  it('shows webhook configuration', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Webhook Notifications')).toBeInTheDocument();
    expect(screen.getByText('Webhook URL')).toBeInTheDocument();
  });

  it('displays test webhook button', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Webhook')).toBeInTheDocument();
  });

  it('shows reset settings option', () => {
    render(
      <TestWrapper>
        <SystemSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Reset to Defaults')).toBeInTheDocument();
  });
});

