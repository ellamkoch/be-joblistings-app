/**
 * Password helpers.
 *
 * This module hashes plain-text passwords and checks login attempts against a
 * stored password hash.
 */
import bcrypt from 'bcryptjs';

/**
 * Hashes a password with bcrypt.
 *
 * @param {string} password - The plain-text password.
 * @returns {string} The bcrypt password hash.
 */
export function hashPassword(password) {
  const saltRounds = 10;

  return bcrypt.hashSync(password, saltRounds);
}

/**
 * Compares a plain-text password to a stored bcrypt hash.
 *
 * @param {string} password - The plain-text password.
 * @param {string} hash - The stored password hash.
 * @returns {boolean} True when the password matches.
 */
export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
