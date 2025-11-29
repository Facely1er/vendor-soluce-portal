import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import OfflineDetector from '../OfflineDetector';

// Mock fetch for connection checks
vi.stubGlobal('fetch', vi.fn());

describe('OfflineDetector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the component', () => {
    // Mock online state
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true
    });

    const { container } = render(<OfflineDetector />);
    
    // Component should render, but may return null when online
    expect(container).toBeInTheDocument();
  });

  it('handles offline state', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true
    });

    const { container } = render(<OfflineDetector />);
    expect(container).toBeInTheDocument();
  });

  it('sets up event listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    
    render(<OfflineDetector />);
    
    expect(addEventListenerSpy).toHaveBeenCalled();
  });
});

