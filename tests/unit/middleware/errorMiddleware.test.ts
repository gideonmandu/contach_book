import request from 'supertest';
import express from 'express';
import type { ErrorRequestHandler } from 'express';

describe('errorHandler middleware', () => {
    let errorHandler: ErrorRequestHandler;
    let originalNodeEnv: string | undefined;

    // Before each test, store the original NODE_ENV and reset modules
    beforeEach(() => {
        originalNodeEnv = process.env.NODE_ENV;
        jest.resetModules();
    });

    // After each test, reset NODE_ENV to its original value
    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
    });

    it('should log the error and return a 500 status with an error message and stack trace', async () => {
        process.env.NODE_ENV = 'development'; // Set NODE_ENV for this test
        errorHandler = require('../../../src/middleware/errorMiddleware').errorHandler;
        const app = express();
        app.get('/', (req, res, next) => {
            next(new Error('Test error'));
        });
        app.use(errorHandler);

        const res = await request(app).get('/');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            message: 'Test error',
            stack: expect.any(String),
        });
    });

    it('should return a sanitized error response in production environment', async () => {
        process.env.NODE_ENV = 'production'; // Set NODE_ENV for this test
        errorHandler = require('../../../src/middleware/errorMiddleware').errorHandler;
        const app = express();
        app.get('/', (req, res, next) => {
            next(new Error('Test error'));
        });
        app.use(errorHandler);

        const res = await request(app).get('/');
        expect(res.body).toEqual({
            message: 'Test error',
            stack: '',
        });
    });
});
