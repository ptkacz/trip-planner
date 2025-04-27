# TripPlanner (MVP) test3

## Table of Contents
- [Project Name](#project-name)
- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Name
TripPlanner (MVP)

## Project Description
TripPlanner (MVP) is an AI-powered trip planning application that simplifies the process of organizing trips. It allows users to quickly jot down notes about potential travel destinations and interests, which are then transformed into detailed, personalized travel itineraries. The generated itineraries include authentic places to visit arranged in an optimal sequence, complete with descriptions and distances from the starting point.

## Tech Stack
- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **AI Integration:** Communication with various AI models through Openrouter.ai
- **CI/CD & Hosting:** GitHub Actions for CI/CD pipelines and DigitalOcean for hosting via Docker
- **Testing:** Vitest for unit/integration tests, React Testing Library for component testing, Playwright for E2E tests

## Getting Started Locally
1. **Clone the Repository:**
   ```bash
   git clone git@github.com:ptkacz/trip-planner.git
   cd trip-planner
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Available Scripts
- **npm run dev:** Start development server.
- **npm run build:** Build for production.
- **npm run preview:** Preview production build.
- **npm run lint:** Run ESLint to analyze code quality.
- **npm run lint:fix:** Fix ESLint issues.

## Project Scope
- **User Notes Management:** Create, read, update, and delete trip notes.
- **User Account Management:** Secure registration, login, password updates, and account deletion.
- **User Profile:** Save and update travel preferences including types of destinations, preferred activities, dining options, and more.
- **Trip Plan Generation:** Generate a detailed travel itinerary based on selected notes and user preferences, including locations, descriptions, photos, and distance calculations.
- **Limitations:** The MVP does not include features like plan-sharing between accounts, extensive multimedia support, or advanced real-time routing and cost/time calculations.

## Project Status
This project is currently in the **MVP** stage and under active development.

## License
This project is licensed under the [MIT License](LICENSE). 
