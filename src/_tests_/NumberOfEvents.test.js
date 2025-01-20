// src/__tests__/NumberOfEvents.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NumberOfEvents from '../components/NumberOfEvents'; // Make sure this import is correct

describe('<NumberOfEvents /> component', () => {
  test('renders input field for number of events', () => {
    render(<NumberOfEvents setNumberOfEvents={() => {}} />);
    const inputField = screen.getByRole('spinbutton'); // Use spinbutton for numeric inputs
    expect(inputField).toBeInTheDocument();
  });

  test('has a default value of 32 for the input field', () => {
    render(<NumberOfEvents setNumberOfEvents={() => {}} />);
    const inputField = screen.getByRole('spinbutton');
    expect(inputField.value).toBe('32');
  });

  test('updates value when user types', () => {
    render(<NumberOfEvents setNumberOfEvents={() => {}} />);
    const inputField = screen.getByRole('spinbutton');
    
    // Simulate user typing in the input field
    fireEvent.change(inputField, { target: { value: '45' } });
    
    // Verify that the input value has been updated
    expect(inputField.value).toBe('45');
  });

  test('handles boundary conditions correctly', () => {
    render(<NumberOfEvents setNumberOfEvents={() => {}} />);
    const inputField = screen.getByRole('spinbutton');
    
    // Test that the value cannot go below the minimum value (1)
    fireEvent.change(inputField, { target: { value: '0' } });
    expect(inputField.value).toBe('1');  // Expect '1' when value is below minimum
    
    // Test that the value cannot go above the maximum value (50)
    fireEvent.change(inputField, { target: { value: '100' } });
    expect(inputField.value).toBe('50');  // Expect '50' when value exceeds the maximum
  });
});

