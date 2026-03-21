import { unauthorized } from '#utils/httpErrors';
import { verifyToken } from '#utils/jwt';
import { isTokenRevoked } from '#db/revokedTokens';
import { ensure } from '#utils/ensureFieldsGuard';


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
