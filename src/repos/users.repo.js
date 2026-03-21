export function createUsersRepo(prisma) {
    return {
        async create(data) {
            return prisma.user.create({ data });
        },

        async findByEmail(email) {
            return prisma.user.findUnique({ where: { email } });
        },

        async findById(id) {
            return prisma.user.findUnique({ where: { id } });
        },
    }
}
