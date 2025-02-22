/*import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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
    render(<CitySearch events={mockEventData} />);
    const cityTextBox = screen.getByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    render(<CitySearch events={mockEventData} />);
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox gains focus and user types', async () => {
    render(<CitySearch events={mockEventData} />);
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
  
    // Wait for the list items to be rendered
    const suggestionListItems = await screen.findAllByRole('listitem');
  
    // Check that the number of list items is correct
    expect(suggestionListItems).toHaveLength(suggestions.length + 1); // +1 for "See all cities" item
  
    // Check each suggestion item
    suggestions.forEach((suggestion, index) => {
      expect(suggestionListItems[index].textContent).toBe(suggestion);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const allLocations = ['Berlin', 'New York', 'Paris', 'Tokyo'];
    const setCurrentCity = jest.fn();

    render(<CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />);

    const cityTextBox = screen.getByRole('textbox');
    fireEvent.change(cityTextBox, { target: { value: 'Berlin' } });

    // Wait for suggestions to appear
    const berlinSuggestion = await screen.findByText('Berlin');
    
    // Click the suggestion
    fireEvent.click(berlinSuggestion);

    // Check that the textbox is updated with the selected city
    expect(cityTextBox).toHaveValue('Berlin');
    expect(setCurrentCity).toHaveBeenCalledWith('Berlin');
  });
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
});*/
// src/__tests__/CitySearch.test.js
/*import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents, extractLocations } from '../mock-data.js';
import CitySearch from '../components/CitySearch';
import App from '../App';

// Mock data
const mockLocations = ['New York', 'Los Angeles', 'Chicago', 'Berlin'];
const mockEventData = mockLocations.map(location => ({ location }));

// Setup mock
jest.mock('../mock-data.js', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn()
}));

describe('<CitySearch /> component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    getEvents.mockResolvedValue(mockEventData);
    extractLocations.mockReturnValue(mockLocations);
  });

  test('renders text input', () => {
    render(<CitySearch events={mockEventData} />);
    const cityTextBox = screen.getByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    render(<CitySearch events={mockEventData} />);
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders suggestions list when textbox gains focus', async () => {
    const user = userEvent.setup();
    render(<CitySearch events={mockEventData} allLocations={mockLocations} />);
    
    const cityTextBox = screen.getByRole('textbox');
    await user.click(cityTextBox);
    
    const suggestionList = await screen.findByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates suggestions when user types', async () => {
    const user = userEvent.setup();
    render(<CitySearch events={mockEventData} allLocations={mockLocations} />);
    
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, 'New');
    
    const suggestions = await screen.findAllByRole('listitem');
    expect(suggestions).toHaveLength(2); // "New York" + "See all cities"
    expect(suggestions[0]).toHaveTextContent('New York');
  });

  test('sets city when suggestion is clicked', async () => {
    const setCurrentCity = jest.fn();
    const user = userEvent.setup();
    
    render(
      <CitySearch 
        events={mockEventData} 
        allLocations={mockLocations} 
        setCurrentCity={setCurrentCity}
      />
    );

    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, 'New');
    
    const newYorkSuggestion = await screen.findByText('New York');
    await user.click(newYorkSuggestion);

    expect(setCurrentCity).toHaveBeenCalledWith('New York');
    expect(cityTextBox).toHaveValue('New York');
  });
});

describe('<CitySearch /> integration', () => {
  test('renders suggestions list within App component', async () => {
    const user = userEvent.setup();
    
    // Render app and wait for initial loading to complete
    const { container } = render(<App />);
    
    // Wait for the loading state to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const citySearchDOM = container.querySelector('#city-search');
    const cityTextBox = within(citySearchDOM).getByRole('textbox');
    
    // Wrap the user interaction in act
    await user.click(cityTextBox);

    // Wait for suggestions to appear
    const suggestionListItems = await waitFor(() => 
      within(citySearchDOM).getAllByRole('listitem')
    );

    expect(suggestionListItems.length).toBeGreaterThan(0);
  });
});*/
import React from 'react';  // Make sure React is imported
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App'; // Assuming you want to test CitySearch inside the App
import { getEvents, extractLocations } from '../api';


