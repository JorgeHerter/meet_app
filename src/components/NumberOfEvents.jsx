import React, { useState } from 'react';

const NumberOfEvents = () => {
  const [numberOfEvents, setNumberOfEvents] = useState(32);
  const maxEvents = 50; // Set a maximum limit
  const minEvents = 1; // Set a minimum limit

  // Handle changes to the input field
  const handleInputChange = (event) => {
    let value = event.target.value;

    // Ensure the value is a number and within the allowed range (minEvents to maxEvents)
    value = Math.max(minEvents, Math.min(maxEvents, value)); // Ensure value is within bounds

    setNumberOfEvents(value);
  };

  return (
    <div>
      <label htmlFor="numberOfEvents">Number of events:</label>
      <input
        id="numberOfEvents"
        type="number"
        value={numberOfEvents}
        onChange={handleInputChange}
        min={minEvents} // Ensures no negative values
        max={maxEvents} // Limits input to maxEvents
        step="1" // Allows step increments of 1
        aria-label="Number of events" // Ensuring accessibility
      />
    </div>
  );
};

export default NumberOfEvents;

