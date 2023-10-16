import mongoose from 'mongoose';
import logger from './logger';
import { envConfigs } from './configs';

/**
 * Generate MongoDB connection URI.
 */
const getMongoURI = (): string => {
    // return `mongodb+srv://${envConfigs.DB_USER}:${envConfigs.DB_PASSWORD}@${envConfigs.DB_HOST}:${envConfigs.DB_PORT}/${envConfigs.DB_NAME}?authSource=admin&retryWrites=true&w=majority`;
    return `mongodb://${envConfigs.DB_USER}:${envConfigs.DB_PASSWORD}@${envConfigs.DB_HOST}:${envConfigs.DB_PORT}/${envConfigs.DB_NAME}?authSource=admin&retryWrites=true&w=majority`;
};

const RETRY_INTERVAL = envConfigs.DB_RETRY_INTERVAL;

/**
 * The function `connectDB` connects to a MongoDB database using the provided
 * environment variables and logs the connection status.
 * 
 * @param {number} retryCount - Current retry attempt number.
 */
export const connectDB = async (retryCount = 0) => {
    const mongoURI = getMongoURI();;
    logger.info(`Connecting to MongoDB`);

    try {
        await mongoose.connect(mongoURI!, {
            connectTimeoutMS: 10000,
            maxPoolSize: 50,
            socketTimeoutMS: 45000
        });
        logger.info('MongoDB connected');
    } catch (error) {
        if (retryCount < envConfigs.DB_MAX_RETRIES) {
            logger.error(`Error connecting to MongoDB. Retrying in ${RETRY_INTERVAL / 1000} seconds...`, error);
            setTimeout(() => connectDB(retryCount + 1), RETRY_INTERVAL);
        } else {
            logger.error('Max retry attempts reached. Failed to connect to MongoDB.', error);
            process.exit(1);
        }
    }
};

export default connectDB;
