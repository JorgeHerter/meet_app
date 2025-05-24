import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Event from '../components/Event'; // Adjust this import to wherever your Event component is

describe('show/hide event details', () => {
  let eventData;

  beforeEach(() => {
    // Sample event data
    eventData = {
      summary: 'Test Event',
      location: 'Test Location',
      description: 'Test Description',
      start: { dateTime: '2023-06-01T19:00:00' },
    };
  });

  test('event element collapses by default', () => {
    render(<Event event={eventData} />);
    
    // Verify that the summary is visible
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    
    // Verify that the details are not visible
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  test('clicking show details button expands event details', () => {
    render(<Event event={eventData} />);
    
    // Find and click the show details button
    const showDetailsButton = screen.getByRole('button', { name: /show details/i });
    fireEvent.click(showDetailsButton);
    
    // Verify that all details are now visible
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    
    // Verify that button text changed to "Hide Details"
    expect(screen.getByRole('button', { name: /hide details/i })).toBeInTheDocument();
  });

  test('clicking hide details button collapses event details', () => {
    render(<Event event={eventData} />);
    
    // First click to show details
    const showDetailsButton = screen.getByRole('button', { name: /show details/i });
    fireEvent.click(showDetailsButton);
    
    // Then click to hide details
    const hideDetailsButton = screen.getByRole('button', { name: /hide details/i });
    fireEvent.click(hideDetailsButton);
    
    // Verify that details are hidden again
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    
    // Verify that button text changed back to "Show Details"
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });
});