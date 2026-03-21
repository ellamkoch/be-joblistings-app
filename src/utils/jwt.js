import jwt from 'jsonwebtoken';

export function signToken({ userId, secret }) {
    return jwt.sign({ sub: userId }, secret, { expiresIn: '12h' });
}

export function verifyToken({ token, secret }) {
    return jwt.verify(token, secret);
}
