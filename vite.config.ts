import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom'],
          // Router and navigation
          router: ['react-router-dom'],
          // UI components (split into smaller chunks)
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'ui-forms': ['@radix-ui/react-select', '@radix-ui/react-checkbox'],
          // Charts and data visualization
          charts: ['recharts'],
          // Query and state management
          query: ['@tanstack/react-query'],
          // Utilities and helpers
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          // Helmet for SEO
          seo: ['react-helmet-async'],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace('.tsx', '').replace('.ts', '') : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size for better loading
    chunkSizeWarningLimit: 500,
    // Enable CSS code splitting for better performance
    cssCodeSplit: true,
    // Minify CSS and JS
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize asset inlining
    assetsInlineLimit: 4096,
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 4173,
  },
  // Enable pre-rendering for SEO
  ssr: {
    noExternal: ['react-helmet-async'],
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})