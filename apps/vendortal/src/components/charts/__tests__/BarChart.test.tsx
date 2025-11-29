import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BarChart from '../BarChart';

describe('BarChart Component', () => {
  const sampleData = [
    { name: 'Category A', value: 100 },
    { name: 'Category B', value: 200 },
    { name: 'Category C', value: 150 }
  ];

  it('renders BarChart component', () => {
    const { container } = render(<BarChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom height', () => {
    const { container } = render(<BarChart data={sampleData} height={400} />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.style.height).toBe('400px');
  });

  it('applies custom width', () => {
    const { container } = render(<BarChart data={sampleData} width="80%" />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.style.width).toBe('80%');
  });

  it('applies custom className', () => {
    const { container } = render(<BarChart data={sampleData} className="custom-class" />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer).toHaveClass('custom-class');
  });

  it('renders with default props', () => {
    const { container } = render(<BarChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    const { container } = render(<BarChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

