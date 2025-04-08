/*import mockData from './mock-data';

// Utility function to extract unique locations from the events array
export const extractLocations = (events) => {
  const locations = events.map(event => event.location);
  return [...new Set(locations)];
};

// Set API_BASE_URL based on the hostname
let API_BASE_URL = 'https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com'; // Development URL


console.log('API_BASE_URL at initialization:', API_BASE_URL); // Debug log

export const getAuthURL = async () => {
  console.log('API_BASE_URL inside getAuthURL:', API_BASE_URL); // Debug log
  console.log("Fetching OAuth URL..."); // Debug log
  try {
    // Use the correct API_BASE_URL and endpoint
    const response = await fetch(`${API_BASE_URL}/dev/api/get-auth-url`);

    console.log('Response:', response); // Debug log
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Auth URL:', result.authUrl); // Debug log
    return result.authUrl; // Return the OAuth URL for the user to authenticate
  } catch (error) {
    console.error('Error getting auth URL:', error.message, error); // Log full error
    throw error; // Propagate the error if unable to get the auth URL
  }
};

// Function to check if the access token is valid
const checkToken = async (accessToken) => {
  console.log("Checking token validity..."); // Debug log
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const result = await response.json();
    console.log("Token check response:", result); // Debug log
    return !result.error;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

// Function to get events from AWS Lambda
export const getEvents = async () => {
  const token = sessionStorage.getItem('access_token'); // Get token from session storage
  console.log('Access token from sessionStorage:', token); // Debug log

  if (!token) {
    // Redirect the user to Google's OAuth flow
    alert('No access token found. Redirecting to Google for authentication.');
    console.log('No access token found, redirecting to OAuth process'); // Debug log
    await startOAuthProcess(); // Initiate the OAuth process
    return; // Exit the function
  }

  // Validate the token before making the request
  const isValid = await checkToken(token);
  console.log('Is the token valid?', isValid); // Debug log

  if (!isValid) {
    // Redirect the user to Google's OAuth flow
    alert('Invalid access token. Redirecting to Google for authentication.');
    console.log('Token invalid, redirecting to OAuth process'); // Debug log
    sessionStorage.removeItem('access_token'); // Remove invalid token
    await startOAuthProcess(); // Initiate the OAuth process
    return; // Exit the function
  }

  try {
    const url = `${API_BASE_URL}/api/get-events/${encodeURIComponent(token)}`;
    console.log('Fetching events from:', url); // Debug log

    const response = await fetch(url); // Fetch events from the API
    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Events data structure:', result); // Debug log

    if (!result.events) {
      throw new Error('Events data is missing from response');
    }

    return result.events; // Return the events data if successful
  } catch (error) {
    console.error('Error fetching events:', error);
    alert('Error fetching events. Using mock data.'); // Show notification for error
    return mockData; // Return mock data in case of error
  }
};

// Function to get access token from AWS Lambda
export const getAccessToken = async (code) => {
  console.log("Fetching access token with code:", code); // Added to track the code being sent
  try {
    const encodedCode = encodeURIComponent(code); // URL encode the code
    console.log("Encoded code:", encodedCode); // Added to verify encoded code
    const response = await fetch(
      `${API_BASE_URL}/api/token/${encodedCode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Token response:', result); // Added to verify the response

    const accessToken = result.access_token;

    if (!accessToken) {
      throw new Error('Access token missing from response');
    }

    sessionStorage.setItem('access_token', accessToken); // Store the access token in session storage
    console.log('Access token stored in sessionStorage:', accessToken); // Debug log
    return accessToken; // Return the access token
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error; // Propagate the error if unable to fetch token
  }
};

// Function to get OAuth URL from AWS Lambda
/*export const getAuthURL = async () => {
  console.log("Fetching OAuth URL..."); // Debug log
  try {
    const response = await fetch(`${API_BASE_URL}/api/get-auth-url`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Auth URL:', result.authUrl); // Debug log
    return result.authUrl; // Return the OAuth URL for the user to authenticate
  } catch (error) {
    console.error('Error getting auth URL:', error.message, error); // Log full error
    throw error; // Propagate the error if unable to get the auth URL
  }
};*/

