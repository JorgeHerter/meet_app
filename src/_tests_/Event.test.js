// src/__tests__/Event.test.js
import React from 'react';
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
});




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
