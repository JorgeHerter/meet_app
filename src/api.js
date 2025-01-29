
// src/api.js
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
  const locations = [...new Set(extractedLocations)]; // Remove duplicates using Set
  return locations;
};

/**
 * This function fetches the list of all events.
 * It returns the 'events' array from mockData.
 *
 * @returns {Array} - Array of event objects
 */
// src/api.js

export const getEvents = async () => {
  try {
    const events = mockData?.[0]?.events;  // Use optional chaining for both mockData and mockData[0]

    // Check if events exist and are in the expected array format
    if (!Array.isArray(events)) {
      throw new Error("Fetched events are not in expected array format");
    }

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    
    // Optionally, log the error to an error reporting system
    // logErrorToMonitoringSystem(error);

    // Return an empty array in case of errors, or you can return a default set of mock events
    return [];
  }
};




