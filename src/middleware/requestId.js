/**
 * Request id middleware.
 *
 * This middleware attaches a request id to each request and response so logs
 * and error payloads can be traced more easily.
 */
import crypto from 'crypto';

/**
 * Attaches an existing or generated request id to the request lifecycle.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */
export function requestId(req, res, next) {
    const incomingId = req.get('x-request-id');

    const id = incomingId || crypto.randomUUID();

    req.requestId = id;
    res.setHeader('x-request-id', id);

    next();
}
