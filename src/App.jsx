// src/App.js
import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents, isAuthenticated, startOAuthProcess } from './api';

import './App.css';

const App = () => {
  const [authReady, setAuthReady] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 Handle authentication before anything else
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          await startOAuthProcess(); // This redirects — stops execution
        } else {
          setAuthReady(true);
          const loader = document.getElementById('auth-loader');
          if (loader) loader.style.display = 'none'; // Hide the loader if it exists
        }
      } catch (err) {
        console.error("Authentication failed:", err);
      }
    };
    checkAuth();
  }, []);

  // ⛔ Don't render anything else until authenticated
  if (!authReady) {
    return <div>🔐 Logging you in, please wait...</div>;
  }

  // 🔁 Fetch events after authentication
  const fetchData = async () => {
    try {
      setLoading(true);
      const allEvents = await getEvents();
      const filteredEvents = currentCity === "See all cities"
        ? allEvents
        : allEvents.filter(event => event.location === currentCity);

      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authReady) {
      fetchData();
    }
  }, [currentCity, currentNOE, authReady]);

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

