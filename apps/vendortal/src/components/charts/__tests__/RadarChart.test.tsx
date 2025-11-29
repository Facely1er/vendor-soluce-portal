import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RadarChart from '../RadarChart';

describe('RadarChart Component', () => {
  const sampleData = [
    { dimension: 'Security', risk: 75, required: 80, fullMark: 100 },
    { dimension: 'Privacy', risk: 60, required: 70, fullMark: 100 }
  ];

  it('renders RadarChart component', () => {
    const { container } = render(<RadarChart data={sampleData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom height', () => {
    const { container } = render(<RadarChart data={sampleData} height={400} />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.style.height).toBe('400px');
  });

  it('applies custom width', () => {
    const { container } = render(<RadarChart data={sampleData} width="80%" />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.style.width).toBe('80%');
  });

  it('applies custom className', () => {
    const { container } = render(<RadarChart data={sampleData} className="custom-class" />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer).toHaveClass('custom-class');
  });

  it('displays no data message for empty data', () => {
    const { getByText } = render(<RadarChart data={[]} />);
    expect(getByText('No data available for radar chart')).toBeInTheDocument();
  });

  it('handles undefined data', () => {
    const { getByText } = render(<RadarChart data={undefined as any} />);
    expect(getByText('No data available for radar chart')).toBeInTheDocument();
  });
});

