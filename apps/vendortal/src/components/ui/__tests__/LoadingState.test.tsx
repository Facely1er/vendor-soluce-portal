import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import LoadingState from '../LoadingState';

describe('LoadingState Component', () => {
  it('renders LoadingState with default message', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingState message="Please wait..." />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders LoadingSpinner', () => {
    const { container } = render(<LoadingState />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('applies fullPage class when fullPage is true', () => {
    const { container } = render(<LoadingState fullPage={true} />);

    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('does not apply fullPage class when fullPage is false', () => {
    const { container } = render(<LoadingState fullPage={false} />);

    expect(container.firstChild).not.toHaveClass('min-h-screen');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingState className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with large spinner by default', () => {
    const { container } = render(<LoadingState />);

    const spinner = container.querySelector('.h-12');
    expect(spinner).toBeInTheDocument();
  });

  it('renders multiple messages when remounting', () => {
    const { rerender } = render(<LoadingState message="First" />);
    expect(screen.getByText('First')).toBeInTheDocument();

    rerender(<LoadingState message="Second" />);
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders LoadingState with any message value', () => {
    const { container } = render(<LoadingState message="" />);

    const messageElement = container.querySelector('.text-gray-600');
    expect(messageElement).toBeInTheDocument();
  });
});

