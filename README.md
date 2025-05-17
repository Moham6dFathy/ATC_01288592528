# Event Booking System

**Project Description**

The Event Booking System is a full-stack application designed to enable users to browse, register, and manage bookings for various events. The backend is built with NestJS for scalability and modularity, while the frontend leverages React and Vite for a fast, responsive user experience.

---

**Table of Contents**

1. [Project Description](#project-description)
2. [Installation Instructions](#installation-instructions)
3. [Usage Guide](#usage-guide)
4. [Code Structure & Architecture](#code-structure--architecture)
5. [API Documentation](#api-documentation)
6. [Admin Dashboard Access](#admin-dashboard-access)
6. [Configuration](#configuration)
7. [Deployment Instructions](#deployment-instructions)
8. [Contributing](#contributing)
9. [License](#license)
10. [Credits & Acknowledgments](#credits--acknowledgments)

---

## Project Description

Event Booking System provides:

- **Event Discovery**: Browse upcoming events by category and date.
- **User Authentication**: Secure sign-up and login flow.
- **Booking Management**: Book seats, view, and cancel bookings.
- **Admin Dashboard**: CRUD operations for events, categories , Bookings and Users.

---

## Installation Instructions

### Prerequisites

- Node.js (>= 16.x) and npm
- MongoDB instance (local or hosted)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Moham6dFathy/ATC_01288592528.git
cd ATC_01288592528/Backend

# Install dependencies
npm install
# or yarn install

# Copy environment template and configure
cp .development.env .env
# Edit .env to set MONGODB_URI, JWT_SECRET, etc.

# Run in development mode
npm run start:dev
```

The server will run on `http://localhost:3000/` by default.

### Frontend Setup

```bash
cd ../Frontend

# Install dependencies
npm install
# or yarn install

# Copy and configure
cp .env.example .env
# Set VITE_API_URL=http://localhost:3000/api

# Run development server
npm run dev
```

The app will be available at `http://localhost:8080/`.

---

## Usage Guide

### Backend

- **Start server**: `npm run start:dev` (reloads on file changes)
- **Build**: `npm run build` → outputs to `dist/`
- **Production**: `npm run start:prod` → runs compiled build

### Frontend

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build` → outputs to `dist/`
- **Preview**: `npm run preview`

### UI Walkthrough

1. **Home Page**: Browse featured events.
2. **Event Details**: Click an event to view details and book.
3. **Profile**: View your upcoming bookings.
4. **Admin**: Accessible at `/admin` for managing events, categories, bookings and Users.

---

## Code Structure & Architecture

```
root/
├─ Backend/        # NestJS REST API
│  ├─ src/         # Application source code
│  │  ├─ modules/  # Feature modules (auth, events, category, booking)
│  │  ├─ guards/   # Route guards
│  │  ├─ interceptors/
│  │  ├─ filters/  # Exception filters
│  │  └─ main.ts   # Bootstrap
│  ├─ test/        # End-to-end tests
│  └─ dist/        # Compiled JavaScript output

├─ Frontend/       # React + Vite
│  ├─ src/
│  │  ├─ components/ # Shared UI and admin components
│  │  ├─ pages/      # Route views (Home, Profile, Admin)
│  │  ├─ services/   # API client modules
│  │  └─ hooks/      # Custom React hooks
│  ├─ public/        # Static assets
│  └─ dist/          # Production build

└─ README.md        # This documentation
```

**Technologies & Libraries**

- **Backend**: NestJS, TypeScript, MongoDB, Mongoose, JWT
- **Frontend**: React, Vite, TypeScript, Tailwind CSS

---
## API Documentation

| Postman : https://documenter.getpostman.com/view/34728288/2sB2qXj2e4

---

## Admin Dashboard Access
- **email**: admin@io.io
- **password**: Admin@2003

---

## Configuration

**Backend** (`Backend/.env`):

```
MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_jwt_secret
PORT=3000
```

**Frontend** (`Frontend/.env`):

```
VITE_API_URL=http://localhost:3000/api
```

---

## Deployment Instructions

1. **Backend**:
   ```bash
   cd Backend
   npm run build
   npm run start:prod
   ```
2. **Frontend**:
   ```bash
   cd Frontend
   npm run build
   serve -s dist  # or use any static file server
   ```
3. Configure your production environment variables accordingly and ensure network rules allow connectivity between front and backends.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "feat: Your feature"`
4. Push to branch: `git push origin feature/YourFeature"`
5. Open a Pull Request.

Please adhere to the existing code style and include tests where appropriate.

---

## Credits & Acknowledgments

- Built with [NestJS](https://nestjs.com/) for the backend.
- Frontend scaffolded with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/).
- UI designed using [Tailwind CSS](https://tailwindcss.com/).
- Thanks to all open-source contributors and community plugins.
