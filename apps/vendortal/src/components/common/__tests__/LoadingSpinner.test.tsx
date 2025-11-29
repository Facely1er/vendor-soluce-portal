import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders LoadingSpinner with default size', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8'); // medium size
  });

  it('renders with small size', () => {
    const { container } = render(<LoadingSpinner size="small" />);

    const spinner = container.querySelector('.h-4');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with medium size', () => {
    const { container } = render(<LoadingSpinner size="medium" />);

    const spinner = container.querySelector('.h-8');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with large size', () => {
    const { container } = render(<LoadingSpinner size="large" />);

    const spinner = container.querySelector('.h-12');
    expect(spinner).toBeInTheDocument();
  });

  it('applies animation classes', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('rounded-full');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);

    const spinner = container.querySelector('.custom-class');
    expect(spinner).toBeInTheDocument();
  });

  it('has circular styling', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('.rounded-full');
    expect(spinner).toHaveClass('border-b-2');
    expect(spinner).toHaveClass('border-t-2');
  });

  it('renders different sizes correctly', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach(size => {
      const { container } = render(<LoadingSpinner size={size} />);
      const expectedHeight = size === 'small' ? 'h-4' : size === 'medium' ? 'h-8' : 'h-12';
      
      const spinner = container.querySelector(`.${expectedHeight}`);
      expect(spinner).toBeInTheDocument();
    });
  });

  it('combines custom className with existing classes', () => {
    const { container } = render(<LoadingSpinner className="custom-spinner" />);

    const spinner = container.querySelector('.custom-spinner');
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('rounded-full');
  });
});

