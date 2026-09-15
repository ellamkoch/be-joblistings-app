/**
 * Token hashing helpers.
 *
 * This module converts raw tokens into stable hashes so tokens can be stored
 * safely in the database without saving the original value.
 */
import { createHash } from 'node:crypto';

/**
 * Hashes a token using SHA-256.
 *
 * @param {string} token - The raw token string.
 * @returns {string} The hashed token value.
 */
export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}
