/**
 * Authentication middleware.
 *
 * This middleware verifies bearer tokens, checks revocation status, and stores
 * the authenticated user id on the request object.
 */
import { unauthorized } from '#utils/httpErrors';
import { verifyToken } from '#utils/jwt';
import { isTokenRevoked } from '#db/revokedTokens';
import { ensure } from '#utils/ensureFieldsGuard';


/**
 * Requires a valid bearer token for protected routes.
 *
 * @param {import('express').Request} req - The incoming Express request.
 * @param {import('express').Response} _res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export async function requireAuth(req, _res, next) {
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(unauthorized('Missing Bearer Token'));
    }

    let payload;

    try {
        const secret = req.app.locals.config.JWT_SECRET;
        payload = verifyToken({ token, secret });

    } catch {
        return next(unauthorized('Invalid token'));
    }

    const isRevoked = await isTokenRevoked(token);
    ensure(!isRevoked, unauthorized('Token has been revoked'));

    req.user = { id: payload.sub };
    req.auth = { token, payload };

    return next();

}
