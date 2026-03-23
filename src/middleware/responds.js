
/**
 * Response helper middleware.
 *
 * This module adds small response helper methods so controllers can return
 * consistent JSON envelopes for successful requests.
 */


/**
 * Sends a formatted success response.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @param {number} status - The HTTP status code.
 * @param {any} data - The response payload.
 * @param {object|null} [meta=null] - Optional metadata for the response.
 * @returns {import('express').Response} The JSON success response.
 */
function sendSuccess( req, res, status, data, meta = null) {
 return res.status(status).json({
    ok: true,
    requestId: req.requestId,
    data,
    ...(meta ? { meta } : {}),
   });
}


/**
 * Adds shared response helpers to the Express response object.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */
export function respond(req, res, next) {
    res.ok = (data, meta) => sendSuccess(req, res, 200, data, meta);

    res.created = (data, meta) => sendSuccess(req, res, 201, data, meta);

    res.noContent = () => res.status(204).send();

    next();

}
