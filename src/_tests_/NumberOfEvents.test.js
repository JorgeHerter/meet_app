// src/__tests__/NumberOfEvents.test.js
// src/__tests__/NumberOfEvents.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NumberOfEvents from '../components/NumberOfEvents'; // Adjust path accordingly

describe('<NumberOfEvents /> component', () => {
  test('renders correctly', () => {
    render(<NumberOfEvents />);
    
    // Ensure the input field is rendered
    const inputField = screen.getByRole('spinbutton'); // Use spinbutton role
    expect(inputField).toBeInTheDocument();
  });

  test('has a default value of 32', () => {
    render(<NumberOfEvents />);
    
    // Check if the default value is set to 32
    const inputField = screen.getByRole('spinbutton'); // Use spinbutton role
    expect(inputField.value).toBe('32');
  });

  test('allows typing a value within the allowed range (1-50)', () => {
    render(<NumberOfEvents />);
    
    const inputField = screen.getByRole('spinbutton'); // Use spinbutton role
    
    // Simulate typing a valid value within range
    fireEvent.change(inputField, { target: { value: '25' } });
    expect(inputField.value).toBe('25');
    
    // Simulate typing a value exceeding the max limit
    fireEvent.change(inputField, { target: { value: '60' } });
    expect(inputField.value).toBe('50'); // Value should be capped at 50
    
    // Simulate typing a value below the min limit
    fireEvent.change(inputField, { target: { value: '0' } });
    expect(inputField.value).toBe('1'); // Value should be set to 1
  });

  test('restricts value below 1 and above 50', () => {
    render(<NumberOfEvents />);
    
    const inputField = screen.getByRole('spinbutton'); // Use spinbutton role
    
    // Try entering a value below 1
    fireEvent.change(inputField, { target: { value: '-10' } });
    expect(inputField.value).toBe('1');
    
    // Try entering a value above 50
    fireEvent.change(inputField, { target: { value: '100' } });
    expect(inputField.value).toBe('50');
  });

  test('ensures the value is between 1 and 50 after backspace and typing', () => {
    render(<NumberOfEvents />);
    
    const inputField = screen.getByRole('spinbutton'); // Use spinbutton role
    
    // Try deleting part of the value and typing a new number
    fireEvent.change(inputField, { target: { value: '45' } });
    fireEvent.change(inputField, { target: { value: '10' } }); // Lower within range
    expect(inputField.value).toBe('10');
  });
});

/*test('dummy test', () => {
  expect(true).toBe(true);
});*/


