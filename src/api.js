
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
    const events = mockData[0]?.events;  // Simulated mock data response

    if (!Array.isArray(events)) {
      throw new Error("Fetched events are not in expected array format");
    }

    return events;  // Return the mock event data
  } catch (error) {
    //console.error("Error fetching events:", error);
    return [];  // Return an empty array if an error occurs
  }
};





