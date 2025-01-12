// src/components/NumberOfEvents.jsx
import React, { useState } from 'react';

const NumberOfEvents = () => {
  const [numberOfEvents, setNumberOfEvents] = useState(32);

  // Handle changes to the input field
  const handleInputChange = (event) => {
    // Ensure the value is a number before updating
    const value = event.target.value;
    if (value >= 0) { // Optional: Ensuring non-negative values
      setNumberOfEvents(value);
    }
  };

  return (
    <div>
      <label htmlFor="numberOfEvents">Number of events:</label>
      <input
        id="numberOfEvents"
        type="number"
        value={numberOfEvents}
        onChange={handleInputChange}
        min="0" // Optional: Preventing negative numbers
        step="1" // Optional: Increment by 1
        aria-label="Number of events" // Ensuring accessibility
      />
    </div>
  );
};

export default NumberOfEvents;

