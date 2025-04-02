// src/App.js
import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents } from './api';

import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // Default 32 events as per Feature 3 Scenario 1
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allEvents = await getEvents(); // Wait for getEvents to resolve
      // Filter events based on selected city
      const filteredEvents = currentCity === "See all cities" 
        ? allEvents 
        : allEvents.filter(event => event.location === currentCity);
      
      // Update events state with the filtered events, limited by currentNOE
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when currentCity or currentNOE changes
  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]); // This will run whenever currentCity or currentNOE changes

  return (
    <div className="App">
      <h1>Meet App</h1>
      
      {error && <div className="error" data-testid="error">{error}</div>}
      
      {loading ? (
        <div data-testid="loading">Loading events...</div>
      ) : (
        <>
          <CitySearch 
            allLocations={allLocations} 
            setCurrentCity={setCurrentCity} 
          />
          
          <NumberOfEvents 
            currentNOE={currentNOE} 
            setCurrentNOE={setCurrentNOE} 
          />
          
          <EventList events={events} />
        </>
      )}
    </div>
  );
};

export default App;

