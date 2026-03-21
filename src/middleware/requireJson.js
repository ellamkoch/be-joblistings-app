import { unsupportedMediaType, badRequest } from "#utils/httpErrors"

export function requireJson(req, _res, next) {
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
        return next(unsupportedMediaType('content-Type must be application/json'));
    }

    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
        return next(badRequest('Body is empty'));
    }

    next();
}


