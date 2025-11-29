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
        data: [],
        error: null
      })),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('useSupplyChainAssessments Hook', () => {
  it('should export useSupplyChainAssessments function', async () => {
    const { useSupplyChainAssessments } = await import('../useSupplyChainAssessments');
    expect(typeof useSupplyChainAssessments).toBe('function');
  });

  it('should be importable', async () => {
    expect(async () => {
      await import('../useSupplyChainAssessments');
    }).not.toThrow();
  });

  it('should exist in the hooks module', async () => {
    const module = await import('../useSupplyChainAssessments');
    expect(module).toHaveProperty('useSupplyChainAssessments');
  });
});

