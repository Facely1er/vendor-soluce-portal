/**
 * Button component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils';
import Button from './Button';

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary-600');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-secondary-600');
    
    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByText('Outline');
    expect(button).toHaveClass('border');
  });

  it('disables button when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByText('Loading');
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/test">Link Button</Button>);
    
    const link = screen.getByText('Link Button').closest('a');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });

  it('renders with icon', () => {
    const Icon = () => <span data-testid="icon">Icon</span>;
    render(<Button icon={<Icon />}>With Icon</Button>);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    let button = screen.getByText('Small');
    expect(button).toHaveClass('px-3', 'py-1.5');
    
    rerender(<Button size="medium">Medium</Button>);
    button = screen.getByText('Medium');
    expect(button).toHaveClass('px-4', 'py-2');
    
    rerender(<Button size="large">Large</Button>);
    button = screen.getByText('Large');
    expect(button).toHaveClass('px-6', 'py-3');
  });

  it('is accessible with proper ARIA attributes', () => {
    render(
      <Button 
        ariaLabel="Submit form"
        disabled
      >
        Submit
      </Button>
    );
    
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});