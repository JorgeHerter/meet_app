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

  // 🔐 Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        await startOAuthProcess(); // Will redirect if needed
        return;
      }
      setAuthReady(true);
    };
    checkAuth();
  }, []);

  // 🛑 Don't fetch data until authenticated
  useEffect(() => {
    if (!authReady) return;

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
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [authReady, currentCity, currentNOE]);

  if (!authReady) return <div>🔐 Logging you in, please wait...</div>;

  return (
    <div className="App">
      <h1>Meet App</h1>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Loading events...</div>
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


