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

// Set API_BASE_URL based on the environment
const API_BASE_URL = 'https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev';

// Store the redirect URI to ensure it's consistent between getting auth URL and exchanging code
const REDIRECT_URI = 'https://meet-app-psi.vercel.app/';

// Debug logging enabled (set to false in production)
const DEBUG = true;

// Debug logger
const log = (message, data) => {
  if (DEBUG) {
    if (data) {
      console.log(`[Meet App] ${message}`, data);
    } else {
      console.log(`[Meet App] ${message}`);
    }
  }
};

log('API_BASE_URL:', API_BASE_URL);

// Utility function to extract unique locations from the events array
export const extractLocations = (events) => {
  const locations = events.map((event) => event.location);
  return [...new Set(locations)];
};

// Function to get the Google OAuth URL
export const getAuthURL = async () => {
  try {
    log('Fetching OAuth URL...');
    const response = await fetch(`${API_BASE_URL}/api/get-auth-url`);
    
    if (!response.ok) {
      const errorText = await response.text();
      log('Error response from auth URL endpoint:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const { authUrl } = await response.json();
    log('Auth URL received:', authUrl);
    return authUrl;
  } catch (error) {
    log('Error getting auth URL:', error);
    throw error;
  }
};

// Function to check if the access token is valid
const checkToken = async (accessToken) => {
  if (!accessToken) {
    log('No access token provided to validate');
    return false;
  }

  try {
    log('Checking token validity...');
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    
    if (!response.ok) {
      log('Token validation failed with status:', response.status);
      return false;
    }
    
    const result = await response.json();
    
    if (result.error) {
      log('Token invalid:', result.error);
      return false;
    }
    
    log('Token is valid');
    return true;
  } catch (error) {
    log('Error validating token:', error);
    return false;
  }
};

// Function to get events from AWS Lambda
export const getEvents = async () => {
  // Handle authorization code if present in URL
  if (new URLSearchParams(window.location.search).has('code')) {
    log('Auth code detected in URL, handling OAuth redirect...');
    await handleOAuthRedirect();
  }
  
  // Check for token in session storage
  const token = sessionStorage.getItem('access_token');
  log('Access token from sessionStorage:', token ? '(exists)' : '(missing)');

  // If no token is found, start OAuth process
  if (!token) {
    log('No access token found. Starting OAuth process...');
    await startOAuthProcess();
    return mockData; // Return mock data while authentication is in progress
  }

  // Validate the token we have
  try {
    const isValid = await checkToken(token);
    
    if (!isValid) {
      log('Invalid access token. Removing token and restarting OAuth process...');
      sessionStorage.removeItem('access_token');
      await startOAuthProcess();
      return mockData;
    }

    // Token is valid, fetch events
    const url = `${API_BASE_URL}/api/get-events/${encodeURIComponent(token)}`;
    log('Fetching events from:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      log('Error fetching events:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { events } = await response.json();
    log('Events fetched successfully:', events.length);
    return events;
  } catch (error) {
    log('Error in getEvents function:', error);
    console.error('Error fetching events:', error);
    alert('Error fetching events. Using mock data instead.');
    return mockData;
  }
};

// Function to get access token from AWS Lambda with comprehensive error handling
export const getAccessToken = async (code) => {
  if (!code) {
    log('No authorization code provided');
    throw new Error('No authorization code provided');
  }

  try {
    log('Exchanging authorization code for access token...');
    log('Code:', code.substring(0, 10) + '...');
    
    const url = `${API_BASE_URL}/api/token/${encodeURIComponent(code)}`;
    log('Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    log('Response status:', response.status);

    // Handle non-200 responses
    if (!response.ok) {
      let errorData;
      
      try {
        // Try to parse as JSON
        errorData = await response.json();
        log('Structured error from backend:', errorData);
      } catch (e) {
        // If not JSON, get raw text
        const errorText = await response.text();
        log('Raw error from backend:', errorText);
        errorData = { message: errorText };
      }
      
      throw new Error(`Failed to get access token: ${errorData.message || errorData.error || response.statusText}`);
    }

    // Parse the response
    const result = await response.json();
    log('Token response received with keys:', Object.keys(result).join(', '));

    // Validate that we received an access token
    const { access_token } = result;
    if (!access_token) {
      log('Access token missing from response');
      throw new Error('Access token missing from response');
    }

    // Store token in session storage
    try {
      sessionStorage.setItem('access_token', access_token);
      
      // Verify token was stored correctly
      const verifyToken = sessionStorage.getItem('access_token');
      
      if (!verifyToken) {
        log('Failed to store token in sessionStorage');
        throw new Error('Failed to store token in sessionStorage');
      }
      
      log('Access token successfully stored in sessionStorage');
    } catch (storageError) {
      log('Error storing token in sessionStorage:', storageError);
      console.error('Unable to store access token. This may be due to browser privacy settings.');
      // Continue anyway since we have the token in memory for this session
    }
    
    return access_token;
  } catch (error) {
    log('Error in getAccessToken function:', error);
    console.error('Error getting access token:', error.message || error);
    throw error;
  }
};

// Function to clean up URL query parameters (e.g., after OAuth redirect)
export const removeQueryParams = () => {
  const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
  window.history.pushState({}, document.title, newUrl);
  log('Cleaned URL:', newUrl);
};

// Function to initiate OAuth process
export const startOAuthProcess = async () => {
  try {
    const authUrl = await getAuthURL();
    log('Redirecting to auth URL:', authUrl);
    // Store timestamp to detect expired auth codes later
    sessionStorage.setItem('oauth_start_time', Date.now().toString());
    window.location.href = authUrl;
  } catch (error) {
    log('Error starting OAuth process:', error);
    console.error('Error starting OAuth process:', error);
    alert('Failed to start authentication process. Please try again.');
  }
};

// Function to handle the OAuth process after redirect
export const handleOAuthRedirect = async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  
  if (!code) {
    log('No authorization code found in URL');
    return false;
  }
  
  log('Authorization code received:', code.substring(0, 10) + '...');
  
  try {
    // Check if code might be expired (more than 5 minutes old)
    const oauthStartTime = parseInt(sessionStorage.getItem('oauth_start_time') || '0', 10);
    const currentTime = Date.now();
    const codeAge = currentTime - oauthStartTime;
    
    if (codeAge > 300000) { // 5 minutes in milliseconds
      log('Authorization code may be expired (age: ' + Math.round(codeAge/1000) + ' seconds)');
    }
    
    // Exchange code for token
    await getAccessToken(code);
    
    // Clean up the URL
    removeQueryParams();
    
    // Clear the OAuth start time
    sessionStorage.removeItem('oauth_start_time');
    
    // Verify token after a brief delay
    setTimeout(() => {
      const token = sessionStorage.getItem('access_token');
      log('Verification: token in sessionStorage after OAuth flow:', token ? '(exists)' : '(missing)');
    }, 100);
    
    return true;
  } catch (error) {
    log('Error handling OAuth redirect:', error);
    console.error('Error handling OAuth redirect:', error);
    alert('Failed to complete login. Please try again.');
    removeQueryParams();
    return false;
  }
};

// Initialize the application based on current state
export const initializeApp = () => {
  log('Initializing application...');
  
  // Check for existing token
  const token = sessionStorage.getItem('access_token');
  
  if (token) {
    log('Existing access token found');
    
    // Verify token in background
    checkToken(token).then(isValid => {
      if (!isValid) {
        log('Existing token is invalid, will refresh on next action');
        // Don't remove yet - wait for user action to avoid immediate redirects
      }
    });
  } else {
    log('No existing access token');
  }
  
  // If we have an auth code in the URL, handle OAuth redirect
  if (new URLSearchParams(window.location.search).has('code')) {
    log('Auth code detected in URL, handling redirect...');
    // We'll handle this in getEvents() so we don't interrupt normal app startup
  } else {
    log('No authorization code in URL, normal startup');
    // Let component mount normally
  }
  
  log('Application initialized');
};

// Run initialization
initializeApp();