import winston from 'winston';
import { envConfigs } from './configs';

const { combine, timestamp, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
    level: envConfigs.LOGGING_LEVEL || 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    defaultMeta: { service: 'contact-service' },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            handleExceptions: true
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            handleExceptions: true
        }),
    ],
    exitOnError: false // Do not exit on handled exceptions
});

if (envConfigs.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            simple()
        ),
        handleExceptions: true
    }));
}

// If using promises or async/await, handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});

export default logger;
