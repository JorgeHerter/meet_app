import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

// import * as atatus from 'atatus-spa';  // Optional: Enable Atatus monitoring
// atatus.config('1b1ee5665eb943e3bdb71259beabe47a').install();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker only in production
if (process.env.NODE_ENV === 'production') {
  serviceWorkerRegistration.register();
} else {
  console.log('Service Worker registration skipped in development mode');
  serviceWorkerRegistration.unregister(); // Unregister any existing service workers
}
