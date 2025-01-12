
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import CitySearch from '../components/CitySearch';

// Mock event data
const mockEventData = [
  { id: "abc123", summary: "Meeting with Berlin Team", location: "Berlin" },
  { id: "def456", summary: "Meeting in New York", location: "New York" },
  { id: "ghi789", summary: "Conference in Paris", location: "Paris" }
];

// Placeholder for event fetching function (to be implemented based on actual data)
const getEvents = async () => {
  return mockEventData; // Returning mock data for now
};

// Placeholder for extracting locations from events (to be implemented based on actual data)
const extractLocations = (events) => {
  return events.map(event => event.location);
};

jest.setTimeout(10000); // Set a global timeout of 10 seconds for all tests

describe('<CitySearch /> component', () => {
  test('renders text input', () => {
    render(<CitySearch events={mockEventData} />);  // Pass events prop here
    const cityTextBox = screen.getByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    render(<CitySearch events={mockEventData} />);  // Pass events prop here
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox gains focus and user types', async () => {
    render(<CitySearch events={mockEventData} />);  // Pass events prop here
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
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);

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

    render(<CitySearch events={mockEventData} allLocations={allLocations} />);

    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    // Wait for the suggestions list to appear
    const suggestionListItems = await screen.findAllByRole('listitem');
    
    // Assume the first suggestion is "Berlin"
    const BerlinGermanySuggestion = suggestionListItems[0];

    // Simulate a click on the "Berlin" suggestion
    await user.click(BerlinGermanySuggestion);

    // Check that the text in the textbox is now the clicked suggestion text
    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});



