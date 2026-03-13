import { HttpError } from "#utils/httpErrors";

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

export function errorHandler(err, req, res, _next) {
    if (err instanceof HttpError) {
    return sendError(req, res, err.status, err.code, err.message, err.details);
    }

    console.error(err);

    return sendError(req, res, 500, "internal_server_error", "Internal Server Error");

}
