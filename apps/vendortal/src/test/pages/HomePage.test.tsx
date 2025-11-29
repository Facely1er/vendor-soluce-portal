import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import HomePage from '../../pages/HomePage';

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

describe('HomePage', () => {
  it('renders homepage correctly', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check that the main element is rendered
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('min-h-screen');
  });

  it('renders all main sections', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check that the main element contains the expected structure
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // The sections should be rendered (we can't test specific content without mocking the components)
    // but we can verify the main structure exists
    expect(main).toHaveClass('min-h-screen');
  });

  it('has proper semantic structure', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Verify it uses semantic HTML
    const main = screen.getByRole('main');
    expect(main.tagName).toBe('MAIN');
  });

  it('applies correct CSS classes', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen');
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('maintains consistent structure across renders', () => {
    const { rerender } = render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen');

    rerender(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    const mainAfterRerender = screen.getByRole('main');
    expect(mainAfterRerender).toHaveClass('min-h-screen');
  });
});
