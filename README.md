# EventSphere – Smart Event & Venue Management Platform

<p align="center">
  <strong>A Full-Stack Web Application for Seamless Event and Venue Management</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=nodedotjs" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel" alt="Vercel"/>
  <img src="https://img.shields.io/badge/API-Express-lightgrey?logo=express" alt="Express"/>
</p>

---

## Overview

**EventSphere** is a full-stack Smart Event and Venue Management Platform developed as a Full Stack Development (FSD) micro-project.

The platform provides a centralized environment for managing events, venues, registrations and user interactions. It supports three major user roles—Administrators, Event Organizers and Participants—each with role-specific access and functionality.

EventSphere aims to simplify event management by bringing event organization, venue coordination and participant registration into a single web-based application.

The application follows a modern client-server architecture using React for the frontend, Node.js and Express.js for backend services, and MongoDB for persistent data storage.

## Live Application

| Resource | Link |
|---|---|
| Live Frontend | [EventSphere – Vercel](https://event-sphere-blond.vercel.app) |
| Backend API | [EventSphere API – Render](https://eventsphere-api-m8c4.onrender.com) |
| API Health Check | [Health Endpoint](https://eventsphere-api-m8c4.onrender.com/api/health) |
| GitHub Repository | [Sumit-Barve/EventSphere](https://github.com/Sumit-Barve/EventSphere) |

## Key Features

### 1. Role-Based Access

EventSphere supports three primary user roles:

- **Administrator:** Platform-level management and administrative operations.
- **Event Organizer:** Event creation and management operations.
- **Participant:** Event discovery, registration and participation-related activities.

### 2. Event Management

- Create and manage events.
- Maintain event descriptions and details.
- Manage event information and status.
- Associate events with venues and organizers.

### 3. Venue Management

- Maintain venue information.
- Store venue location and capacity details.
- Associate venues with scheduled events.
- Manage venue-related information.

### 4. Participant Registration

- Allow participants to register for events.
- Maintain event registration records.
- Track registration status.
- Persist registration information in the database.

### 5. Authentication and Security

- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based authorization.
- Protected backend routes.
- Input validation and sanitization.
- Security headers and API rate limiting.

### 6. Real-Time Communication

- Socket.IO-based real-time communication.
- Real-time notification support.
- Frontend socket integration.

### 7. Review and Notification Support

- Event-related review functionality.
- Notification management.
- Notification read-state tracking.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| State Management | React Context API |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB |
| ODM | Mongoose 8 |
| Authentication | JWT, bcrypt |
| Real-Time Communication | Socket.IO |
| API Security | Helmet, express-rate-limit, express-validator, express-mongo-sanitize |
| Version Control | Git, GitHub |
| CI | GitHub Actions |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Database Hosting | MongoDB Atlas |
| Containerization | Docker, Docker Compose |

## System Architecture

EventSphere follows a layered client-server architecture.

```text
                 USERS
       ┌──────────┼───────────┐
       │          │           │
    Admin     Organizer   Participant
       │          │           │
       └──────────┼───────────┘
                  │
          ┌───────▼────────┐
          │ React Frontend │
          │  React + Vite  │
          │ Tailwind CSS   │
          └───────┬────────┘
                  │
           HTTP / WebSocket
                  │
          ┌───────▼────────┐
          │  Node.js API   │
          │   Express.js   │
          │   Socket.IO    │
          └───────┬────────┘
                  │
          ┌───────▼────────┐
          │ Application    │
          │ Logic &        │
          │ Security       │
          └───────┬────────┘
                  │
          ┌───────▼────────┐
          │   Mongoose     │
          │      ODM       │
          └───────┬────────┘
                  │
          ┌───────▼────────┐
          │    MongoDB     │
          │  Database      │
          └────────────────┘
```

## Project Structure

The repository is organized into separate frontend and backend applications.

```text
EventSphere/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── client/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   └── vercel.json
│
├── server/
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
└── .gitignore
```

## Getting Started

Follow these instructions to run EventSphere locally.

### Prerequisites

Make sure the following software is installed:

- Node.js (Node.js 22 or a compatible supported version)
- npm
- MongoDB Community Server or a MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Sumit-Barve/EventSphere.git
```

```bash
cd EventSphere
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Configure Frontend Environment

Create a `.env` file inside the `client` directory.

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Start the Frontend

```bash
npm run dev
```

The frontend development server will normally be available at:

`http://localhost:5173`

### 5. Install Backend Dependencies

Open another terminal:

```bash
cd EventSphere/server
npm install
```

### 6. Configure Backend Environment

Create a `.env` file inside the `server` directory using `.env.example` as the reference.

Configure the following variables with your own local values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eventsphere
CLIENT_URL=http://localhost:5173

JWT_SECRET=replace_with_a_strong_random_secret
JWT_EXPIRES_IN=1d
```

Configure SMTP variables if email functionality is required.

**Security note:** Never commit `.env` files, database credentials, JWT secrets or other private configuration values to GitHub.

### 7. Start the Backend

```bash
npm run dev
```

The backend API will normally run at:

`http://localhost:5000`

To start the backend using the production start script:

```bash
npm start
```

## Available Scripts

### Frontend

Run these commands from the `client` directory.

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production frontend build |
| `npm run lint` | Runs frontend lint checks |
| `npm run preview` | Previews the production build locally |

### Backend

Run these commands from the `server` directory.

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server using Nodemon |
| `npm start` | Starts the production server |
| `npm run seed` | Runs the database seed script |
| `npm run seed:users` | Runs the user seed script |

## Testing and Quality Checks

The project uses automated checks to improve code quality and catch common development issues.

The GitHub Actions workflow includes:

- Frontend dependency installation.
- Frontend lint checks.
- Frontend production build.
- Backend dependency installation.
- Backend JavaScript syntax checks.

The backend also provides a health endpoint:

```http
GET /api/health
```

A successful response confirms that the API is running and the configured database connection is available.

## CI and Deployment

EventSphere uses separate services for source control, continuous integration and hosting.

| Component | Platform | Purpose |
|---|---|---|
| Source Code | GitHub | Repository and version control |
| Continuous Integration | GitHub Actions | Lint, build and syntax validation |
| Frontend | Vercel | Frontend hosting |
| Backend | Render | Backend API hosting |
| Database | MongoDB Atlas | Production database |

### CI Workflow

The GitHub Actions workflow is located at:

`.github/workflows/ci.yml`

It is configured to run automated checks when code is pushed to the `main` branch or when a pull request targets `main`.

### Deployment Workflow

The application uses Vercel and Render for hosting. When automatic deployment is enabled in the respective hosting services, changes pushed to the configured GitHub branch can trigger new deployments.

## Docker Containerization

EventSphere also includes Docker configuration for containerized execution.

The project contains:

- `client/Dockerfile` – builds the frontend and serves the production build through Nginx.
- `server/Dockerfile` – builds the backend container.
- `docker-compose.yml` – coordinates the frontend and backend services.

### Run with Docker Compose

From the project root directory:

```bash
docker compose build
```

Start the services:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

Access the containerized frontend:

`http://localhost:8080`

Stop the containers:

```bash
docker compose down
```

The current local Compose configuration expects MongoDB to be available on the host machine.

## Security Considerations

Security is an important part of EventSphere's backend design.

The application uses or integrates the following security mechanisms:

- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based access control.
- Protected API routes.
- Request validation.
- MongoDB query sanitization.
- HTTP security headers using Helmet.
- Rate limiting to reduce excessive API requests.
- Environment variables for sensitive configuration.

Sensitive credentials should always be maintained outside the source repository.

## Future Enhancements

Potential future improvements include:

- Online payment gateway integration.
- QR-code-based event entry and ticket verification.
- Advanced event analytics and reporting.
- Email and SMS notification integration.
- Calendar synchronization.
- Advanced venue availability management.
- Improved automated backend test coverage.
- Enhanced accessibility and mobile responsiveness.

These are proposed enhancements and are not presented as completed features.

## Contributors

**Project Developer**

**Sumit Barve**

Full Stack Development (FSD) – Mini Project

GitHub: [Sumit-Barve](https://github.com/Sumit-Barve)

## Acknowledgements

This project was developed as part of the Full Stack Development academic curriculum. Special thanks to the faculty for their guidance and support throughout the development process.

## License

This repository is currently a public academic project. No separate open-source license has been specified.

---

<p align="center">
  <strong>EventSphere – Simplifying Event and Venue Management</strong>
  <br/>
  Built with React, Node.js, Express.js and MongoDB.
</p>
