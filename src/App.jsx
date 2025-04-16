
// src/App.jsx
import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents, isAuthenticated } from './api';
import AuthWrapper from './authwrapper';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // First check: is the user authenticated?
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      const auth = await isAuthenticated();
      setAuthenticated(auth);
      setLoading(false);
    };

    verifyAuth();
  }, []); // Run only once when app mounts

  // Once authenticated OR when user changes filter, fetch events
  useEffect(() => {
    const fetchData = async () => {
      if (!authenticated) return;

      setLoading(true);
      try {
        const allEvents = await getEvents();
        const filteredEvents = currentCity === "See all cities"
          ? allEvents
          : allEvents.filter(event => event.location === currentCity);

        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(allEvents));
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticated, currentCity, currentNOE]);

  return (
    <AuthWrapper>
      <div className="App">
        <h1>Meet App</h1>

        {loading && <div data-testid="loading">Loading events...</div>}
        {!loading && !authenticated && <p>Authenticating...</p>}
        {error && <div className="error" data-testid="error">{error}</div>}

        {authenticated && !loading && (
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
    </AuthWrapper>
  );
};

export default App;




