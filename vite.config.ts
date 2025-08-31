import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Presidential-level Vite configuration for currencytocurrency.app
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
  server: {
    host: "::",
    port: 8080,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  plugins: [
    react({
      // Enable React Fast Refresh for development
      fastRefresh: mode === 'development',
      // Optimize JSX runtime for production
      jsxRuntime: 'automatic'
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // CRITICAL: Force single React instance to prevent multiple React copies
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // Force all Radix UI packages to use the same React instance
      "@radix-ui/react-slot": path.resolve(__dirname, "./node_modules/@radix-ui/react-slot"),
    },
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime", 
      "react/jsx-dev-runtime",
      "@radix-ui/react-slot"
    ],
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router-dom", 
      "@tanstack/react-query",
      "@radix-ui/react-slot"
    ],
    force: true,
  },
  build: {
    target: 'es2020',
    minify: isProduction ? 'terser' : 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Strategic code splitting for optimal loading
          vendor: ['react-router-dom', '@tanstack/react-query'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          utils: ['clsx', 'tailwind-merge', 'date-fns'],
        },
        // Optimize asset naming for caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: !isProduction,
    // Enable compression and optimization
    reportCompressedSize: true,
    assetsInlineLimit: 4096,
    // Terser options for production optimization
    terserOptions: isProduction ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    } : undefined,
  },
    // Performance optimizations
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
  };
});