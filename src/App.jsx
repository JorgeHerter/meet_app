
// src/App.jsx
import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents, isAuthenticated, startOAuthProcess } from './api';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Function to fetch events
  const fetchData = async () => {
    try {
      setLoading(true);
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

  // Auth and mock mode logic
  useEffect(() => {
    const initializeApp = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const isMock = searchParams.get('mock') === 'true';

      if (isMock) {
        console.log("🧪 Running in mock mode — skipping real authentication");
        localStorage.setItem('mock', 'true');
        sessionStorage.setItem('access_token', 'test-token');
        setAuthenticated(true);
        return;
      }

      const isAuth = await isAuthenticated();
      if (!isAuth) {
        console.log("🔐 User not authenticated, starting OAuth process...");
        await startOAuthProcess();
      } else {
        console.log("✅ User authenticated");
        setAuthenticated(true);
      }
    };

    initializeApp();
  }, []);

  // Load events once authenticated or when filters change
  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, currentCity, currentNOE]);

  return (
    <div className="App">
      <h1>Meet App</h1>

      {localStorage.getItem('mock') === 'true' && (
        <div style={{ color: 'green' }}>✅ Mock Mode Enabled</div>
      )}

      {error && <div className="error" data-testid="error">{error}</div>}

      {loading ? (
        <div data-testid="loading">Loading events...</div>
      ) : (
        <>
          <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
          <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
          <EventList events={events} />
        </>
      )}
    </div>
  );
};

export default App;




