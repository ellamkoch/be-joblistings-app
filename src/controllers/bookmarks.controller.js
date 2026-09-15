import { notFound, forbidden, badRequest } from '#utils/httpErrors';
import { ensure } from '#utils/ensureFieldsGuard';
import { parsePagination } from '#utils/pagination';

/**
 * Lists the authenticated user's bookmarked jobs with shared pagination.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} A paginated bookmark response.
 */
export async function getMyBookmarkedJobs(req, res) {
  const { bookmarks } = res.locals.repos;
  const { limit, page, offset } = parsePagination(req.query);

  const userId = req.user?.id;
  ensure(userId, forbidden('You must be signed in to view bookmarked jobs'));

  const result = await bookmarks.listByUserId({
    userId,
    limit,
    offset,
  });

  return res.ok(result.bookmarkList, {
    pagination: { limit, page, total: result.total },
  });
}

/**
 * Creates a bookmark for the authenticated user and target job.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} The created bookmark.
 */
export async function createBookmark(req, res) {
  const { bookmarks, jobs } = res.locals.repos;
  const userId = req.user?.id;
  ensure(userId, forbidden('You must be signed in to save this job'));

  const jobId = req.params.jobId;
  ensure(jobId, badRequest('Job Id is required'));

  const foundJob = await jobs.getById(jobId);
  ensure(foundJob, notFound('Job not found'));

  const existingBookmark = await bookmarks.findByUserAndJob({ userId, jobId });
  ensure(!existingBookmark, badRequest('Bookmark already exists'));

  const newBookmark = await bookmarks.create({
    jobId,
    userId,
  });

  return res.created(newBookmark);
}

/**
 * Deletes the authenticated user's bookmark for a given job.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} A no-content response on success.
 */
export async function deleteBookmark(req, res) {
  const { bookmarks, jobs } = res.locals.repos;

  const userId = req.user?.id;
  ensure(userId, forbidden('You must be signed in to save this job'));

  const jobId = req.params.jobId;
  ensure(jobId, badRequest('Job id is required'));

  const foundJob = await jobs.getById(jobId);
  ensure(foundJob, notFound('Job not found'));

  const result = await bookmarks.deleteByUserAndJob({ userId, jobId });
  ensure(result, notFound('Bookmark not found'));

  return res.noContent();
}
