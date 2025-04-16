// src/__tests__/App.test.js
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from '../App';

// Mock the API functions
jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn((events) => {
    return [...new Set(events.map((event) => event.location))];
  }),
  isAuthenticated: jest.fn().mockResolvedValue(true), // ← Mock it to return "authenticated"
  startOAuthProcess: jest.fn(),                       // ← Also needed for your app logic
}));


describe('<App /> component', () => {
  beforeEach(() => {
    getEvents.mockClear();
  });

  test('renders list of events', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Event 2', location: 'Berlin, Germany' }
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(getByTestId('event-list')).toBeInTheDocument();
    });
  });

  test('renders CitySearch', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' }
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(getByTestId('city-search')).toBeInTheDocument();
    });
  });

  test('renders NumberOfEvents', async () => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' }
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(getByTestId('number-of-events')).toBeInTheDocument();
    });
  });
});

describe('<App /> integration', () => {
  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    const mockEvents = [
      { id: 1, summary: 'Berlin Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Berlin Event 2', location: 'Berlin, Germany' },
      { id: 3, summary: 'London Event', location: 'London, UK' }
    ];
    getEvents.mockResolvedValue(mockEvents);

    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    // Wait for the events to load
    await waitFor(() => {
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Get the CitySearch component and input field
    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    // Type "Berlin" into the city search input
    await user.type(CitySearchInput, 'Berlin');
    
    // Get the Berlin, Germany suggestion item
    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    
    // Click on the Berlin, Germany suggestion
    await user.click(berlinSuggestionItem);

    // Get the EventList component
    const EventListDOM = AppDOM.querySelector('#event-list');
    
    // Wait for the events to update based on the city selection
    await waitFor(() => {
      const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
      
      // Filter the mock events to just those in Berlin
      const berlinEvents = mockEvents.filter(
        event => event.location === 'Berlin, Germany'
      );
      
      // Expect the number of rendered events to match the number of Berlin events
      expect(allRenderedEventItems.length).toBe(berlinEvents.length);
      
      // Check that all rendered events are from Berlin
      allRenderedEventItems.forEach(event => {
        expect(event.textContent).toContain('Berlin');
      });
    });
  });

  test('renders the number of events specified by the user', async () => {
    const user = userEvent.setup();
    
    // Create 5 mock events
    const mockEvents = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      summary: `Event ${i + 1}`,
      location: 'Berlin, Germany'
    }));
    
    getEvents.mockResolvedValue(mockEvents);

    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    // Wait for the events to load
    await waitFor(() => {
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Get the NumberOfEvents component and input field
    const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
    const NumberOfEventsInput = within(NumberOfEventsDOM).queryByRole('spinbutton');
    
    // Set the number of events to 2
    await user.clear(NumberOfEventsInput);
    await user.type(NumberOfEventsInput, '2');
    
    // Get the EventList component
    const EventListDOM = AppDOM.querySelector('#event-list');
    
    // Wait for the events to update based on the number specified
    await waitFor(() => {
      const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
      
      // Expect only 2 events to be rendered
      expect(allRenderedEventItems.length).toBe(2);
    });
  });
});
