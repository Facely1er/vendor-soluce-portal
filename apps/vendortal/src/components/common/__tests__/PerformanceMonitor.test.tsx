import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import PerformanceMonitor from '../PerformanceMonitor';

// Mock hooks and Sentry
vi.mock('../../hooks/usePerformanceMonitoring', () => ({
  usePerformanceMonitoring: () => ({
    trackRender: vi.fn(),
    trackInteraction: vi.fn(),
    trackAsyncOperation: vi.fn(),
    trackError: vi.fn()
  }),
  usePagePerformance: () => ({
    trackPageLoad: vi.fn()
  })
}));

vi.mock('../../utils/sentry', () => ({
  addBreadcrumb: vi.fn()
}));

describe('PerformanceMonitor Component', () => {
  it('renders children', () => {
    const { getByText } = render(
      <PerformanceMonitor componentName="TestComponent">
        <div>Test Content</div>
      </PerformanceMonitor>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('wraps children with monitoring', () => {
    const { container } = render(
      <PerformanceMonitor componentName="Dashboard">
        <div>Dashboard</div>
      </PerformanceMonitor>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    const { getByText } = render(
      <PerformanceMonitor componentName="Test">
        <div>Child 1</div>
        <div>Child 2</div>
      </PerformanceMonitor>
    );
    
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
  });
});

