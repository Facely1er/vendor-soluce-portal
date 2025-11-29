import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from '../Skeleton';

describe('Skeleton', () => {
  it('renders skeleton', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.bg-gray-200')).toBeInTheDocument();
  });

  it('applies default animate class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('does not animate when animate is false', () => {
    const { container } = render(<Skeleton animate={false} />);
    expect(container.firstChild).not.toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom width', () => {
    const { container } = render(<Skeleton width="200px" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe('200px');
  });

  it('applies custom height', () => {
    const { container } = render(<Skeleton height="50px" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.height).toBe('50px');
  });

  it('applies number width correctly', () => {
    const { container } = render(<Skeleton width={300} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe('300px');
  });

  it('applies number height correctly', () => {
    const { container } = render(<Skeleton height={40} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.height).toBe('40px');
  });

  it('applies border radius when rounded is true', () => {
    const { container } = render(<Skeleton rounded={true} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.borderRadius).toBe('0.375rem');
  });

  it('removes border radius when rounded is false', () => {
    const { container } = render(<Skeleton rounded={false} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.borderRadius).toBe('0');
  });
});

