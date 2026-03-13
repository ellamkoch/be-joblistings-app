import dotenv from 'dotenv';

dotenv.config();

export function ensureEnv() {
    const PORT = Number(process.env.port ?? 3000);

    const JWT_SECRET = process.env.JWT_SECRET ?? '';

    if (!Number.isFinite(PORT) || PORT <= 0) {
        throw new Error ('Invalid PORT. Please set PORT to a valid number');
    }

    if(JWT_SECRET.trim().length < 31) {
        throw new Error ('Invalid JWT_SECRET. Please set a long random string (32+ characters');
    }

    return { PORT, JWT_SECRET };
}
