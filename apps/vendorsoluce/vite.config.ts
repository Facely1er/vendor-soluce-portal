import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Type declaration for Node.js process global
declare const process: {
  env: Record<string, string | undefined>;
  cwd: () => string;
};

// Determine if this is a demo build
const isDemoBuild = process.env.VITE_APP_ENV === 'demo' || process.env.BUILD_MODE === 'demo';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Use separate output directory for demo builds
    outDir: isDemoBuild ? 'dist-demo' : 'dist',
    target: 'es2020',
    minify: 'terser', // Use terser for production builds with better compression
    terserOptions: {
      compress: {
        drop_console: isDemoBuild ? false : true, // Keep console logs in demo for debugging
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - must be loaded first, keep together for proper initialization
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          
          // React-dependent libraries that need React available
          if (id.includes('node_modules/@sentry/react') || id.includes('node_modules/react-joyride')) {
            return 'react-vendor';
          }
          
          // Heavy visualization libraries
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }

          // Backend services
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }

          // PDF generation (loaded only when needed via lazy routes)
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) {
            return 'pdf-utils';
          }

          // Internationalization
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }

          // State management
          if (id.includes('node_modules/zustand')) {
            return 'state';
          }

          // UI utilities
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/date-fns') || id.includes('node_modules/dompurify')) {
            return 'ui-utils';
          }
        },
      },
      input: {
        main: '/index.html'
      }
    },
    sourcemap: isDemoBuild ? true : false, // Include sourcemaps in demo for debugging
    reportCompressedSize: false,
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