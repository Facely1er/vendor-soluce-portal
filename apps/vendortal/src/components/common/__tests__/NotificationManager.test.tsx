import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotificationManager from '../NotificationManager';

// Mock the store
const mockUseAppStore = vi.fn();
vi.mock('../../../stores/appStore', () => ({
  useAppStore: (selector: (state: { notifications: any[]; removeNotification: () => void }) => any) => mockUseAppStore(selector),
}));

describe('NotificationManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no notifications exist', () => {
    mockUseAppStore.mockReturnValue([]);

    const { container } = render(<NotificationManager />);
    expect(container.firstChild).toBeNull();
  });

  it('renders notification when notifications exist', () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'success',
        title: 'Success',
        message: 'Test message'
      }
    ];

    mockUseAppStore.mockReturnValue(mockNotifications);

    render(<NotificationManager />);
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('handles different notification types', () => {
    const mockNotifications = [
      { id: '1', type: 'success', title: 'Done', message: 'Action completed' },
      { id: '2', type: 'error', title: 'Error', message: 'Something failed' }
    ];
    mockUseAppStore.mockReturnValue(mockNotifications);

    const { container } = render(<NotificationManager />);
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
  });

  it('renders warning notification', () => {
    const mockNotifications = [
      { id: '1', type: 'warning', title: 'Warning', message: 'Be careful' }
    ];
    mockUseAppStore.mockReturnValue(mockNotifications);

    render(<NotificationManager />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders info notification', () => {
    const mockNotifications = [
      { id: '1', type: 'info', title: 'Info', message: 'FYI' }
    ];
    mockUseAppStore.mockReturnValue(mockNotifications);

    render(<NotificationManager />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('renders with proper styling', () => {
    const mockNotifications = [
      { id: '1', type: 'success', title: 'Test', message: 'Message' }
    ];
    mockUseAppStore.mockReturnValue(mockNotifications);
    
    const { container } = render(<NotificationManager />);
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
  });
});

