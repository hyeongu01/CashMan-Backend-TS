import config from '@config/config';
import winston from "winston";

const LOG_DIR = "logs";

const {combine, timestamp, printf, colorize} = winston.format;
const logFormat = printf(({level, message, timestamp}): string => {
    return `[${timestamp}] ${level}: ${message}`;
})

export const logger = winston.createLogger({
    level: "http",
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                logFormat
            )
        }),
        new winston.transports.File({
            filename: `${LOG_DIR}/error.log`,
            level: 'error',
            format: combine(
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            filename: `${LOG_DIR}/combined.log`,
            format: combine(
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.json()
            )
        }),
    ]
})

export default logger;
