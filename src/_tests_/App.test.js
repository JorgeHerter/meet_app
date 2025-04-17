import React from 'react';
import { render, within, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from '../App';

// Mock the API functions
jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn((events) => {
    return [...new Set(events.map((event) => event.location))];
  }),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  startOAuthProcess: jest.fn(),
}));

describe('<App /> component', () => {
  beforeEach(() => {
    getEvents.mockClear();
  });

  test('renders the event list', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Event 2', location: 'Berlin, Germany' },
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(getByTestId('event-list')).toBeInTheDocument();
    });
  });

  test('renders the CitySearch component', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' },
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(getByTestId('city-search')).toBeInTheDocument();
    });
  });

  test('renders the NumberOfEvents component', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' },
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(getByTestId('number-of-events')).toBeInTheDocument();
    });
  });
});

ddescribe('<App /> integration', () => {
  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    const mockEvents = [
      { id: 1, summary: 'Berlin Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Berlin Event 2', location: 'Berlin, Germany' },
      { id: 3, summary: 'London Event', location: 'London, UK' },
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { container, queryByTestId } = render(<App />);
    const AppDOM = container.firstChild;

    // Wait for the events to load
    await waitFor(() => {
      expect(queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Get the CitySearch component and input field
    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const CitySearchInput = within(CitySearchDOM).getByRole('textbox');

    // Type "Berlin" into the city search input
    await user.type(CitySearchInput, 'Berlin');

    // Get the Berlin, Germany suggestion item by test ID
    const berlinSuggestionItem = await screen.findByTestId('city-suggestion-item');

    // Click on the Berlin, Germany suggestion
    await user.click(berlinSuggestionItem);

    // Get the EventList component
    const EventListDOM = AppDOM.querySelector('#event-list');

    // Wait for the events to update based on the city selection
    await waitFor(async () => {
      const allRenderedEventItems = await within(EventListDOM).findAllByRole('listitem');

      // Filter the mock events to just those in Berlin
      const berlinEvents = mockEvents.filter(
        (event) => event.location === 'Berlin, Germany'
      );

      // Expect the number of rendered events to match the number of Berlin events
      expect(allRenderedEventItems.length).toBe(berlinEvents.length);

      // Check that all rendered events are from Berlin
      allRenderedEventItems.forEach((event) => {
        expect(event.textContent).toContain('Berlin');
      });
    });
  });

  test('updates the number of events shown when user specifies a number', async () => {
    const user = userEvent.setup();

    // Create 5 mock events
    const mockEvents = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      summary: `Event ${i + 1}`,
      location: 'Berlin, Germany',
    }));

    getEvents.mockResolvedValue(mockEvents);

    const { container, queryByTestId } = render(<App />);
    const AppDOM = container.firstChild;

    // Wait for the events to load
    await waitFor(() => {
      expect(queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify that all 5 events are initially rendered
    const EventListDOM = AppDOM.querySelector('#event-list');
    await waitFor(() => {
      const allRenderedEventItems = within(EventListDOM).getAllByRole('listitem');
      expect(allRenderedEventItems.length).toBe(5);
    });

    // Get the NumberOfEvents component and input field
    const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
    const NumberOfEventsInput = within(NumberOfEventsDOM).getByRole('spinbutton');

    // Set the number of events to 2
    await user.clear(NumberOfEventsInput);
    await user.type(NumberOfEventsInput, '2');

    // Wait for the events to update based on the number specified
    await waitFor(() => {
      const allRenderedEventItems = within(EventListDOM).getAllByRole('listitem');
      expect(allRenderedEventItems.length).toBe(2);  // Expect the number of events to be 2
    });
  });
});

