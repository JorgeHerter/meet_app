// src/App.jsx
import React from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';

const App = () => {
  return (
    <div className="App">
      <CitySearch />
      <EventList events={[]} />
    </div>
  );
};

export default App;

