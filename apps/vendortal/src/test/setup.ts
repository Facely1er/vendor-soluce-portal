/**
 * Vitest test setup and configuration
 */

import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
          signInWithEmail: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
          signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
          signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
          signOut: vi.fn().mockResolvedValue({ error: null }),
          onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    elements: vi.fn(() => ({
      create: vi.fn(),
      mount: vi.fn(),
      unmount: vi.fn(),
    })),
    confirmPayment: vi.fn(),
  }),
}));

// Mock i18next
vi.mock('i18next', () => ({
  default: {
    init: vi.fn(),
    changeLanguage: vi.fn(),
    t: vi.fn((key) => key),
    use: vi.fn().mockReturnThis(),
    dir: vi.fn().mockReturnValue('ltr'),
    language: 'en',
  },
  init: vi.fn(),
  changeLanguage: vi.fn(),
  t: vi.fn((key) => key),
  use: vi.fn().mockReturnThis(),
  dir: vi.fn().mockReturnValue('ltr'),
  language: 'en',
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock I18nContext to avoid i18next initialization issues
vi.mock('../context/I18nContext', () => ({
  I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  useI18n: () => ({
    language: 'en',
    changeLanguage: vi.fn(),
    t: (key: string) => key,
  }),
}));

// Mock environment variables
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
vi.stubEnv('VITE_APP_ENV', 'test');
vi.stubEnv('VITE_APP_VERSION', '0.0.0-test');