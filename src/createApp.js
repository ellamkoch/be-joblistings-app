import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

export function createApp({ config = {} }) {
    const app = express();

    app.locals.config = config;

    app.use(express.json());

    app.use(helmet());

    app.use(morgan('dev'));

    app.use(cors());

    app.use((req, _res, next) => {
        next();
    });

    app.get('/health', (req, res) => {
        return res.status(200).send({ status: 'ok' });
    });

    return app;
}
