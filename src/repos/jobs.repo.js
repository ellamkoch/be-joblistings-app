/**
 * Jobs repository.
 *
 * This module keeps Prisma calls for job records in one place so controllers
 * can focus on HTTP validation and response handling.
 */
/**
 * Creates the jobs repository for a Prisma client instance.
 *
 * @param {import('@prisma/client').PrismaClient} prisma - The Prisma client used for database access.
 * @returns {object} Repository methods for reading and writing jobs.
 */
export function createJobsRepo(prisma) {
  return {
    /**
     * Lists jobs ordered by newest posted date first.
     *
     * @param {object} [options={}] - Pagination options.
     * @param {number} [options.limit] - Maximum number of jobs to return.
     * @param {number} [options.offset] - Number of jobs to skip.
     * @returns {Promise<{jobList: object[], total: number}>} The jobs and total count.
     */
    async listAll({ limit, offset } = {}) {
      const query = { orderBy: { postedAt: 'desc' } };

      if (limit !== undefined) query.take = limit;
      if (offset !== undefined) query.skip = offset;

      const [jobList, total] = await Promise.all([prisma.job.findMany(query), prisma.job.count()]);
      return { jobList, total };
    },

    /**
     * Looks up one job by id.
     *
     * @param {string} id - The job id.
     * @returns {Promise<object|null>} The matching job or null when not found.
     */
    async getById(id) {
      return await prisma.job.findUnique({ where: { id } });
    },

    /**
     * Creates a job record.
     *
     * Optional Prisma String? fields are only added when provided so the
     * repo stays simple while still matching the schema.
     *
     * @param {object} data - The job payload to persist.
     * @param {string} data.company - The company name.
     * @param {string} data.position - The role title shown to applicants.
     * @param {string} data.role - The job category.
     * @param {string} data.level - The experience level.
     * @param {string} data.contract - The contract type.
     * @param {string} data.languages - A comma-separated language list.
     * @param {string} data.tools - A comma-separated tools list.
     * @param {string} data.location - The job location label.
     * @param {string} data.jobDesc - The main job description.
     * @param {string} data.responsibilities - The responsibilities summary.
     * @param {boolean} data.isNew - Whether the job should be marked new.
     * @param {boolean} data.isFeatured - Whether the job should be featured.
     * @param {Date} data.postedAt - The posted date for sorting/display.
     * @param {string} data.authorId - The owner of the job record.
     * @param {string} [data.logoUrl] - Optional company logo URL.
     * @param {string} [data.nice2have] - Optional nice-to-have section.
     * @param {string} [data.about] - Optional company about section.
     * @param {string} [data.eoeStatement] - Optional EOE statement.
     * @param {string} [data.requirements] - Optional requirements text.
     * @returns {Promise<object>} The newly created job.
     */
    async create({
      company,
      position,
      role,
      level,
      contract,
      languages,
      tools,
      location,
      jobDesc,
      responsibilities,
      isNew,
      isFeatured,
      postedAt,
      authorId,
      logoUrl,
      nice2have,
      about,
      eoeStatement,
      requirements,
    }) {
      return prisma.job.create({
        data: {
          company,
          position,
          role,
          level,
          contract,
          languages,
          tools,
          location,
          jobDesc,
          responsibilities,
          isNew,
          isFeatured,
          postedAt,
          authorId,
          ...(logoUrl !== undefined ? { logoUrl } : {}),
          ...(nice2have !== undefined ? { nice2have } : {}),
          ...(about !== undefined ? { about } : {}),
          ...(eoeStatement !== undefined ? { eoeStatement } : {}),
          ...(requirements !== undefined ? { requirements } : {}),
        },
        omit: { updatedAt: true },
      });
    },

    /**
     * Updates a job when it exists and belongs to the requesting user.
     *
     * @param {object} options - Update options.
     * @param {string} options.id - The job id to update.
     * @param {object} options.data - The partial update payload.
     * @param {string} options.authorId - The authenticated user id.
     * @returns {Promise<object|null|'forbidden'>} The updated job, null, or a forbidden marker.
     */
    async update({ id, data, authorId }) {
      const existingJob = await prisma.job.findUnique({
        where: { id },
        omit: { createdAt: true },
      });
      if (!existingJob) return null;
      if (existingJob.authorId !== authorId) return 'forbidden';

      return prisma.job.update({
        where: { id },
        data,
      });
    },

    /**
     * Deletes a job when it exists and belongs to the requesting user.
     *
     * @param {object} options - Delete options.
     * @param {string} options.id - The job id to delete.
     * @param {string} options.authorId - The authenticated user id.
     * @returns {Promise<true|null|'forbidden'>} True on success, null if missing, or a forbidden marker.
     */
    async delete({ id, authorId }) {
      const deletedJob = await prisma.job.findUnique({ where: { id } });
      if (!deletedJob) return null;
      if (deletedJob.authorId !== authorId) return 'forbidden';

      await prisma.job.delete({ where: { id } });
      return true;
    },
  };
}
