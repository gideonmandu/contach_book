import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import connectDB from './config/db';
import contactRoutes from './routes/contactRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import logger from './config/logger';
import { validateEnvironmentVariables } from './utils/validateEnv';
import { envConfigs } from './config/configs';

const app = express();            
// add middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(errorHandler);

// add routes
app.get('/', (req, res) => {res.send({ "health": 'ok' })});
app.use('/api/v1/contacts', contactRoutes); // Using the contact routes we
// set up
/**
 * The function `start` connects to MongoDB and starts the server on a specified
 * port.
 */
const start = async () => {
    try {
        // Validate environment variables
        validateEnvironmentVariables();
        // Connect to MongoDB
        await connectDB();
        const {PORT} = envConfigs;
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(error);
    }
};

start();
export default app