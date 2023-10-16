import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { envConfigs } from '../config/configs';

/**
 * The errorHandler function handles errors in a TypeScript application by logging
 * the error and returning an appropriate response with an error message and stack
 * trace.
 * @param {Error} err - The `err` parameter is the error object that was thrown or
 * passed to the middleware.
 * @param {Request} req - The `req` parameter represents the HTTP request object,
 * which contains information about the incoming request such as headers, query
 * parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object in
 * Express.js. It represents the HTTP response that will be sent back to the
 * client. It is used to set the status code and send the response data.
 * @param {NextFunction} next - The `next` parameter is a function that is used to
 * pass control to the next middleware function in the request-response cycle. It
 * is typically used when an error occurs and you want to skip the current
 * middleware and move on to the next one.
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    logger.error(err.message, { stack: err.stack, request: req.originalUrl });
    res.status(statusCode).json({
        message: `${err.message}` || 'Internal Server Error',
        stack: envConfigs.NODE_ENV === 'production' ? '' : err.stack, 
    });
};

export { errorHandler };
