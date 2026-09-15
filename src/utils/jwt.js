/**
 * JWT helpers.
 *
 * This module signs authentication tokens and verifies incoming bearer tokens.
 */
import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for a user id.
 *
 * @param {object} options - Signing options.
 * @param {string} options.userId - The authenticated user id.
 * @param {string} options.secret - The JWT signing secret.
 * @returns {string} A signed JWT string.
 */
export function signToken({ userId, secret }) {
  return jwt.sign({ sub: userId }, secret, { expiresIn: '12h' });
}

/**
 * Verifies a JWT and returns its payload.
 *
 * @param {object} options - Verification options.
 * @param {string} options.token - The token to verify.
 * @param {string} options.secret - The JWT verification secret.
 * @returns {string | jwt.JwtPayload} The decoded token payload.
 */
export function verifyToken({ token, secret }) {
  return jwt.verify(token, secret);
}
