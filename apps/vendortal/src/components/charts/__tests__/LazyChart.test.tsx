import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import LazyChart from '../LazyChart';

const sampleData = [
  { name: 'Test', value: 100 }
];

describe('LazyChart Component', () => {
  it('renders LazyChart component', () => {
    const { container } = render(
      <LazyChart type="bar" data={sampleData} />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders with title', () => {
    const { getByText } = render(
      <LazyChart type="bar" data={sampleData} title="Test Chart" />
    );
    expect(getByText('Test Chart')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <LazyChart type="bar" data={sampleData} className="custom-class" />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('handles different chart types', () => {
    const types = ['radar', 'pie', 'line', 'bar', 'area'] as const;
    
    types.forEach(type => {
      const { container } = render(
        <LazyChart type={type} data={sampleData} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  it('renders without title', () => {
    const { container } = render(
      <LazyChart type="bar" data={sampleData} />
    );
    // Should still render without title
    expect(container).toBeInTheDocument();
  });
});

