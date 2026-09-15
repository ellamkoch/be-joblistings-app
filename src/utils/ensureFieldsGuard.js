/**
 * Validation guard helpers.
 *
 * These helpers keep simple assertion-style checks in one place so controllers
 * and middleware can throw consistent HTTP errors.
 */
import { badRequest } from '#utils/httpErrors';

/**
 * Throws the provided error when a condition is falsy.
 *
 * @param {unknown} condition - The condition to evaluate.
 * @param {Error} err - The error to throw when the condition fails.
 * @returns {void}
 */
export function ensure(condition, err) {
  if (!condition) {
    throw err;
  }
}

/**
 * Ensures an object contains each required field.
 *
 * @param {object} obj - The object being validated.
 * @param {string[]} fields - The required field names.
 * @returns {void}
 */
export function ensureFields(obj, fields) {
  const missing = fields.filter((f) => !obj?.[f]);
  if (missing.length > 0) {
    throw badRequest('Missing required fields', { missing });
  }
}