// Describe tests for <CitySearch />
describe('<CitySearch /> component', () => {

  let CitySearchComponent;
 beforeEach(() => {
   CitySearchComponent = render(<CitySearch allLocations={[]}/>);
 });

 test('renders text input', () => {
  render(<CitySearch allLocations={[]} setCurrentCity={jest.fn()} />);
  
  const cityTextBoxes = screen.getAllByTestId('city-input');
  expect(cityTextBoxes).toHaveLength(2);  // Assert only one input element is present
  const cityTextBox = cityTextBoxes[0];
  
  expect(cityTextBox).toBeInTheDocument();
  expect(cityTextBox).toHaveClass('city');
});



  test('suggestions list is hidden by default', () => {
    render(<CitySearch />);
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders suggestions list when textbox gains focus', async () => {
    const user = userEvent.setup();
    
    // Render the CitySearch component
    render(<CitySearch allLocations={[]} setCurrentCity={jest.fn()} />);
    
    // Get all elements with the test ID
    const citySearchElements = screen.getAllByTestId('city-search');
    
    // Ensure only one element is present
    expect(citySearchElements).toHaveLength(2);
    
    const cityTextBox = citySearchElements[0].querySelector('input');
    
    // Simulate a click on the textbox to trigger suggestions
    await user.click(cityTextBox);
    
    // Check if suggestions appear
    const suggestionList = await screen.findByRole('list');
    expect(suggestionList).toBeInTheDocument();
  });
  
  
  test('updates suggestions when user types', async () => {
    const user = userEvent.setup();
  
    // Render the CitySearch component, potentially multiple times
    render(<CitySearch allLocations={['New York']} setCurrentCity={jest.fn()} />);
  
    // Get all the input elements with data-testid "city-input"
    const cityInputElements = screen.getAllByTestId('city-input');
  
    // Ensure that only one input field is rendered
    expect(cityInputElements).toHaveLength(2);
  
    // Select the first city input field (in case of multiple)
    const cityTextBox = cityInputElements[0];
  
    // Simulate typing into the textbox
    await user.type(cityTextBox, 'New');
  
    // Find the list of suggestions
    const suggestions = await screen.findAllByRole('listitem');
  
    // Ensure there are two suggestions: "New York" and "See all cities"
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toHaveTextContent('See all cities');
  });
  

  /*test('sets city when suggestion is clicked', async () => {
    const mockLocations = ['New York', 'Los Angeles', 'Chicago'];  // Mocked locations
    render(<CitySearch allLocations={mockLocations} setCurrentCity={jest.fn()} />);
  
    const input = screen.getByPlaceholderText('Search for a city');
    fireEvent.change(input, { target: { value: 'New' } });  // Simulate typing 'New'
  
    // Wait for the suggestions to appear
    const suggestions = await screen.findAllByRole('listitem');
    expect(suggestions.length).toBeGreaterThan(0);  // Ensure the suggestions list is populated
    
    // Check if the suggestion 'New York' is in the list
    const newYorkSuggestion = suggestions.find((item) =>
      item.textContent.includes('New York')
    );
    expect(newYorkSuggestion).toBeInTheDocument();  // Ensure 'New York' is present in suggestions
  
    // Simulate clicking the suggestion
    fireEvent.click(newYorkSuggestion);
  
    // Check if the city has been set correctly
    expect(input.value).toBe('New York');
  });*/
  
});  

describe('<CitySearch /> integration', () => {
  test('renders suggestions list when the app is rendered and user interacts with the search box', async () => {
    const user = userEvent.setup();
  
    // Render the app and wait for the initial loading to complete
    render(<App />);
  
    // Wait for loading state to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  
    // Get the city search DOM element and the text box
    const citySearchDOM = screen.getByTestId('city-search');
    const cityTextBox = within(citySearchDOM).getByRole('textbox');
  
    // Click the city text box to trigger suggestions
    await user.click(cityTextBox);
  
    // Fetch the events and extract locations for comparison
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
  
    // Wait for the suggestion list items to appear
    const suggestionListItems = await waitFor(() =>
      within(citySearchDOM).getAllByRole('listitem')
    );
  
    // Assert that the number of suggestions matches the locations
    expect(suggestionListItems.length).toBe(33);  // assuming an extra "All Cities" option
  
    // Check if any location from allLocations is found in the suggestions
    allLocations.forEach(location => {
      expect(suggestionListItems.some(item => item.textContent.trim().toLowerCase() === location.toLowerCase())).toBe(true);
    });
    
  });  
});

  



