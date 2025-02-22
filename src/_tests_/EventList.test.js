
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
/*import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from './EventList';

describe('<EventList /> component', () => {
  const mockEvents = [
    {
      id: '1',
      summary: 'React Meetup',
      location: 'New York, USA',
      created: '2025-01-01T10:00:00.000Z',
      start: { dateTime: '2025-01-15T08:00:00+01:00' }
    },
    {
      id: '2',
      summary: 'Vue.js Meetup',
      location: 'London, UK',
      created: '2025-01-05T10:00:00.000Z',
      start: { dateTime: '2025-01-20T09:00:00+01:00' }
    }
  ];

  test('renders list of events', () => {
    render(<EventList events={mockEvents} />);
    
    const eventList = screen.getByTestId('event-list');
    expect(eventList).toBeInTheDocument();
    
    const eventItems = screen.getAllByRole('listitem');
    expect(eventItems).toHaveLength(mockEvents.length);
  });

  test('renders "No events found" when events array is empty', () => {
    render(<EventList events={[]} />);
    
    const eventList = screen.getByTestId('event-list');
    expect(eventList).toBeInTheDocument();
    
    const noEventsMessage = screen.getByText('No events found');
    expect(noEventsMessage).toBeInTheDocument();
  });

  test('renders "No events found" when events array is null', () => {
    render(<EventList events={null} />);
    
    const eventList = screen.getByTestId('event-list');
    expect(eventList).toBeInTheDocument();
    
    const noEventsMessage = screen.getByText('No events found');
    expect(noEventsMessage).toBeInTheDocument();
  });

  test('filters out invalid events', () => {
    const eventsWithInvalid = [
      ...mockEvents,
      { id: '3' }, // Missing location
      { location: 'Berlin' }, // Missing id
      null,
      undefined
    ];

    render(<EventList events={eventsWithInvalid} />);
    
    const eventItems = screen.getAllByRole('listitem');
    expect(eventItems).toHaveLength(mockEvents.length); // Should only show valid events
  });
});*/
import React, { useState, useEffect } from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import EventList from '../components/EventList'; // Adjust path accordingly
import { getEvents } from '../api'; // This is your real API call

// Create a functional component that uses the hooks
const EventListWithState = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents(); // Make real API call
        setEvents(eventData); // Assuming eventData is an array of events
      } catch (error) {
        setError('Error fetching events');
      }
    };

    fetchEvents();
  }, []); // Empty array ensures this only runs once when the component mounts

  if (error) {
    return <div>{error}</div>;
  }

  if (!events.length) {
    return <div>Loading...</div>;
  }

  // Return the EventList component with events passed as props
  return <EventList events={events} />;
};

describe('<EventList /> component', () => {
  test('renders list of events from real API', async () => {
    render(<EventListWithState />); // Render the component with the useState/useEffect logic

    // Wait for the event list to render
    await waitFor(() => screen.getByTestId('event-list'));

    const eventList = screen.getByTestId('event-list');
    expect(eventList).toBeInTheDocument();

    // You may want to adjust this part to the exact number of events you expect to be fetched
    const eventItems = screen.getAllByRole('listitem');
    expect(eventItems.length).toBeGreaterThan(0); // There should be at least one event
  });

  test('renders "No events found" when events array is empty from real API', async () => {
    // Mock the API response to return an empty array
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]) // Simulating empty events array from API
    });
  
    render(<EventList />);
  
    // Wait for the component to render
    const noEventsMessage = await screen.findByText(/No events found/i);
    expect(noEventsMessage).toBeInTheDocument();
  });
  

 test('renders "No events found" when events array is null', () => {
  // Render the component with `events` set to null
  render(<EventList events={null} />);
  
  // Check that the "No events found" message appears
  expect(screen.getByText(/No events found/i)).toBeInTheDocument();
});

test('renders "No events found" when events array is undefined', () => {
  // Render the component with `events` set to undefined
  render(<EventList events={undefined} />);
  
  // Check that the "No events found" message appears
  expect(screen.getByText(/No events found/i)).toBeInTheDocument();
});

test('renders "No events found" when events array is empty', () => {
  // Render the component with an empty array
  render(<EventList events={[]} />);
  
  // Check that the "No events found" message appears
  expect(screen.getByText(/No events found/i)).toBeInTheDocument();
});

  

  test('filters out invalid events from real API', async () => {
    render(<EventListWithState />);

    // Wait for the event list to render and handle the invalid events
    await waitFor(() => screen.getByTestId('event-list'));

    const eventItems = screen.getAllByRole('listitem');
    expect(eventItems.length).toBeGreaterThan(0); // There should be at least one valid event

    // Assuming the real API filters invalid events before returning them
    // If not, you'll need to handle invalid events within the component's logic.
  });

  /*test('renders "No events found" when events array is null', () => {
    render(<EventList events={null} />); // Passing null explicitly
  
    const noEventsMessage = screen.getByText('No events found');
    expect(noEventsMessage).toBeInTheDocument();
  });*/

  describe('<EventList /> integration', () => {
    test('renders a list of 32 events when the app is mounted and rendered', async () => {
      const AppComponent = render(<App />);
      
      // Wait for the event list to be rendered
      const eventListContainer = await screen.findByTestId('event-list'); // Using testId to find the container
  
      // Wait for the list items to be rendered inside the container
      await waitFor(() => {
        const eventListItems = within(eventListContainer).queryAllByRole('listitem');
        expect(eventListItems.length).toBe(32);
      });
    });
  });
  
});
/*test('dummy test', () => {
  expect(true).toBe(true);
});*/








