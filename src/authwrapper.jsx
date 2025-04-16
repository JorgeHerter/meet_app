// src/AuthWrapper.jsx
import React, { useEffect, useState } from "react";
import { isAuthenticated, getAccessToken, handleAuthRedirect } from "./api";

const AuthWrapper = ({ children }) => {
  const [authComplete, setAuthComplete] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        console.log("Handling OAuth redirect...");
        await handleAuthRedirect(code);
        window.history.replaceState({}, "", "/"); // Clean URL
      }

      const auth = await isAuthenticated();
      if (!auth) {
        console.log("Not authenticated. Redirecting...");
        const tokenUrl = await getAccessToken(); // redirects user to login
        window.location.href = tokenUrl;
      } else {
        console.log("Authenticated successfully.");
      }

      setAuthComplete(true); // ✅ NOW we let the app render
    };

    initAuth();
  }, []);

  if (!authComplete) {
    return <div>Authenticating...</div>; // Show loader until auth is done
  }

  return <>{children}</>;
};

export default AuthWrapper;
