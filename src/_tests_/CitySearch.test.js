// src/__tests__/CitySearch.test.js
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { extractLocations, getEvents } from '../api';

// Mock the API functions
jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn((events = []) => [...new Set(events.map(e => e.location))]),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  startOAuthProcess: jest.fn(),
}));


describe('<CitySearch /> component', () => {
  let CitySearchComponent;
  beforeEach(() => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
  });

  test('renders text input', () => {
    const cityTextBox = CitySearchComponent.queryByTestId('city-input');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveAttribute('placeholder', 'Search for a city');
  });

  test('suggestions list is hidden by default', () => {
    const suggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox has focus', async () => {
    const user = userEvent.setup();
    const cityTextBox = CitySearchComponent.queryByTestId('city-input');
    await user.click(cityTextBox);
    
    const suggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(
      <CitySearch allLocations={allLocations} setCurrentCity={() => {}} />
    );

    // User types "Berlin" in city textbox
    const cityTextBox = CitySearchComponent.queryByTestId('city-input');
    await user.click(cityTextBox);
    await user.type(cityTextBox, "Berlin");

    // Verify that the suggestions list filters to match the user input
    const suggestions = allLocations.filter(location => {
      return location.toUpperCase().includes("BERLIN".toUpperCase());
    });

    // Get all list items rendered in the suggestions list
    const suggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    const suggestionListItems = within(suggestionList).queryAllByRole('listitem');
    
    // 1 more suggestion item is expected because "See all cities" is hardcoded
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    
    // Check that all suggestion items match what we expect
    for (let i = 0; i < suggestions.length; i++) {
      expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
    }
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={() => {}} 
      />
    );

    const cityTextBox = CitySearchComponent.queryByTestId('city-input');
    await user.click(cityTextBox);
    await user.type(cityTextBox, "Berlin");

    // Get all list items rendered in the suggestions list
    const suggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    const suggestionListItems = within(suggestionList).queryAllByRole('listitem');
    
    // Click the first suggestion
    await user.click(suggestionListItems[0]);
    
    expect(cityTextBox).toHaveValue(suggestionListItems[0].textContent);
    
    // Suggestions list should disappear after selection
    const updatedSuggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    expect(updatedSuggestionList).not.toBeInTheDocument();
  });
});

describe('<CitySearch /> integration', () => {
  test('renders suggestions list when the app is rendered', async () => {
    const user = userEvent.setup();
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Event 2', location: 'London, UK' }
    ];
    getEvents.mockResolvedValue(mockEvents);
    
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    // Wait for the events to load
    await waitFor(() => {
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument();
    });

    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const cityTextBox = within(CitySearchDOM).queryByTestId('city-input');
    await user.click(cityTextBox);

    // Get all locations from mock events
    const allLocations = extractLocations(mockEvents);
    
    // Wait for suggestions list to be populated
    await waitFor(() => {
      const suggestionsList = within(CitySearchDOM).queryByTestId('suggestions-list');
      const suggestionListItems = within(suggestionsList).queryAllByRole('listitem');
      // +1 for "See all cities" 
      expect(suggestionListItems.length).toBe(allLocations.length + 1);
    });
  });

  test('updates filtered events when user selects a city from suggestions', async () => {
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

    // Verify that all events are initially shown
    const EventListDOM = AppDOM.querySelector('#event-list');
    let eventItems = within(EventListDOM).queryAllByRole('listitem');
    expect(eventItems.length).toBe(mockEvents.length);

    // Get the CitySearch component and input field
    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const cityTextBox = within(CitySearchDOM).queryByTestId('city-input');
    
    // Type "Berlin" into the city search input
    await user.click(cityTextBox);
    await user.type(cityTextBox, 'Berlin');
    
    // Wait for suggestions list to appear
    const suggestionsList = await within(CitySearchDOM).findByTestId('suggestions-list');
    
    // Get the Berlin, Germany suggestion item and click it
    const berlinSuggestionItem = within(suggestionsList).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);
    
    // Wait for the events to update based on the city selection
    await waitFor(() => {
      const filteredEventItems = within(EventListDOM).queryAllByRole('listitem');
      
      // Filter the mock events to just those in Berlin
      const berlinEvents = mockEvents.filter(
        event => event.location === 'Berlin, Germany'
      );
      
      // Expect the number of rendered events to match the number of Berlin events
      expect(filteredEventItems.length).toBe(berlinEvents.length);
      
      // Check that all rendered events are from Berlin
      filteredEventItems.forEach(event => {
        expect(event.textContent).toContain('Berlin');
      });
    });
  });
});
