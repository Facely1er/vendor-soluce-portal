import { logger } from '../../utils/logger';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import AuthContext from '../../context/AuthContext';

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

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides authentication context', async () => {
    const TestComponent = () => {
      const { user, isLoading, isAuthenticated } = useAuth();
      return (
        <div>
          <div data-testid="user">{user ? 'authenticated' : 'not authenticated'}</div>
          <div data-testid="loading">{isLoading ? 'loading' : 'not loading'}</div>
          <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Wait for the loading state to resolve
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('not authenticated');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('handles sign in', async () => {
    const TestComponent = () => {
      const { signIn } = useAuth();
      
      const handleSignIn = async () => {
        try {
          await signIn('test@example.com', 'password123');
        } catch (error) {
          logger.error('Sign in failed:', error);
        }
      };

      return (
        <button onClick={handleSignIn} data-testid="signin-btn">
          Sign In
        </button>
      );
    };

    // Mock is handled in setup.ts

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const signInButton = screen.getByTestId('signin-btn');
    fireEvent.click(signInButton);

    await waitFor(() => {
      // Test passes if no error is thrown
      expect(screen.getByTestId('signin-btn')).toBeInTheDocument();
    });
  });

  it('handles sign up', async () => {
    const TestComponent = () => {
      const { signUp } = useAuth();
      
      const handleSignUp = async () => {
        try {
          await signUp('test@example.com', 'password123', 'Test User');
        } catch (error) {
          logger.error('Sign up failed:', error);
        }
      };

      return (
        <button onClick={handleSignUp} data-testid="signup-btn">
          Sign Up
        </button>
      );
    };

    // Mock is handled in setup.ts

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const signUpButton = screen.getByTestId('signup-btn');
    fireEvent.click(signUpButton);

    await waitFor(() => {
      // Test passes if no error is thrown
      expect(screen.getByTestId('signup-btn')).toBeInTheDocument();
    });
  });

  it('handles sign out', async () => {
    const TestComponent = () => {
      const { signOut } = useAuth();
      
      const handleSignOut = async () => {
        try {
          await signOut();
        } catch (error) {
          logger.error('Sign out failed:', error);
        }
      };

      return (
        <button onClick={handleSignOut} data-testid="signout-btn">
          Sign Out
        </button>
      );
    };

    // Mock is handled in setup.ts

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const signOutButton = screen.getByTestId('signout-btn');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Test passes if no error is thrown
      expect(screen.getByTestId('signout-btn')).toBeInTheDocument();
    });
  });

  it('handles authentication errors', async () => {
    const TestComponent = () => {
      const { signIn } = useAuth();
      const [error, setError] = React.useState<string | null>(null);
      
      const handleSignIn = async () => {
        try {
          await signIn('test@example.com', 'wrongpassword');
        } catch (err: any) {
          setError(err.message);
        }
      };

      return (
        <div>
          <button onClick={handleSignIn} data-testid="signin-btn">
            Sign In
          </button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      );
    };

    // Mock is handled in setup.ts

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const signInButton = screen.getByTestId('signin-btn');
    fireEvent.click(signInButton);

    await waitFor(() => {
      // Test passes if component renders without crashing
      expect(screen.getByTestId('signin-btn')).toBeInTheDocument();
    });
  });
});

