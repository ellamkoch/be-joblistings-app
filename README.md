# Job Listings API

A RESTful backend API for the Job Listings full-stack application, built with Node.js, Express, Prisma, and PostgreSQL.

Originally developed as part of my CodeX Academy Level 4 capstone, this API provides authentication, job management, and user-specific saved jobs for the deployed React frontend.

The project focuses on layered backend architecture, relational data modeling, authentication and authorization, validation, consistent API responses, and deployed frontend-to-backend integration.

---

## Live API

**API:** https://be-joblistings-app.onrender.com

**Frontend:** https://femjoblistings.netlify.app/

The API is deployed on Render and connects to a PostgreSQL database hosted through Supabase.

> **Note:** The backend uses Render's free tier and may take a short time to wake after a period of inactivity.

---

## Key Features

- RESTful API built with Express
- PostgreSQL persistence through Prisma ORM
- User registration, login, and logout
- JWT-based authentication
- Token revocation using a database-backed blacklist
- Protected routes and ownership checks
- Job listing CRUD operations
- User-specific saved jobs/bookmarks
- Pagination support
- Request validation and data normalization
- Standardized API responses and error handling
- Environment-based CORS configuration
- Seed data imported from CSV
- Postman collection for API testing

---

## Tech Stack

**Backend**

- Node.js
- Express
- JavaScript (ES6+)

**Database & Authentication**

- PostgreSQL
- Supabase database hosting
- Prisma ORM
- JSON Web Tokens (JWT)
- bcryptjs

**Development & Testing**

- Vitest
- Supertest
- Postman
- ESLint
- Prettier

**Deployment**

- Render — API
- Supabase — PostgreSQL database

---

## Architecture

The backend follows a layered structure:

```text
Request → Middleware → Controller → Repository → Prisma → PostgreSQL
```

**Middleware** handles cross-cutting concerns including authentication, request IDs, CORS, and error handling.

**Controllers** handle HTTP request and response logic, validation, and normalization.

**Repositories** contain data-access operations and interact with Prisma.

**Prisma** manages relational database access to the Supabase-hosted PostgreSQL database.

This separation keeps HTTP concerns, application logic, and database access distinct and easier to maintain and test.

---

## Authentication

Authentication uses JSON Web Tokens passed through the `Authorization` header:

```text
Authorization: Bearer <token>
```

Protected routes validate the token through authentication middleware.

Logout uses a token-revocation strategy rather than relying only on client-side token removal. Revoked tokens are hashed and stored in the database so previously issued tokens can be rejected after logout.

Job modification routes also enforce ownership so authenticated users cannot update or delete jobs owned by another user.

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| POST   | `/auth/register` | Create a user account         |
| POST   | `/auth/login`    | Authenticate and return a JWT |
| POST   | `/auth/logout`   | Revoke the current token      |

### Jobs

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/jobs`     | List jobs with pagination |
| GET    | `/jobs/:id` | Get a single job          |
| POST   | `/jobs`     | Create a job              |
| PATCH  | `/jobs/:id` | Update an owned job       |
| DELETE | `/jobs/:id` | Delete an owned job       |

### Saved Jobs

| Method | Endpoint                  | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/me/bookmarks`         | List the authenticated user's saved jobs |
| POST   | `/jobs/:jobId/bookmark` | Save a job                               |
| DELETE | `/jobs/:jobId/bookmark` | Remove a saved job                       |

### Health

| Method | Endpoint    | Description                    |
| ------ | ----------- | ------------------------------ |
| GET    | `/health` | Verify that the API is running |

---

## Data Model

The application uses relational models for:

- **User** — account and authentication data
- **Job** — job listing data and ownership
- **Bookmark** — relationship between a user and a saved job
- **RevokedToken** — invalidated authentication tokens

Bookmarks use a composite unique constraint on `userId` and `jobId`, preventing the same user from saving the same job more than once.

Prisma relation queries are used to return associated job data for saved-job requests.

---

## CORS & Environment Configuration

Runtime configuration is managed through environment variables.

The backend supports a comma-separated list of allowed frontend origins through `ALLOWED_ORIGIN`. Requests are accepted when their origin matches the configured list.

Requests without an origin, such as requests from Postman or other server-side tools, are also permitted for testing.

Typical local configuration includes:

```env
ALLOWED_ORIGIN=http://localhost:5173
```

Production configuration includes the deployed Netlify frontend origin.

