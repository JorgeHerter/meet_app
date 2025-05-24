
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
/*import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents, isAuthenticated, startOAuthProcess, isLocalMode, isMockMode } from './api';
import './App.css';
import { InfoAlert, ErrorAlert } from './components/Alert';
import EventGenresChart from './components/EventGenresChart';
import CityEventsChart from './components/CityEventsChart';

// ======= Atatus Monitoring (Disabled) =======
/*
import * as atatus from 'atatus-spa';

let astatusInitialized = false;
let astatusDisabledByDev = false;

const allowAtatusInDev = localStorage.getItem('allow_atatus_in_dev') === 'true';
const inDevMode = window.location.hostname === 'localhost' || 
                  new URLSearchParams(window.location.search).get('mock') === 'true';

try {
  if (!inDevMode || allowAtatusInDev) {
    const astatusConfig = atatus.config('your-key', {
      releaseStage: inDevMode ? 'development' : 'production'
    });

    if (typeof astatusConfig.instrumentXHR === 'function') astatusConfig.instrumentXHR();
    if (typeof astatusConfig.captureConsoleErrors === 'function') astatusConfig.captureConsoleErrors();
    if (typeof astatusConfig.install === 'function') astatusConfig.install();

    astatusInitialized = true;
  } else {
    astatusDisabledByDev = true;
  }
} catch (err) {
  console.error("Error initializing Atatus:", err);
  astatusInitialized = false;
}
*/
// ============================================

/*const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  const mockModeActive = isLocalMode() || isMockMode();

  useEffect(() => {
    const initializeApp = async () => {
      if (mockModeActive) {
        localStorage.setItem('mock', 'true');
        sessionStorage.setItem('access_token', 'test-token');
        setAuthenticated(true);
        return;
      }
  
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
  
        if (code) {
          const response = await fetch(`https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeURIComponent(code)}`);
          const data = await response.json();
  
          if (data.access_token) {
            sessionStorage.setItem('access_token', data.access_token);
            setAuthenticated(true);
            // Clean up the URL to prevent loops
            window.history.replaceState({}, document.title, '/');
          } else {
            throw new Error('No access token in response');
          }
        } else {
          const isAuth = await isAuthenticated();
          if (!isAuth) {
            await startOAuthProcess();
          } else {
            setAuthenticated(true);
          }
        }
      } catch (authError) {
        console.error("Authentication error:", authError);
        setError('Authentication failed. Please try again.');
      }
    };
  
    initializeApp();
  }, [mockModeActive]);
  

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, currentCity, currentNOE]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allEvents = await getEvents();
      const filteredEvents =
        currentCity === 'See all cities'
          ? allEvents
          : allEvents.filter((event) =>
              event.location?.trim().toLowerCase() === currentCity.trim().toLowerCase()
            );

      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    } catch (err) {
      console.error('Fetch events error:', err);
      setError('Failed to load events. Please try again later.');
      setErrorAlert('Failed to load events. Please try again later.');
      // reportToAtatus(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Meet App</h1>
  
      <div style={{ marginBottom: '1rem' }}>
        {authenticated && (
          <div data-testid="auth-status" style={{ color: 'green' }}>
            🟢 Authenticated
          </div>
        )}
        {mockModeActive && (
          <div style={{ color: 'green' }} data-testid="mock-status">
            ✅ Mock Mode Enabled
          </div>
        )}
      </div>
  
      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {errorAlert && <ErrorAlert text={errorAlert} />}
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
            setInfoAlert={setInfoAlert}
          />
          <NumberOfEvents
            currentNOE={currentNOE}
            setCurrentNOE={setCurrentNOE}
          />
          <EventList events={events} />
  
          {events.length > 0 && allLocations.length > 0 && (
            <div className="charts-wrapper">
              <div className="charts-container">
                <div className="chart-wrapper">
                  <EventGenresChart events={events} />
                </div>
                <div className="chart-wrapper">
                  <CityEventsChart events={events} allLocations={allLocations} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
  
      <div style={{ fontSize: '10px', color: 'gray', marginTop: '20px' }}>
        Environment: {process.env.NODE_ENV || 'not set'}
      </div>
    </div>
  );  
};

export default App;*/

import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents, isAuthenticated, startOAuthProcess, isLocalMode, isMockMode } from './api';
import './App.css';
import { InfoAlert, ErrorAlert } from './components/Alert';
import EventGenresChart from './components/EventGenresChart';
import CityEventsChart from './components/CityEventsChart';

