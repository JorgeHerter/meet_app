
import mockData from './mock-data';

/**
 * This function extracts locations from the events array.
 * It takes the events array and maps over it to return an array of locations.
 * It then removes duplicates using a Set and the spread operator.
 *
 * @param {*} events - Array of event objects
 * @returns {Array} - Unique list of locations
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location); // Map to extract locations
  return [...new Set(extractedLocations)]; // Remove duplicates using Set
};

/**
 * This function checks the validity of an access token.
 * It fetches information using the Google OAuth token info endpoint.
 *
 * @param {string} accessToken - The access token to verify
 * @returns {Object} - Token verification result
 */
const checkToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error checking token:", error);
    return null;
  }
};

/**
 * This function fetches the list of all events.
 * It checks if the environment is localhost and returns mock data accordingly.
 * If not, it verifies the access token and fetches events from the API.
 *
 * @returns {Array} - Array of event objects or null if error occurs
 */
export const getEvents = async () => {
  // If running on localhost, return mock data
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  const token = await getAccessToken();  // Fetch the access token

  if (!token) {
    console.error("No valid access token found.");
    return null;
  }

  try {
    removeQuery(); // Clean up the URL query params

    // Fetch events from the API using the token
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

/**
 * Removes the URL query parameters from the page.
 */
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
};

/**
 * This function fetches the access token using the authorization code.
 * It encodes the authorization code and fetches the access token from the server.
 *
 * @param {string} code - The authorization code
 * @returns {string|null} - The access token or null if unable to fetch
 */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  try {
    const response = await fetch(`https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}`);
    const { access_token } = await response.json();

    if (access_token) {
      // Store the access token securely
      sessionStorage.setItem("access_token", access_token);
      return access_token;
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
  }

  return null;
};

/**
 * Fetches the access token from sessionStorage.
 * If the token is invalid or missing, it initiates the token verification flow.
 *
 * @returns {string|null} - The access token or null if none available
 */
const getAccessToken = async () => {
  const accessToken = sessionStorage.getItem('access_token');

  if (accessToken) {
    // Check the token's validity
    const tokenCheck = await checkToken(accessToken);

    if (tokenCheck?.error) {
      // If token is invalid, remove it and prompt for a new token
      await sessionStorage.removeItem("access_token");
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (!code) {
        // If no code, redirect to the auth URL
        const response = await fetch("https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url");
        const result = await response.json();
        const { authUrl } = result;
        window.location.href = authUrl;
      } else {
        // If there's a code, get a new token
        return await getToken(code);
      }
    } else {
      return accessToken;  // Return the valid token
    }
  }

  return null;  // Return null if no access token is available
};