Other required environment configuration includes the database connection and JWT secret. See `.env.example` for the current configuration template.

---

## Validation & Error Handling

The API includes centralized response and error-handling behavior.

Job updates support partial `PATCH` requests, allowing only supplied fields to be changed. Input handling includes:

- Required-field validation
- Boolean normalization
- CSV field normalization for languages and tools
- Optional string handling
- Ownership validation
- Not-found handling
- Authentication and authorization errors
- Duplicate bookmark prevention

The API also uses request IDs and a standardized response envelope to make responses and errors easier to trace.

---

## Seed Data

Job seed data can be imported from CSV using Prisma.

The seed process:

- Parses job data from CSV
- Converts dates and booleans into appropriate database values
- Normalizes multiline language and tool fields
- Creates or reuses a dedicated seed user
- Avoids duplicating seeded jobs when rerun

Run the seed process with:

```bash
npm run db:seed
```

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/ellamkoch/be-joblistings-app.git
cd be-joblistings-app
```

Install dependencies:

```bash
npm install
```

Create a local environment file from the provided example:

```bash
cp .env.example .env
```

Update the environment values, then generate the Prisma client:

```bash
npm run db:generate
```

Apply development migrations:

```bash
npm run db:migrate:dev
```

Optionally seed the database:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Verify the API with:

```text
GET /health
```

---

## Testing

The backend includes automated testing with Vitest and Supertest.

```bash
npm test
```

A Postman collection is also included for manual API testing. It covers authentication, protected routes, job CRUD operations, bookmarks, validation, authorization, and error responses.

---

## Production Deployment

The API is deployed as a Render web service.

Production deployment uses:

- `process.env.PORT` for the runtime port
- `prisma generate` to generate Prisma Client
- `prisma migrate deploy` for production migrations
- Render environment variables for database, JWT, and CORS configuration

Development uses `prisma migrate dev`; production uses `prisma migrate deploy`.

---

## What I Learned

This project strengthened my understanding of:

- Designing a RESTful API with Express
- Separating routes, controllers, repositories, and middleware
- Modeling relational data with Prisma and PostgreSQL
- Implementing JWT authentication and authorization
- Enforcing resource ownership
- Managing token revocation
- Validating and normalizing API input
- Connecting separately deployed frontend and backend applications
- Configuring CORS and environment variables across environments
- Testing API behavior and debugging full-stack data flow

---

## Frontend Repository

The React frontend is maintained separately:

https://github.com/ellamkoch/fem-joblistings-app

---

## Future Improvements

Potential future enhancements include:

- Expand automated integration test coverage
- Continue refining API validation
- Add additional filtering and search capabilities
- Explore AWS-native PostgreSQL hosting in a future iterati

# be-joblistings-app

This is the repo for my Capstone for Level 4 of CodeX, where we're building a full stack web app.

This project implements a RESTful API for a Job Listings application using Express, Prisma, and PostgreSQL (Supabase-hosted).

This backend supports authentication, job listings, and user-specific bookmarks, and is currently deployed on Render.

## Links

Live API URL: https://be-joblistings-app.onrender.com

GitHub Repository: https://github.com/ellamkoch/be-joblistings-app

## Built With

- Node.js
- Express
- PostgreSQL (Supabase)
- JSON Web Tokens (JWT)
- bcryptjs
- Custom query parsing helpers (pagination, CSV, boolean)
- Prisma ORM (relational queries, composite keys)

## Architecture Overview

This backend follows a layered architecture:

Request → Middleware → Controller → Repository → Prisma → Database

- **Middleware** handles cross-cutting concerns (auth, validation, request IDs)
- **Controllers** handle HTTP request/response logic
- **Repositories** contain data access and business rules
- **Prisma** manages database interaction with Supabase Postgres

This separation keeps the API maintainable, testable, and easy to reason about.

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

Typical local development flow:

1. Start the database (if applicable)
2. Run migrations: `npm run db:migrate:dev`
3. Generate Prisma client: `npm run db:generate`
4. Seed data (optional): `npm run db:seed`
5. Start server: `npm run dev`

### Environment Variables

Environment variables are defined in `.env.example`.

These include configuration for the database connection, JWT authentication, and allowed CORS origins.

Values should be set locally in a `.env` file and configured in the Render dashboard for production.

### Quick Test

Once the server is running, verify the API is working:

- GET /health → returns a success response using the standardized response envelope

This endpoint is useful for confirming the server is running locally or in production.

### Scripts

- `npm run dev` – start the development server
- `npm start` – start the server
- `npm test` – run tests
- `npm run db:migrate:dev` – apply local Prisma migrations during development
- `npm run db:generate` – generate the Prisma client
- `npm run db:migrate:deploy`
- `npm run db:seed`
- `npm run db:reset`

### Seed Data

Job seed data is imported from a CSV through a Prisma seed script.

The seed script:

- parses CSV rows for the jobs table only
- converts booleans and dates into proper database types
- normalizes multiline language/tool fields
- creates or reuses a dedicated seed user
- skips duplicate seeded jobs on rerun

Run with:

`npm run db:seed`

## Production / Deployment Notes

This backend is deployed as a web service on Render.

Key deployment details:

- The server uses `process.env.PORT` to bind to the correct runtime port
- Prisma migrations are applied during deployment using: `npx prisma migrate deploy`
- Prisma Client is generated during build: `npx prisma generate`
- Environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGIN`) are configured in the Render dashboard

