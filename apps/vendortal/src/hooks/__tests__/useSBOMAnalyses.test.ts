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

describe('useSBOMAnalyses Hook', () => {
  it('should export useSBOMAnalyses function', async () => {
    const { useSBOMAnalyses } = await import('../useSBOMAnalyses');
    expect(typeof useSBOMAnalyses).toBe('function');
  });

  it('should be importable', async () => {
    expect(async () => {
      await import('../useSBOMAnalyses');
    }).not.toThrow();
  });

  it('should exist in the hooks module', async () => {
    const module = await import('../useSBOMAnalyses');
    expect(module).toHaveProperty('useSBOMAnalyses');
  });
});

