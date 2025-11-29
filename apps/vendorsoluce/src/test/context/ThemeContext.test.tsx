import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useTheme } from '../../hooks/useTheme';

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

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('provides theme context with default light theme', () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('toggles theme from light to dark', () => {
    const TestComponent = () => {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <button onClick={toggleTheme} data-testid="toggle-btn">
            Toggle Theme
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    const toggleButton = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles theme from dark to light', () => {
    const TestComponent = () => {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <button onClick={toggleTheme} data-testid="toggle-btn">
            Toggle Theme
          </button>
        </div>
      );
    };

    // Set initial theme to dark
    localStorage.setItem('theme', 'dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    const toggleButton = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('persists theme preference in localStorage', () => {
    const TestComponent = () => {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <button onClick={toggleTheme} data-testid="toggle-btn">
            Toggle Theme
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const toggleButton = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleButton);

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('applies dark class to document when theme is dark', () => {
    const TestComponent = () => {
      const { toggleTheme } = useTheme();
      return (
        <button onClick={toggleTheme} data-testid="toggle-btn">
          Toggle Theme
        </button>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const toggleButton = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from document when theme is light', () => {
    const TestComponent = () => {
      const { toggleTheme } = useTheme();
      return (
        <button onClick={toggleTheme} data-testid="toggle-btn">
          Toggle Theme
        </button>
      );
    };

    // Set initial theme to dark
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const toggleButton = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleButton);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('uses system preference when no saved preference exists', () => {
    // Mock system preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});

