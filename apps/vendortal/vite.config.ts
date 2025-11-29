import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration - React Bundling Safeguards
 * 
 * This configuration prevents the "Cannot set properties of undefined" error
 * by ensuring React is bundled as a single, unified chunk.
 * 
 * CRITICAL: Never split React across multiple chunks. This causes multiple
 * React instances and breaks React's internal APIs.
 * 
 * See: docs/REACT_BUNDLING_GUIDE.md for details
 */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // SAFEGUARD 1: Force Vite to use a single React instance even if duplicates exist in node_modules
    // This prevents "Cannot set properties of undefined" errors
    dedupe: ['react', 'react-dom', 'scheduler']
  },
  optimizeDeps: {
    // SAFEGUARD 2: Pre-bundle React modules to ensure they stay together
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: ['lucide-react'], // Large icon library - load separately
  },
  build: {
    target: 'es2020',
    minify: 'esbuild', // Use esbuild for faster builds
    rollupOptions: {
      output: {
        // Use consistent chunk file naming to prevent dynamic import failures on Vercel
        // This ensures chunk hashes are stable across builds when content doesn't change
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // SAFEGUARD 3: CRITICAL - Force ALL React-related packages into ONE chunk
          // NEVER split these across multiple chunks or you'll get multiple React instances
          // This is the most important safeguard against bundling errors
          'react-vendor': [
            'react',
            'react-dom', 
            'react/jsx-runtime', 
            'react/jsx-dev-runtime', 
            'scheduler'
          ],
          'react-router': ['react-router-dom'],
          'charts': ['recharts'],
          'supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
          'stripe': ['@stripe/stripe-js'],
        },
      },
    },
    sourcemap: false, // Disable sourcemaps in production for security
    reportCompressedSize: false,
    // Production optimizations
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    // Remove console.log and debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Legal comments (license headers) - keep for compliance
    legalComments: 'none',
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  }
});