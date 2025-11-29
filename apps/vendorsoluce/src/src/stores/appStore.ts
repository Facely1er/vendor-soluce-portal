import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface Modal {
  id: string;
  type: 'addVendor' | 'deleteConfirm' | 'settings' | 'help';
  isOpen: boolean;
  data?: Record<string, unknown>;
}

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  loading: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Modals
  modals: Modal[];
  
  // Search & Filters
  globalSearch: string;
  activeFilters: Record<string, string | number | boolean | string[]>;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLoading: (loading: boolean) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Modal actions
  openModal: (type: Modal['type'], data?: Record<string, unknown>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Search & Filter actions
  setGlobalSearch: (search: string) => void;
  setFilter: (key: string, value: unknown) => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sidebarOpen: false,
      theme: 'system',
      loading: false,
      notifications: [],
      modals: [],
      globalSearch: '',
      activeFilters: {},
      
      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),
      
      setTheme: (theme) => set({ theme }, false, 'setTheme'),
      
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      
      // Notification actions
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set(
          (state) => ({
            notifications: [...state.notifications, newNotification]
          }),
          false,
          'addNotification'
        );
        
        // Auto-remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },
      
      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }),
          false,
          'removeNotification'
        ),
      
      clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),
      
      // Modal actions
      openModal: (type, data) => {
        const id = Math.random().toString(36).substr(2, 9);
        const modal: Modal = { id, type, isOpen: true, data };
        
        set(
          (state) => ({
            modals: [...state.modals, modal]
          }),
          false,
          'openModal'
        );
      },
      
      closeModal: (id) =>
        set(
          (state) => ({
            modals: state.modals.filter(m => m.id !== id)
          }),
          false,
          'closeModal'
        ),
      
      closeAllModals: () => set({ modals: [] }, false, 'closeAllModals'),
      
      // Search & Filter actions
      setGlobalSearch: (search) => set({ globalSearch: search }, false, 'setGlobalSearch'),
      
      setFilter: (key, value) =>
        set(
          (state) => ({
            activeFilters: { ...state.activeFilters, [key]: value }
          }),
          false,
          'setFilter'
        ),
      
      clearFilters: () => set({ activeFilters: {} }, false, 'clearFilters'),
    }),
    {
      name: 'vendorsoluce-app-store',
    }
  )
);