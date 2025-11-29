import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useSBOMAnalyses } from '../../hooks/useSBOMAnalyses';
import SBOMAnalyzer from '../../pages/SBOMAnalyzer';

// Mock the useSBOMAnalyses hook
vi.mock('../../hooks/useSBOMAnalyses');
const mockUseSBOMAnalyses = vi.mocked(useSBOMAnalyses);

// Mock file reading
const mockFile = new File(['test content'], 'test.json', { type: 'application/json' });
const mockFileReader = {
  readAsText: vi.fn(),
  result: '{"components": [{"name": "test", "version": "1.0.0"}]}',
  onload: null,
  onerror: null,
};

// Mock global FileReader
global.FileReader = vi.fn(() => mockFileReader) as any;

// Mock fetch for OSV API
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

describe('SBOMAnalyzer', () => {
  const mockAnalyses = [
    {
      id: '1',
      filename: 'test-sbom.json',
      total_components: 10,
      total_vulnerabilities: 5,
      risk_score: 75,
      created_at: '2025-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSBOMAnalyses.mockReturnValue({
      analyses: mockAnalyses,
      loading: false,
      error: null,
      createAnalysis: vi.fn(),
      deleteAnalysis: vi.fn(),
      refetch: vi.fn(),
    });

    // Mock OSV API response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        vulns: [
          {
            id: 'CVE-2024-1234',
            summary: 'Test vulnerability',
            published: '2024-01-01',
            database_specific: { severity: 'HIGH' },
          },
        ],
      }),
    });
  });

  it('renders SBOM analyzer correctly', () => {
    render(
      <TestWrapper>
        <SBOMAnalyzer />
      </TestWrapper>
    );

    expect(screen.getByText(/sbom analyzer/i)).toBeInTheDocument();
    expect(screen.getByText(/upload sbom file/i)).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    render(
      <TestWrapper>
        <SBOMAnalyzer />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText(/upload sbom file/i);
    
    // Simulate file upload
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(mockFileReader.readAsText).toHaveBeenCalled();
    });
  });

  it('shows recent analyses', () => {
    render(
      <TestWrapper>
        <SBOMAnalyzer />
      </TestWrapper>
    );

    expect(screen.getByText('test-sbom.json')).toBeInTheDocument();
    expect(screen.getByText('10 components')).toBeInTheDocument();
    expect(screen.getByText('5 vulnerabilities')).toBeInTheDocument();
  });

  it('displays analysis results after upload', async () => {
    render(
      <TestWrapper>
        <SBOMAnalyzer />
      </TestWrapper>
    );

    // Simulate successful analysis
    const fileInput = screen.getByLabelText(/upload sbom file/i);
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText(/analysis results/i)).toBeInTheDocument();
    });
  });

  it('handles analysis errors gracefully', async () => {
    // Mock API failure
    (global.fetch as any).mockRejectedValue(new Error('API Error'));

    render(
      <TestWrapper>
        <SBOMAnalyzer />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText(/upload sbom file/i);
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

