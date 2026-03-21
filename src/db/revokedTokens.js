import { hashToken } from '#utils/hashToken';
import { prisma } from '#db/prisma';


export async function revokeToken({
    token,
    expiresAt,
    userId = null
}) {
    const tokenHash = hashToken(token);

    return prisma.revokedToken.upsert({
        where: { tokenHash },
        update: {
            userId,
            expiresAt,
            revokedAt: new Date(),
        },
        create: {
            tokenHash,
            userId,
            expiresAt,
        },
    });
}

export async function isTokenRevoked(token) {
    const tokenHash = hashToken(token);

    const revokedToken = await prisma.revokedToken.findUnique({
        where: { tokenHash },
    });

    return Boolean(revokedToken && revokedToken.expiresAt > new Date());
}
