import React from 'react';
import { render, screen } from '@testing-library/react';
import EventList from '../components/EventList';

// Mock event fetching function
const getEvents = async () => {
  return [
    { id: 1, summary: "Event 1", location: "Berlin" },
    { id: 2, summary: "Event 2", location: "Paris" },
    { id: 3, summary: "Event 3", location: "New York" },
    { id: 4, summary: "Event 4", location: "London" }
  ]; // Mocking events for testing purposes
};

describe('<EventList /> component', () => {
  
  test('has an element with "list" role', () => {
    render(<EventList events={[]} />);
    expect(screen.queryByRole("list")).toBeInTheDocument();
  });

  test('renders correct number of events', () => {
    render(<EventList events={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  test('renders correct number of events asynchronously', async () => {
    const allEvents = await getEvents();  // Fetching events asynchronously
    render(<EventList events={allEvents} />);
    
    // Asserting the correct number of list items is rendered
    expect(await screen.findAllByRole('listitem')).toHaveLength(allEvents.length);
  });
});
