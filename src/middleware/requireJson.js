/**
 * JSON body middleware.
 *
 * This middleware enforces JSON requests for write operations and rejects empty
 * request bodies before they reach the controllers.
 */
import { unsupportedMediaType, badRequest } from '#utils/httpErrors';

/**
 * Ensures POST, PUT, and PATCH requests send a non-empty JSON body.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} _res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */
export function requireJson(req, _res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return next(unsupportedMediaType('content-Type must be application/json'));
  }

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return next(badRequest('Body is empty'));
  }

  next();
}
