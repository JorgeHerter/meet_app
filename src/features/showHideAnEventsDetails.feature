Feature: Show/Hide Event Details

  Scenario: the event element should be collapsed
    Given the main page is open
    When the event details have not been revealed
    Then the event element should be collapsed

  Scenario: User can expand an event to view details
    Given the main page is open
    When the user clicks on “Show Details”
    Then the event element should expand to display the details

  Scenario: User can collapse an event to hide details
    Given the event details are currently visible
    When the user clicks on “Hide Details”
    Then the event element should collapse and hide the details


