module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',  // Transforms JS/JSX with babel-jest
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',  // Map 'src/' to the appropriate directory
    '\\.css$': 'identity-obj-proxy',    // Mock CSS imports using identity-obj-proxy
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],  // Setup for testing-library
  testEnvironment: 'jest-environment-jsdom',  // Use jsdom environment for React tests
  extensionsToTreatAsEsm: ['.jsx'],  // Handle JSX extensions
  moduleDirectories: ['node_modules', 'src'],  // Add src folder to module directories
};