// Function to clean up URL query parameters (e.g., after OAuth redirect)
/*export const removeQueryParams = () => {
  let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.pushState("", "", newUrl); // Clean up URL by removing query params
  console.log('Cleaned URL:', newUrl); // Debug log
};

// Function to initiate OAuth process
export const startOAuthProcess = async () => {
  const authUrl = await getAuthURL(); // Get the OAuth URL
  console.log('Redirecting to auth URL:', authUrl); // Debug log
  window.location.href = authUrl; // Redirect to the OAuth URL for user authentication
};

// Check if we are on the redirect page and handle the OAuth process
const code = new URLSearchParams(window.location.search).get('code'); // Check for authorization code

if (code) {
  console.log("Authorization code received:", code);
  // Call function to exchange authorization code for access token
  getAccessToken(code)
    .then((accessToken) => {
      console.log("Access token:", accessToken);
      // Redirect to another page or remove code from URL
      removeQueryParams();
      // You can now call getEvents() to get the events using the valid access token
    })
    .catch((error) => {
      console.error("Error exchanging code for access token:", error);
    });
} else {
  // If no code in the URL, start the OAuth process
  console.log("No code found, starting OAuth process...");
  startOAuthProcess();
}*/

import mockData from './mock-data';

// API Configuration
const API_BASE_URL = 'https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev';
const TOKEN_STORAGE_KEY = 'access_token';
const CODE_PROCESSED_KEY = 'auth_code_processed';
const MAX_AUTH_RETRIES = 2;

// Authentication state tracking
let authState = {
  isAuthenticating: false,
  authErrorCount: 0,
};

// Debug logger
const debug = (message, data) => {
  console.log(`[MeetApp] ${message}`, data || '');
};

/**
 * Extract unique locations from events array
 */
export const extractLocations = (events) => {
  const locations = events.map((event) => event.location);
  return [...new Set(locations)];
};

/**
 * Fetch the Google OAuth authorization URL
 */
export const getAuthURL = async () => {
  debug('Requesting auth URL');
  try {
    const response = await fetch(`${API_BASE_URL}/api/get-auth-url`);
    if (!response.ok) {
      throw new Error(`Auth URL request failed: ${response.status}`);
    }
    const { authUrl } = await response.json();
    debug('Received auth URL', authUrl);
    return authUrl;
  } catch (error) {
    console.error('Failed to get auth URL:', error);
    throw error;
  }
};

/**
 * Validate the current access token
 */
const validateToken = async (accessToken) => {
  if (!accessToken) return false;

  debug('Validating token');
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );

    if (!response.ok) {
      debug('Token validation failed', response.status);
      return false;
    }

    const result = await response.json();
    const isValid = !result.error;
    debug('Token validation result', isValid);
    return isValid;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * Check if we're currently processing a code
 */
const isCodeAlreadyProcessed = (code) => {
  const processedCode = sessionStorage.getItem(CODE_PROCESSED_KEY);
  return processedCode === code;
};

/**
 * Mark a code as processed to prevent loops
 */
const markCodeAsProcessed = (code) => {
  sessionStorage.setItem(CODE_PROCESSED_KEY, code);
};

/**
 * Fetch events from the API
 */
