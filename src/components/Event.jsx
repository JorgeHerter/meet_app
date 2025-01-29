/*import React, { useState } from 'react';

const Event = ({ event }) => {

  const [showDetails, setShowDetails] = useState(false);

  // Toggle the details visibility
  const toggleDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  return (
    <div className="event">
      
      <h2>{event.summary}</h2>

      
      <p>{new Date(event.created).toLocaleString()}</p>

      
      <p>{event.location}</p>

      
      <button onClick={toggleDetails}>
        {showDetails ? 'Hide details' : 'Show details'}
      </button>

      
      {showDetails && (
        <div className="event-details">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Attendees:</strong> {event.attendees.join(', ')}</p>
          
        </div>
      )}
    </div>
  );
};

export default Event;*/
// src/components/Event.jsx
import React, { useState } from "react";

// Utility function for formatting date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  // Destructuring event.start safely
  const { start, location, created, summary, description, hangoutLink } = event;
  const startDateTime = start?.dateTime || "N/A";  // Fallback if dateTime is not available
  const formattedStartTime = startDateTime === "N/A" ? startDateTime : formatDate(startDateTime);

  return (
    <div className="event">
      <h3>{summary}</h3>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Created:</strong> {new Date(created).toLocaleString()}</p>
      <p><strong>Start Time:</strong> {formattedStartTime}</p>
      <button onClick={toggleDetails}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>

      {showDetails && (
        <div className="event-details">
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Hangout Link:</strong> <a href={hangoutLink} target="_blank" rel="noopener noreferrer">Join here</a></p>
        </div>
      )}
    </div>
  );
};

export default Event;

