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

// Configuration
const API_BASE_URL = 'https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev';
const STORAGE_KEY_ACCESS_TOKEN = 'access_token';

console.log('API service initialized with base URL:', API_BASE_URL);

// Flag to prevent redundant OAuth redirect handling
let isOAuthHandled = false;

/**
 * Utility function to extract unique locations from events array
 */
export const extractLocations = (events) => {
  const locations = events.map((event) => event.location);
  return [...new Set(locations)];
};

/**
 * Fetch the Google OAuth authorization URL
 */
export const getAuthURL = async () => {
  try {
    console.log('Fetching OAuth URL...');
    const response = await fetch(`${API_BASE_URL}/api/get-auth-url`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from auth URL:', errorText);
      throw new Error(`Failed to get auth URL: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Auth URL received:', data.authUrl);
    return data.authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
};

/**
 * Validate access token with Google's tokeninfo endpoint
 */
const checkToken = async (accessToken) => {
  if (!accessToken) return false;
  
  try {
    console.log('Checking token validity...');
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    
    if (!response.ok) {
      console.log('Token validation failed with status:', response.status);
      return false;
    }
    
    const result = await response.json();
    if (result.error) {
      console.log('Token invalid. Error:', result.error);
      return false;
    }
    
    console.log('Token is valid, expires in:', result.expires_in, 'seconds');
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Exchange authorization code for access token
 * Matches the backend implementation that expects code in path parameter
 */
export const getAccessToken = async (code) => {
  if (!code) {
    console.error('No authorization code provided');
    throw new Error('Missing authorization code');
  }
  
  try {
    console.log('Exchanging code for access token...');
    console.log('Code:', code.substring(0, 10) + '...');
    
    // URL with the code in the path parameter as expected by your backend
    const url = `${API_BASE_URL}/api/token/${encodeURIComponent(code)}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Token response status:', response.status);
    
    // Handle error responses
    if (!response.ok) {
      let errorDetail;
      try {
        const errorData = await response.json();
        errorDetail = JSON.stringify(errorData);
      } catch (e) {
        errorDetail = await response.text() || `Status ${response.status}`;
      }
      console.error('Token exchange error:', errorDetail);
      throw new Error(`Token exchange failed: ${response.status} - ${errorDetail}`);
    }
    
    // Parse the successful response
    const tokenData = await response.json();
    
    // Backend returns the full token object from Google, so we need to extract access_token
    if (!tokenData.access_token) {
      throw new Error('Access token missing from response');
    }
    
    console.log('Token received:', tokenData.access_token.substring(0, 10) + '...');
    
    // Store the token in localStorage for persistence across sessions
    localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, tokenData.access_token);
    
    console.log('Access token successfully stored');
    return tokenData.access_token;
  } catch (error) {
    console.error('Token exchange failed:', error);
    throw error;
  }
};

/**
 * Get events from the Google Calendar API
 */
export const getEvents = async () => {
  // Process any auth code in the URL first
  if (new URLSearchParams(window.location.search).has('code')) {
    console.log('Auth code detected in URL, handling before fetching events');
    try {
      await handleOAuthRedirect();
    } catch (error) {
      console.error('Error handling OAuth redirect:', error);
      return mockData;
    }
  }
  
  // Get the token from storage
  const token = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  console.log('Access token available:', !!token);
  
  // Handle case where no token is available
  if (!token) {
    console.log('No access token found, initiating OAuth flow');
    try {
      await startOAuthProcess();
    } catch (error) {
      console.error('Failed to start OAuth process:', error);
    }
    return mockData;
  }
  
  // Validate the token
  const isValid = await checkToken(token);
  if (!isValid) {
    console.log('Token is invalid or expired, restarting auth flow');
    localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
    try {
      await startOAuthProcess();
    } catch (error) {
      console.error('Failed to restart OAuth process:', error);
    }
    return mockData;
  }
  
  // Token is valid, fetch events
  try {
    console.log('Fetching events with valid token');
    const url = `${API_BASE_URL}/api/get-events/${encodeURIComponent(token)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching events:', errorText);
      throw new Error(`Error fetching events: ${response.status}`);
    }
    
    const { events } = await response.json();
    console.log(`Successfully fetched ${events.length} events`);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // If error is auth-related, try to refresh auth
    if (error.message && (
        error.message.includes('401') || 
        error.message.includes('403') || 
        error.message.includes('auth')
    )) {
      console.log('Auth error detected, clearing token and restarting auth flow');
      localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
      try {
        await startOAuthProcess();
      } catch (e) {
        console.error('Failed to restart auth process after event fetch error:', e);
      }
    } else {
      alert('Error fetching calendar events. Using mock data instead.');
    }
    
    return mockData;
  }
};

/**
 * Remove query parameters from URL after OAuth redirect
 */
export const removeQueryParams = () => {
  const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
  window.history.pushState({}, document.title, newUrl);
  console.log('Removed query parameters from URL');
};

/**
 * Start the OAuth authentication process
 */
export const startOAuthProcess = async () => {
  try {
    const authUrl = await getAuthURL();
    console.log('Redirecting to Google authorization page:', authUrl);
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to start OAuth process:', error);
    throw error;
  }
};

/**
 * Handle OAuth redirect with authorization code
 */
export const handleOAuthRedirect = async () => {
  if (isOAuthHandled) {
    console.log('OAuth redirect already handled. Skipping...');
    return false;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  
  // Handle error in OAuth redirect
  if (error) {
    console.error('OAuth error returned:', error);
    removeQueryParams();
    throw new Error(`Authorization failed: ${error}`);
  }
  
  // Handle missing code
  if (!code) {
    console.log('No authorization code found in URL');
    return false;
  }
  
  console.log('Processing authorization code from redirect');
  
  try {
    // Set flag to prevent re-processing
    isOAuthHandled = true;
    
    // Exchange code for token
    await getAccessToken(code);
    
    // Verify token storage
    const token = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
    if (!token) {
      throw new Error('Token not found after exchange');
    }
    
    // Clean up the URL
    removeQueryParams();
    
    console.log('OAuth redirect handled successfully');
    return true;
  } catch (error) {
    console.error('Failed to handle OAuth redirect:', error);
    // Reset flag if there's an error
    isOAuthHandled = false;
    // Clean up regardless of success
    removeQueryParams();
    throw error;
  }
};

/**
 * Initialize the application
 */
export const initializeApp = () => {
  console.log('Initializing app and checking auth state');
  
  // Handle OAuth redirect if needed
  if (new URLSearchParams(window.location.search).has('code')) {
    console.log('Auth code detected in URL, handling OAuth redirect...');
    handleOAuthRedirect().catch(error => {
      console.error('Failed to handle OAuth redirect during initialization:', error);
    });
  } else if (new URLSearchParams(window.location.search).has('error')) {
    // Handle OAuth error
    const error = new URLSearchParams(window.location.search).get('error');
    console.error('OAuth error detected:', error);
    alert(`Authentication error: ${error}. Please try again.`);
    removeQueryParams();
  } else {
    // Check if we have a valid token
    const token = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
    if (token) {
      console.log('Existing token found, app ready');
    } else {
      console.log('No token found, authentication will be required');
    }
  }
};

// Run initialization
initializeApp();