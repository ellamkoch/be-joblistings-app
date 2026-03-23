# be-joblistings-app

This is the repo for my Capstone for Level 4 of CodeX, where we're building a full stack web app.

The goal of this project is to build a RESTful API for a Job Listings application using Express, Prisma, and PostgreSQL via Supabase to start. If time, the database and all will be on AWS.

This backend will support authentication, job listings, and user-specific bookmarks, and will be deployed to AWS.

## Built With

- Node.js
- Express
- PostgreSQL (Supabase)
- Prisma ORM
- JSON Web Tokens (JWT)
- bcryptjs
- Custom query parsing helpers (pagination, CSV, boolean)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/ellamkoch/be-joblistings-app
cd be-joblistings-app
```

2. Install dependencies: `npm install`
3. Set up environment variables:

   Create a `.env` file in the root of the project using the provided example:

   ```
   cp .env.example .env
   ```

   Then update the values in `.env` per the example file.
4. Apply database migrations: `npm run db:migrate:dev`
5. Generate Prisma client: `npm run db:generate`
6. Start the development server: `npm run dev`

### Scripts

- `npm run dev` – start the development server
- `npm start` – start the server
- `npm test` – run tests
- `npm run db:migrate:dev` – apply local Prisma migrations during development
- `npm run db:generate` – generate the Prisma client
- `npm run db:migrate:deploy`
- `npm run db:seed`
- `npm run db:reset`

## API Endpoints

> To be documented as routes are implemented.

### Auth

* `POST /auth/register` – create a new user account
* `POST /auth/login` – authenticate user and return JWT
* `POST /auth/logout` – revoke current token (blacklist-based invalidation)

### Jobs

* `GET /jobs` – list jobs with pagination support (`limit`, `page`)
* `GET /jobs/:id` – get a single job by id
* `POST /jobs` – create a new job (authenticated)
* `PATCH /jobs/:id` – update a job (authenticated, owner only)
* `DELETE /jobs/:id` – delete a job (authenticated, owner only)

### Bookmarks

- TBD

## Authentication

* Uses JWT (JSON Web Tokens) for authentication
* Tokens are passed via `Authorization: Bearer <token>`
* Protected routes are enforced via middleware
* Token revocation is implemented using a blacklist strategy (hashed tokens stored in the database)

## Project Status

### Completed

* Express app scaffolded using createApp pattern
* Global middleware configured (helmet, cors, morgan, JSON parsing)
* Request ID middleware implemented
* Standardized response envelope implemented
* Global error handler + HttpError pattern implemented
* Not found handler implemented
* Health route (`/health`) verified
* Environment configuration set up (`.env` + `.env.example`)
* Supabase PostgreSQL database configured
* Prisma installed and initialized
* Database connection configured via `DATABASE_URL`
* Prisma schema created (User, Job, Bookmark, RevokedToken)
* Database migrations applied
* User authentication implemented (register/login)
* JWT-based authentication middleware implemented
* Protected route support added
* Token revocation (logout) implemented
* Jobs resource implemented (CRUD)
* Jobs repository created and integrated with Prisma
* Jobs controller implemented with validation and normalization
* Pagination support implemented for job listing endpoint
* Query parameter helpers implemented (boolean + CSV parsing)
* Ownership checks enforced for update and delete operations
* Partial update (PATCH) behavior implemented with field-level validation

### Not Started

- Bookmarks resource
- Deployment (AWS)
- README endpoint documentation

## API Testing (Postman)

The following endpoints have been tested using Postman:

### Register

- Successfully creates a new user and returns a JWT

### Login

- Authenticates a user and returns a JWT

### Protected Route

- Requires a valid Bearer token
- Returns 401 if token is missing or invalid

### Logout (Token Revocation)

- Revokes the current token
- Subsequent requests with the same token are rejected

> Screenshots available demonstrating successful and failed requests in the screenshots folder in github repo.

### Jobs – Behavior Notes

- PATCH updates only modify provided fields; omitted fields remain unchanged
- Required string fields cannot be updated to empty values
- Optional string fields are set to `null` when sent as blank
- Boolean fields accept both boolean and string values (`true`, `false`, `1`, `0`)
- CSV fields (languages, tools) are normalized into comma-separated strings
- Job listings are ordered by `postedAt` (newest first)
