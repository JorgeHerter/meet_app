import React from 'react';
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
});
