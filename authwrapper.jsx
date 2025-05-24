// src/AuthWrapper.jsx
import React, { useEffect, useState } from 'react';
import { isAuthenticated, startOAuthProcess } from './api';

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        await startOAuthProcess();
      } else {
        setAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  if (!authenticated) {
    return <div>Authenticating...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
