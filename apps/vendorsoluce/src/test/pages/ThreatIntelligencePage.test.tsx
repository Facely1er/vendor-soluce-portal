import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useThreatIntelligence } from '../../hooks/useThreatIntelligence';
import ThreatIntelligencePage from '../../pages/ThreatIntelligencePage';

// Mock the useThreatIntelligence hook
vi.mock('../../hooks/useThreatIntelligence');
const mockUseThreatIntelligence = vi.mocked(useThreatIntelligence);

// Mock fetch for threat intelligence API
global.fetch = vi.fn();

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

describe('ThreatIntelligencePage', () => {
  const mockThreats = [
    {
      id: '1',
      title: 'Critical Vulnerability in OpenSSL',
      severity: 'critical',
      category: 'vulnerability',
      source: 'CVE',
      published_date: '2025-01-01T00:00:00Z',
      description: 'A critical vulnerability has been discovered in OpenSSL',
      affected_products: ['OpenSSL 3.0.0', 'OpenSSL 3.0.1'],
      cve_id: 'CVE-2024-1234',
      cvss_score: 9.8,
    },
    {
      id: '2',
      title: 'Supply Chain Attack on npm Package',
      severity: 'high',
      category: 'supply_chain',
      source: 'Security Research',
      published_date: '2025-01-02T00:00:00Z',
      description: 'Malicious package discovered in npm registry',
      affected_products: ['npm', 'Node.js'],
      cve_id: null,
      cvss_score: 7.5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseThreatIntelligence.mockReturnValue({
      threats: mockThreats,
      loading: false,
      error: null,
      fetchThreats: vi.fn(),
      refetch: vi.fn(),
    });

    // Mock API responses
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        threats: mockThreats,
        total: 2,
      }),
    });
  });

  it('renders threat intelligence page correctly', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('Threat Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Stay informed about the latest security threats')).toBeInTheDocument();
  });

  it('displays threat list', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('Critical Vulnerability in OpenSSL')).toBeInTheDocument();
    expect(screen.getByText('Supply Chain Attack on npm Package')).toBeInTheDocument();
  });

  it('shows threat severity levels', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('displays threat categories', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('Vulnerability')).toBeInTheDocument();
    expect(screen.getByText('Supply Chain')).toBeInTheDocument();
  });

  it('shows CVSS scores', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('9.8')).toBeInTheDocument();
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('displays CVE IDs when available', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('CVE-2024-1234')).toBeInTheDocument();
  });

  it('shows affected products', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('OpenSSL 3.0.0')).toBeInTheDocument();
    expect(screen.getByText('OpenSSL 3.0.1')).toBeInTheDocument();
    expect(screen.getByText('npm')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseThreatIntelligence.mockReturnValue({
      threats: [],
      loading: true,
      error: null,
      fetchThreats: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseThreatIntelligence.mockReturnValue({
      threats: [],
      loading: false,
      error: 'Failed to load threats',
      fetchThreats: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load threats')).toBeInTheDocument();
  });

  it('handles empty threats list', () => {
    mockUseThreatIntelligence.mockReturnValue({
      threats: [],
      loading: false,
      error: null,
      fetchThreats: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText(/no threats found/i)).toBeInTheDocument();
  });

  it('displays threat sources', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    expect(screen.getByText('CVE')).toBeInTheDocument();
    expect(screen.getByText('Security Research')).toBeInTheDocument();
  });

  it('shows threat publication dates', () => {
    render(
      <TestWrapper>
        <ThreatIntelligencePage />
      </TestWrapper>
    );

    // Check that dates are displayed (format may vary)
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-02/)).toBeInTheDocument();
  });
});

