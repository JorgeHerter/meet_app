import React from 'react';
import Event from "./Event";

const EventList = ({ events }) => {
  return (
    <ul id="event-list" data-testid="event-list">
      {events ? 
        events.map(event => (
          <li key={event.id} data-testid="event-item">  {/* Wrap each event in an <li> element */}
            <Event event={event} />
          </li>
        )) : 
        null}
    </ul>
  );
}

export default EventList;
