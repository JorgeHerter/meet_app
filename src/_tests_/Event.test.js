// src/__tests__/Event.test.js
/*import React from 'react';

import { render, screen } from '@testing-library/react';
import Event from '../components/Event';  // Adjust path accordingly

// Mock event data
const mockEvent = {
  id: 1,
  summary: "Meeting with Berlin Team",
  created: "2025-01-12T10:00:00Z", // ISO string to match directly
  location: "Berlin",
};

describe('<Event /> component', () => {
  test('renders event title, time, and location', () => {
    render(<Event event={mockEvent} />);

    // Check if the event title is displayed
    expect(screen.queryByText(mockEvent.summary)).toBeInTheDocument();

    // Check if the event created date is displayed (formatted)
    const formattedDate = new Date(mockEvent.created).toLocaleString();
    expect(screen.queryByText(formattedDate)).toBeInTheDocument(); // Check formatted date

    // Check if the event location is displayed
    expect(screen.queryByText(mockEvent.location)).toBeInTheDocument();
  });
});*/

/*import React from "react";
import { render, screen } from "@testing-library/react";
import Event from "../components/Event";

test("renders event details correctly", () => {
  const mockEvent = {
    summary: "Meeting with Team",
    created: "2025-01-22T09:00:00Z",
    location: "Conference Room A",
    id: "1",
  };

  render(<Event event={mockEvent} />);

  // Check if event title, created time, and location are rendered
  expect(screen.getByText("Meeting with Team")).toBeInTheDocument();
  expect(screen.getByText("2025-01-22T09:00:00Z")).toBeInTheDocument();
  expect(screen.getByText("Conference Room A")).toBeInTheDocument();
});*/

import React, { useState, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Event from '../components/Event'; // Adjust path accordingly
import { getEvents } from '../api'; // Import the real API method

// Create a functional component to use hooks
const EventWithState = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEvents(); // Use the real API method
        setEvent(eventData[0]); // Assuming you're showing the first event for simplicity
      } catch (error) {
        setError('Error fetching event');
      }
    };

    fetchEvent();
  }, []); // Empty array ensures this only runs once when the component mounts

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  if (!event) {
    return <div>Loading...</div>; // Loading state
  }

  // Return the Event component with event passed as props
  return <Event event={event} />;
};

describe('<Event /> component', () => {
  test('renders event details correctly', async () => {
    render(<EventWithState />); // Render the component with hooks
  
    // Wait for the event details to be rendered
    await waitFor(() => screen.getByText('Location:')); 
  
    // Check if event details are displayed
    const eventLocationLabel = screen.getByText('Location:');
    expect(eventLocationLabel).toBeInTheDocument();
  
    const eventLocation = screen.getByText('Tokyo, Japan'); // Adjust this to match the actual location
    expect(eventLocation).toBeInTheDocument();
  });
  

  /*test('renders error message if event is not found', async () => {
    // Simulate an API failure by mocking the global fetch
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Event not found'));
  
    // Wrap the state updates and render in act()
    await act(async () => {
      render(<EventWithState />);
    });
  
    // Check if error message is displayed when API fails
    const errorMessage = await screen.findByText('Error fetching event');
    expect(errorMessage).toBeInTheDocument();
  });*/
  
  test('renders loading state initially', () => {
    render(<EventWithState />); // Render the component with hooks

    // Check if loading message is displayed initially
    const loadingMessage = screen.getByText('Loading...');
    expect(loadingMessage).toBeInTheDocument();
  });
});
/*test('dummy test', () => {
  expect(true).toBe(true);
});*/



