import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the input value to delay the suggestions update
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);  // Adjust time as needed (e.g., 500ms delay)

    // Clean up the timeout if the query changes before the delay
    return () => clearTimeout(timer);
  }, [query]);

  // Update suggestions based on debouncedQuery
  useEffect(() => {
    if (debouncedQuery) {
      const filteredLocations = allLocations.filter((location) =>
        location.toUpperCase().includes(debouncedQuery.toUpperCase())
      );
      setSuggestions(filteredLocations);
    } else {
      setSuggestions([]); // Clear suggestions when the query is empty
    }
  }, [debouncedQuery, allLocations]);

  // Handle changes in the input field
  const handleInputChanged = (event) => {
    setQuery(event.target.value);
  };

  // Handle clicking on a suggestion
  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);          // Update the textbox with the clicked suggestion
    setShowSuggestions(false); // Hide the suggestions list
  };

  return (
    <div id="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />
      {showSuggestions && query && (
        <ul className="suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((city, index) => (
              <li key={index} onClick={handleItemClicked}>{city}</li>
            ))
          ) : (
            <li>No cities found</li>
          )}
          <li key="see-all-cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
