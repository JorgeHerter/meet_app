// src/__tests__/Event.test.js
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import App from '../App';
import { getEvents } from '../api';

// Mock the API functions
jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn((events) => {
    return [...new Set(events.map((event) => event.location))];
  }),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  startOAuthProcess: jest.fn()
}));


describe('<Event /> component', () => {
  const mockEvent = {
    id: 'event123',
    summary: 'Test Event',
    location: 'Berlin, Germany',
    description: 'This is a test event description',
    created: '2023-01-01T10:00:00Z',
    start: {
      dateTime: '2023-01-15T18:00:00Z'
    },
    hangoutLink: 'https://meet.google.com/abc-def-ghi'
  };

  test('renders event component with correct event details', () => {
    const { getByText } = render(<Event event={mockEvent} />);
    
    // Basic details should be visible
    expect(getByText('Test Event')).toBeInTheDocument();
    expect(getByText(/Berlin, Germany/)).toBeInTheDocument();
    
    // Date information should be visible
    expect(getByText(/Created:/)).toBeInTheDocument();
    expect(getByText(/Start Time:/)).toBeInTheDocument();
    
    // Show Details button should be visible
    const showDetailsButton = getByText('Show Details');
    expect(showDetailsButton).toBeInTheDocument();
  });
  
  test('expanded details are hidden by default', () => {
    const { queryByText } = render(<Event event={mockEvent} />);
    
    // Description should not be visible by default
    expect(queryByText(/This is a test event description/)).not.toBeInTheDocument();
    
    // Hangout link should not be visible by default
    expect(queryByText(/Join here/)).not.toBeInTheDocument();
  });
  
  test('expands event details when "Show Details" button is clicked', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = render(<Event event={mockEvent} />);
    
    // Initially details are hidden
    expect(queryByText(/This is a test event description/)).not.toBeInTheDocument();
    
    // Click the "Show Details" button
    const showDetailsButton = getByText('Show Details');
    await user.click(showDetailsButton);
    
    // After clicking, details should be visible
    expect(getByText(/This is a test event description/)).toBeInTheDocument();
    expect(getByText(/Join here/)).toBeInTheDocument();
    
    // Button should now say "Hide Details"
    expect(getByText('Hide Details')).toBeInTheDocument();
  });
  
  test('collapses event details when "Hide Details" button is clicked', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = render(<Event event={mockEvent} />);
    
    // First expand details
    const showDetailsButton = getByText('Show Details');
    await user.click(showDetailsButton);
    
    // Verify details are shown
    expect(getByText(/This is a test event description/)).toBeInTheDocument();
    
    // Now click "Hide Details" button
    const hideDetailsButton = getByText('Hide Details');
    await user.click(hideDetailsButton);
    
    // After clicking, details should be hidden again
    expect(queryByText(/This is a test event description/)).not.toBeInTheDocument();
    
    // Button should say "Show Details" again
    expect(getByText('Show Details')).toBeInTheDocument();
  });
  
  test('handles event with missing properties gracefully', () => {
    const incompleteEvent = {
      id: 'event456',
      summary: 'Incomplete Event',
      // Missing location, description, etc.
    };
    
    const { getByText } = render(<Event event={incompleteEvent} />);
    
    // Should display the event with default fallback values
    expect(getByText('Incomplete Event')).toBeInTheDocument();
    expect(getByText(/No location provided/)).toBeInTheDocument();
  });
});

describe('<Event /> integration', () => {
  test('renders events with show/hide details functionality in the app', async () => {
    const user = userEvent.setup();
    const mockEvents = [
      {
        id: 'event123',
        summary: 'Test Event 1',
        location: 'Berlin, Germany',
        description: 'Test Event 1 Description',
        created: '2023-01-01T10:00:00Z',
        start: { dateTime: '2023-01-15T18:00:00Z' },
        hangoutLink: 'https://meet.google.com/abc-def-ghi'
      },
      {
        id: 'event456',
        summary: 'Test Event 2',
        location: 'London, UK',
        description: 'Test Event 2 Description',
        created: '2023-01-02T11:00:00Z',
        start: { dateTime: '2023-01-16T19:00:00Z' },
        hangoutLink: 'https://meet.google.com/jkl-mno-pqr'
      }
    ];
    
    // Mock the API to return our test events
    getEvents.mockResolvedValue(mockEvents);
    
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    
    // Wait for the events to load
    await waitFor(() => {
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // Find the event list
    const EventListDOM = AppDOM.querySelector('#event-list');
    const eventItems = within(EventListDOM).queryAllByRole('listitem');
    
    // Verify both events are rendered
    expect(eventItems.length).toBe(mockEvents.length);
    
    // Check first event details
    const firstEvent = within(eventItems[0]);
    expect(firstEvent.getByText('Test Event 1')).toBeInTheDocument();
    expect(firstEvent.getByText(/Berlin, Germany/)).toBeInTheDocument();
    
    // Description should be hidden initially
    expect(firstEvent.queryByText(/Test Event 1 Description/)).not.toBeInTheDocument();
    
    // Click the "Show Details" button for the first event
    const showDetailsButton = firstEvent.getByText('Show Details');
    await user.click(showDetailsButton);
    
    // Now description should be visible
    expect(firstEvent.getByText(/Test Event 1 Description/)).toBeInTheDocument();
    
    // Hide details again
    const hideDetailsButton = firstEvent.getByText('Hide Details');
    await user.click(hideDetailsButton);
    
    // Description should be hidden again
    expect(firstEvent.queryByText(/Test Event 1 Description/)).not.toBeInTheDocument();
  });
  
  test('event details toggle independently', async () => {
    const user = userEvent.setup();
    const mockEvents = [
      {
        id: 'event123',
        summary: 'Test Event 1',
        location: 'Berlin, Germany',
        description: 'Test Event 1 Description',
        created: '2023-01-01T10:00:00Z',
        start: { dateTime: '2023-01-15T18:00:00Z' }
      },
      {
        id: 'event456',
        summary: 'Test Event 2',
        location: 'London, UK',
        description: 'Test Event 2 Description',
        created: '2023-01-02T11:00:00Z',
        start: { dateTime: '2023-01-16T19:00:00Z' }
      }
    ];
    
    // Mock the API to return our test events
    getEvents.mockResolvedValue(mockEvents);
    
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    
    // Wait for the events to load
    await waitFor(() => {
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // Find the event list
    const EventListDOM = AppDOM.querySelector('#event-list');
    const eventItems = within(EventListDOM).queryAllByRole('listitem');
    
    // Show details for the first event
    const firstEvent = within(eventItems[0]);
    const firstShowButton = firstEvent.getByText('Show Details');
    await user.click(firstShowButton);
    
    // Show details for the second event
    const secondEvent = within(eventItems[1]);
    const secondShowButton = secondEvent.getByText('Show Details');
    await user.click(secondShowButton);
    
    // Both events should show their descriptions
    expect(firstEvent.getByText(/Test Event 1 Description/)).toBeInTheDocument();
    expect(secondEvent.getByText(/Test Event 2 Description/)).toBeInTheDocument();
    
    // Hide details for the first event only
    const firstHideButton = firstEvent.getByText('Hide Details');
    await user.click(firstHideButton);
    
    // First event description should be hidden, second should still be visible
    expect(firstEvent.queryByText(/Test Event 1 Description/)).not.toBeInTheDocument();
    expect(secondEvent.getByText(/Test Event 2 Description/)).toBeInTheDocument();
  });
});
