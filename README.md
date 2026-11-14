# Daily Tracker API

REST API for a daily habit/tracker application. It provides user authentication, account management, and CRUD operations for trackers and per-date tracker entries.

## Features

- **Authentication**: sign up with email verification, login, forgot/reset password
- **Account management**: view profile, update email/password, delete account (authenticated)
- **Trackers**: create, list, update, and delete user-owned trackers
- **Daily tracking**: record completion state and notes per tracker/date
- **Health check**: service status endpoint
- **Migrations**: file-based MongoDB migration runner (`up`/`down`)

## Tech Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Auth/Security**: JWT, bcrypt, cookie-parser
- **Validation/Utilities**: Zod, dotenv, CORS, Morgan
- **Email**: Resend
- **Testing**: Vitest, Supertest

## Project Structure

```text
src/
  app.js              # Express app and route mounting
  server.js           # DB connection and HTTP server bootstrap
  config/             # environment and database config
  controllers/        # request handlers
  middlewares/        # auth and error handling
  models/             # Mongoose models (User, Tracker, TrackerDate)
  routes/             # API route definitions
migrations/           # database migrations
scripts/migrate.js    # migration runner
tests/                # test setup and specs
```

## Getting Started

### Prerequisites

- Node.js 24+ (matches Docker image)
- npm
- MongoDB instance
- Resend API key (for auth-related emails)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/express-mongo-template
JWT_SECRET=
JWT_EXPIRY=
RESEND_API_KEY=
EMAIL_SENDER=<whatever>@resend.dev
ALLOWED_ORIGIN=http://localhost:5173
BASE_URL=
```

| Variable | Description |
| --- | --- |
| `PORT` | Port the API server listens on |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRY` | JWT expiration (e.g. token lifetime) |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `EMAIL_SENDER` | Sender address used with Resend |
| `ALLOWED_ORIGIN` | CORS allowed origin (credentials enabled) |
| `BASE_URL` | Base URL used by the application (e.g. links/emails) |

### Run

```bash
# development (nodemon)
npm run dev

# production
npm start
```

The API mounts routes under `/api/v1`.

## API Overview

### Health

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | No | Service health check |

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/signup` | No | Register a new account |
| `GET` | `/api/v1/verify-account/:token` | No | Verify account email |
| `POST` | `/api/v1/login` | No | Authenticate and receive token/session |
| `POST` | `/api/v1/forgot-password` | No | Request password reset |
| `PATCH` | `/api/v1/reset-password/:token` | No | Reset password with token |

### Current User (`/api/v1/me`, authenticated)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/me` | Get current user profile |
| `DELETE` | `/api/v1/me` | Delete current user account |
| `PATCH` | `/api/v1/me/password` | Update password |
| `PATCH` | `/api/v1/me/email` | Update email |

### Trackers (`/api/v1/trackers`, authenticated)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/trackers` | List trackers for current user |
| `POST` | `/api/v1/trackers` | Create a tracker |
| `PATCH` | `/api/v1/trackers/:id` | Update a tracker |
| `DELETE` | `/api/v1/trackers/:id` | Delete a tracker |
| `POST` | `/api/v1/trackers/:id` | Check/record a date entry for a tracker |
| `PATCH` | `/api/v1/trackers/:id/:date` | Update a specific tracker date entry |

## Data Models (high level)

- **User**: account credentials/state and auth-related tokens/metadata
- **Tracker**: a named tracker owned by a user
- **TrackerDate**: per-date record for a tracker (`date`, `isDone`, optional `note`)

## Scripts

```bash
npm run dev          # start in development mode
npm start            # start in production mode
npm test             # run tests (Vitest)
npm run migrate      # run pending migrations (up)
npm run migrate:down # run rollback (down)
```

## Docker

Build and run with Docker:

```bash
docker build -t daily-tracker-api .
docker run --env-file .env -p 3000:3000 daily-tracker-api
```

A `docker-compose.yml` is included in the repository for local/containerized setup.

## License

No license file is included in this repository. Add a `LICENSE` file if you plan to distribute or open-source this project.
