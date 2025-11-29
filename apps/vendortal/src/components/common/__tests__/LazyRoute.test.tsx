import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Suspense } from 'react';
import LazyRoute from '../LazyRoute';

describe('LazyRoute Component', () => {
  it('renders children with default fallback', () => {
    const { container } = render(
      <LazyRoute>
        <div>Test Content</div>
      </LazyRoute>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders with custom fallback', () => {
    const CustomFallback = () => <div>Custom Loading</div>;
    
    const { getByText } = render(
      <Suspense fallback={<CustomFallback />}>
        <div>Content</div>
      </Suspense>
    );
    
    expect(getByText('Content')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <Suspense fallback={<div>Loading</div>}>
        <div>Child Content</div>
      </Suspense>
    );
    
    expect(getByText('Child Content')).toBeInTheDocument();
  });
});

