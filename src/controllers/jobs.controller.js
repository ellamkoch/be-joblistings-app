/**
 * Jobs controller handlers.
 *
 * These functions validate request data, call the jobs repo, and send
 * consistent API responses through the shared response helpers.
 */
import { notFound, forbidden, badRequest } from '#utils/httpErrors';
import { ensure, ensureFields } from '#utils/ensureFieldsGuard';
import { parsePagination } from '#utils/pagination';
import { parseBoolean, parseCsvSet } from '#utils/queryParams';

/**
 * Lists jobs using the shared pagination parser and response helper.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} A paginated job list response.
 */
export async function listAllJobs(req, res) {
  const { jobs } = res.locals.repos;
  const { limit, page, offset } = parsePagination(req.query);

  const result = await jobs.listAll({
    limit,
    offset,
  });
  return res.ok(result.jobList, {
    pagination: { limit, page, total: result.total },
  });
}

/**
 * Fetches one job by its route id.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} The matching job response.
 */
export async function getJobById(req, res) {
  const { jobs } = res.locals.repos;

  const id = req.params.id;
  const found = await jobs.getById(id);
  ensure(found, notFound('Job not found'));

  return res.ok(found);
}

/**
 * Creates a new job for the authenticated user after validating the required
 * fields expected by the Prisma Job model.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} The created job response.
 */
export async function createJob(req, res) {
  const { jobs } = res.locals.repos;
  const authorId = req.user?.id;
  ensure(authorId, forbidden('You must be signed in to create a job'));

  const { data } = req.body ?? {};
  ensureFields(data, [
    'company',
    'position',
    'role',
    'level',
    'contract',
    'languages',
    'tools',
    'location',
    'jobDesc',
    'responsibilities',
    'postedAt',
  ]);
  ensure(data?.isNew !== undefined, badRequest('isNew is required'));
  ensure(data?.isFeatured !== undefined, badRequest('isFeatured is required'));

  const company = String(data.company).trim();
  const position = String(data.position).trim();
  const role = String(data.role).trim();
  const level = String(data.level).trim();
  const contract = String(data.contract).trim();
  const location = String(data.location).trim();
  const jobDesc = String(data.jobDesc).trim();
  const responsibilities = String(data.responsibilities).trim();

  const languageList = [...parseCsvSet(data.languages)];
  const toolList = [...parseCsvSet(data.tools)];
  ensure(languageList.length > 0, badRequest('languages must be a comma-separated string'));
  ensure(toolList.length > 0, badRequest('tools must be a comma-separated string'));

  let isNew;
  if (typeof data.isNew === 'boolean') {
    isNew = data.isNew;
  } else if (typeof data.isNew === 'string') {
    const normalizedIsNew = data.isNew.trim().toLowerCase();
    ensure(
      ['true', 'false', '1', '0'].includes(normalizedIsNew),
      badRequest('isNew must be a boolean'),
    );
    isNew = parseBoolean(data.isNew);
  } else {
    throw badRequest('isNew must be a boolean');
  }

  let isFeatured;
  if (typeof data.isFeatured === 'boolean') {
    isFeatured = data.isFeatured;
  } else if (typeof data.isFeatured === 'string') {
    const normalizedIsFeatured = data.isFeatured.trim().toLowerCase();
    ensure(
      ['true', 'false', '1', '0'].includes(normalizedIsFeatured),
      badRequest('isFeatured must be a boolean'),
    );
    isFeatured = parseBoolean(data.isFeatured);
  } else {
    throw badRequest('isFeatured must be a boolean');
  }

  const postedAt = new Date(data.postedAt);
  ensure(!Number.isNaN(postedAt.getTime()), badRequest('postedAt must be a valid date'));

  const createdJob = await jobs.create({
    company,
    position,
    role,
    level,
    contract,
    languages: languageList.join(', '),
    tools: toolList.join(', '),
    logoUrl: data.logoUrl?.trim() || undefined,
    location,
    jobDesc,
    responsibilities,
    nice2have: data.nice2have?.trim() || undefined,
    about: data.about?.trim() || undefined,
    eoeStatement: data.eoeStatement?.trim() || undefined,
    requirements: data.requirements?.trim() || undefined,
    isNew,
    isFeatured,
    postedAt,
    authorId,
  });

  return res.created(createdJob);
}

