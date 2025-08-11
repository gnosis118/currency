import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
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
    rollupOptions: {
      output: {
        manualChunks: {
          // Remove React from manual chunking to prevent conflicts
          vendor: ['react-router-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
  },
}));