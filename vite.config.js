iimport { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      srcDir: 'src', // Adjust if your service-worker is elsewhere
      filename: 'service-worker.js',
      manifest: {
        name: 'Meet App',
        short_name: 'Meet',
        description: 'Your event discovery app',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
            purpose: 'maskable'
          },
          {
            src: 'meet-app-144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'meet-app-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'meet-app-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/.*\.png$/, // Cache .png files
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
              },
            },
          },
        ],
      },
    }),
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

