// playwright.config.js
module.exports = {
    testDir: './e2e-tests',
    use: {
      baseURL: 'https://meet-app-psi.vercel.app',
      headless: true,
    },
  };
  