// src/__tests__/Event.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Event from '../components/Event';  // Adjust path accordingly

// Mock event data
const mockEvent = {
  id: 1,
  summary: "Meeting with Berlin Team",
  created: "2025-01-12T10:00:00Z",
  location: "Berlin",
};

describe('<Event /> component', () => {
  test('renders event title, time, and location', () => {
    render(<Event event={mockEvent} />);

    // Check if the event title is displayed
    expect(screen.queryByText(mockEvent.summary)).toBeInTheDocument();

    // Check if the event start time is displayed
    expect(screen.queryByText(new Date(mockEvent.created).toLocaleString())).toBeInTheDocument();

    // Check if the event location is displayed
    expect(screen.queryByText(mockEvent.location)).toBeInTheDocument();
  });
});
