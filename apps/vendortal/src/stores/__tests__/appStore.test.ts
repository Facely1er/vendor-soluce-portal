import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAppStore.setState({
      sidebarOpen: false,
      theme: 'system',
      loading: false,
      notifications: [],
      modals: [],
      globalSearch: '',
      activeFilters: {},
    });
  });

  it('initializes with default state', () => {
    const state = useAppStore.getState();
    
    expect(state.sidebarOpen).toBe(false);
    expect(state.theme).toBe('system');
    expect(state.loading).toBe(false);
    expect(state.notifications).toEqual([]);
    expect(state.modals).toEqual([]);
    expect(state.globalSearch).toBe('');
    expect(state.activeFilters).toEqual({});
  });

  it('toggles sidebar', () => {
    const { setSidebarOpen } = useAppStore.getState();
    
    useAppStore.getState().setSidebarOpen(true);
    expect(useAppStore.getState().sidebarOpen).toBe(true);
    
    useAppStore.getState().setSidebarOpen(false);
    expect(useAppStore.getState().sidebarOpen).toBe(false);
  });

  it('sets theme', () => {
    useAppStore.getState().setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');
    
    useAppStore.getState().setTheme('light');
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('sets loading state', () => {
    useAppStore.getState().setLoading(true);
    expect(useAppStore.getState().loading).toBe(true);
    
    useAppStore.getState().setLoading(false);
    expect(useAppStore.getState().loading).toBe(false);
  });

  it('adds notification', () => {
    useAppStore.getState().addNotification({
      title: 'Test',
      message: 'Test message',
      type: 'info'
    });
    
    const notifications = useAppStore.getState().notifications;
    expect(notifications.length).toBe(1);
    expect(notifications[0].title).toBe('Test');
    expect(notifications[0].message).toBe('Test message');
    expect(notifications[0].type).toBe('info');
  });

  it('removes notification', () => {
    // Add multiple notifications
    useAppStore.getState().addNotification({
      title: 'Test 1',
      message: 'Message 1',
      type: 'info'
    });
    
    const firstId = useAppStore.getState().notifications[0].id;
    
    useAppStore.getState().addNotification({
      title: 'Test 2',
      message: 'Message 2',
      type: 'success'
    });
    
    expect(useAppStore.getState().notifications.length).toBe(2);
    
    useAppStore.getState().removeNotification(firstId);
    
    const notifications = useAppStore.getState().notifications;
    expect(notifications.length).toBe(1);
    expect(notifications[0].title).toBe('Test 2');
  });

  it('clears all notifications', () => {
    useAppStore.getState().addNotification({
      title: 'Test 1',
      message: 'Message 1',
      type: 'info'
    });
    
    useAppStore.getState().addNotification({
      title: 'Test 2',
      message: 'Message 2',
      type: 'success'
    });
    
    expect(useAppStore.getState().notifications.length).toBe(2);
    
    useAppStore.getState().clearNotifications();
    
    expect(useAppStore.getState().notifications.length).toBe(0);
  });

  it('opens modal', () => {
    useAppStore.getState().openModal('addVendor', { test: 'data' });
    
    const modals = useAppStore.getState().modals;
    expect(modals.length).toBe(1);
    expect(modals[0].type).toBe('addVendor');
    expect(modals[0].isOpen).toBe(true);
    expect(modals[0].data).toEqual({ test: 'data' });
  });

  it('closes modal', () => {
    useAppStore.getState().openModal('settings');
    const modalId = useAppStore.getState().modals[0].id;
    
    expect(useAppStore.getState().modals.length).toBe(1);
    
    useAppStore.getState().closeModal(modalId);
    
    expect(useAppStore.getState().modals.length).toBe(0);
  });

  it('closes all modals', () => {
    useAppStore.getState().openModal('settings');
    useAppStore.getState().openModal('help');
    
    expect(useAppStore.getState().modals.length).toBe(2);
    
    useAppStore.getState().closeAllModals();
    
    expect(useAppStore.getState().modals.length).toBe(0);
  });

  it('sets global search', () => {
    useAppStore.getState().setGlobalSearch('test query');
    expect(useAppStore.getState().globalSearch).toBe('test query');
    
    useAppStore.getState().setGlobalSearch('');
    expect(useAppStore.getState().globalSearch).toBe('');
  });

  it('sets filter', () => {
    useAppStore.getState().setFilter('status', 'active');
    
    expect(useAppStore.getState().activeFilters.status).toBe('active');
    
    useAppStore.getState().setFilter('risk', 'high');
    
    expect(useAppStore.getState().activeFilters.status).toBe('active');
    expect(useAppStore.getState().activeFilters.risk).toBe('high');
  });

  it('clears all filters', () => {
    useAppStore.getState().setFilter('status', 'active');
    useAppStore.getState().setFilter('risk', 'high');
    
    expect(Object.keys(useAppStore.getState().activeFilters).length).toBe(2);
    
    useAppStore.getState().clearFilters();
    
    expect(useAppStore.getState().activeFilters).toEqual({});
  });
});

