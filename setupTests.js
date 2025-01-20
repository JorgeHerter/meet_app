import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

// Reset fetch mocks before each test
beforeEach(() => {
  fetchMock.resetMocks();
});
