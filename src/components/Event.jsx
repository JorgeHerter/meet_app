import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Toggle the details visibility
  const toggleDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  return (
    <div className="event">
      {/* Event Title */}
      <h2>{event.summary}</h2>

      {/* Event Start Time */}
      <p>{new Date(event.created).toLocaleString()}</p>

      {/* Event Location */}
      <p>{event.location}</p>

      {/* Button to Show/Hide Details */}
      <button onClick={toggleDetails}>
        {showDetails ? 'Hide details' : 'Show details'}
      </button>

      {/* Event Details Section (Visible when showDetails is true) */}
      {showDetails && (
        <div className="event-details">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Attendees:</strong> {event.attendees.join(', ')}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default Event;