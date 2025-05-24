import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

// Optional: Atatus monitoring (uncomment and configure if needed)
// import * as atatus from 'atatus-spa';
// atatus.config('1b1ee5665eb943e3bdb71259beabe47a').install();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// ✅ Register service worker in production
if (process.env.NODE_ENV === 'production') {
  serviceWorkerRegistration.register();
} else {
  console.log('⚠️ Service Worker registration skipped in development mode');
  serviceWorkerRegistration.unregister(); // Clean up any existing registrations
}

//serviceWorkerRegistration.register();