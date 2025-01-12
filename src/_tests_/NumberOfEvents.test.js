// src/__tests__/NumberOfEvents.test.js
import React from 'react'; // Ensure React is imported
import { render, screen, fireEvent } from '@testing-library/react'; // Import fireEvent here
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders input field for number of events', () => {
    render(<NumberOfEvents />);
    const inputField = screen.getByRole('spinbutton'); // Use spinbutton for numeric inputs
    expect(inputField).toBeInTheDocument();
  });

  test('has a default value of 32 for the input field', () => {
    render(<NumberOfEvents />);
    const inputField = screen.getByRole('spinbutton');
    expect(inputField.value).toBe('32');
  });

  test('updates value when user types', async () => {
    render(<NumberOfEvents />);
    const inputField = screen.getByRole('spinbutton');
    
    // Simulate user typing in the input field
    fireEvent.change(inputField, { target: { value: '45' } });
    
    // Verify that the input value has been updated
    expect(inputField.value).toBe('45');
  });
});



