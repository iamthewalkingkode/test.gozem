import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import expressPinoLogger from 'express-pino-logger';
import 'module-alias/register';
import { Server } from 'socket.io';

import config from '@/config';
import routes from '@/routes';
import { types } from '@/utils/index';
import logger from '@/middlewares/logger.middleware';
import socketIO from './socket';

const app = express();

// const loggerMiddleware = expressPinoLogger({
//     logger,
//     autoLogging: false,
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(loggerMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((error: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
    logger.error(error.message);
    res.status(types.HttpStatus.InternalServerError).send(`Ooops!! Something broke!`);
});

const server = app.listen(config.APP_PORT, () => logger.info(`🚀 Server ready at: ${config.APP_PORT}`));

const io = new Server(server, { cors: { origin: '*' } });
socketIO(io);
routes(app);

// default routes
app.use((_: express.Request, res: express.Response) => {
    res.status(types.HttpStatus.BadRequest).json([`Invalid request`]);
});