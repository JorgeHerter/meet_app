# 📆 Meet App

A **serverless, progressive web application (PWA)** built with **React** that allows users to explore upcoming tech events across cities using the **Google Calendar API**. Designed using **Test-Driven Development (TDD)** and deployed with serverless architecture for scalability, offline use, and optimal performance.

---

## 🚀 Features

- 🔍 **Filter Events by City**
- 📋 **Show/Hide Event Details**
- 🔢 **Specify Number of Events**
- 📶 **Use the App When Offline**
- 📲 **Add App Shortcut to Home Screen**
- 📊 **Visualize Events with Charts (City & Genre)**

---

## 🧪 Technical Highlights

- ⚛️ Built with React and Vite
- ✅ TDD using Jest & React Testing Library
- 🔒 OAuth2 authentication via Google Calendar API
- ☁️ Serverless functions (AWS Lambda via Netlify or Vercel)
- 📦 PWA support with Workbox & `vite-plugin-pwa`
- 📉 Data visualization using [Recharts](https://recharts.org/)
- 🌐 Responsive design and cross-browser support (incl. IE11)

---

## 📛 Badges (optional)

> Replace URLs with your actual repo/build/test/deploy links

![Build Status](https://img.shields.io/github/workflow/status/yourusername/meet_app/CI)
![Netlify](https://img.shields.io/netlify/your-netlify-id)
![License](https://img.shields.io/github/license/yourusername/meet_app)

---

## 🛠️ Tech Stack

- **React** (with Hooks)
- **Vite** (for fast dev/build)
- **Jest** / **React Testing Library** (for TDD)
- **Recharts** (for charts)
- **Vercel** / **Netlify** (for serverless backend)
- **Google Calendar API** (OAuth2 flow)
- **Workbox** (offline caching)

---

## ⚙️ Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/meet_app.git
   cd meet_app
🧪 Feature Scenarios (Gherkin Style)
Feature 1: Filter Events By City
Scenario 1: When user hasn’t searched for a city, show upcoming events from all cities
Scenario 2: User should see a list of suggestions when they search for a city
Scenario 3: User can select a city from the suggested list

Feature 2: Show/Hide Event Details
Scenario 1: An event element is collapsed by default
Scenario 2: User can expand an event to see details
Scenario 3: User can collapse an event to hide details

Feature 3: Specify Number of Events
Scenario 1: When user hasn’t specified a number, 32 events are shown by default
Scenario 2: User can change the number of events displayed

Feature 4: Use the App When Offline
Scenario 1: Show cached data when there’s no internet connection
Scenario 2: Show error when user changes search settings while offline

Feature 5: Add App Shortcut to Home Screen
Scenario 1: User can install the meet app as a shortcut on their device home screen

Feature 6: Display Charts Visualizing Event Details
Scenario 1: Show a chart with the number of upcoming events in each city
Scenario 2: Show a chart with event genre distribution
