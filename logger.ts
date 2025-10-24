import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    isDevelopment
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          })
        )
      : winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});

// In production, also log to file
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

export default logger;
