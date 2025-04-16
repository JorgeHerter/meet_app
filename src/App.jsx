
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
  const [authChecked, setAuthChecked] = useState(false); // ✅ new state

  // Check auth once at app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        setAuthenticated(auth);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthChecked(true); // ✅ ensures we checked auth
      }
    };
    checkAuth();
  }, []);

  // Fetch data only if auth is done AND user is authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (!authenticated || !authChecked) return;

      setLoading(true);
      try {
        const allEvents = await getEvents();
        const filteredEvents =
          currentCity === "See all cities"
            ? allEvents
            : allEvents.filter((event) => event.location === currentCity);

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
  }, [authenticated, authChecked, currentCity, currentNOE]);

  return (
    <AuthWrapper>
      <div className="App">
        <h1>Meet App</h1>

        {error && <div className="error" data-testid="error">{error}</div>}
        {loading && <div data-testid="loading">Loading events...</div>}

        {authChecked && authenticated && !loading && (
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

        {authChecked && !authenticated && (
          <p>Please log in to view events.</p>
        )}
      </div>
    </AuthWrapper>
  );
};

export default App;