Note:

- `prisma migrate dev` is used locally for development only
- Production deployments use `prisma migrate deploy` and do not require a shadow database

## API Endpoints

### Auth

- `POST /auth/register` – create a new user account
- `POST /auth/login` – authenticate user and return JWT
- `POST /auth/logout` – revoke current token (blacklist-based invalidation)

### Jobs

- `GET /jobs` – list jobs with pagination support (`limit`, `page`)
- `GET /jobs/:id` – get a single job by id
- `POST /jobs` – create a new job (authenticated)
- `PATCH /jobs/:id` – update a job (authenticated, owner only)
- `DELETE /jobs/:id` – delete a job (authenticated, owner only)

#### Jobs - Behavior Notes

- PATCH updates only modify provided fields; omitted fields remain unchanged
- Required string fields cannot be updated to empty values
- Optional string fields are set to `null` when sent as blank
- Boolean fields accept both boolean and string values (`true`, `false`, `1`, `0`)
- CSV fields (languages, tools) are normalized into comma-separated strings
- Job listings are ordered by `postedAt` (newest first)

### Bookmarks

- `GET /me/bookmarks` – list the authenticated user’s bookmarked jobs (with pagination support)
- `POST /jobs/:jobId/bookmark` – save (bookmark) a job for the authenticated user
- `DELETE /jobs/:jobId/bookmark` – remove (unsave) a bookmarked job for the authenticated user

#### Bookmarks – Behavior Notes

- Bookmarks represent a relationship between a user and a job
- A user can only bookmark a job once (enforced via unique constraint)
- Attempting to bookmark the same job twice returns a `400 Bad Request`
- Bookmark creation and deletion are scoped to the authenticated user
- Bookmark listing is exposed through a current-user endpoint (`/me/bookmarks`)
- Deleting a bookmark that does not exist returns a `404 Not Found`
- Bookmarked jobs are returned with selected job fields (not full job objects)
- Bookmark list is ordered by `createdAt` (newest first)

## Authentication

- Uses JWT (JSON Web Tokens) for authentication
- Tokens are passed via `Authorization: Bearer <token>`
- Protected routes are enforced via middleware
- Token revocation is implemented using a blacklist strategy (hashed tokens stored in the database)

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured to allow only trusted frontend origins to access the API.

Implementation details:

- CORS is configured using the `cors` middleware in the `createApp` factory
- The allowed origin is defined via the `ALLOWED_ORIGIN` environment variable
- The value is validated in `env.js` and passed into the app configuration
- Non-browser tools (such as Postman) are allowed by permitting requests with no origin

Example configuration: ALLOWED_ORIGIN=http://localhost:5173

Behavior:

- Requests from the configured origin are allowed
- Requests from other origins are rejected
- Requests without an origin (e.g., Postman) are allowed for testing

Architecture notes:

- Environment variables are loaded and validated in `env.js`
- The validated config is passed into `createApp`
- CORS middleware reads from the config object, keeping environment logic separate from application logic

### Multiple Origin Support

The backend supports both local development and the deployed frontend.

- `ALLOWED_ORIGIN` is configured to allow the active frontend origin
- In development, this is typically `http://localhost:5173`
- In production, this is set to the CloudFront domain

The server also allows requests with no origin (e.g., Postman) for testing purposes.

## Project Status

### Completed

