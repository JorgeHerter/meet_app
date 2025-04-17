import React from 'react';
import { render, within, waitFor, fireEvent } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { isAuthenticated, getEvents, extractLocations, startOAuthProcess } from '../api';  // Adjust the relative path

import App from '../App';

const feature = loadFeature(require.resolve('./filterEventsByCity.feature'));

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

defineFeature(feature, test => {
  test('When user hasn’t searched for a city, show upcoming events from all cities.', ({ given, when, then }) => {
    let AppComponent;
    let EventListDOM;

    given('user hasn’t searched for any city', () => {
      // No user input needed here
    });

    when('the user opens the app', async () => {
      AppComponent = render(<App />);
      await waitFor(() => expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument());
      EventListDOM = AppComponent.container.querySelector('#event-list');
    });

    then('the user should see the list of all upcoming events.', async () => {
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0); // or expect(EventListItems.length).toBe(32);
      });
    });
  });

  test('User should see a list of suggestions when they search for a city.', ({ given, when, then }) => {
    let AppComponent;
    let CitySearchInput;

    given('the main page is open', async () => {
      AppComponent = render(<App />);
      await waitFor(() => expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument());
      CitySearchInput = await AppComponent.findByPlaceholderText('Search for a city');
    });

    when('user starts typing in the city textbox', async () => {
      // Simulate user typing "Berlin" in the city input box
      await waitFor(() => fireEvent.change(CitySearchInput, { target: { value: 'Berlin' } }));
    });

    then('the user should receive a list of cities (suggestions) that match what they’ve typed', async () => {
      const suggestionList = await AppComponent.findAllByRole('listitem');
      expect(suggestionList.length).toBeGreaterThan(0);
      expect(suggestionList.some(item => item.textContent.includes('Berlin'))).toBe(true);
    });
  });

  test('User can select a city from the suggested list.', ({ given, and, when, then }) => {
    let AppComponent;
    let CitySearchInput;
    let EventListDOM;
  
    given(/^user was typing "(.*)" in the city textbox$/, async (city) => {
      AppComponent = render(<App />);
      await waitFor(() => expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument());
      CitySearchInput = await AppComponent.findByPlaceholderText('Search for a city');
      await fireEvent.change(CitySearchInput, { target: { value: city } });
    });
  
    and('the list of suggested cities is showing', async () => {
        const input = await AppComponent.findByTestId('city-input');
      
        // Simulate focus first (to show suggestions)
        fireEvent.focus(input);
      
        // Suggestions render asynchronously, so wait for them
        await waitFor(() => {
          const suggestionsList = AppComponent.getByTestId('suggestions-list');
          expect(suggestionsList).toBeInTheDocument();
        });
      });
      
      when(/^the user selects a city \(e\.g\., "(.*)"\) from the list$/, async (city) => {
        const AppComponent = render(<App />);
      
        const cityInput = AppComponent.getByPlaceholderText('Search for a city');
        fireEvent.change(cityInput, { target: { value: city } });
      
        // Wait for suggestions to show up
        const suggestionsList = await AppComponent.findByTestId('suggestions-list');
      
        const fullCityName = `${city}, Germany`;
      
        // Get all list items and click the correct one
        const allSuggestions = within(suggestionsList).getAllByRole('listitem');
        const selectedSuggestion = allSuggestions.find((li) => li.textContent === fullCityName);
        fireEvent.click(selectedSuggestion);
      
        // Wait for input to update after clicking suggestion
        await waitFor(() => {
          expect(cityInput.value).toBe(fullCityName);
        });
      });
      
      
    then('their city should be changed to that city (i.e., “Berlin, Germany”)', async () => {
      const cityInput = await AppComponent.findByPlaceholderText('Search for a city');
      expect(cityInput.value).toBe('Berlin, Germany');
    });
  
    and('the user should receive a list of upcoming events in that city', async () => {
      EventListDOM = AppComponent.container.querySelector('#event-list');
      const filteredEventItems = within(EventListDOM).queryAllByRole('listitem');
      filteredEventItems.forEach(event => {
        expect(event.textContent).toContain('Berlin');
      });
    });
  });
  });




      