export const getEvents = async () => {
  debug('Getting events, auth state:', authState);

  // If too many auth failures, use mock data
  if (authState.authErrorCount >= MAX_AUTH_RETRIES) {
    debug('Too many auth failures, using mock data');
    return mockData;
  }

  // Check for OAuth redirect code
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    debug('Detected OAuth code in URL', code);

    // Prevent processing the same code multiple times
    if (isCodeAlreadyProcessed(code)) {
      debug('This code has already been processed, skipping');
    } else {
      try {
        debug('Processing new auth code');
        markCodeAsProcessed(code);
        authState.isAuthenticating = true;

        const token = await getAccessToken(code);
        removeQueryParams();

        // If we got a token, try to use it immediately
        if (token) {
          debug('Successfully obtained token, fetching events');
          authState.isAuthenticating = false;

          try {
            const url = `${API_BASE_URL}/api/get-events/${encodeURIComponent(token)}`;
            const response = await fetch(url);

            if (!response.ok) {
              throw new Error(`Events request failed: ${response.status}`);
            }

            const { events } = await response.json();
            debug('Successfully fetched events', events.length);

            // Reset error count on success
            authState.authErrorCount = 0;
            return events;
          } catch (error) {
            console.error('Error fetching events with new token:', error);
            return mockData;
          }
        }
      } catch (error) {
        console.error('Failed to process auth code:', error);
        authState.isAuthenticating = false;
      }
    }
  }

  // Get current token
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  debug('Current token status', token ? 'exists' : 'missing');

  // No token and not currently authenticating
  if (!token && !authState.isAuthenticating) {
    debug('No token available, starting auth flow');
    try {
      authState.isAuthenticating = true;
      await startOAuthProcess();
      // Auth process will redirect, but in case it doesn't:
      return mockData;
    } catch (error) {
      authState.isAuthenticating = false;
      authState.authErrorCount++;
      console.error('Auth process failed:', error);
      return mockData;
    }
  }

  // If authentication is in progress
  if (authState.isAuthenticating) {
    debug('Authentication in progress, using mock data');
    return mockData;
  }

  // We have a token, let's try to use it
  try {
    // First validate the token
    const isValid = await validateToken(token);
    if (!isValid) {
      debug('Token is invalid, clearing and restarting auth');
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);

      if (authState.authErrorCount < MAX_AUTH_RETRIES) {
        authState.isAuthenticating = true;
        await startOAuthProcess();
      }

      return mockData;
    }

    // Token is valid, fetch the events
    debug('Fetching events with valid token');
    const url = `${API_BASE_URL}/api/get-events/${encodeURIComponent(token)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Events request failed: ${response.status}`);
    }

    const { events } = await response.json();
    debug('Successfully fetched events', events.length);

    // Reset error count on success
    authState.authErrorCount = 0;
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return mockData;
  }
};

/**
 * Exchange auth code for access token
 */
export const getAccessToken = async (code) => {
  debug('Getting access token with code', code);
  try {
    const url = `${API_BASE_URL}/api/token/${encodeURIComponent(code)}`;
    debug('Token request URL:', url);

    const response = await fetch(url);
    debug('Token response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      debug('Token error response:', errorData);
      throw new Error(errorData.message || 'Failed to get access token');
    }

    const { access_token } = await response.json();
    if (!access_token) {
      throw new Error('Access token missing from response');
    }

    debug('Successfully received access token');
    sessionStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    return access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    authState.authErrorCount++;
    throw error;
  }
};

/**
 * Clean up URL parameters after OAuth redirect
 */
export const removeQueryParams = () => {
  debug('Removing query parameters from URL');
  const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
  window.history.pushState({}, document.title, newUrl);
};

/**
 * Start the OAuth authentication process
 */
export const startOAuthProcess = async () => {
  debug('Starting OAuth process');
  try {
    if (!authState.isAuthenticating) {
      authState.isAuthenticating = true;
      const authUrl = await getAuthURL();
      debug('Redirecting to auth URL', authUrl);
      window.location.href = authUrl;
    }
  } catch (error) {
    console.error('Failed to start OAuth process:', error);
    authState.isAuthenticating = false;
    authState.authErrorCount++;
    alert('Failed to start authentication. Please try again.');
    throw error;
  }
};

/**
 * Initialize the app
 */
(function initializeApp() {
  debug('API_BASE_URL at initialization:', API_BASE_URL);

  // Check for OAuth redirect
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    debug('Auth code detected in URL, handling OAuth redirect...');
    getEvents().then((events) => {
      debug('Initial events loaded:', events.length);
    }).catch((err) => {
      console.error('Error loading initial events:', err);
    });
  } else {
    debug('No OAuth code in URL');
  }
})();