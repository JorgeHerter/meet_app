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

// Flag to track authentication state
let isAuthenticating = false;
let isOAuthHandled = false;

// Utility function to extract unique locations from the events array
export const extractLocations = (events) => {
  const locations = events.map((event) => event.location);
  return [...new Set(locations)];
};

// Function to get the Google OAuth URL
export const getAuthURL = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/get-auth-url`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { authUrl } = await response.json();
    return authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
};

// Function to check if the access token is valid
const checkToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const result = await response.json();
    return !result.error;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Function to get events from AWS Lambda
export const getEvents = async () => {
  // First check if we need to handle an OAuth redirect
  if (new URLSearchParams(window.location.search).has('code') && !isOAuthHandled) {
    await handleOAuthRedirect();
  }

  // Check if we have a token
  const token = sessionStorage.getItem('access_token');

  // If no token is available and we're not already authenticating, start the auth process
  if (!token && !isAuthenticating) {
    isAuthenticating = true;
    await startOAuthProcess();
    return mockData; // Return mock data while authentication is in progress
  }

  // If we're in the middle of authenticating, return mock data
  if (isAuthenticating) {
    return mockData;
  }

  // We have a token, try to use it
  try {
    // Validate the token first
    const isValid = await checkToken(token);
    if (!isValid) {
      // If token is invalid, clear it and restart auth
      sessionStorage.removeItem('access_token');
      isAuthenticating = true;
      await startOAuthProcess();
      return mockData;
    }

    // Token is valid, fetch events
    const url = `${API_BASE_URL}/api/get-events/${encodeURIComponent(token)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { events } = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return mockData;
  }
};

// Function to get access token from AWS Lambda
export const getAccessToken = async (code) => {
  try {
    const url = `${API_BASE_URL}/api/token/${encodeURIComponent(code)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get access token');
    }

    const { access_token } = await response.json();
    if (!access_token) {
      throw new Error('Access token missing from response');
    }

    // Store the token and reset authentication flags
    sessionStorage.setItem('access_token', access_token);
    isAuthenticating = false;
    return access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    isAuthenticating = false;
    alert(`Authentication error: ${error.message || 'Unable to log in. Please try again.'}`);
    throw error;
  }
};

// Function to clean up URL query parameters
export const removeQueryParams = () => {
  const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
  window.history.pushState({}, document.title, newUrl);
};

// Function to initiate OAuth process
export const startOAuthProcess = async () => {
  try {
    // Only start if we're not already authenticating
    if (!isAuthenticating) {
      isAuthenticating = true;
      const authUrl = await getAuthURL();
      window.location.href = authUrl;
    }
  } catch (error) {
    console.error('Error starting OAuth process:', error);
    isAuthenticating = false;
    alert('Failed to start OAuth process. Please try again.');
  }
};

// Function to handle the OAuth process after redirect
export const handleOAuthRedirect = async () => {
  // Prevent multiple processing of the same code
  if (isOAuthHandled) {
    return false;
  }

  const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    try {
      isOAuthHandled = true;
      isAuthenticating = true;
      
      await getAccessToken(code);
      
      // Clean up the URL
      removeQueryParams();
      isAuthenticating = false;
      return true;
    } catch (error) {
      console.error('Error handling OAuth redirect:', error);
      isOAuthHandled = false;
      isAuthenticating = false;
      return false;
    }
  } else {
    return false;
  }
};

// Initialize the application
export const initializeApp = () => {
  // Check if we're returning from an OAuth redirect
  if (new URLSearchParams(window.location.search).has('code') && !isOAuthHandled) {
    // Handle the OAuth redirect
    handleOAuthRedirect().then(() => {
      console.log('OAuth redirect handling complete');
    });
  }
};

// Run initialization
initializeApp();