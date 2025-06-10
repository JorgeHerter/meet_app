Feature: Specify Number of Events

  Scenario: When the user hasn’t specified a number, 32 events are shown by default
    Given the user hasn’t specified a number of events
    When the user opens the app
    Then the user should see 32 events by default

  Scenario: User can change the number of events they want to see
    Given the main page is open
    When the user types a new number into the events input field
    Then the user should see that number of events listed
