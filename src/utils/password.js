import bcrypt from 'bcryptjs'

export function hashPassword(password) {
    const saltRounds = 10;

    return bcrypt.hashSync(password, saltRounds);
}

export function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}
