/**
 * Jobs routes.
 *
 * This router groups public read endpoints and authenticated write endpoints
 * for the jobs resource.
 */
import { Router } from 'express';
import {
    listAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
} from '#controllers/jobs.controller';
import { requireAuth } from '#middleware/requireAuth';
import { requireJson } from '#middleware/requireJson';

/**
 * Express router for job listing endpoints.
 *
 * @type {import('express').Router}
 */
export const jobsRouter = Router();

jobsRouter.get('/', listAllJobs);
jobsRouter.get('/:id', getJobById);

jobsRouter.post('/', requireAuth, requireJson, createJob);
jobsRouter.patch('/:id', requireAuth, requireJson, updateJob);
jobsRouter.delete('/:id', requireAuth, deleteJob);
