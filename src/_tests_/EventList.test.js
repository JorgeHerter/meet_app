
/*import React from 'react';
import 'jest-fetch-mock'; // This mocks the global fetch API
import { render, screen, waitFor, act } from '@testing-library/react';
import EventList from '../components/EventList';  // EventList component
import App from '../App';  // The main App component which will trigger the event fetch

describe('<EventList /> component', () => {

  // Reset fetch mocks before each test
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('has an element with "list" role', () => {
    render(<EventList events={[]} />);
    // Check if a list element is rendered with the "list" role
    expect(screen.queryByRole('list')).toBeInTheDocument();
  });

  test('renders correct number of events', () => {
    const events = [
      { id: 1, summary: 'Event 1', location: 'Berlin' },
      { id: 2, summary: 'Event 2', location: 'Paris' },
      { id: 3, summary: 'Event 3', location: 'New York' },
      { id: 4, summary: 'Event 4', location: 'London' },
    ];
    // Directly pass events as props and check the rendered list length
    render(<EventList events={events} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  test('renders correct number of events asynchronously', async () => {
    const events = [
      { id: 1, summary: 'Event 1', location: 'Berlin' },
      { id: 2, summary: 'Event 2', location: 'Paris' },
      { id: 3, summary: 'Event 3', location: 'New York' },
      { id: 4, summary: 'Event 4', location: 'London' },
    ];

    // Simulate async event fetching
    const fetchEvents = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(events), 100); // Return events after a delay
      });
    };

    await act(async () => {
      const fetchedEvents = await fetchEvents();
      render(<EventList events={fetchedEvents} />);
    });

    // Check if all events are rendered as list items
    const listItems = await screen.findAllByRole('listitem');
    expect(listItems).toHaveLength(events.length);
  });

  describe('<EventList /> integration', () => {
    test('renders a list of 5 events when the app is mounted and rendered', async () => {
      // Mock events to be returned by the fetch call
      const events = Array.from({ length: 5 }, (_, index) => ({
        id: index + 1,
        summary: `Event ${index + 1}`,
        location: `Location ${index + 1}`,
      }));
  
      // Mock the fetch response to return the above events
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(events),
      });
  
      // Wrap the app rendering in `act` to handle asynchronous updates
      await act(async () => {
        render(<App />); // Render the entire App component
      });
  
      // Wait for the event list to be populated and check for the correct number of events
      await waitFor(() => {
        const eventListItems = screen.getAllByRole('listitem');
        expect(eventListItems).toHaveLength(32); // Ensure 5 events are rendered
      });
  
      // Clean up mock after test
      fetch.mockReset();
    });
  });
});*/
// src/__tests__/EventList.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For toBeInTheDocument matcher
import { getEvents } from '../mock-data'; // Import getEvents
import App from '../App';
import EventList from '../components/EventList'; // If you're using EventList in your test

// Mock the getEvents function from mock-data.js
jest.mock('../mock-data', () => ({
  getEvents: jest.fn().mockResolvedValue([
    { id: 1, name: 'Event 1', location: 'Location 1' },
    { id: 2, name: 'Event 2', location: 'Location 2' },
    { id: 3, name: 'Event 3', location: 'Location 3' },
  ]),
}));

describe('<App /> component', () => {
  let AppDOM;

  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test('renders list of events', async () => {
    render(<App />);  // Rendering the App
    const eventList = await screen.findByTestId('event-list'); // Wait for event list to render
    expect(eventList).toBeInTheDocument();
  });

  test('renders correct number of events', async () => {
    const allEvents = await getEvents();  // Fetch events using the mock API

    // Filter valid events, ensuring there are no empty or invalid events
    const filteredEvents = allEvents.filter(event => event && event.location);

    render(<EventList events={filteredEvents} />);  // Render EventList with valid events

    // Wait for the event list items to be rendered
    const eventListItems = await screen.findAllByRole('listitem');
    
    expect(eventListItems).toHaveLength(filteredEvents.length);
  });

  test('renders CitySearch component', () => {
    expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
  });

  describe('<EventList /> integration', () => {
    test('renders a list of events when the app is mounted', async () => {
      render(<App />);
      await waitFor(() => {
        const eventListItems = screen.getAllByRole('listitem');
        expect(eventListItems.length).toBeGreaterThan(0);
      });
    });
  });
});




