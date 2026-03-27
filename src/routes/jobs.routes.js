/**
 * Jobs routes.
 *
 * This router groups public read endpoints, authenticated write endpoints,
 * and bookmark mutations scoped to individual jobs.
 */
import { Router } from 'express';
import {
  listAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '#controllers/jobs.controller';
import { createBookmark, deleteBookmark } from '#controllers/bookmarks.controller';
import { requireAuth } from '#middleware/requireAuth';
import { requireJson } from '#middleware/requireJson';

/**
 * Express router for job listing endpoints.
 *
 * This includes nested bookmark create/delete routes for a specific job.
 *
 * @type {import('express').Router}
 */
export const jobsRouter = Router();

jobsRouter.get('/', requireAuth, listAllJobs);
jobsRouter.get('/:id', requireAuth, getJobById);

jobsRouter.post('/', requireAuth, requireJson, createJob);
jobsRouter.patch('/:id', requireAuth, requireJson, updateJob);
jobsRouter.delete('/:id', requireAuth, deleteJob);

jobsRouter.post('/:jobId/bookmark', requireAuth, createBookmark);
jobsRouter.delete('/:jobId/bookmark', requireAuth, deleteBookmark);
