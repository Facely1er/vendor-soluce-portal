import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import Toast from '../Toast';

describe('Toast Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders Toast with title and message', () => {
    render(
      <Toast
        id="1"
        title="Test Title"
        message="Test Message"
        type="info"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('renders with success type', () => {
    render(
      <Toast
        id="1"
        title="Success"
        message="Operation successful"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with error type', () => {
    render(
      <Toast
        id="1"
        title="Error"
        message="Something went wrong"
        type="error"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders with warning type', () => {
    render(
      <Toast
        id="1"
        title="Warning"
        message="Please be careful"
        type="warning"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders with info type', () => {
    render(
      <Toast
        id="1"
        title="Information"
        message="Just FYI"
        type="info"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Information')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Toast
        id="test-toast"
        title="Test"
        message="Test"
        type="info"
        onClose={mockOnClose}
      />
    );

    vi.advanceTimersByTime(100); // Advance for initial animation
    const closeButton = screen.getByRole('button');
    closeButton.click();

    vi.advanceTimersByTime(300); // Advance for exit animation
    expect(mockOnClose).toHaveBeenCalledWith('test-toast');
  });

  it('auto-closes after duration', () => {
    render(
      <Toast
        id="test-toast"
        title="Test"
        message="Test"
        type="info"
        duration={1000}
        onClose={mockOnClose}
      />
    );

    vi.advanceTimersByTime(1000);
    vi.advanceTimersByTime(300); // Exit animation

    expect(mockOnClose).toHaveBeenCalledWith('test-toast');
  });

  it('does not auto-close when duration is 0', () => {
    render(
      <Toast
        id="test-toast"
        title="Test"
        message="Test"
        type="info"
        duration={0}
        onClose={mockOnClose}
      />
    );

    vi.advanceTimersByTime(5000);
    
    // onClose should not be called for infinite duration
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders with different positions', () => {
    const { rerender } = render(
      <Toast
        id="1"
        title="Test"
        message="Test"
        type="info"
        position="top-left"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(
      <Toast
        id="1"
        title="Test"
        message="Test"
        type="info"
        position="bottom-right"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Toast
        id="1"
        title="Test Title"
        message="Test Message"
        type="info"
        onClose={mockOnClose}
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });
});

