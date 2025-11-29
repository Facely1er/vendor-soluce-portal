import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSkeleton from '../common/LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  it('renders loading skeleton', () => {
    render(<LoadingSkeleton />);
    
    // Should render without crashing
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders with variant prop', () => {
    const { container } = render(<LoadingSkeleton variant="text" />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
    
    const { container: container2 } = render(<LoadingSkeleton variant="list" />);
    expect(container2.querySelector('.animate-pulse')).toBeTruthy();
    
    const { container: container3 } = render(<LoadingSkeleton variant="table" />);
    expect(container3.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders with custom className', () => {
    render(<LoadingSkeleton className="custom-class" />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders dashboard variant', () => {
    render(<LoadingSkeleton variant="dashboard" />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders table variant', () => {
    render(<LoadingSkeleton variant="table" />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

