
# Event Booking Platform

A modern event ticketing and booking platform built with React, TypeScript, and Tailwind CSS.

## Features

- Browse and search for events
- View event details and book tickets
- Explore different event categories
- User authentication
- Responsive design for all device sizes

## Tech Stack

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Shadcn UI components
- React Query for data fetching
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
```sh
git clone <REPOSITORY_URL>
cd event-booking
```

2. Install dependencies
```sh
npm install
```

3. Start the development server
```sh
npm run dev
```

The application will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/        # Reusable UI components
├── data/              # Mock data and API utilities
├── hooks/             # Custom React hooks
├── layout/            # Layout components
├── pages/             # Page components
├── styles/            # Global styles
├── types/             # TypeScript types and interfaces
├── App.tsx            # Main app component with routes
├── index.css          # Global CSS
└── main.tsx           # Entry point
```

## Deployment

To build the application for production:

```sh
npm run build
```

## License

[MIT](LICENSE)
