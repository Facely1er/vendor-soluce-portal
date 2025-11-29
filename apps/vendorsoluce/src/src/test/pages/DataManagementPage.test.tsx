import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import DataManagementPage from '../../pages/DataManagementPage';

// Mock the useApi hook
vi.mock('../../hooks/useApi');
const mockUseApi = vi.mocked(useApi);

// Mock file operations
const mockFile = new File(['test data'], 'test.csv', { type: 'text/csv' });
const mockFileReader = {
  readAsText: vi.fn(),
  result: 'name,email,company\nJohn,john@example.com,Acme Corp',
  onload: null,
  onerror: null,
};

global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;

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

describe('DataManagementPage', () => {
  const mockData = {
    vendors: 10,
    assessments: 25,
    sbom_analyses: 15,
    last_backup: '2025-01-01T00:00:00Z',
    storage_used: '2.5 GB',
    storage_limit: '10 GB',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      exportData: vi.fn(),
      importData: vi.fn(),
      backupData: vi.fn(),
      restoreData: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders data management page correctly', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText('Manage your data import, export, and backup')).toBeInTheDocument();
  });

  it('displays data statistics', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Data Overview')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Vendors count
    expect(screen.getByText('25')).toBeInTheDocument(); // Assessments count
    expect(screen.getByText('15')).toBeInTheDocument(); // SBOM analyses count
  });

  it('shows storage information', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Storage Usage')).toBeInTheDocument();
    expect(screen.getByText('2.5 GB')).toBeInTheDocument();
    expect(screen.getByText('10 GB')).toBeInTheDocument();
  });

  it('displays last backup time', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Last Backup')).toBeInTheDocument();
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  });

  it('shows export options', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByText('Export Vendors')).toBeInTheDocument();
    expect(screen.getByText('Export Assessments')).toBeInTheDocument();
    expect(screen.getByText('Export SBOM Analyses')).toBeInTheDocument();
  });

  it('shows import options', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Import Data')).toBeInTheDocument();
    expect(screen.getByText('Import Vendors')).toBeInTheDocument();
    expect(screen.getByText('Import Assessments')).toBeInTheDocument();
  });

  it('displays backup options', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Backup & Restore')).toBeInTheDocument();
    expect(screen.getByText('Create Backup')).toBeInTheDocument();
    expect(screen.getByText('Restore from Backup')).toBeInTheDocument();
  });

  it('handles file upload for import', async () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText(/import vendors/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(mockFileReader.readAsText).toHaveBeenCalled();
    });
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      exportData: vi.fn(),
      importData: vi.fn(),
      backupData: vi.fn(),
      restoreData: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to load data',
      exportData: vi.fn(),
      importData: vi.fn(),
      backupData: vi.fn(),
      restoreData: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('displays data validation options', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Data Validation')).toBeInTheDocument();
    expect(screen.getByText('Validate Data Integrity')).toBeInTheDocument();
  });

  it('shows data cleanup options', () => {
    render(
      <TestWrapper>
        <DataManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Data Cleanup')).toBeInTheDocument();
    expect(screen.getByText('Clean Duplicate Records')).toBeInTheDocument();
  });
});

