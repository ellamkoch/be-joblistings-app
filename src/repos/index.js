export async function createRepos(prisma) {
    const {createUsersRepo } = await import('./users.repo.js');

    return {
        users: createUsersRepo(prisma),
    };
}
