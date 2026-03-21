import { HttpError } from '#utils/httpErrors';
import { Prisma } from '../../generated/prisma/index.js';

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

function mapPrismaError(err) {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return null;

  switch (err.code) {
    case 'P2002':
      return new HttpError(
        409,
        'unique_constraint',
        'A record with these unique fields already exists.',
        err.meta ?? null,
      );

      case 'P2003':
        return new HttpError(
          409,
          'foreign_key_constraint',
          'A related record was not found (foreign key constraint).',
          err.meta ?? null,
        );

        case 'P2025':
        return new HttpError(
          404,
          'record_not_found',
          'Record not found.',
          err.meta ?? null,
        );

        default:
        return new HttpError(
          500,
          'database_error',
          'A database error occurred.',
          err.meta ?? null,
        );
  }
}

export function errorHandler(err, req, res, _next) {

  const prismaMapped = mapPrismaError(err);
  if (prismaMapped) {
    return sendError(
      req,
      res,
      prismaMapped.status,
      prismaMapped.code,
      prismaMapped.message,
      prismaMapped.details,
    );
  }
  if (err instanceof HttpError) {
    return sendError(req, res, err.status, err.code, err.message, err.details);
  }

  console.error(err);

  return sendError(req, res, 500, 'internal_server_error', 'Internal Server Error');
}
