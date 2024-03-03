import pino from 'pino';

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};
const logger = pino({
  customLevels: levels, // our defined levels
  useOnlyCustomLevels: true,
  level: 'http',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // colorizes the log
      levelFirst: true,
      translateTime: 'yyyy-dd-mm, h:MM:ss TT',
    },
  },
});

export default logger;
