
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
  isLocalMode,
  isMockMode
} from './api';
import './App.css';
import * as atatus from 'atatus-spa';

// Global variable to track if Atatus was initialized successfully
let astatusInitialized = false;
let astatusDisabledByDev = false;

// Determine if we should allow Atatus testing in development
const allowAtatusInDev = localStorage.getItem('allow_atatus_in_dev') === 'true';
const inDevMode = window.location.hostname === 'localhost' || 
                  new URLSearchParams(window.location.search).get('mock') === 'true';

// Initialize Atatus with environment checks
try {
  // Skip Atatus in development mode unless explicitly enabled
  if (!inDevMode || allowAtatusInDev) {
    console.log(`🔄 Initializing Atatus... (${inDevMode ? 'DEV mode with testing enabled' : 'PRODUCTION mode'})`);
    
    // Initialize Atatus properly
    const astatusConfig = atatus.config('b1b3462ff17349bd90559fb62636d727', {
      // Set appropriate release stage
      releaseStage: inDevMode ? 'development' : 'production'
    });
    
    // Check if methods exist before calling them
    if (typeof astatusConfig.instrumentXHR === 'function') {
      astatusConfig.instrumentXHR();
    }
    
    if (typeof astatusConfig.captureConsoleErrors === 'function') {
      astatusConfig.captureConsoleErrors();
    }
    
    if (typeof astatusConfig.install === 'function') {
      astatusConfig.install();
    }
    
    astatusInitialized = true;
    console.log("✅ Atatus initialized successfully");
  } else {
    console.log("🛠 Dev mode - Atatus monitoring disabled by default");
    astatusDisabledByDev = true;
  }
} catch (err) {
  console.error("❌ Error initializing Atatus:", err);
  astatusInitialized = false;
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
  const [astatusDevEnabled, setAtatusDevEnabled] = useState(allowAtatusInDev);

  // Check if we're in mock mode using the utility functions
  const mockModeActive = isLocalMode() || isMockMode();

  // Check if Atatus is properly loaded
  useEffect(() => {
    try {
      const astatusAvailable = typeof atatus !== 'undefined' && typeof atatus.notify === 'function';
      
      if (mockModeActive && !astatusDevEnabled) {
        setAtatusStatus('Disabled in dev mode (can enable)');
      } else if (astatusInitialized) {
        setAtatusStatus(mockModeActive ? 'Enabled in dev mode' : 'Available');
      } else {
        setAtatusStatus(astatusAvailable ? 'Available but not initialized' : 'Not available');
      }
      
      console.log("Atatus status:", astatusStatus);
    } catch (err) {
      console.error("Error checking Atatus status:", err);
      setAtatusStatus('Error');
    }
  }, [mockModeActive, astatusDevEnabled, astatusStatus]);

  useEffect(() => {
    const initializeApp = async () => {
      if (mockModeActive) {
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
        // Report auth error to Atatus if available
        reportToAtatus(authError);
      }
    };

    initializeApp();
  }, [mockModeActive]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, currentCity, currentNOE]);

  // Helper function to safely report errors to Atatus
  const reportToAtatus = (error) => {
    try {
      // Only report if Atatus is initialized or explicitly enabled in dev
      if ((astatusInitialized || astatusDevEnabled) && typeof atatus?.notify === 'function') {
        console.log("📤 Reporting error to Atatus");
        atatus.notify(error);
        return true;
      }
      return false;
    } catch (e) {
      console.error("❌ Failed to report to Atatus:", e);
      return false;
    }
  };

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
      reportToAtatus(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Atatus in development mode
  const toggleAtatusInDev = () => {
    if (!mockModeActive) {
      alert("This option is only available in development mode");
      return;
    }
    
    const newState = !astatusDevEnabled;
    setAtatusDevEnabled(newState);
    localStorage.setItem('allow_atatus_in_dev', newState.toString());
    
    if (newState && astatusDisabledByDev) {
      // Re-initialize Atatus if it was previously disabled
      try {
        console.log("🔄 Re-initializing Atatus for development testing");
        const astatusConfig = atatus.config('b1b3462ff17349bd90559fb62636d727', {
          releaseStage: 'development'
        });
        
        if (typeof astatusConfig.instrumentXHR === 'function') astatusConfig.instrumentXHR();
        if (typeof astatusConfig.captureConsoleErrors === 'function') astatusConfig.captureConsoleErrors();
        if (typeof astatusConfig.install === 'function') astatusConfig.install();
        
        astatusInitialized = true;
        astatusDisabledByDev = false;
        console.log("✅ Atatus re-initialized for development");
        alert("Atatus has been enabled for testing. Please refresh the page for all features to work properly.");
      } catch (err) {
        console.error("❌ Error initializing Atatus:", err);
        alert("Failed to initialize Atatus: " + err.message);
      }
    } else if (!newState) {
      alert("Atatus has been disabled. Please refresh the page for changes to take effect.");
    }
  };

  const handleTestError = () => {
    try {
      console.log("🧪 Starting Atatus error test");
  
      if (mockModeActive && !astatusDevEnabled) {
        console.log("⚠️ Atatus testing unavailable in dev mode without enabling");
        alert("Atatus is disabled in development mode. Toggle 'Enable Atatus in Dev' to test.");
        return;
      }
  
      // Check if atatus is properly initialized
      if (!astatusInitialized || typeof atatus !== 'object' || typeof atatus.notify !== 'function') {
        const initError = new Error('Atatus is not initialized correctly');
        console.error("❌", initError);
        throw initError;
      }
  
      // Create a test error and report it to Atatus
      const testError = new Error('Test Atatus Setup');
      const reported = reportToAtatus(testError);
      
      if (reported) {
        console.log("📤 Test error sent to Atatus");
        setTimeout(() => alert("Test error sent to Atatus. Check Atatus dashboard."), 100);
      } else {
        throw new Error("Failed to send test error to Atatus");
      }
    } catch (err) {
      console.error("❌ Failed in handleTestError:", err);
      reportToAtatus(err);
  
      // Use fallback alert
      try {
        alert("Error sending test error to Atatus: " + err.message);
      } catch (e) {
        console.warn("⚠️ Also failed to show fallback alert:", e);
      }
    }
  };
  
  return (
    <div className="App">
      <h1>Meet App</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        {/* Button to test Atatus error reporting */}
        <button onClick={handleTestError}>
          Test Atatus
        </button>
        
        {/* Only show toggle button in development mode */}
        {mockModeActive && (
          <button 
            onClick={toggleAtatusInDev}
            style={{ 
              backgroundColor: astatusDevEnabled ? '#e77' : '#7d7',
              color: 'white' 
            }}
          >
            {astatusDevEnabled ? 'Disable' : 'Enable'} Atatus in Dev
          </button>
        )}
      </div>
      
      <div style={{ fontSize: '10px', color: 'gray', marginTop: '5px' }}>
        Atatus Status: {astatusStatus}
      </div>

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




  






