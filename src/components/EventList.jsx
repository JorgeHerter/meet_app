//src\components\EventList.jsx
/*import React from 'react';
import Event from './Event'; // Import the Event component

const EventList = ({ events = [] }) => {
  
  return (
    <ul 
      id="event-list" 
      data-testid="event-list"
      role="list"
    >
      {events.length === 0 ? (
        <p>No events available.</p> // Placeholder when no events exist
      ) : (
        events.map((event, index) => (
          <li 
            key={event.id || index}  // Use event.id or index as a fallback
            data-testid="event-item"
            role="listitem"
          >
            <Event event={event} />  // Pass the event object to the Event component
          </li>
        ))
      )}
    </ul>
  );
};

export default EventList;*/

// src/components/EventList.jsx
import React from 'react';
import Event from './Event';

jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn((events) => [...new Set(events.map(e => e.location))]),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  startOAuthProcess: jest.fn()
}));


const EventList = ({ events = [] }) => { 
  // Default to an empty array if events is null or undefined

  // Filter out any invalid or empty events based on the assumption that 
  // a valid event should have a location property
  const validEvents = Array.isArray(events) 
    ? events.filter(event => event && event.location)
    : [];

  return (
    <ul id="event-list" data-testid="event-list">
      {validEvents.length > 0 ? (
        validEvents.map(event => (
          <li key={event.id} role="listitem">
            <Event event={event} />
          </li>
        ))
      ) : (
        // If there are no valid events, show "No events found"
        <li>No events found</li>
      )}
    </ul>
  );
};

export default EventList;















