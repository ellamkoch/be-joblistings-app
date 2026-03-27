/**
 * Environment configuration helpers.
 *
 * This module loads environment variables and validates the values required to
 * boot the app safely.
 */
import dotenv from 'dotenv';

dotenv.config();

/**
 * Reads and validates required runtime environment values.
 *
 * @returns {{PORT: number, JWT_SECRET: string}} The validated app configuration.
 */
export function ensureEnv() {
  const PORT = Number(process.env.port ?? 3000);

  const JWT_SECRET = process.env.JWT_SECRET ?? '';

  const ALLOWED_ORIGINS_RAW = process.env.ALLOWED_ORIGIN ?? '';

  if (!Number.isFinite(PORT) || PORT <= 0) {
    throw new Error('Invalid PORT. Please set PORT to a valid number');
  }

  if (JWT_SECRET.trim().length < 31) {
    throw new Error('Invalid JWT_SECRET. Please set a long random string (32+ characters');
  }

if (!ALLOWED_ORIGINS_RAW) {
  throw new Error("ALLOWED_ORIGIN is required");
}

const allowedOrigins = ALLOWED_ORIGINS_RAW
  .split(',')
  .map((origin)=> origin.trim())
  .filter(Boolean);

  return { PORT, JWT_SECRET, allowedOrigins };
}


