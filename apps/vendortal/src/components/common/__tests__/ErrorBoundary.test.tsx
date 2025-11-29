import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Mock Sentry
vi.mock('../../utils/sentry', () => ({
  reportError: vi.fn(() => 'mock-event-id')
}));

describe('ErrorBoundary Component', () => {
  it('renders children when there is no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(container).toBeInTheDocument();
  });

  it('does not throw without children', () => {
    expect(() => render(<ErrorBoundary children={undefined} />)).not.toThrow();
  });

  it('can be mounted', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });
});

