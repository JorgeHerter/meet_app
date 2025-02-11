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
  const [currentNOE, setCurrentNOE] = useState(32);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const allEvents = await getEvents();
        
        if (isMounted) {
          // Ensure allEvents is an array before using slice
          if (Array.isArray(allEvents)) {
            setEvents(allEvents.slice(0, currentNOE));
          } else {
            throw new Error('Events data is not in the expected format');
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching events:", error);
          setError("Failed to load events. Please try again later.");
          setEvents([]); // Reset events on error
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup to prevent setting state on unmounted component
    };
  }, [currentNOE]);

  // Safely filter events with null checks
  const filteredEvents = currentCity && events.length > 0
    ? events.filter(event => 
        event?.location?.toLowerCase().includes(currentCity.toLowerCase())
      )
    : events;

  // Safely extract locations with null checks
  const locations = events
    .filter(event => event?.location)
    .map(event => event.location);

  if (loading) {
    return <div data-testid="loading">Loading events...</div>;
  }

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  return (
    <div className="App">
      <CitySearch 
        allLocations={locations} 
        setCurrentCity={setCurrentCity} 
      />
      <NumberOfEvents 
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
      />
      <EventList events={filteredEvents} />
    </div>
  );
};

export default App;