/**
 * Partially updates a job that belongs to the authenticated user.
 *
 * Omitted fields are ignored, required string fields cannot be set to blank,
 * and optional nullable string fields are converted to null when sent blank.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} The updated job response.
 */
export async function updateJob(req, res) {
  const { jobs } = res.locals.repos;
  const authorId = req.user?.id;
  ensure(authorId, forbidden('You must be signed in to update a job'));

  const id = req.params.id;
  const { data } = req.body ?? {};

  const allowedFields = [
    'company',
    'position',
    'role',
    'level',
    'contract',
    'languages',
    'tools',
    'logoUrl',
    'location',
    'jobDesc',
    'responsibilities',
    'nice2have',
    'about',
    'eoeStatement',
    'requirements',
    'isNew',
    'isFeatured',
    'postedAt',
  ];

  const updateData = { ...data };
  const requiredStringFields = [
    'company',
    'position',
    'role',
    'level',
    'contract',
    'location',
    'jobDesc',
    'responsibilities',
  ];
  const csvFields = ['languages', 'tools'];
  const booleanFields = ['isNew', 'isFeatured'];
  const optionalNullableStringFields = [
    'logoUrl',
    'nice2have',
    'about',
    'eoeStatement',
    'requirements',
  ];

  Object.keys(updateData).forEach((field) => {
    if (allowedFields.includes(field)) return;
    delete updateData[field];
  });

  requiredStringFields.forEach((field) => {
    if (updateData[field] === undefined) return;
    updateData[field] = String(updateData[field]).trim();
    ensure(updateData[field], badRequest(`${field} cannot be empty`));
  });

  csvFields.forEach((field) => {
    if (updateData[field] === undefined) return;

    const items = [...parseCsvSet(updateData[field])];
    ensure(items.length > 0, badRequest(`${field} must be separated by commas`));
    updateData[field] = items.join(', ');
  });

  optionalNullableStringFields.forEach((field) => {
    if (updateData[field] === undefined) return;

    const value = String(updateData[field]).trim();
    updateData[field] = value || null;
  });

  booleanFields.forEach((field) => {
    if (updateData[field] === undefined) return;

    if (typeof updateData[field] === 'boolean') return;

    if (typeof updateData[field] === 'string') {
      const normalized = updateData[field].trim().toLowerCase();
      ensure(
        ['true', 'false', '1', '0'].includes(normalized),
        badRequest(`${field} must be a boolean`),
      );
      updateData[field] = parseBoolean(updateData[field]);
      return;
    }

    throw badRequest(`${field} must be a boolean`);
  });

  if (updateData.postedAt !== undefined) {
    updateData.postedAt = new Date(updateData.postedAt);
    ensure(
      !Number.isNaN(updateData.postedAt.getTime()),
      badRequest('postedAt must be a valid date'),
    );
  }

  ensure(Object.keys(updateData).length > 0, badRequest('No valid fields provided for update'));

  const updatedJob = await jobs.update({
    id,
    data: updateData,
    authorId,
  });

  ensure(updatedJob !== 'forbidden', forbidden('You are not allowed to update this job'));
  ensure(updatedJob, notFound('Job not found'));

  return res.ok(updatedJob);
}

/**
 * Deletes a job owned by the authenticated user.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void|import('express').Response>} A no-content response on success.
 */
export async function deleteJob(req, res) {
  const { jobs } = res.locals.repos;

  const id = req.params.id;

  const result = await jobs.delete({ id, authorId: req.user.id });
  ensure(result !== 'forbidden', forbidden('You cannot delete this job'));
  ensure(result, notFound('Job not found'));

  return res.noContent();
}
