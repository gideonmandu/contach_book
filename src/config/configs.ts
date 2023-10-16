import dotenv from 'dotenv';

dotenv.config();

interface Environment {
    PORT: number;
    NODE_ENV: 'development' | 'production';
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_MAX_RETRIES: number;
    DB_RETRY_INTERVAL: number;
    EXPRESS_USER?: string;
    EXPRESS_PASSWORD?: string;
    ENCRYPTION_SECRET: string;
    ENCRYPTION_ALGORITHM: string;
    ENCRYPTION_IV_LENGTH: number;
    LOGGING_LEVEL: string;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    PAGINATION_DEFAULT_LIMIT: number;
    PAGINATION_DEFAULT_PAGE: number;
}

export const envConfigs: Environment = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: process.env.DB_NAME || 'contact-service',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_MAX_RETRIES: Number(process.env.DB_MAX_RETRIES),
    DB_RETRY_INTERVAL: Number(process.env.DB_RETRY_INTERVAL),
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || 'secret',
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    ENCRYPTION_IV_LENGTH: Number(process.env.ENCRYPTION_IV_LENGTH),
    LOGGING_LEVEL: process.env.LOGGING_LEVEL || 'debug',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1d',
    PAGINATION_DEFAULT_LIMIT: Number(process.env.PAGINATION_DEFAULT_LIMIT),
    PAGINATION_DEFAULT_PAGE: Number(process.env.PAGINATION_DEFAULT_PAGE),

};