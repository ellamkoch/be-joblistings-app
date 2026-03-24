/**
 * Revoked token data helpers.
 *
 * This module stores revoked JWT hashes and checks whether a token has already
 * been invalidated.
 */
import { hashToken } from '#utils/hashToken';
import { prisma } from '#db/prisma';

/**
 * Stores or refreshes a revoked token record.
 *
 * @param {object} options - Revocation options.
 * @param {string} options.token - The raw JWT string.
 * @param {Date} options.expiresAt - When the JWT expires.
 * @param {string|null} [options.userId=null] - The related user id when known.
 * @returns {Promise<object>} The revoked token record.
 */
export async function revokeToken({ token, expiresAt, userId = null }) {
  const tokenHash = hashToken(token);

  return prisma.revokedToken.upsert({
    where: { tokenHash },
    update: {
      userId,
      expiresAt,
      revokedAt: new Date(),
    },
    create: {
      tokenHash,
      userId,
      expiresAt,
    },
  });
}

/**
 * Checks whether a token hash exists and is still active.
 *
 * @param {string} token - The raw JWT string.
 * @returns {Promise<boolean>} True when the token is revoked and not expired.
 */
export async function isTokenRevoked(token) {
  const tokenHash = hashToken(token);

  const revokedToken = await prisma.revokedToken.findUnique({
    where: { tokenHash },
  });

  return Boolean(revokedToken && revokedToken.expiresAt > new Date());
}
