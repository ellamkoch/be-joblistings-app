
/**
 * Bookmarks routes.
 *
 * This router exposes the authenticated user's bookmark listing endpoint at
 * /me/bookmarks.
 */
import { Router } from 'express';
import { getMyBookmarkedJobs } from '#controllers/bookmarks.controller';
import { requireAuth } from '#middleware/requireAuth';

export const bookmarksRouter = Router();

bookmarksRouter.get('/me/bookmarks', requireAuth, getMyBookmarkedJobs);
