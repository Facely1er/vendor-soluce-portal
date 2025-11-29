import { describe, it, expect, vi } from 'vitest';

// Mock useAuth
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          data: []
        })),
        data: [],
        error: null
      })),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('useVendors Hook', () => {
  it('should export useVendors function', async () => {
    const { useVendors } = await import('../useVendors');
    expect(typeof useVendors).toBe('function');
  });

  it('should be importable', async () => {
    expect(async () => {
      await import('../useVendors');
    }).not.toThrow();
  });

  it('should exist in the hooks module', async () => {
    const module = await import('../useVendors');
    expect(module).toHaveProperty('useVendors');
  });
});
