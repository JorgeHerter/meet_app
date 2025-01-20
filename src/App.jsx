import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents } from './api';

import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);  // All unique city locations
  const [currentNOE, setCurrentNOE] = useState(32);  // Number of events to display
  const [events, setEvents] = useState([]);  // List of events to display
  const [currentCity, setCurrentCity] = useState("See all cities");  // Current city for filtering events
  const [error, setError] = useState(null);  // Error state to display errors if fetching fails

  // Fetch events and locations based on the selected city and number of events
  const fetchData = async () => {
    try {
      const allEvents = await getEvents();
      console.log("All events:", allEvents); // Log the full list of events
  
      // Apply the city filter (check if currentCity is set to "See all cities" or the specific city)
      const filteredEvents = currentCity === "See all cities"
        ? allEvents
        : allEvents.filter(event => event.location.includes(currentCity)); // Ensure location contains the city string
      
      console.log("Filtered events:", filteredEvents);  // Log the filtered events
  
      setEvents(filteredEvents.slice(0, currentNOE));  // Limit events to the specified number
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  

  // Re-fetch events when currentCity or currentNOE (number of events) changes
  useEffect(() => {
    fetchData();  // Fetch data based on currentCity and currentNOE
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <h1>Event Finder</h1>
      {error && <p className="error-message">{error}</p>}  {/* Display error message if error exists */}
      
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={setCurrentCity} 
      />  {/* City search component */}
      
      <NumberOfEvents 
        currentNOE={currentNOE} 
        setCurrentNOE={setCurrentNOE} 
      />  {/* Number of events selector */}
      
      <EventList 
        events={events} 
      />  {/* Event list component */}
    </div>
  );
};

export default App;
