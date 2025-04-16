// src/AuthWrapper.jsx
import React, { useEffect, useState } from 'react';
import { isAuthenticated, ensureAuthenticated } from './api';

const AuthWrapper = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      console.log("Authenticating...");
      try {
        const loggedIn = await isAuthenticated();
        if (!loggedIn) {
          console.log("User not authenticated, starting OAuth flow");
          await ensureAuthenticated();
        }
        setAuthReady(true);
      } catch (err) {
        console.error('Auth error:', err);
        setAuthError(err.message || 'Authentication failed.');
      }
    };
  
    authenticate();
  }, []);
  
  if (authError) return <div className="auth-error">❌ {authError}</div>;
  if (!authReady) return <div className="auth-loader">🔐 Logging you in...</div>;

  // If authenticated and ready, render children (main app content)
  return <>{children}</>;
};

export default AuthWrapper;
