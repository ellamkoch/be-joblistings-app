import { createApp } from '#app';
import { ensureEnv } from '#utils/env';

const env = ensureEnv();

const app = createApp({
    config: { JWT_SECRET: env.JWT_SECRET },
});

app.listen(env.PORT, () => {
    console.log(`Server's up and running! App is listening on httP://localhost:${env.PORT}`);
});

