/**
 * Error-handling middleware.
 *
 * This module converts application and Prisma errors into the shared JSON error
 * response format used by the API.
 */
import { HttpError } from '#utils/httpErrors';
import { Prisma } from '../../generated/prisma/index.js';

/**
 * Sends a formatted error response.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @param {number} status - The HTTP status code.
 * @param {string} code - The machine-readable error code.
 * @param {string} message - The human-readable error message.
 * @param {any} [details=null] - Optional extra error details.
 * @returns {import('express').Response} The JSON error response.
 */
function sendError(req, res, status, code, message, details = null) {
  return res.status(status).json({
    ok: false,
    error: {
      requestId: req.requestId,
      code,
      message,
      details: details ?? null,
    },
  });
}

/**
 * Maps known Prisma errors into HttpError instances.
 *
 * @param {unknown} err - The thrown error.
 * @returns {HttpError|null} A mapped HTTP error or null when no mapping exists.
 */
function mapPrismaError(err) {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return null;

  switch (err.code) {
    case 'P2002':
      return new HttpError(
        409,
        'unique_constraint',
        'A record with these unique fields already exists.',
        err.meta ?? null,
      );

      case 'P2003':
        return new HttpError(
          409,
          'foreign_key_constraint',
          'A related record was not found (foreign key constraint).',
          err.meta ?? null,
        );

        case 'P2025':
        return new HttpError(
          404,
          'record_not_found',
          'Record not found.',
          err.meta ?? null,
        );

        default:
        return new HttpError(
          500,
          'database_error',
          'A database error occurred.',
          err.meta ?? null,
        );
  }
}

/**
 * Express error-handling middleware for API responses.
 *
 * @param {unknown} err - The thrown error.
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} _next - The next middleware function.
 * @returns {import('express').Response} The JSON error response.
 */
export function errorHandler(err, req, res, _next) {

  const prismaMapped = mapPrismaError(err);
  if (prismaMapped) {
    return sendError(
      req,
      res,
      prismaMapped.status,
      prismaMapped.code,
      prismaMapped.message,
      prismaMapped.details,
    );
  }
  if (err instanceof HttpError) {
    return sendError(req, res, err.status, err.code, err.message, err.details);
  }

  console.error(err);

  return sendError(req, res, 500, 'internal_server_error', 'Internal Server Error');
}
