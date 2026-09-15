/**
 * Not-found middleware.
 *
 * This middleware converts unknown routes into a shared 404 HttpError.
 */
import { notFound } from '#utils/httpErrors';

/**
 * Forwards a 404 error when no route matches the request.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} _res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */
export function notFoundHandler(req, _res, next) {
  next(notFound(`Route not found: ${req.method} ${req.path}`));
}
