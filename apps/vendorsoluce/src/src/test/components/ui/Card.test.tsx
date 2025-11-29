import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

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

describe('Card Components', () => {
  it('renders Card with children', () => {
    render(
      <TestWrapper>
        <Card>
          <div>Card content</div>
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(
      <TestWrapper>
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      </TestWrapper>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md');
  });

  it('applies assessment variant styles', () => {
    render(
      <TestWrapper>
        <Card variant="assessment" data-testid="card">
          <div>Assessment card</div>
        </Card>
      </TestWrapper>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-l-4', 'border-l-vendorsoluce-navy');
  });

  it('applies sbom variant styles', () => {
    render(
      <TestWrapper>
        <Card variant="sbom" data-testid="card">
          <div>SBOM card</div>
        </Card>
      </TestWrapper>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-l-4', 'border-l-vendorsoluce-teal');
  });

  it('applies vendor variant styles', () => {
    render(
      <TestWrapper>
        <Card variant="vendor" data-testid="card">
          <div>Vendor card</div>
        </Card>
      </TestWrapper>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-l-4', 'border-l-vendorsoluce-blue');
  });

  it('applies custom className', () => {
    render(
      <TestWrapper>
        <Card className="custom-card" data-testid="card">
          <div>Custom card</div>
        </Card>
      </TestWrapper>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
  });

  it('renders CardHeader with children', () => {
    render(
      <TestWrapper>
        <Card>
          <CardHeader>
            <div>Header content</div>
          </CardHeader>
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('applies CardHeader styles', () => {
    render(
      <TestWrapper>
        <Card>
          <CardHeader data-testid="header">
            <div>Header content</div>
          </CardHeader>
        </Card>
      </TestWrapper>
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveClass('p-4');
  });

  it('renders CardTitle with children', () => {
    render(
      <TestWrapper>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('applies CardTitle styles', () => {
    render(
      <TestWrapper>
        <Card>
          <CardHeader>
            <CardTitle data-testid="title">Card Title</CardTitle>
          </CardHeader>
        </Card>
      </TestWrapper>
    );

    const title = screen.getByTestId('title');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900', 'dark:text-white');
  });

  it('renders CardContent with children', () => {
    render(
      <TestWrapper>
        <Card>
          <CardContent>
            <div>Content</div>
          </CardContent>
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies CardContent styles', () => {
    render(
      <TestWrapper>
        <Card>
          <CardContent data-testid="content">
            <div>Content</div>
          </CardContent>
        </Card>
      </TestWrapper>
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('p-4', 'pt-0');
  });

  it('renders complete card structure', () => {
    render(
      <TestWrapper>
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is the card content.</p>
          </CardContent>
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is the card content.')).toBeInTheDocument();
  });
});

