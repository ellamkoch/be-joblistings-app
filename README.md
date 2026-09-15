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
- Explore AWS-native PostgreSQL hosting in a future iteration
