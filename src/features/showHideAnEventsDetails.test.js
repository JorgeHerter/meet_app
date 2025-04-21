import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import App from '../App';

// Mock events data
const mockEventsData = [
  {
    id: 1,
    title: 'Sample Event',
    details: 'Some details...',
    location: 'Somewhere',
    start: '2025-05-01T10:00:00Z',
  },
];

// Mocking fetch and other global functions
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ events: mockEventsData }),
  })
);

jest.mock('../api', () => ({
  getEvents: jest.fn(() => Promise.resolve(mockEventsData)),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  getAuthURL: jest.fn(() => Promise.resolve('https://example.com')),
}));

// JSDOM mocks
delete window.location;
window.location = { href: jest.fn() };
global.alert = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

const feature = loadFeature(require.resolve('./showHideAnEventsDetails.feature'));

defineFeature(feature, (test) => {
  let AppComponent;
  let EventList;

  const setup = async () => {
    AppComponent = render(<App />);
    await waitFor(() =>
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument()
    );
    EventList = AppComponent.container.querySelector('#event-list');
  };

  test('the event element should be collapsed', ({ given, when, then }) => {
    given('the main page is open', async () => {
      await setup();
    });

    when('the event details have not been revealed', () => {
      // No interaction needed
    });

    then('the event element should be collapsed', async () => {
      const firstEvent = within(EventList).getAllByRole('listitem')[0];
      const details = firstEvent.querySelector('.event-details');
      expect(details).not.toBeInTheDocument();
    });
  });

  test('User can expand an event to view details', ({ given, when, then }) => {
    given('the main page is open', async () => {
      await setup();
    });

    when('the user clicks on “Show Details”', async () => {
      const firstEvent = within(EventList).getAllByRole('listitem')[0];
      const button = within(firstEvent).getByText('Show Details');
      fireEvent.click(button);
    });

    then('the event element should expand to display the details', async () => {
      const firstEvent = within(EventList).getAllByRole('listitem')[0];
      await waitFor(() => {
        expect(firstEvent.querySelector('.event-details')).toBeInTheDocument();
      });
    });
  });

  test('User can collapse an event to hide details', ({ given, when, then }) => {
    let firstEvent;

    given('the event details are currently visible', async () => {
      await setup();
      firstEvent = within(EventList).getAllByRole('listitem')[0];
      const showDetailsButton = within(firstEvent).getByText('Show Details');
      fireEvent.click(showDetailsButton);
      await waitFor(() =>
        expect(firstEvent.querySelector('.event-details')).toBeInTheDocument()
      );
    });

    when('the user clicks on “Hide Details”', async () => {
      const hideDetailsButton = within(firstEvent).getByText('Hide Details');
      fireEvent.click(hideDetailsButton);
    });

    then('the event element should collapse and hide the details', async () => {
      await waitFor(() => {
        expect(firstEvent.querySelector('.event-details')).not.toBeInTheDocument();
      });
    });
  });
});

/*import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import App from '../App';

const feature = loadFeature(require.resolve('./showHideAnEventsDetails.feature'));

defineFeature(feature, (test) => {
  let AppComponent;
  let EventList;

  // Setup helper: renders the app and waits for it to finish loading
  const setup = async () => {
    AppComponent = render(<App />);
    await waitFor(() => {
      expect(AppComponent.queryByTestId('loading')).not.toBeInTheDocument();
    });
    EventList = AppComponent.container.querySelector('#event-list');
  };

  // SCENARIO: Event is collapsed by default
  test('the event element should be collapsed', ({ given, when, then }) => {
    given('the main page is open', async () => {
      await setup();
    });

    when('the event details have not been revealed', () => {
      // No user interaction required
    });

    then('the event element should be collapsed', async () => {
      const firstEvent = within(EventList).getAllByRole('listitem')[0];
      const details = firstEvent.querySelector('.event-details');
      expect(details).not.toBeInTheDocument();
    });
  });

  // SCENARIO: User expands an event
  test('User can expand an event to view details', ({ given, when, then }) => {
    given('the main page is open', async () => {
      await setup();
    });

    when('the user clicks on “Show Details”', async () => {
      const firstEvent = within(EventList).getAllByRole('listitem')[0];
      const showButton = within(firstEvent).getByText('Show Details');
      fireEvent.click(showButton);
    });

    then('the event element should expand to display the details', async () => {
      const firstEvent = within(EventList).getAllByRole('listitem')[0];
      await waitFor(() => {
        expect(firstEvent.querySelector('.event-details')).toBeInTheDocument();
      });
    });
  });

  // SCENARIO: User collapses an event
  test('User can collapse an event to hide details', ({ given, when, then }) => {
    let firstEvent;

    given('the event details are currently visible', async () => {
      await setup();
      firstEvent = within(EventList).getAllByRole('listitem')[0];
      const showButton = within(firstEvent).getByText('Show Details');
      fireEvent.click(showButton);
      await waitFor(() =>
        expect(firstEvent.querySelector('.event-details')).toBeInTheDocument()
      );
    });

    when('the user clicks on “Hide Details”', async () => {
      const hideButton = within(firstEvent).getByText('Hide Details');
      fireEvent.click(hideButton);
    });

    then('the event element should collapse and hide the details', async () => {
      await waitFor(() => {
        expect(firstEvent.querySelector('.event-details')).not.toBeInTheDocument();
      });
    });
  });
});*/

