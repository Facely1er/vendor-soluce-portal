import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AreaChart from '../AreaChart';

describe('AreaChart Component', () => {
  const sampleData = [
    { name: 'Day 1', value: 100 },
    { name: 'Day 2', value: 120 },
    { name: 'Day 3', value: 115 }
  ];

  it('renders AreaChart component', () => {
    const { container } = render(<AreaChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom height', () => {
    const { container } = render(<AreaChart data={sampleData} height={400} />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.style.height).toBe('400px');
  });

  it('applies custom width', () => {
    const { container } = render(<AreaChart data={sampleData} width="80%" />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.style.width).toBe('80%');
  });

  it('applies custom className', () => {
    const { container } = render(<AreaChart data={sampleData} className="custom-class" />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer).toHaveClass('custom-class');
  });

  it('renders with default props', () => {
    const { container } = render(<AreaChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    const { container } = render(<AreaChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

