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
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          // Router and navigation
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          // UI components (split into smaller chunks for mobile)
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-dropdown-menu')) {
            return 'ui-core';
          }
          if (id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-checkbox')) {
            return 'ui-forms';
          }
          // Charts and data visualization (lazy load for mobile)
          if (id.includes('recharts')) {
            return 'charts';
          }
          // Query and state management
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          // Utilities and helpers
          if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'utils';
          }
          // Helmet for SEO
          if (id.includes('react-helmet-async')) {
            return 'seo';
          }
          // Mobile-specific optimizations
          if (id.includes('web-vitals')) {
            return 'mobile-core';
          }
          // Split blog content for better mobile loading
          if (id.includes('src/content/blog') || id.includes('mdBlog')) {
            return 'blog-content';
          }
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
    // Optimize chunk size for mobile performance
    chunkSizeWarningLimit: 300,
    // Enable CSS code splitting for better performance
    cssCodeSplit: true,
    // Minify CSS and JS
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Mobile-specific optimizations
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        unsafe_arrows: true,
        unsafe_methods: true,
      },
      mangle: {
        safari10: true, // Mobile Safari compatibility
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize asset inlining for mobile (smaller limit for better caching)
    assetsInlineLimit: 2048,
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