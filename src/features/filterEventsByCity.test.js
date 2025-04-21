import React from 'react';
import { render, within, waitFor, fireEvent, screen } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import App from '../App';

jest.mock('../api', () => ({
  isAuthenticated: jest.fn().mockResolvedValue(true),
  getEvents: jest.fn().mockResolvedValue([
    { id: 1, summary: 'Berlin Event 1', location: 'Berlin, Germany' },
    { id: 2, summary: 'Berlin Event 2', location: 'Berlin, Germany' },
    { id: 3, summary: 'London Event', location: 'London, UK' }
  ]),
  extractLocations: jest.fn().mockReturnValue(['Berlin, Germany', 'London, UK']),
  startOAuthProcess: jest.fn().mockResolvedValue(undefined)
}));

const feature = loadFeature(require.resolve('./filterEventsByCity.feature'));

defineFeature(feature, test => {
  test('When user hasn’t searched for a city, show upcoming events from all cities.', ({ given, when, then }) => {
    let AppComponent;
    let EventListDOM;

    given('user hasn’t searched for any city', () => {
      // No setup needed
    });

    when('the user opens the app', async () => {
      AppComponent = render(<App />);
      await waitFor(() => expect(AppComponent.queryByTestId('event-list')).toBeInTheDocument());
      EventListDOM = AppComponent.container.querySelector('#event-list');
    });

    then('the user should see the list of all upcoming events.', async () => {
      const events = within(EventListDOM).queryAllByRole('listitem');
      expect(events.length).toBe(3); // From mocked getEvents
    });
  });

  test('User should see a list of suggestions when they search for a city.', ({ given, when, then }) => {
    let AppComponent;
    let CitySearchInput;

    given('the main page is open', async () => {
      AppComponent = render(<App />);
      await waitFor(() => expect(AppComponent.queryByTestId('city-search')).toBeInTheDocument());
      CitySearchInput = await AppComponent.findByPlaceholderText('Search for a city');
    });

    when('user starts typing in the city textbox', async () => {
      fireEvent.change(CitySearchInput, { target: { value: 'Berlin' } });
    });

    then('the user should receive a list of cities (suggestions) that match what they’ve typed', async () => {
      const suggestions = await screen.findAllByRole('listitem');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(item => item.textContent.includes('Berlin'))).toBe(true);
    });
  });

  test('User can select a city from the suggested list.', ({ given, and, when, then }) => {
    let AppComponent;
    let CitySearchInput;
    let EventListDOM;

    given(/^user was typing "(.*)" in the city textbox$/, async (city) => {
      AppComponent = render(<App />);
      CitySearchInput = await AppComponent.findByPlaceholderText('Search for a city');
      fireEvent.change(CitySearchInput, { target: { value: city } });
    });

    and('the list of suggested cities is showing', async () => {
        const input = await AppComponent.findByTestId('city-input');
      
        fireEvent.focus(input); // Triggers setShowSuggestions(true)
        fireEvent.change(input, { target: { value: 'Berlin' } }); // Updates query + shows matching cities
      
        // Wait until the suggestions list is rendered
        await waitFor(() => {
          const suggestionsList = AppComponent.getByTestId('suggestions-list');
          expect(suggestionsList).toBeInTheDocument();
      
          const items = within(suggestionsList).getAllByTestId('city-suggestion-item');
          expect(items.length).toBeGreaterThan(0);
        });
      });
      

    when(/^the user selects a city \(e\.g\., "(.*)"\) from the list$/, async (cityName) => {
      const fullCity = `${cityName}, Germany`;
      const suggestionsList = AppComponent.getByTestId('suggestions-list');
      const suggestionItems = within(suggestionsList).getAllByRole('listitem');
      const targetSuggestion = suggestionItems.find(item => item.textContent === fullCity);

      fireEvent.click(targetSuggestion);

      // Wait for input to update
      await waitFor(() => {
        expect(CitySearchInput.value).toBe(fullCity);
      });
    });

    then(/^their city should be changed to that city \(i\.e\., "(.*)"\)$/, async (selectedCity) => {
      expect(CitySearchInput.value).toBe(selectedCity);
    });

    and('the user should receive a list of upcoming events in that city', async () => {
      EventListDOM = AppComponent.container.querySelector('#event-list');
      const filteredEventItems = within(EventListDOM).queryAllByRole('listitem');

      // All items should be from Berlin
      filteredEventItems.forEach(event => {
        expect(event.textContent).toContain('Berlin');
      });
    });
  });
});



      