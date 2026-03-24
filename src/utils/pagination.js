/**
 * Pagination helpers.
 *
 * These helpers convert query-string pagination values into safe numeric values
 * used by repository methods.
 */
import { badRequest } from '#utils/httpErrors';
import { ensure } from '#utils/ensureFieldsGuard';

/**
 * Parses limit/page values from a query object.
 *
 * @param {object} [query={}] - The request query object.
 * @returns {{limit: number, page: number, offset: number}} Parsed pagination values.
 */
export function parsePagination(query = {}) {
  const rawLimit = query.limit ?? 20;
  const rawPage = query.page ?? 1;

  const parsedLimit = Number(rawLimit);
  ensure(parsedLimit <= 100, badRequest('Limit cannot exceed 100'));

  const limit = clampInt(rawLimit, 1, 100, 20);
  const page = clampInt(rawPage, 1, Number.MAX_SAFE_INTEGER, 1);

  const offset = (page - 1) * limit;

  return { limit, page, offset };
}

/**
 * Clamps a numeric input to a safe integer range.
 *
 * @param {unknown} value - The input value to parse.
 * @param {number} min - The minimum allowed integer.
 * @param {number} max - The maximum allowed integer.
 * @param {number} fallback - The fallback value when parsing fails.
 * @returns {number} A clamped integer value.
 */
function clampInt(value, min, max, fallback) {
  const n = Number(value);

  if (!Number.isFinite(n)) return fallback;

  const i = Math.trunc(n);
  if (i < min) return min;
  if (i > max) return max;
  return i;
}
