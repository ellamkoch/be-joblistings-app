import crypto from 'crypto';

export function requestId(req, res, next) {
    const incomingId = req.get('X-Request-Id');

    const id = incomingId || crypto.randomUUID();

    req.requestId = id;
    res.setHeader('X-Request-Id', id);

    next();
}
