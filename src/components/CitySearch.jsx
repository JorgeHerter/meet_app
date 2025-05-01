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

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(allLocations); // Initialize with all locations
  }, [allLocations]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);
  
    if (!allLocations) return;
  
    const filteredLocations = allLocations.filter((location) => {
      const locationStr = typeof location === 'string' ? location : location.label;
      return locationStr.toUpperCase().includes(value.toUpperCase());
    });
  
    setSuggestions(filteredLocations);
  
    const infoText = filteredLocations.length === 0
      ? "We can not find the city you are looking for. Please try another city"
      : "";
  
    setInfoAlert(infoText);
  };
  
  const handleItemClicked = (event) => {
    const value = String(event.target.textContent).trim();
    console.log("Clicked on city:", value);
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value);
    setInfoAlert(""); // Clear the info alert when a city is selected
  };

  return (
    <div id="city-search" className="city-search" data-testid="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        data-testid="city-input"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />
      {showSuggestions && (
        <ul className="suggestions" data-testid="suggestions-list">
          {suggestions.map((suggestion, index) => {
            const label = typeof suggestion === 'string' ? suggestion : suggestion.label;
            return (
    <li
      data-testid="city-suggestion-item"
      key={index}
      onClick={handleItemClicked}
    >
      {label}
    </li>
  );
})}

          <li key="See all cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;










