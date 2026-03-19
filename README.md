# be-joblistings-app

This is the repo for my Capstone for Level 4 of CodeX, where we're building a full stack web app.

The goal of this project is to build a RESTful API for a Job Listings application using Express, Prisma, and PostgreSQL.

This backend will support authentication, job listings, and user-specific bookmarks, and will be deployed to AWS.

## Built With

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JSON Web Tokens (JWT)
- bcryptjs

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

   Then update the values in `.env`:

   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/job_listings_db"
   JWT_SECRET="your_jwt_secret"
   PORT=3005
   NODE_ENV=development
   ```
4. Ensure your PostgreSQL database exists:job_listings_db
5. Apply database migrations: `npm run db:migrate:dev`
6. Generate Prisma client: `npm run db:generate`
7. Start the development server: `npm run dev`

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

- POST /auth/register
- POST /auth/login

### Jobs

- TBD

### Bookmarks

- TBD

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
- PostgreSQL database created locally
- Prisma installed and initialized
- Database connection configured via `DATABASE_URL`

### In Progress

- Prisma schema modeling (User, Job, Bookmark)

### Not Started

- Authentication endpoints (register/login)
- JWT auth middleware
- Jobs resource (CRUD)
- Bookmarks resource
- Protected routes
- Deployment (AWS)
- README endpoint documentation
