/**
 * Application factory.
 *
 * This module wires global middleware, shared locals, feature routers, and
 * the final not-found and error handlers.
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { respond } from '#middleware/responds';
import { requestId } from '#middleware/requestId';
import { errorHandler } from '#middleware/errorHandler';
import { notFoundHandler } from '#middleware/notFoundHandler';

import { authRouter } from '#routes/auth.routes';
import { bookmarksRouter } from '#routes/bookmarks.routes';
import { jobsRouter } from '#routes/jobs.routes';

/**
 * Creates and configures the Express application instance.
 *
 * @param {object} options - App dependencies and runtime config.
 * @param {object} options.repos - Repository collection shared through res.locals.
 * @param {object} [options.config={}] - App configuration values.
 * @returns {import('express').Express} The configured Express app.
 */


export function createApp({ repos, config = {} }) {
  const app = express();

  app.locals.config = config;

  app.use(express.json());

  app.use(requestId);

  app.use(helmet());

  app.use(morgan('dev'));

  //built a multi-origin one to allow postman to still be used for testing
  app.use(
    cors({
      origin(origin, callback) {
        // The browser sends an "Origin" header for cross-origin requests
        // Example: https://d37elyh0k3z152.cloudfront.net

        // Postman and some tools do NOT send an Origin header
        // In that case, origin will be undefined

        // We allow requests if:
        // 1) There is no origin (Postman, server-to-server, etc.)
        // 2) The origin is in our allowed list (frontend domains)
        // 3) if config issues occur again, empty array keeps app from crashing. just rejects origin instead. 
        if (!origin || (config.allowedOrigins ?? []).includes(origin)) {
          return callback(null, true);
        }

        // If the origin is not allowed, block the request
        return callback(new Error('Not allowed by CORS'));
      },
    }),
  );
//middleware for tracking errors
//  app.use((err, req, res, next) => {
//      next();
//   });

  app.use(respond);

  app.get('/health', (req, res) => {
    return res.ok({ status: 'ok' });
  });

  app.use((req, res, next) => {
    res.locals.repos = repos;
    next();
  });

  app.use('/auth', authRouter);
  // Mounted without a prefix because the router defines the full /me/bookmarks path.
  app.use(bookmarksRouter);
  app.use('/jobs', jobsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
