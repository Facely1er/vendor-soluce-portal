import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorState from '../ErrorState';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ErrorState Component', () => {
  it('renders ErrorState with default title and message', () => {
    renderWithRouter(<ErrorState />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    renderWithRouter(
      <ErrorState
        title="Custom Error"
        message="This is a custom error message"
      />
    );

    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('This is a custom error message')).toBeInTheDocument();
  });

  it('renders with retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    renderWithRouter(<ErrorState onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const mockRetry = vi.fn();
    renderWithRouter(<ErrorState onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    retryButton.click();

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('renders home link by default', () => {
    renderWithRouter(<ErrorState />);

    const homeButton = screen.getByText(/Go Home/i);
    expect(homeButton).toBeInTheDocument();
  });

  it('hides home link when showHomeLink is false', () => {
    renderWithRouter(<ErrorState showHomeLink={false} />);

    expect(screen.queryByText(/Go Home/i)).not.toBeInTheDocument();
  });

  it('renders without retry button when onRetry is not provided', () => {
    renderWithRouter(<ErrorState />);

    expect(screen.queryByRole('button', { name: /Try Again/i })).not.toBeInTheDocument();
  });

  it('renders both retry and home buttons when both are enabled', () => {
    const mockRetry = vi.fn();
    renderWithRouter(<ErrorState onRetry={mockRetry} showHomeLink={true} />);

    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithRouter(<ErrorState className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders error icon', () => {
    const { container } = renderWithRouter(<ErrorState />);

    const iconContainer = container.querySelector('.w-16.h-16');
    expect(iconContainer).toBeInTheDocument();
  });
});

