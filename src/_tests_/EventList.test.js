
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
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from '../components/EventList';
import App from '../App';
import { getEvents } from '../api';

jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn((events) => [...new Set(events.map(e => e.location))]),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  startOAuthProcess: jest.fn(),
  isLocalMode: jest.fn().mockReturnValue(true),  // Mocked function
  isMockMode: jest.fn().mockReturnValue(false), // Mocked function
}));


// -------------------------
// 🔹 Utility Component for State-based Test
// -------------------------
const EventListWithState = () => {
  const [events, setEvents] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Error fetching events');
      }
    };
    fetchEvents();
  }, []);

  if (error) return <div>{error}</div>;
  if (!events || events.length === 0) return <div>No events found</div>;

  return <EventList events={events} />;
};

// -------------------------
// 🔹 Unit Tests
// -------------------------
describe('<EventList /> component', () => {
  test('renders list of valid events', () => {
    const validEvents = [
      { id: 1, summary: 'Event A', location: 'Berlin, Germany' },
      { id: 2, summary: 'Event B', location: 'Paris, France' },
    ];

    render(<EventList events={validEvents} />);

    const eventList = screen.getByTestId('event-list');
    expect(eventList).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(validEvents.length);
    expect(screen.getByText('Event A')).toBeInTheDocument();
    expect(screen.getByText('Event B')).toBeInTheDocument();
  });

  test('shows "No events found" for null', () => {
    render(<EventList events={null} />);
    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });

  test('shows "No events found" for undefined', () => {
    render(<EventList events={undefined} />);
    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });

  test('shows "No events found" for empty array', () => {
    render(<EventList events={[]} />);
    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });

  test('filters out invalid events', () => {
    const mixedEvents = [
      { id: 1, summary: 'Valid Event', location: 'Berlin' },
      { id: 2 }, // Invalid
      {},        // Invalid
    ];

    render(<EventList events={mixedEvents} />);

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1); // Only one valid
    expect(screen.getByText('Valid Event')).toBeInTheDocument();
  });
});

// -------------------------
// 🔹 Integration with useEffect & API
// -------------------------
describe('<EventListWithState /> integration', () => {
  test('loads and renders events from mocked API', async () => {
    getEvents.mockResolvedValue([
      { id: '1', summary: 'Fetched Event', location: 'London' },
    ]);

    render(<EventListWithState />);

    const list = await screen.findByTestId('event-list');
    expect(list).toBeInTheDocument();
    expect(within(list).getByText('Fetched Event')).toBeInTheDocument();
  });

  test('shows error if fetching fails', async () => {
    getEvents.mockRejectedValueOnce(new Error('API error'));
    render(<EventListWithState />);
    expect(await screen.findByText(/error fetching events/i)).toBeInTheDocument();
  });

  test('shows "No events found" if API returns empty array', async () => {
    getEvents.mockResolvedValue([]);
    render(<EventListWithState />);
    expect(await screen.findByText(/no events found/i)).toBeInTheDocument();
  });
});

// -------------------------
// 🔹 Full App Integration
// -------------------------
describe('<App /> integration', () => {
  test('renders event list in the full App', async () => {
    const mockEvents = [
      { id: '1', summary: 'App Event', location: 'Amsterdam' }
    ];

    getEvents.mockResolvedValue(mockEvents);

    render(<App />);

    const eventList = await screen.findByTestId('event-list');
    const listItems = within(eventList).getAllByRole('listitem');
    expect(listItems.length).toBe(1);
    expect(within(listItems[0]).getByText('App Event')).toBeInTheDocument();
  });
});

/*test('dummy test', () => {
  expect(true).toBe(true);
});*/








