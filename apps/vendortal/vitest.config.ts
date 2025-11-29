/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/App.tsx',
        'src/pages/**',
        'src/components/ai/**',
        'src/components/analytics/**',
        'src/components/assessments/**',
        'src/components/asset/**',
        'src/components/billing/**',
        'src/components/dashboard/**',
        'src/components/data/**',
        'src/components/freemium/**',
        'src/components/layout/**',
        'src/components/onboarding/**',
        'src/components/pricing/**',
        'src/components/risk/**',
        'src/components/vendor/**',
        'src/components/vendor-assessments/**',
        'src/services/**',
        'src/lib/stripe.ts',
        'src/lib/stripeProducts.ts',
        'src/lib/supabase.ts',
        'src/lib/database.types.ts',
        'src/utils/dataImportExport.ts',
        'src/utils/generatePdf.ts',
        'src/utils/nistMapping.ts',
        'src/utils/supabaseStorage.ts',
        'src/utils/threatIntelligence.ts',
        'src/utils/chartPreloader.tsx',
        'src/hooks/useChartData.ts',
        'src/hooks/useOnboarding.ts',
        'src/hooks/usePerformanceMonitoring.ts',
        'src/hooks/useSubscription.ts',
        'src/hooks/useThreatIntelligence.ts',
        'src/hooks/useUsageEnforcement.ts',
        'src/hooks/useVendorAssessments.ts',
        'src/stores/assessmentStore.ts',
        'src/stores/vendorStore.ts',
        'src/types/**',
        'src/config/**',
        'src/context/I18nContext.tsx',
        'src/context/RBACContext.tsx',
        'src/components/common/AccessibilityHelper.tsx',
        'src/components/common/CommandPalette.tsx',
        'src/components/common/QuickAccessMenu.tsx',
        'supabase/**',
        '**/*.mjs',
        '**/test-*.js',
        '**/test-*.mjs',
        '**/create-*.js',
        '**/create-*.mjs',
        '**/fix-*.js',
        '**/update-*.js',
        '**/update-*.mjs',
        '**/verify-*.js',
        '**/verify-*.mjs'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/components/ui/**/*.{ts,tsx}': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/components/common/**/*.{ts,tsx}': {
          branches: 75,
          functions: 55,
          lines: 75,
          statements: 75
        },
        './src/components/__tests__/**/*.{ts,tsx}': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/utils/__tests__/**/*.{ts,tsx}': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/hooks/__tests__/**/*.{ts,tsx}': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/stores/__tests__/**/*.{ts,tsx}': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/test/**/*.{ts,tsx}': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/context/**/*.{ts,tsx}': {
          branches: 65,
          functions: 70,
          lines: 45,
          statements: 45
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

