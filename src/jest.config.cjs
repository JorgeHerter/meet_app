module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest', // Ensure .mjs files are transformed
  },
  transformIgnorePatterns: [
    '/node_modules/(?!puppeteer|@puppeteer|debug)/', // Allow transformation of these modules
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'], // Include mjs files
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Maps 'src/' to the appropriate directory
    '\\.css$': 'identity-obj-proxy',  // Mocks CSS imports using identity-obj-proxy
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // Setup for testing-library
  testEnvironment: 'jest-environment-jsdom', // Use jsdom environment for React tests
  moduleDirectories: ['node_modules', 'src'], // Add src folder to module directories
};





