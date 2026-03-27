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

  app.use(cors({
    origin(origin, callback) {
      if (!origin || origin === config.ALLOWED_ORIGIN) {
        return callback(null,true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

 app.use((err, req, res, next) => {
     next();
  });

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
