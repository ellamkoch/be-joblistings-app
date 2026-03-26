# e-joblistings-app

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
- Prisma ORM (including relational queries and composite keys)

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

## Project Status

### Completed

- Express app scaffolded using createApp pattern
- Global middleware configured (helmet, cors, morgan, JSON parsing)
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

### Not Started

- Deployment (AWS)
- Local PostgreSQL db created
- README endpoint documentation

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
