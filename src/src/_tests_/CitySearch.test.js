// src/__tests__/CitySearch.test.js
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { extractLocations, getEvents, isAuthenticated, startOAuthProcess, isLocalMode, isMockMode } from '../api';

const mockLocations = ['Berlin, Germany', 'London, UK', 'Paris, France'];

jest.mock('../api', () => ({
  getEvents: jest.fn().mockResolvedValue([
    { id: 1, location: 'Berlin, Germany', summary: 'Event 1' },
    { id: 2, location: 'London, UK', summary: 'Event 2' },
    { id: 3, location: 'Paris, France', summary: 'Event 3' },
  ]),
  extractLocations: jest.fn(() => mockLocations),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  startOAuthProcess: jest.fn(),
  isLocalMode: jest.fn().mockReturnValue(false),  // Adjust the mock for isLocalMode
  isMockMode: jest.fn().mockReturnValue(true),    // Adjust the mock for isMockMode
}));

describe('<CitySearch /> component', () => {
  let CitySearchComponent;
  let mockSetInfoAlert;

  beforeEach(() => {
    mockSetInfoAlert = jest.fn();
    CitySearchComponent = render(
      <CitySearch 
        allLocations={[]} 
        setCurrentCity={() => {}} 
        setInfoAlert={mockSetInfoAlert}
      />
    );
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
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={() => {}} 
        setInfoAlert={mockSetInfoAlert}
      />
    );

    const cityTextBox = CitySearchComponent.queryByTestId('city-input');
    await user.click(cityTextBox);
    await user.type(cityTextBox, "Berlin");

    const suggestions = allLocations.filter(location => 
      location.toUpperCase().includes("BERLIN".toUpperCase())
    );

    const suggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    const suggestionListItems = within(suggestionList).queryAllByRole('listitem');

    expect(suggestionListItems).toHaveLength(suggestions.length + 1); // +1 for "See all cities"

    suggestions.forEach((location, i) => {
      expect(suggestionListItems[i].textContent).toBe(location);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);

    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={() => {}} 
        setInfoAlert={mockSetInfoAlert}
      />
    );

    const cityTextBox = CitySearchComponent.queryByTestId('city-input');
    await user.click(cityTextBox);
    await user.type(cityTextBox, "Berlin");

    const suggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    const suggestionListItems = within(suggestionList).queryAllByRole('listitem');

    await user.click(suggestionListItems[0]);

    expect(cityTextBox.value).toBe('Berlin, Germany');

    const updatedSuggestionList = CitySearchComponent.queryByTestId('suggestions-list');
    expect(updatedSuggestionList).not.toBeInTheDocument();
  });
});

describe('<CitySearch /> integration', () => {
  test('updates filtered events when user selects a city from suggestions', async () => {
    const user = userEvent.setup();

    const mockEvents = [
      { id: 1, summary: 'Berlin Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Berlin Event 2', location: 'Berlin, Germany' },
      { id: 3, summary: 'London Event', location: 'London, UK' }
    ];
    getEvents.mockResolvedValue(mockEvents);

    const { container, queryByTestId } = render(<App />);

    // Wait for the loading spinner to go away
    await waitFor(() => {
      expect(queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Get the city input field, simulate user typing
    const cityInput = queryByTestId('city-input');
    await user.click(cityInput);
    await user.type(cityInput, 'Berlin');

    // Find the suggestions list and select Berlin
    const suggestionsList = await within(container).findByTestId('suggestions-list');
    const berlinSuggestionItem = within(suggestionsList).getByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    // Wait for the city input to reflect the selected city
    await waitFor(() => {
      expect(cityInput.value).toBe('Berlin, Germany');
    });

    // Get the updated list of events for Berlin
    const updatedEventList = container.querySelector('#event-list');
    const berlinEvents = mockEvents.filter(e => e.location === 'Berlin, Germany');

    // Wait for the event list to be filtered based on the selected city
    await waitFor(() => {
      const filteredItems = within(updatedEventList).queryAllByRole('listitem');
      expect(filteredItems.length).toBe(berlinEvents.length); // Ensure only Berlin events are shown
      filteredItems.forEach(item => {
        expect(item.textContent).toMatch(/Berlin/); // Ensure the event text matches Berlin
      });
    });
  });
});
