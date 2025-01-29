/*import React, { useEffect, useState } from 'react';
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
      
  
      // Apply the city filter (check if currentCity is set to "See all cities" or the specific city)
      const filteredEvents = currentCity === "See all cities"
        ? allEvents
        : allEvents.filter(event => event.location.includes(currentCity)); // Ensure location contains the city string
    
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
      {error && <p className="error-message">{error}</p>}  
      
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={setCurrentCity} 
      />  
      
      <NumberOfEvents 
        currentNOE={currentNOE} 
        setCurrentNOE={setCurrentNOE} 
      />
      
      <EventList 
        events={events} 
      />  
    </div>
  );
};

export default App;*/
// src/App.js
import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents } from './api';

import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // Default number of events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState('');  // State to track the current city

  // Function to fetch event data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEvents = await getEvents(); // Fetch events from the API
        setEvents(allEvents.slice(0, currentNOE)); // Limit to the currentNOE number
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [currentNOE]);

  // Filter events based on the selected city
  const filteredEvents = currentCity
    ? events.filter(event => event.location.toLowerCase().includes(currentCity.toLowerCase()))
    : events;

  // Extract locations from events for CitySearch
  const locations = events.map(event => event.location);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <CitySearch allLocations={locations} setCurrentCity={setCurrentCity} /> {/* Pass setCurrentCity as a prop */}
      <NumberOfEvents />
      <EventList events={filteredEvents} /> {/* Display filtered events */}
    </div>
  );
};

export default App;









