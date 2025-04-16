import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Exclude test-related dependencies from the production build
      external: ['jest'],
    },
  },
  server: {
    // Set the default port for the development server
    port: 8080,
    open: true, // Automatically open the browser when the server starts
  },
});