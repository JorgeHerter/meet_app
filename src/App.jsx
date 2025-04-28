
// src/App.jsx
/*import React, { useEffect, useState } from 'react';
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
  /*useEffect(() => {
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
  }, []);*/

  // Load events once authenticated or when filters change
  /*useEffect(() => {
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

export default App;*/
import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import {
  extractLocations,
  getEvents,
  isAuthenticated,
  startOAuthProcess,
} from './api';
import './App.css';
import * as atatus from 'atatus-spa';

// Initialize Atatus unconditionally for more reliable error tracking
try {
  console.log("🔄 Initializing Atatus...");
  atatus.config('b1b3462ff17349bd90559fb62636d727')
    .instrumentXHR()  // Track AJAX/fetch requests
    .captureConsoleErrors()  // Capture console errors
    .install();
  console.log("✅ Atatus initialized successfully");
} catch (err) {
  console.error("❌ Error initializing Atatus:", err);
}

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [astatusStatus, setAtatusStatus] = useState('Unknown');

  const isMockMode =
    window.location.hostname === 'localhost' ||
    new URLSearchParams(window.location.search).get('mock') === 'true';

  // Check if Atatus is properly loaded
  useEffect(() => {
    try {
      const astatusAvailable = typeof atatus !== 'undefined' && typeof atatus.notify === 'function';
      setAtatusStatus(astatusAvailable ? 'Available' : 'Not available');
      console.log("Atatus status:", astatusAvailable ? "Available" : "Not available");
    } catch (err) {
      console.error("Error checking Atatus status:", err);
      setAtatusStatus('Error');
    }
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const isMock = searchParams.get('mock') === 'true';
      const isLocalhost = window.location.hostname === 'localhost';

      if (isMock || isLocalhost) {
        console.log("🧪 Mock or local mode — skipping authentication");
        localStorage.setItem('mock', 'true');
        sessionStorage.setItem('access_token', 'test-token');
        setAuthenticated(true);
        return;
      }

      try {
        const isAuth = await isAuthenticated();
        if (!isAuth) {
          console.log("🔐 User not authenticated, starting OAuth process...");
          await startOAuthProcess();
        } else {
          console.log("✅ User authenticated");
          setAuthenticated(true);
        }
      } catch (authError) {
        console.error("❌ Authentication error:", authError);
        setError('Authentication failed. Please try again.');
        // Report auth error to Atatus
        try {
          atatus.notify(authError);
        } catch (e) {
          console.error("❌ Failed to report auth error to Atatus:", e);
        }
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, currentCity, currentNOE]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching events...");
      const allEvents = await getEvents();
      const filteredEvents =
        currentCity === 'See all cities'
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);

      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
      console.log("📦 Events loaded:", filteredEvents.length);
    } catch (err) {
      console.error('❌ Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      // Report data fetch error to Atatus
      try {
        atatus.notify(err);
      } catch (e) {
        console.error("❌ Failed to report data error to Atatus:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestError = () => {
    try {
      console.log("🧪 Testing Atatus error reporting");
      atatus.notify(new Error('Test Atatus Setup'));
      console.log("📤 Error sent to Atatus");
      alert("Test error sent to Atatus. Check Atatus dashboard.");
    } catch (err) {
      console.error("❌ Failed to send test error to Atatus:", err);
      alert("Failed to send error to Atatus: " + err.message);
    }
  };

  return (
    <div className="App">
      <h1>Meet App</h1>

      {/* Button to test Atatus error reporting */}
      <button onClick={handleTestError}>
        Test Atatus Setup
      </button>
      
      <div style={{ fontSize: '10px', color: 'gray', marginTop: '5px' }}>
        Atatus Status: {astatusStatus}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {authenticated && (
          <div data-testid="auth-status" style={{ color: 'green' }}>
            🟢 Authenticated
          </div>
        )}
        {isMockMode && (
          <div style={{ color: 'green' }} data-testid="mock-status">
            ✅ Mock Mode Enabled
          </div>
        )}
      </div>

      {error && (
        <div className="error" data-testid="error">
          {error}
        </div>
      )}

      {loading ? (
        <div data-testid="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div data-testid="no-events">No events found.</div>
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
      
      <div style={{ fontSize: '10px', color: 'gray', marginTop: '20px' }}>
        Environment: {process.env.NODE_ENV || 'not set'}
      </div>
    </div>
  );
};

export default App;




  






