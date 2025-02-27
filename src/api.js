
import mockData from './mock-data'; // Mock data for development

// Utility function to extract unique locations from the events array
export const extractLocations = (events) => {
  const locations = events.map(event => event.location); // Extract locations from events
  return [...new Set(locations)]; // Remove duplicates using Set
};

// Function to check if the access token is valid
const checkToken = async (accessToken) => {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error checking token:", error);
    return null;
  }
};

// Function to fetch events. Returns mock data for localhost; else fetches real events.
export const getEvents = async () => {
  // Check if we're in a local development environment
  if (window.location.href.startsWith("http://localhost")) {
    return mockData; // Return mock data for local dev
  }

  const token = await getAccessToken(); // Get the valid access token

  if (!token) {
    console.error("No valid access token found.");
    return null;
  }

  try {
    removeQueryParams(); // Clean up any URL query parameters

    // Fetch real events from the API using the access token
    const url = `https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev/api/token${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const result = await response.json();
    return result ? result.events : null;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
};

// Function to clean up URL query parameters
const removeQueryParams = () => {
  let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.pushState("", "", newurl); // Remove query params from the URL
};

// Function to exchange the authorization code for an access token
const getToken = async (code) => {
  const encodedCode = encodeURIComponent(code); // URL encode the authorization code
  try {
    const response = await fetch(`https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodedCode}`);
    const { access_token } = await response.json();

    if (access_token) {
      // Store the access token securely in sessionStorage
      sessionStorage.setItem("access_token", access_token);
      return access_token;
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
  }

  return null; // Return null if unable to fetch the access token
};

// Function to get the access token from sessionStorage or initiate token flow if needed
const getAccessToken = async () => {
  const accessToken = sessionStorage.getItem('access_token'); // Retrieve the access token from sessionStorage

  if (accessToken) {
    // If the token exists, validate it
    const tokenCheck = await checkToken(accessToken);

    if (tokenCheck?.error) {
      // If the token is invalid, clear it and prompt the user to authenticate again
      sessionStorage.removeItem("access_token");

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code"); // Get the authorization code from URL

      if (!code) {
        // If no code is found, redirect the user to the OAuth authorization URL
        const authUrlResponse = await fetch("https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url");
        const { authUrl } = await authUrlResponse.json();
        window.location.href = authUrl; // Redirect to the authorization URL
      } else {
        // If the code is found, exchange it for an access token
        return await getToken(code);
      }
    } else {
      return accessToken; // Return the valid access token
    }
  }

  return null; // Return null if no access token is found
};
