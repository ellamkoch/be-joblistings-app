



function sendSuccess( req, res, status, data, meta = null) {
 return res.status(status).json({
    ok: true,
    requestId: req.requestId,
    data,
    ...(meta ? { meta } : {}),
   });
}


export function respond(req, res, next) {
    res.ok = (data, meta) => sendSuccess(req, res, 200, data, meta);

    res.created = (data, meta) => sendSuccess(req, res, 201, data, meta);

    res.noContent = () => res.status(204).send();

    next();

}
