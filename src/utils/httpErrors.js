/**
 * httpErrors utilities
 * --------------------
 * Provides a consistent HttpError class plus helper factories for common
 * HTTP error types (400/401/403/404/409/415/500).
 *
 * These helpers are used by controllers and middleware to throw structured errors
 * that the global errorHandler converts into the standard error envelope.
 */

/**
 * @class HttpError
 * @extends Error
 */

/**
 * Creates a structured HTTP error.
 *
 * @param {number} status - HTTP status code (e.g., 400, 404)
 * @param {string} code - Machine-readable error code (snake_case)
 * @param {string} message - Human-readable error message
 * @param {any} [details] - Optional extra details (validation info, etc.)
 */

export class HttpError extends Error {
    constructor( status, code, message, details) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export const badRequest = (message = 'Bad Request', details) =>
    new HttpError(400, 'bad_request', message, details);

export const unauthorized = (message = 'Unauthorized', details) =>
    new HttpError(401, 'unauthorized', message, details);

export const forbidden = (message = 'Forbidden', details) =>
    new HttpError(403, 'forbidden', message, details);

export const notFound = (message = 'Not Found', details) =>
    new HttpError(404, 'not_found', message, details);

export const conflict =(message = 'Conflict', details) =>
    new HttpError(409, 'conflict', message, details);

export const unsupportedMediaType = (message = 'Unsupported Media Type', details) =>
    new HttpError(415, 'unsupported_media_type', message, details);

export const internalServerError = (message = 'Internal Server Error', details) =>
    new HttpError(500, 'internal_server_error', message, details);
