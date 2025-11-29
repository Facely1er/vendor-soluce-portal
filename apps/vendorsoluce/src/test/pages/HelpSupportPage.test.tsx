import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import HelpSupportPage from '../../pages/HelpSupportPage';

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

describe('HelpSupportPage', () => {
  const mockFaqs = [
    {
      id: '1',
      question: 'How do I add a new vendor?',
      answer: 'To add a new vendor, go to the Vendors page and click the "Add Vendor" button.',
      category: 'vendors',
    },
    {
      id: '2',
      question: 'How do I upload an SBOM?',
      answer: 'Navigate to the SBOM Analyzer page and use the file upload feature.',
      category: 'sbom',
    },
  ];

  const mockTickets = [
    {
      id: '1',
      subject: 'Unable to upload SBOM file',
      status: 'open',
      priority: 'high',
      created_at: '2025-01-01T00:00:00Z',
      user: {
        email: 'user@example.com',
        full_name: 'Test User',
      },
    },
    {
      id: '2',
      subject: 'Question about billing',
      status: 'resolved',
      priority: 'medium',
      created_at: '2025-01-02T00:00:00Z',
      user: {
        email: 'admin@example.com',
        full_name: 'Admin User',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      faqs: mockFaqs,
      tickets: mockTickets,
      loading: false,
      error: null,
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
      searchFaqs: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders help support page correctly', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Help & Support')).toBeInTheDocument();
    expect(screen.getByText('Get help and support for your account')).toBeInTheDocument();
  });

  it('displays FAQ section', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('How do I add a new vendor?')).toBeInTheDocument();
    expect(screen.getByText('How do I upload an SBOM?')).toBeInTheDocument();
  });

  it('shows FAQ answers', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('To add a new vendor, go to the Vendors page and click the "Add Vendor" button.')).toBeInTheDocument();
    expect(screen.getByText('Navigate to the SBOM Analyzer page and use the file upload feature.')).toBeInTheDocument();
  });

  it('displays support tickets', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Support Tickets')).toBeInTheDocument();
    expect(screen.getByText('Unable to upload SBOM file')).toBeInTheDocument();
    expect(screen.getByText('Question about billing')).toBeInTheDocument();
  });

  it('shows ticket status', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('displays ticket priority', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('shows ticket creation dates', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-02/)).toBeInTheDocument();
  });

  it('displays ticket user information', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('shows create ticket form', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Create Support Ticket')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Email Support')).toBeInTheDocument();
    expect(screen.getByText('Phone Support')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      faqs: [],
      tickets: [],
      loading: true,
      error: null,
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
      searchFaqs: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      faqs: [],
      tickets: [],
      loading: false,
      error: 'Failed to load support data',
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
      searchFaqs: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load support data')).toBeInTheDocument();
  });

  it('handles empty FAQ list', () => {
    mockUseApi.mockReturnValue({
      faqs: [],
      tickets: mockTickets,
      loading: false,
      error: null,
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
      searchFaqs: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no faqs found/i)).toBeInTheDocument();
  });

  it('handles empty tickets list', () => {
    mockUseApi.mockReturnValue({
      faqs: mockFaqs,
      tickets: [],
      loading: false,
      error: null,
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
      searchFaqs: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no tickets found/i)).toBeInTheDocument();
  });

  it('displays FAQ search functionality', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Search FAQs')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument();
  });

  it('shows FAQ categories', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Vendors')).toBeInTheDocument();
    expect(screen.getByText('SBOM')).toBeInTheDocument();
  });

  it('displays support resources', () => {
    render(
      <TestWrapper>
        <HelpSupportPage />
      </TestWrapper>
    );

    expect(screen.getByText('Support Resources')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Video Tutorials')).toBeInTheDocument();
  });
});

