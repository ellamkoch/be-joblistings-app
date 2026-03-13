import crypto from 'crypto';

export function requestId(req, res, next) {
    const incomingId = req.get('x-request-id');

    const id = incomingId || crypto.randomUUID();

    req.requestId = id;
    res.setHeader('x-request-id', id);

    next();
}
