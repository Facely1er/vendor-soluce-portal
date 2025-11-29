import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TextCarousel from '../TextCarousel';

// Mock timers for testing
vi.useFakeTimers();

describe('TextCarousel Component', () => {
  const texts = ['Text 1', 'Text 2', 'Text 3'];

  beforeEach(() => {
    vi.clearAllTimers();
  });

  it('renders first text initially', () => {
    render(<TextCarousel texts={texts} />);
    expect(screen.getByText('Text 1')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <TextCarousel texts={texts} className="custom-class" />
    );
    
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('renders with custom textClassName', () => {
    const { container } = render(
      <TextCarousel texts={texts} textClassName="text-custom" />
    );
    
    const textElement = container.querySelector('.text-custom');
    expect(textElement).toBeInTheDocument();
  });

  it('returns null for empty texts array', () => {
    const { container } = render(<TextCarousel texts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays single text without dots', () => {
    render(<TextCarousel texts={['Only Text']} />);
    expect(screen.getByText('Only Text')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Go to text/i)).not.toBeInTheDocument();
  });

  it('displays dots for multiple texts', () => {
    render(<TextCarousel texts={texts} />);
    expect(screen.getByLabelText('Go to text 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to text 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to text 3')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<TextCarousel texts={texts} />);
    const textElement = screen.getByRole('text');
    expect(textElement).toHaveAttribute('aria-live', 'polite');
    expect(textElement).toHaveAttribute('aria-atomic', 'true');
  });

  it('handles single text without interval', () => {
    render(<TextCarousel texts={['Single']} interval={1000} />);
    expect(screen.getByText('Single')).toBeInTheDocument();
    // Should not cycle with only one text
  });

  it('handles dot navigation', () => {
    const { getAllByRole } = render(<TextCarousel texts={['1', '2', '3']} />);
    const dots = getAllByRole('button');
    
    // Should have 3 dots
    expect(dots).toHaveLength(3);
  });
});