- Express app scaffolded using createApp pattern
- Global middleware configured (helmet, cors with environment-based origin control, morgan, JSON parsing)
- Request ID middleware implemented
- Standardized response envelope implemented
- Global error handler + HttpError pattern implemented
- Not found handler implemented
- Health route (`/health`) verified
- Environment configuration set up (`.env` + `.env.example`)
- Supabase PostgreSQL database configured
- Prisma installed and initialized
- Database connection configured via `DATABASE_URL`
- Prisma schema created (User, Job, Bookmark, RevokedToken)
- Database migrations applied
- User authentication implemented (register/login)
- JWT-based authentication middleware implemented
- Protected route support added
- Token revocation (logout) implemented
- Jobs resource implemented (CRUD)
- Jobs repository created and integrated with Prisma
- Jobs controller implemented with validation and normalization
- Pagination support implemented for job listing endpoint
- Query parameter helpers implemented (boolean + CSV parsing)
- Ownership checks enforced for update and delete operations
- Partial update (PATCH) behavior implemented with field-level validation
- Bookmarks resource implemented (save, list, delete)
- Bookmarks repository created and integrated with Prisma
- User ↔ Job bookmark relationship modeled using a join table
- Composite unique constraint enforced on (userId, jobId) to prevent duplicates
- Bookmark create/delete implemented as job-scoped actions (`/jobs/:jobId/bookmark`)
- Bookmark list endpoint implemented as current-user-scoped (`/me/bookmarks`)
- Pagination support added to bookmark listing
- Nested job data returned using Prisma relation queries (select-based shaping)
- Duplicate bookmark prevention handled at both controller and database levels
- Proper error handling implemented for not found, duplicate, and unauthorized states

### Status

The backend API is fully implemented and deployed.

Core functionality is complete, including:

- Authentication (register, login, logout with token revocation)
- Jobs resource (CRUD with ownership enforcement)
- Bookmarks resource (user-specific save/remove/list)
- Prisma integration with Supabase Postgres
- End-to-end persistence verified through deployed frontend

### Future Improvements

* Explore migrating database hosting to an AWS-native PostgreSQL solution in a future iteration

### Notes

AWS Lambda deployment was not used due to Prisma connection constraints in serverless environments. Render was used instead to provide stable database connectivity while still meeting the requirement of a deployed API.

## API Testing (Postman)

The following endpoints have been tested using Postman. Screenshots available demonstrating successful and failed requests in the screenshots folder in github repo.

### Health

- Confirms the API is running and reachable (200 OK)
- Returns a simple success response with request metadata
- Used to verify server status during development and deployment

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

### Jobs

- Successfully creates a job when authenticated (201 Created)
- Returns all jobs with pagination support (200 OK)
- Retrieves a single job by id (200 OK)
- Returns 404 when requesting a non-existent job
- Updates a job successfully when authenticated as the owner (200 OK)
- Prevents updates by non-owners (403 Forbidden)
- Enforces validation rules on update (400 Bad Request for invalid or empty required fields)
- Deletes a job successfully when authenticated as the owner (204 No Content)
- Prevents deletion by non-owners (403 Forbidden)
- Returns 401 when attempting to access protected job routes without a valid token
- Supports multiple PATCH scenarios including:

  - simple field updates
  - boolean field updates
  - clearing optional fields
  - validation failures for invalid input

### Bookmarks

- Successfully saves a job as a bookmark (201 Created)
- Prevents duplicate bookmarks (400 Bad Request)
- Returns bookmarked jobs for the authenticated user (200 OK)
- Deletes a bookmark successfully (204 No Content)
- Returns 404 when attempting to delete a non-existent bookmark
- Requires a valid Bearer token for all bookmark endpoints
- Returns 401 when token is missing, invalid, or revoked

### Postman Usage Notes

A Postman collection is included in the repository to simplify testing.

- Import the collection into Postman to run all requests
- Set the `baseUrl` and `token` variables as needed
- Authentication-protected routes require a valid Bearer token
- The `token` variable is automatically set after successful login
- Some requests rely on previously created data (e.g., jobId)
- Ensure Authorization headers are enabled when testing protected endpoints

Typical flow for testing:

1. Register a new user or log in to obtain a token
2. Create a job
3. Use the returned jobId for update, delete, and bookmark requests
4. Test bookmark save, list, and delete endpoints

- Ensure Authorization headers are enabled when testing protected endpoints
