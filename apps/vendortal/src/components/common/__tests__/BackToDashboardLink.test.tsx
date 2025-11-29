import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BackToDashboardLink from '../BackToDashboardLink';

const mockUseAuth = vi.fn();
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('BackToDashboardLink Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders for authenticated user', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <BrowserRouter>
        <BackToDashboardLink />
      </BrowserRouter>
    );

    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('renders for unauthenticated user', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <BrowserRouter>
        <BackToDashboardLink />
      </BrowserRouter>
    );

    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    const { container } = render(
      <BrowserRouter>
        <BackToDashboardLink className="custom-class" />
      </BrowserRouter>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has arrow icon', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <BrowserRouter>
        <BackToDashboardLink />
      </BrowserRouter>
    );

    const link = screen.getByText('Back to Dashboard').closest('a');
    expect(link).toBeInTheDocument();
  });
});

