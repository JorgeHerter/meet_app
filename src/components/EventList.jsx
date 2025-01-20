//src\components\EventList.jsx
import React from 'react';
import Event from './Event'; // Import the Event component

const EventList = ({ events = [] }) => {
  console.log(events); 
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

export default EventList;





