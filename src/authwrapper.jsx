// src/AuthWrapper.jsx
import React, { useEffect, useState } from 'react';
import { ensureAuthenticated, logout, handleOAuthRedirect } from './api';

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (new URLSearchParams(window.location.search).has('code')) {
        await handleOAuthRedirect();
      }

      await ensureAuthenticated();
      setAuthenticated(true);
    };

    init();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload(); // Force re-auth
  };

  if (!authenticated) return <p>Authenticating...</p>;

  return (
    <div>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {children}
    </div>
  );
};

export default AuthWrapper;
