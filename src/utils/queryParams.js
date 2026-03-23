/**
 * Query parameter parsing helpers.
 *
 * These helpers normalize common query-string values used by filters and
 * controller validation.
 */
/**
 * Parses a string query value into a boolean.
 *
 * @param {unknown} value - The query value to parse.
 * @returns {boolean} True for "true" or "1"; otherwise false.
 */
export function parseBoolean(value) {
    if (typeof value !== 'string') return false;
    const v = value.trim().toLowerCase();
    return v === 'true' || v ==='1';
}

/**
 * Parses a comma-separated string into a normalized Set.
 *
 * @param {unknown} value - The query or body value to parse.
 * @returns {Set<string>} A set of lowercased, trimmed entries.
 */
export function parseCsvSet(value) {
    if (typeof value !== 'string') return new Set();
    return new Set(
        value
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    );
}
