import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { getEvents, extractLocations } from '../api';

// Correctly mock the event data with valid date and location fields
const mockEventData = [
  { id: 1, summary: 'Event 1', location: 'Berlin, Germany', date: '2025-02-25' },
  { id: 2, summary: 'Event 2', location: 'Paris, France', date: '2025-02-26' },
  { id: 3, summary: 'Event 3', location: 'New York, USA', date: '2025-02-27' },
  { id: 4, summary: 'Event 4', location: 'London, UK', date: '2025-02-28' },
  { id: 5, summary: 'Event 5', location: 'Tokyo, Japan', date: '2025-03-01' }
];

// Mock the API response with the above events
jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn()
}));

// Mock the behavior of the functions to return predefined values
beforeEach(() => {
  getEvents.mockResolvedValue(mockEventData);
  extractLocations.mockReturnValue(mockEventData.map(event => event.location));
});

describe('<CitySearch /> component', () => {
  test('renders text input', () => {
    render(<CitySearch events={mockEventData} />); // Pass events prop here
    const cityTextBox = screen.getByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    render(<CitySearch events={mockEventData} />); // Pass events prop here
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox gains focus and user types', async () => {
    render(<CitySearch events={mockEventData} />); // Pass events prop here
    const user = userEvent.setup();
    const cityTextBox = screen.getByRole('textbox');
    
    // Simulate focus and typing
    await user.click(cityTextBox);
    await user.type(cityTextBox, 'Ber');  // "Berlin" should appear in suggestions

    // Wait for the suggestion list to appear with a custom timeout (10 seconds)
    const suggestionList = await waitFor(() => screen.getByRole('list'), { timeout: 10000 });

    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('See all cities')).toBeInTheDocument();
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allLocations = extractLocations(mockEventData); // Use the mocked locations

    render(<CitySearch events={mockEventData} allLocations={allLocations} />);

    // Simulate typing "Berlin" in the city textbox
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    // Filter allLocations to match the input value
    const suggestions = allLocations.filter(location =>
      location.toUpperCase().includes(cityTextBox.value.toUpperCase())
    );

    // Get all <li> elements inside the suggestion list
    const suggestionListItems = await screen.findAllByRole('listitem');

    expect(suggestionListItems).toHaveLength(suggestions.length + 1); // +1 for "See all cities" item

    // Check each suggestion item
    suggestions.forEach((suggestion, index) => {
      expect(suggestionListItems[index].textContent).toBe(suggestion);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);

    render(<CitySearch
      allLocations={allLocations}
      setCurrentCity={() => { }} // You can mock this function if needed
    />);
    
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    // the suggestion's textContent looks like this: "Berlin, Germany"
    const berlinGermanySuggestion = screen.getByText('Berlin, Germany');  // Simplified for this test

    await user.click(berlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(berlinGermanySuggestion.textContent);
  });

  describe('<CitySearch /> integration', () => {
    test('renders suggestions list when the app is rendered.', async () => {
      const user = userEvent.setup();
      const AppComponent = render(<App />);

      // Find the CitySearch component inside the App
      const CitySearchDOM = AppComponent.container.querySelector('#city-search');
      const cityTextBox = within(CitySearchDOM).queryByRole('textbox');
      await user.click(cityTextBox);

      // Wait for the mock events and locations to be loaded
      const allLocations = extractLocations(mockEventData);

      // Wait for the suggestion list to appear
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestionListItems.length).toBe(allLocations.length + 1); // +1 for "See all cities"
    });
  });
});
