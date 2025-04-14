// src/AuthWrapper.jsx
import React, { useEffect, useState } from 'react';
import { isAuthenticated, ensureAuthenticated, logout } from './api';

const AuthWrapper = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const calculateTimeLeft = () => {
    const expiry = sessionStorage.getItem('token_expiry');
    if (!expiry) return null;

    const now = Date.now();
    const diff = parseInt(expiry, 10) - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const formatTimeLeft = (time) => {
    if (!time) return "Session expired";
    return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
  };

  const handleLogout = async () => {
    await logout();
    sessionStorage.clear(); // Clear everything
    window.location.href = '/'; // Redirect and force reauth
  };
  

  useEffect(() => {
    const authenticate = async () => {
      try {
        const loggedIn = await isAuthenticated();
        if (!loggedIn) {
          await ensureAuthenticated();
        }
        setAuthReady(true);

        const id = setInterval(async () => {
          const valid = await isAuthenticated();
          const remaining = calculateTimeLeft();

          if (!valid || !remaining) {
            clearInterval(id);
            await logout();
            setAuthError('Session expired. Please log in again.');
            setAuthReady(false);
            return;
          }

          setTimeLeft(remaining);
        }, 1000);

        setIntervalId(id);
      } catch (error) {
        setAuthError('Authentication failed. Please try again.');
      }
    };

    authenticate();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (authError) {
    return (
      <div className="auth-error">
        ❌ {authError}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!authReady) {
    return <div className="auth-loader">🔐 Logging you in...</div>;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-controls" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '10px' }}>
        <span>🕒 Session expires in: {formatTimeLeft(timeLeft)}</span>
        <button onClick={handleLogout}>🚪 Log Out</button>
      </div>
      {children}
    </div>
  );
};

export default AuthWrapper;

