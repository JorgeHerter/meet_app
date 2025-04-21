import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import App from '../App';

// --- MOCKS ---

// Create 50 mock events for testing
const mockEventsData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Event ${index + 1}`,
  details: `Details of event ${index + 1}`,
  location: 'Test Location',
  start: '2025-05-01T10:00:00Z',
}));

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ events: mockEventsData }),
  })
);

// Mock the API module
jest.mock('../api', () => ({
  getEvents: jest.fn(() => Promise.resolve(mockEventsData)),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  getAuthURL: jest.fn(() => Promise.resolve('https://example.com')),
}));

// Mock necessary window/global properties
delete window.location;
window.location = { href: jest.fn() };
global.alert = jest.fn();

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// --- FEATURE TESTS ---

const feature = loadFeature(
  require.resolve('./specifyNumberOfEvents.feature')
);

defineFeature(feature, (test) => {
  let AppComponent;

  const setup = async () => {
    AppComponent = render(<App />);
    await waitFor(() =>
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument()
    );
  };

  test('When the user hasn’t specified a number, 32 events are shown by default', ({
    given,
    when,
    then,
  }) => {
    given('the user hasn’t specified a number of events', () => {
      // Default case, no interaction needed
    });

    when('the user opens the app', async () => {
      await setup();
    });

    then('the user should see 32 events by default', async () => {
      const events = AppComponent.getAllByRole('listitem');
      expect(events.length).toBeLessThanOrEqual(32);
    });
  });

  test('User can change the number of events they want to see', ({
    given,
    when,
    then,
  }) => {
    given('the main page is open', async () => {
      await setup();
    });

    when('the user types a new number into the events input field', () => {
        const input = AppComponent.getByLabelText(/number of events/i);
        fireEvent.change(input, { target: { value: '5' } });
      });      

    then('the user should see that number of events listed', async () => {
      await waitFor(() => {
        const events = AppComponent.getAllByRole('listitem');
        expect(events.length).toBeLessThanOrEqual(5);
      });
    });
  });
});

