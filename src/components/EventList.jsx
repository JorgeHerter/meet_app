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

const EventList = ({ events = [] }) => {
  const validEvents = Array.isArray(events)
    ? events.filter(event => event && event.location)
    : [];

    return (
      <>
        {validEvents.length === 0 ? (
          <p data-testid="no-events-msg">No events found</p>
        ) : (
          <ul id="event-list" data-testid="event-list">
            {validEvents.map(event => (
              <ul
                key={event.id}
                role="listitem"
                data-testid="event-item"
              >
                <Event event={event} />
              </ul>
            ))}
          </ul>
        )}
      </>
    );    
};

export default EventList;















