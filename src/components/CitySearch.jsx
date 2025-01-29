// CitySearch.js
/*import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations = [], setCurrentCity }) => {  // Add setCurrentCity prop
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  //const [debouncedQuery, setDebouncedQuery] = useState(query);

 
  useEffect(() => {
     
      const filteredLocations = allLocations.filter((location) =>
        location.toUpperCase().includes(toUpperCase())
      );
      setSuggestions(filteredLocations);
  
  }, [allLocations]);

  const handleInputChanged = (event) => {
    setQuery(event.target.value);
    
    const filteredLocations = allLocations.filter((location) =>
      location.toUpperCase().includes(event.target.value.toUpperCase())
    );
    console.log(allLocations);
    console.log(filteredLocations);
    setShowSuggestions(true);
  };

  const handleItemClicked = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setCurrentCity(suggestion);  // Update the selected city in parent component
  };

  return (
    <div id="city-search" data-testid="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
        aria-label="Search for a city"
      />
      {showSuggestions && query && (
        <ul className="suggestions" role="listbox">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleItemClicked(suggestion)}  // Pass suggestion directly
                role="option"
                aria-label={`Select ${suggestion}`}
              >
                {suggestion}
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
          <li 
            key="See all cities" 
            onClick={() => handleItemClicked("See all cities")}
            role="option"
            aria-label="See all cities"
          >
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;*/

// src/components/CitySearch.jsx
// src/components/CitySearch.jsx

// src/components/CitySearch.jsx

import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations, setCurrentCity }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query === '') {
      setSuggestions([]);
    }
  }, [query]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    const filteredLocations = allLocations
      ? allLocations.filter((location) =>
          location.toUpperCase().includes(value.toUpperCase())
        )
      : [];

    setQuery(value);
    setSuggestions(filteredLocations);
  };

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value); // Set the current city in the parent component (App)
  };

  return (
    <div id="city-search" data-testid="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />
      {showSuggestions ? (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              onClick={handleItemClicked}
              key={`${suggestion}-${index}`} // Combine suggestion with the index to make it unique
            >
              {suggestion}
            </li>
          ))}
          <li key="See all cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default CitySearch;





