import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      external: ['jest'], // Exclude test dependencies from production
    },
  },
  server: {
    port: 8080,
    open: true,
  },
});

