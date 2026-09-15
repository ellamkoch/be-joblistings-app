/**
 * httpErrors utilities
 * --------------------
 * Provides a consistent HttpError class plus helper factories for common
 * HTTP error types (400/401/403/404/409/415).
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
  /**
   * Creates a structured HTTP error.
   *
   * @param {number} status - HTTP status code.
   * @param {string} code - Machine-readable error code.
   * @param {string} message - Human-readable message.
   * @param {any} [details] - Optional extra error details.
   */
  constructor(status, code, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Creates a 400 Bad Request error.
 *
 * @param {string} [message='Bad Request'] - The error message.
 * @param {any} [details] - Optional extra error details.
 * @returns {HttpError} A bad request error instance.
 */
export const badRequest = (message = 'Bad Request', details) =>
  new HttpError(400, 'bad_request', message, details);

/**
 * Creates a 401 Unauthorized error.
 *
 * @param {string} [message='Unauthorized'] - The error message.
 * @param {any} [details] - Optional extra error details.
 * @returns {HttpError} An unauthorized error instance.
 */
export const unauthorized = (message = 'Unauthorized', details) =>
  new HttpError(401, 'unauthorized', message, details);

/**
 * Creates a 403 Forbidden error.
 *
 * @param {string} [message='Forbidden'] - The error message.
 * @param {any} [details] - Optional extra error details.
 * @returns {HttpError} A forbidden error instance.
 */
export const forbidden = (message = 'Forbidden', details) =>
  new HttpError(403, 'forbidden', message, details);

/**
 * Creates a 404 Not Found error.
 *
 * @param {string} [message='Not Found'] - The error message.
 * @param {any} [details] - Optional extra error details.
 * @returns {HttpError} A not found error instance.
 */
export const notFound = (message = 'Not Found', details) =>
  new HttpError(404, 'not_found', message, details);

/**
 * Creates a 409 Conflict error.
 *
 * @param {string} [message='Conflict'] - The error message.
 * @param {any} [details] - Optional extra error details.
 * @returns {HttpError} A conflict error instance.
 */
export const conflict = (message = 'Conflict', details) =>
  new HttpError(409, 'conflict', message, details);

/**
 * Creates a 415 Unsupported Media Type error.
 *
 * @param {string} [message='Unsupported Media Type'] - The error message.
 * @param {any} [details] - Optional extra error details.
 * @returns {HttpError} An unsupported media type error instance.
 */
export const unsupportedMediaType = (message = 'Unsupported Media Type', details) =>
  new HttpError(415, 'unsupported_media_type', message, details);
