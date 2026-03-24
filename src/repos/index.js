/**
 * Repository index.
 *
 * This module creates the repo collection used by the app so controllers can
 * access data-layer methods from one shared place.
 */
/**
 * Creates all repositories for the current Prisma client.
 *
 * @param {import('@prisma/client').PrismaClient} prisma - The Prisma client used for database access.
 * @returns {Promise<object>} The repo collection attached to the app.
 */
export async function createRepos(prisma) {
  const { createUsersRepo } = await import('./users.repo.js');
  const { createJobsRepo } = await import('./jobs.repo.js');
  const { createBookmarksRepo } = await import('./bookmarks.repo.js');

  return {
    users: createUsersRepo(prisma),
    jobs: createJobsRepo(prisma),
    bookmarks: createBookmarksRepo(prisma),
  };
}
