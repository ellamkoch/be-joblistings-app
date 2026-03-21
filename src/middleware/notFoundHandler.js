import { notFound } from '#utils/httpErrors';

export function notFoundHandler(req, _res, next) {
  next(notFound(`Route not found: ${req.method} ${req.path}`));
}
