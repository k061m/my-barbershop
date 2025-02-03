// This file is a configuration file for Vite, a build tool and development server for modern web projects

// Import necessary modules
import { defineConfig } from 'vite'  // Import the defineConfig function from Vite
import react from '@vitejs/plugin-react-swc'  // Import the React plugin for Vite
import path from 'path'  // Import the path module for working with file and directory paths

// Export the configuration object
export default defineConfig({
  // Define plugins to be used
  plugins: [react()],  // Use the React plugin

  // Configure how modules are resolved
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Create an alias '@' that points to the 'src' directory
    },
  },

  // Configure the build process
  build: {
    outDir: 'dist',  // Set the output directory for the build
    sourcemap: true,  // Generate source maps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          // Define manual chunks for better code splitting
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
        },
      },
    },
  },

  // Configure the development server
  server: {
    host: true,  // Listen on all addresses
    port: parseInt(process.env.VITE_DEV_PORT || '3000'),  // Set the port number (default: 3000)
    proxy: {
      // Configure proxy for API requests during development
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
    },
    headers: {
      // Set custom headers for the development server
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
      'X-Frame-Options': 'SAMEORIGIN'
    }
  },
})
