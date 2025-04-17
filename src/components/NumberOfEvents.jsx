import React, { useState } from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE }) => {
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    let value = parseInt(event.target.value, 10);

    // Validate the input value
    if (isNaN(value) || value < 1) {
      value = 1;
      setError('Please enter a number between 1 and 50');
    } else if (value > 50) {
      value = 50;
      setError('Please enter a number between 1 and 50');
    } else {
      setError(''); // Clear error if value is valid
    }

    setCurrentNOE(value); // Update the parent state
  };

  return (
    <div data-testid="number-of-events" id="number-of-events">
      <label htmlFor="number-of-events-input">
        Number of events (between 1 and 50):
      </label>
      <input
        id="number-of-events-input"
        type="number"
        min="1"
        max="50"
        value={currentNOE}
        onChange={handleInputChange}
        role="spinbutton"
        aria-label="Number of events"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default NumberOfEvents;

