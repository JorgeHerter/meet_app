import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false); // Whether to show suggestions or not
  const [query, setQuery] = useState(''); // User input query
  const [suggestions, setSuggestions] = useState([]); // Filtered city suggestions
  const [debouncedQuery, setDebouncedQuery] = useState(query); // Debounced query to reduce frequent updates

  // Debounce the input value to delay the suggestions update
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query); // Update debounced query after the user stops typing for 300ms
    }, 300);

    return () => clearTimeout(timer); // Cleanup timeout on query change
  }, [query]);

  // Update suggestions based on debouncedQuery
  useEffect(() => {
    if (debouncedQuery) {
      // Filter all locations based on the debounced query
      const filteredLocations = allLocations.filter((location) =>
        location.toUpperCase().includes(debouncedQuery.toUpperCase()) // Case insensitive match
      );
      setSuggestions(filteredLocations); // Set the filtered locations as suggestions
    } else {
      setSuggestions([]); // Clear suggestions when query is empty
    }
  }, [debouncedQuery, allLocations]);

  // Handle changes in the input field
  const handleInputChanged = (event) => {
    setQuery(event.target.value); // Update query on input change
    setShowSuggestions(true); // Show suggestions as the user types
  };

  // Handle clicking on a suggestion
  const handleItemClicked = (event) => {
    const value = event.target.textContent; // Get the clicked suggestion
    setQuery(value); // Update the input with the selected city
    setShowSuggestions(false); // Hide the suggestions list
  };

  return (
    <div id="city-search" data-testid="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
        onChange={handleInputChanged} // Handle input change
        aria-label="Search for a city"
      />
      {showSuggestions && query && (
        <ul className="suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={handleItemClicked} // Handle item click
                role="option"
                aria-label={`Select ${suggestion}`}
              >
                {suggestion}
              </li>
            ))
          ) : (
            <li>No results found</li> // Message when no matching cities are found
          )}
          <li key="See all cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