const App = () => {
  // === State Management ===
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  // Static flags - calculated once
  const mockModeActive = isLocalMode() || isMockMode();

  // === Authentication Process ===
  useEffect(() => {
    async function handleAuthentication() {
      if (mockModeActive) {
        localStorage.setItem('mock', 'true');
        sessionStorage.setItem('access_token', 'test-token');
        setAuthenticated(true);
        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
          const response = await fetch(`https://tlhsvksy0f.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeURIComponent(code)}`);
          const data = await response.json();

          if (data.access_token) {
            sessionStorage.setItem('access_token', data.access_token);
            setAuthenticated(true);
            window.history.replaceState({}, document.title, '/');
          } else {
            throw new Error('No access token in response');
          }
        } else {
          const isAuth = await isAuthenticated();
          if (!isAuth) {
            await startOAuthProcess();
          } else {
            setAuthenticated(true);
          }
        }
      } catch (authError) {
        console.error("Authentication error:", authError);
        setError('Authentication failed. Please try again.');
      }
    }

    handleAuthentication();
  }, []); // Only run once on component mount

  // === Initial Data Loading ===
  useEffect(() => {
    if (!authenticated) return;
    
    async function loadInitialData() {
      try {
        setLoading(true);
        const fetchedEvents = await getEvents();
        
        // Store all events and locations first
        setAllEvents(fetchedEvents);
        setAllLocations(extractLocations(fetchedEvents));
        
        // Then filter for display
        setEvents(fetchedEvents.slice(0, currentNOE));
      } catch (err) {
        console.error('Initial data loading error:', err);
        setError('Failed to load events. Please try again later.');
        setErrorAlert('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadInitialData();
  }, [authenticated]); // Only depends on authentication state
  
  // === Handle Filtering (without refetching) ===
  useEffect(() => {
    if (allEvents.length === 0) return;
    
    // Filter existing events based on city and number
    const filteredEvents = currentCity === 'See all cities'
      ? [...allEvents] // Create a new array to ensure state update
      : allEvents.filter(event => 
          event.location?.toLowerCase().trim() === currentCity.toLowerCase().trim()
        );
        
    setEvents(filteredEvents.slice(0, currentNOE));
  }, [currentCity, currentNOE, allEvents]); // Only run when filters change
  
  // === Main Render ===
  return (
    <div className="app-container">
      {/* Fixed header section */}
      <header className="app-header">
        <h1>Meet App</h1>
        
        <div className="status-indicators">
          {authenticated && <div className="status-badge success">🟢 Authenticated</div>}
          {/*mockModeActive && <div className="status-badge info">✅ Mock Mode</div>*/}
        </div>
      </header>

      {/* Main content with fixed dimensions */}
      <main className="app-main">
        {/* Alerts are positioned fixed, won't affect layout */}
        <div className="alerts-container">
          {infoAlert && <InfoAlert text={infoAlert} />}
          {errorAlert && <ErrorAlert text={errorAlert} />}
        </div>
        
        {/* Error display area */}
        <div className="error-container">
          {error && <div className="error-message">{error}</div>}
        </div>
        
        {/* Controls section - always rendered */}
        <section className="controls-section">
          <CitySearch
            allLocations={allLocations}
            setCurrentCity={setCurrentCity}
            setInfoAlert={setInfoAlert}
          />
          <NumberOfEvents
            currentNOE={currentNOE}
            setCurrentNOE={setCurrentNOE}
          />
        </section>

         {/* Charts section - always rendered with conditional content */}
         <section className="charts-section">
          {!loading && events.length > 0 && allLocations.length > 0 ? (
            <div className="charts-grid">
              <div className="chart-container">
                <EventGenresChart events={events} />
              </div>
              <div className="chart-container">
                <CityEventsChart events={events} allLocations={allLocations} />
              </div>
            </div>
          ) : (
            <div className="charts-placeholder"></div>
          )}
        </section>
        
        {/* Events list with placeholder */}
        <section className="events-section">
          {loading ? (
            <div className="loading-placeholder">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="empty-placeholder">No events found.</div>
          ) : (
            <EventList events={events} />
          )}
        </section>
        
        {/* Footer section */}
        <footer className="app-footer">
          <div className="environment-info">
            Environment: {process.env.NODE_ENV || 'not set'}
          </div>
        </footer>
      </main>

    </div>
  );
};

export default App;