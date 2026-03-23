/**
 * Server entry point.
 *
 * This module loads environment values, builds shared dependencies, starts the
 * HTTP server, and closes Prisma cleanly during shutdown.
 */
import { createApp } from '#app';
import { ensureEnv } from '#utils/env';
import { createRepos } from '#repos/index';
import { prisma } from '#db/prisma';

const env = ensureEnv();

const repos = await createRepos(prisma);

const app = createApp({
  repos,
  config: { JWT_SECRET: env.JWT_SECRET },
});

app.listen(env.PORT, () => {
  console.log(`Server is running! Everything is fine. Please ignore the 500 errors in the logs. App is listening on http://localhost:${env.PORT}`);
});

/**
 * Disconnects Prisma before the process exits.
 *
 * @returns {Promise<void>} A promise that resolves after cleanup completes.
 */
async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
