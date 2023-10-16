import { assertEnvVariable, validateEnvironmentVariables } from '../../../src/utils/validateEnv';


jest.mock('../../../src/config/configs', () => ({
    envConfigs: {
        PORT: '3000',
        DB_HOST: 'localhost',
        NODE_ENV: 'development',
        DB_PORT: 'nada',
        DB_NAME: 'contact-service',
        DB_USER: 'root',
        DB_PASSWORD: 'root',
        DB_MAX_RETRIES: '1',
        DB_RETRY_INTERVAL: '1000',
        ENCRYPTION_SECRET: 'secret',
        ENCRYPTION_ALGORITHM: 'aes-256-cbc',
        ENCRYPTION_IV_LENGTH: '1',
        LOGGING_LEVEL: 'debug',
        JWT_SECRET: 'secret',
        JWT_EXPIRY: '1d',
        PAGINATION_DEFAULT_LIMIT: '10',
        PAGINATION_DEFAULT_PAGE: '1',
    }
}));


describe('assertEnvVariable', () => {
    it('should throw an error if value is undefined', () => {
        expect(() => assertEnvVariable(undefined, 'TEST_VAR')).toThrow('TEST_VAR is required and must be valid.');
    });

    it('should throw an error if value does not pass the type check', () => {
        expect(() => assertEnvVariable('not-a-number', 'TEST_VAR', value => !isNaN(value)))
            .toThrow('TEST_VAR is required and must be valid.');
    });

    it('should not throw an error if value is defined and passes the type check', () => {
        expect(() => assertEnvVariable('3000', 'TEST_VAR', value => !isNaN(value))).not.toThrow();
    });
});


describe('validateEnvironmentVariables', () => {
    it(
        'should throw an error if any of the environment variables are invalid',
        () => {
        expect(
            validateEnvironmentVariables
        ).toThrow('Invalid DB_PORT. It should be between 1 and 65535.');
    });

    it(
        'should not throw an error if all the environment variables are valid', 
        () => {
        // Reset the mock with valid values
        jest.resetModules();
        jest.mock('../../../src/config/configs', () => ({
            envConfigs: {
            PORT: '3000',
            DB_HOST: 'localhost',
            NODE_ENV: 'development',
            DB_PORT: '1000',
            DB_NAME: 'contact-service',
            DB_USER: 'root',
            DB_PASSWORD: 'root',
            DB_MAX_RETRIES: '1',
            DB_RETRY_INTERVAL: '1000',
            ENCRYPTION_SECRET: 'secret',
            ENCRYPTION_ALGORITHM: 'aes-256-cbc',
            ENCRYPTION_IV_LENGTH: '1',
            LOGGING_LEVEL: 'debug',
            JWT_SECRET: 'secret',
            JWT_EXPIRY: '1d',
            PAGINATION_DEFAULT_LIMIT: '10',
            PAGINATION_DEFAULT_PAGE: '1',}
        }));
        // Re-import the function to get the updated mock values
        const { validateEnvironmentVariables } = require('../../../src/utils/validateEnv');
        expect(validateEnvironmentVariables).not.toThrow();
    });
});