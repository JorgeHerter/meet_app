import React, { useState } from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE }) => {
  const maxEvents = 50; // Set a maximum limit
  const minEvents = 1; // Set a minimum limit
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  // Handle changes to the input field
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);

    // Check if value is a number
    if (isNaN(value)) {
      return;
    }

    // Ensure the value is within the allowed range
    const boundedValue = Math.max(minEvents, Math.min(maxEvents, value));

    // Set feedback for out of range values
    if (value < minEvents || value > maxEvents) {
      setIsOutOfRange(true);
    } else {
      setIsOutOfRange(false);
    }

    setCurrentNOE(boundedValue);
  };

  return (
    <div id="number-of-events" data-testid="number-of-events">
      <label htmlFor="number-of-events-input">
        Number of events (between {minEvents} and {maxEvents}):
      </label>
      <input
        id="number-of-events-input"
        type="number"
        value={currentNOE}
        onChange={handleInputChange}
        min={minEvents}
        max={maxEvents}
        aria-label="Number of events"
      />
      {isOutOfRange && (
        <p style={{ color: 'red' }}>
          Please enter a number between {minEvents} and {maxEvents}.
        </p>
      )}
    </div>
  );
};

export default NumberOfEvents;

