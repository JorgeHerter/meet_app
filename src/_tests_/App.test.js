/*import React from 'react';
import { render, within, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from '../App';

jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn((events) => {
    return [...new Set(events.map((event) => event.location))];
  })
}));

describe('<App /> component', () => {
  beforeEach(() => {
    getEvents.mockClear();
  });

  // Test to check if the list of events renders correctly
  test('renders list of events', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Event 2', location: 'Berlin, Germany' }
    ];
    getEvents.mockResolvedValue(mockEvents);

    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('event-list')).toBeInTheDocument();
    });
  });

  // Test to check if the CitySearch component renders correctly
  test('renders CitySearch', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' }
    ];
    getEvents.mockResolvedValue(mockEvents);

    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('city-search')).toBeInTheDocument();
    });
  });

  describe('<App /> integration', () => {
    test('renders a list of events matching the city selected by the user', async () => {
      const user = userEvent.setup();

      const mockEvents = [
        { 
          id: 1, 
          summary: 'Berlin Event 1', 
          location: 'Berlin, Germany',
          description: 'Event description 1'
        },
        { 
          id: 2, 
          summary: 'Berlin Event 2', 
          location: 'Berlin, Germany',
          description: 'Event description 2'
        },
        { 
          id: 3, 
          summary: 'London Event', 
          location: 'London, UK',
          description: 'Event description 3'
        }
      ];

      getEvents.mockResolvedValue(mockEvents);

      render(<App />);

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('city-search')).toBeInTheDocument();
      });

      // Find and type in the city search input
      const citySearchInput = screen.getByRole('textbox', { name: /search for a city/i });
      await user.type(citySearchInput, 'Berlin');

      // Wait for suggestions to show up
      await waitFor(() => {
        const berlinSuggestion = screen.getByRole('option', { name: /berlin, germany/i });
        user.click(berlinSuggestion);
      });

      // Verify the filtered events
      await waitFor(() => {
        const eventList = screen.getByTestId('event-list');
        const eventItems = within(eventList).getAllByRole('listitem');

        // Log the event items for debugging
        console.log("Rendered event items:", eventItems);

        // Assert that only Berlin events are shown
        expect(eventItems).toHaveLength(2);
        expect(eventItems[0]).toHaveTextContent(/Berlin Event 1/i);
        expect(eventItems[1]).toHaveTextContent(/Berlin Event 2/i);
      });

      expect(getEvents).toHaveBeenCalled();
    });
  });
});*/
// src/__tests__/App.test.js
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides the "toBeInTheDocument" matcher
import App from '../App';
import { getEvents } from '../api'; // Import getEvents from the API

// Mock the getEvents function to return mock events
jest.mock('../api', () => ({
  getEvents: jest.fn(),
}));

// Sample mock event data for testing
const mockEvents = [
  { id: '1', summary: 'React Meetup', location: 'New York, USA', created: '2025-01-01T10:00:00.000Z', start: { dateTime: '2025-01-15T08:00:00+01:00' } },
  { id: '2', summary: 'Vue.js Meetup', location: 'London, UK', created: '2025-01-05T10:00:00.000Z', start: { dateTime: '2025-01-20T09:00:00+01:00' } },
  { id: '3', summary: 'Angular Meetup', location: 'Berlin, Germany', created: '2025-01-10T10:00:00.000Z', start: { dateTime: '2025-01-22T08:00:00+01:00' } },
];

// Before each test, mock the API response to return the mock events
beforeEach(() => {
  getEvents.mockResolvedValue(mockEvents);
});

// Helper function to render the App and wait for the event list
const renderAppAndWaitForEvents = async () => {
  await act(async () => {
    render(<App />);
  });
  // Wait for the event list to be populated
  await waitFor(() => screen.getByTestId('event-list'));
};

describe('<App /> component', () => {
  // Test case to ensure events are rendered correctly
  test('renders a list of events', async () => {
    await renderAppAndWaitForEvents(); // Render and wait for the event list to appear

    // Check if the event list is in the document
    expect(screen.getByTestId('event-list')).toBeInTheDocument();

    // Ensure the correct number of events are displayed (should be 3 in this case)
    const eventItems = screen.getAllByRole('listitem');
    expect(eventItems.length).toBe(mockEvents.length);

    // Check that specific event details are displayed
    expect(screen.getByText('React Meetup')).toBeInTheDocument();
    expect(screen.getByText('New York, USA')).toBeInTheDocument();
    expect(screen.getByText('Vue.js Meetup')).toBeInTheDocument();
    expect(screen.getByText('London, UK')).toBeInTheDocument();
  });

  // Test case to ensure the CitySearch component is rendered correctly
  test('renders the CitySearch component', async () => {
    await renderAppAndWaitForEvents();

    // Wait for the loading state to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Ensure that the CitySearch input field is present in the document
    const citySearchInput = screen.getByPlaceholderText('Search for a city');
    expect(citySearchInput).toBeInTheDocument();
  });

  // Test case to ensure the loading message is displayed while fetching events
  test('displays a loading message while fetching events', async () => {
    // Mock the API call to simulate a loading state that never resolves
    getEvents.mockReturnValueOnce(new Promise(() => {})); // Never resolves

    await act(async () => {
      render(<App />);
    });

    // Check if the loading message is shown while fetching events
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  // Test case to handle errors when fetching events
  test('displays an error message if fetching events fails', async () => {
    // Simulate an error during the fetching process
    getEvents.mockRejectedValueOnce(new Error('Failed to fetch events'));

    await act(async () => {
      render(<App />);
    });

    // Wait for the error message to appear in the document
    await waitFor(() => {
      expect(screen.getByText('Failed to load events. Please try again later.')).toBeInTheDocument();
    });
  });
});

