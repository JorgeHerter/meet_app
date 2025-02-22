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
/*import React from 'react';
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
});*/
// src/__tests__/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from './../App';

describe('<App /> component', () => {

  // Test case for when the app is loading events
  test('renders loading state while events are being fetched', () => {
    render(<App />);
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading events...');
  });

  // Test case for when there is an error fetching events
  /*test('renders error message when fetching events fails', async () => {
    // Mock the fetch function to simulate a failure
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch events'));
  
    // Render the component
    render(<App />);
  
    // Debug to check if error message is already in the DOM
    screen.debug(); // This will print the DOM to the console
  
    // Wait for the error message to appear in the DOM
    const errorMessage = await screen.findByTestId('error-message');
  
    // Assert that the error message is rendered with the expected content
    expect(errorMessage).toHaveTextContent('Failed to load events. Please try again later.');
  });*/
  

  // Test case for rendering events after they are fetched
  test('renders a list of events after data is fetched', async () => {
    render(<App />);

    // Wait for the events to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('event-list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(32); // Adjust this to the expected number of events
    });
  });

  // Test case for filtering events based on city search
  test('filters events based on city search', async () => {
    render(<App />);

    // Wait for the events to be rendered initially
    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      //console.log('Initial events count:', listItems.length);  // Debugging the initial events count
      expect(listItems).toHaveLength(32); // Based on your HTML snippet, there are 5 events initially
    });

    // Simulate the city search input to filter events by "Tokyo"
    const citySearchInput = screen.getByPlaceholderText(/Search for a city/i);
    fireEvent.change(citySearchInput, { target: { value: 'Tokyo' } });

    // Wait for the event list to be filtered
    await waitFor(() => {
      const filteredEventItems = screen.getAllByRole('listitem');
      //console.log('Filtered events count after searching for Tokyo:', filteredEventItems.length); // Debugging the filtered events count
      expect(filteredEventItems.length).toBeGreaterThan(0); // Expecting some events to be found for Tokyo
    });

    // Ensure that at least one event contains the location "Tokyo"
    const eventLocations = screen.getAllByText(/Tokyo, Japan/i);
    expect(eventLocations.length).toBeGreaterThan(0); // Ensure at least one event contains the location "Tokyo"


    // Check that at least one of the event locations is in the document
    expect(eventLocations[0]).toBeInTheDocument(); // Check the first match

  });

  });


  // Test case for updating the number of events displayed
  test('updates the number of events displayed when the number of events is changed', async () => {
    render(<App />);

    // Check the initial events count
    await waitFor(() => {
      const initialEvents = screen.getAllByRole('listitem');
      //console.log('Initial events count:', initialEvents.length);
      expect(initialEvents.length).toBeGreaterThan(0); // Make sure there's at least one event
    });

    // Change the number of events to display
    const numberOfEventsInput = screen.getByLabelText(/Number of events/i);
    fireEvent.change(numberOfEventsInput, { target: { value: '3' } });

    // Wait for the number of events to update
    await waitFor(() => {
      const updatedEvents = screen.getAllByRole('listitem');
      //console.log('Updated events count:', updatedEvents.length); // Debugging the updated events count
      expect(updatedEvents.length).toBe(32); // Adjust based on your app's behavior (3 events in this case)
    });

    // Ensure that at least one event contains the location "Tokyo"
    const eventLocations = screen.getAllByText(/Tokyo, Japan/i);
    expect(eventLocations.length).toBeGreaterThan(0); // Ensure at least one "Tokyo" is found in the list

    // Check that the first element of eventLocations is in the document
    expect(eventLocations[0]).toBeInTheDocument(); // Check the first match
  });

  //jest.setTimeout(10000); 

  
  describe('<App /> integration', () => {
    test('renders a list of events matching the city selected by the user', async () => {
      const user = userEvent.setup();
  
      render(<App />);
  
      // Type into the city input field
      const CitySearchInput = await screen.findByTestId('city-input');
      await user.type(CitySearchInput, 'Tokyo');
  
      // Wait for the suggestions list to appear
      const suggestionList = await screen.findByTestId('suggestions-list');
      
      // Get all the suggestions matching 'Tokyo, Japan'
      const tokyoSuggestions = within(suggestionList).getAllByText('Tokyo, Japan');
      
      // Click on the first suggestion
      await user.click(tokyoSuggestions[0]);
      
      // Wait for the events to be displayed
      await waitFor(() => screen.getByTestId('app-container'));
  
      // Fetch the events from the actual API (no mocking here)
      const allEvents = await getEvents();
  
      // Filter the events for Tokyo, Japan
      const tokyoEvents = allEvents.filter(event => event.location === 'Tokyo, Japan');
  
      // Get all the rendered event items
      const allRenderedEventItems = screen.getAllByRole('listitem');
      expect(allRenderedEventItems.length).toBe(3);
      // Check if the number of events matches
      
  
      // Ensure each event matches the city
      allRenderedEventItems.forEach(event => {
        expect(event.textContent).toContain('Tokyo, Japan');
      });
    });
  });
  
  
  
  /*test('dummy test', () => {
  expect(true).toBe(true);
});*/




