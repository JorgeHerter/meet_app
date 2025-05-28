import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

// Optional: Atatus monitoring
// import * as atatus from 'atatus-spa';
// atatus.config('YOUR_KEY_HERE').install();

const root = ReactDOM.createRoot(document.getElementById('root'));

// 🔒 Disable mock mode in production
/*if (import.meta.env.PROD) {
  localStorage.removeItem('mock');
}*/

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// ✅ Service Worker registration
if (import.meta.env.PROD) {
  console.log('🚀 Production mode: registering service worker');
  serviceWorkerRegistration.register();
} else {
  console.log('⚠️ Development mode: unregistering service worker');
  
  // More aggressive cleanup for development
  serviceWorkerRegistration.unregister().then(() => {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Clear localStorage items related to workbox
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('workbox-')) {
        localStorage.removeItem(key);
      }
    });
  });
}