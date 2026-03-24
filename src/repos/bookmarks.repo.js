/**
 * Bookmarks repository.
 *
 * This module keeps bookmark-related Prisma calls in one place so bookmark
 * controllers can follow the same thin-controller pattern as other features.
 */
export function createBookmarksRepo(prisma) {
  return {
    /**
     * Lists one user's bookmarks newest first.
     *
     * @param {object} options - Pagination options.
     * @param {string} options.userId - The authenticated user id.
     * @param {number} [options.limit] - Maximum rows to return.
     * @param {number} [options.offset] - Number of rows to skip.
     * @returns {Promise<{bookmarkList: object[], total: number}>} Bookmarks and total count.
     */
    async listByUserId({ userId, limit, offset }) {
  const query = {
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      jobId: true,
      job: {
        select: {
          id: true,
          position: true,
          company: true,
          role: true,
          level: true,
          contract: true,
          languages: true,
          tools: true,
          location: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  };

  if (limit !== undefined) query.take = limit;
  if (offset !== undefined) query.skip = offset;

  const [bookmarkList, total] = await Promise.all([
    prisma.bookmark.findMany(query),
    prisma.bookmark.count({ where: { userId } }),
  ]);

  return { bookmarkList, total };
},

    /**
     * Creates a bookmark record.
     *
     * @param {object} options - Bookmark create options.
     * @param {string} options.userId - The owning user id.
     * @param {string} options.jobId - The bookmarked job id.
     * @returns {Promise<object>} The created bookmark.
     */
    async create({ userId, jobId }) {
      return prisma.bookmark.create({
        data: {
          userId,
          jobId,
        },
      });
    },

    /**
     * Deletes a bookmark by composite user/job key.
     *
     * @param {object} options - Delete options.
     * @param {string} options.jobId - The bookmarked job id.
     * @param {string} options.userId - The owning user id.
     * @returns {Promise<true|null>} True on success, or null when not found.
     */
    async deleteByUserAndJob({ jobId, userId }) {
      const existingBookmark = await prisma.bookmark.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId,
          },
        },
      });
      if (!existingBookmark) return null;

      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });
      return true;
    },

    /**
     * Finds one bookmark using the composite user/job key.
     *
     * @param {object} options - Lookup options.
     * @param {string} options.userId - The owning user id.
     * @param {string} options.jobId - The bookmarked job id.
     * @returns {Promise<object|null>} The bookmark when found.
     */
    async findByUserAndJob({ userId, jobId }) {
      return prisma.bookmark.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId,
          },
        },
      });
    },
  };
}
