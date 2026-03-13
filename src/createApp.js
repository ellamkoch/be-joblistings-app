import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { respond } from '#middleware/responds';
import { requestId } from '#middleware/requestId';
import { errorHandler } from '#middleware/errorHandler';
import { notFoundHandler } from '#middleware/notFoundHandler';



export function createApp({ config = {} }) {
    const app = express();

    app.locals.config = config;

    app.use(express.json());

    app.use(requestId);
    
    app.use(helmet());

    app.use(morgan('dev'));

    app.use(cors());

    app.use((req, _res, next) => {
        next();
    });


    app.use(respond);

    app.get('/health', (req, res) => {
        return res.ok({ status: 'ok' });
    });

    app.use(notFoundHandler);

    app.use(errorHandler);

    return app;
}
