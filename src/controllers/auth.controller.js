import { conflict, unauthorized } from "#utils/httpErrors";
import { ensure, ensureFields } from "#utils/ensureFieldsGuard";
import { hashPassword, verifyPassword } from "#utils/password";
import { signToken } from "#utils/jwt";
import { revokeToken } from "#db/revokedTokens";

export async function registerUser(req, res) {
    const { users } = res.locals.repos;

    ensureFields(req.body, ['email', 'name', 'password']);

    const email = String(req.body.email).toLowerCase().trim();
    const name = String(req.body.name).trim();
    const password = String(req.body.password).trim();

    const userExists = await users.findByEmail(email);
    ensure(!userExists, conflict('Email already registered'));

    const user = await users.create({
        email,
        name,
        passwordHash: hashPassword(password),
    });

    const token = signToken({ userId: user.id, secret: req.app.locals.config.JWT_SECRET });

    return res.created({
        token,
        user: { id: user.id, name: user.name, email: user.email },
    });
  }

  export async function loginUser(req, res) {
    const { users } = res.locals.repos;

    ensureFields(req.body, ['email', 'password']);

    const email = String(req.body.email).toLowerCase().trim();
    const password = String(req.body.password).trim();

    const user = await users.findByEmail(email);
    ensure(user, unauthorized('Invalid credentials'));
    ensure(
        verifyPassword(password, user.passwordHash),
        unauthorized('Invalid credentials'));

    const token = signToken({ userId: user.id, secret: req.app.locals.config.JWT_SECRET });

    return res.ok({
        token,
        user: { id: user.id, email: user.email },
  });
  }

  export async function logoutUser(req, res) {
    const { token, payload } = req.auth;

    const expiresAt = new Date(payload.exp * 1000);

    await revokeToken({
        token,
        expiresAt,
        userId: payload.sub,
    });

    return res.noContent();
  }


