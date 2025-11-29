import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import ContactPage from '../../pages/ContactPage';

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

describe('ContactPage', () => {
  const mockContactInfo = {
    email: 'contact@vendorsoluce.com',
    phone: '+1 (555) 123-4567',
    address: '123 Security Street, San Francisco, CA 94105',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
    support_email: 'support@vendorsoluce.com',
    sales_email: 'sales@vendorsoluce.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      contactInfo: mockContactInfo,
      loading: false,
      error: null,
      submitContactForm: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders contact page correctly', () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Get in touch with our team')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByText('contact@vendorsoluce.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('123 Security Street, San Francisco, CA 94105')).toBeInTheDocument();
    expect(screen.getByText('Monday - Friday: 9:00 AM - 6:00 PM PST')).toBeInTheDocument();
  });

  it('shows contact form', () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByText('Send us a message')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('displays form submission button', () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const subjectInput = screen.getByLabelText('Subject');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByRole('button', { name: 'Send Message' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseApi().submitContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
      });
    });
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      contactInfo: null,
      loading: true,
      error: null,
      submitContactForm: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      contactInfo: null,
      loading: false,
      error: 'Failed to load contact information',
      submitContactForm: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load contact information')).toBeInTheDocument();
  });

  it('displays support contact information', () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('support@vendorsoluce.com')).toBeInTheDocument();
  });

  it('shows sales contact information', () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('sales@vendorsoluce.com')).toBeInTheDocument();
  });

  it('displays office hours', () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByText('Office Hours')).toBeInTheDocument();
    expect(screen.getByText('Monday - Friday: 9:00 AM - 6:00 PM PST')).toBeInTheDocument();
  });

  it('shows contact form validation', async () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your name')).toBeInTheDocument();
      expect(screen.getByText('Please enter your email')).toBeInTheDocument();
      expect(screen.getByText('Please enter a subject')).toBeInTheDocument();
      expect(screen.getByText('Please enter a message')).toBeInTheDocument();
    });
  });

  it('displays success message after form submission', async () => {
    mockUseApi.mockReturnValue({
      contactInfo: mockContactInfo,
      loading: false,
      error: null,
      submitContactForm: vi.fn().mockResolvedValue({ success: true }),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const subjectInput = screen.getByLabelText('Subject');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByRole('button', { name: 'Send Message' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
  });

  it('shows contact form error handling', async () => {
    mockUseApi.mockReturnValue({
      contactInfo: mockContactInfo,
      loading: false,
      error: null,
      submitContactForm: vi.fn().mockRejectedValue(new Error('Submission failed')),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const subjectInput = screen.getByLabelText('Subject');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByRole('button', { name: 'Send Message' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    });
  });
});

