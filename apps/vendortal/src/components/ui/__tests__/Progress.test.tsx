import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from '../Progress';

describe('Progress', () => {
  it('renders progress bar', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('.bg-gray-200')).toBeInTheDocument();
  });

  it('displays correct percentage', () => {
    const { container } = render(<Progress value={50} max={100} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('handles value above max', () => {
    const { container } = render(<Progress value={150} max={100} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('handles negative value', () => {
    const { container } = render(<Progress value={-10} max={100} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('applies size classes correctly', () => {
    const { container: container1 } = render(<Progress value={50} size="sm" />);
    expect(container1.querySelector('[role="progressbar"]')?.parentElement).toHaveClass('h-1');

    const { container: container2 } = render(<Progress value={50} size="md" />);
    expect(container2.querySelector('[role="progressbar"]')?.parentElement).toHaveClass('h-2');

    const { container: container3 } = render(<Progress value={50} size="lg" />);
    expect(container3.querySelector('[role="progressbar"]')?.parentElement).toHaveClass('h-3');
  });

  it('applies variant classes correctly', () => {
    const { container: container1 } = render(<Progress value={50} variant="default" />);
    expect(container1.querySelector('[role="progressbar"]')).toHaveClass('bg-blue-600');

    const { container: container2 } = render(<Progress value={50} variant="success" />);
    expect(container2.querySelector('[role="progressbar"]')).toHaveClass('bg-green-600');

    const { container: container3 } = render(<Progress value={50} variant="warning" />);
    expect(container3.querySelector('[role="progressbar"]')).toHaveClass('bg-yellow-600');

    const { container: container4 } = render(<Progress value={50} variant="error" />);
    expect(container4.querySelector('[role="progressbar"]')).toHaveClass('bg-red-600');
  });

  it('applies custom className', () => {
    const { container } = render(<Progress value={50} className="custom-class" />);
    expect(container.querySelector('[role="progressbar"]')?.parentElement).toHaveClass('custom-class');
  });

  it('applies custom max value', () => {
    const { container } = render(<Progress value={60} max={200} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '30%' });
  });

  it('has transition animation', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('[role="progressbar"]')).toHaveClass('transition-all');
  });
});

