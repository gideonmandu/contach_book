import { envConfigs } from "../config/configs";

/**
 * The assertEnvVariable function checks if a value exists and is of a valid type,
 * throwing an error if not.
 * @param {any} value - The `value` parameter represents the value of the
 * environment variable that needs to be checked.
 * @param {string} name - The `name` parameter is a string that represents the name
 * of the environment variable being checked.
 * @param typeCheck - The `typeCheck` parameter is a function that takes a value as
 * an argument and returns a boolean value indicating whether the value is of the
 * expected type. It is an optional parameter and has a default value of a function
 * that always returns `true`. This allows you to provide a custom type check
 * function
 */
export const assertEnvVariable = (value: any, name: string, typeCheck: (value: any) => boolean = () => true) => {
    if (!value || !typeCheck(value)) {
        throw new Error(`${name} is required and must be valid.`);
    }
};


/**
 * The function `validateEnvironmentVariables` checks if all the required
 * environment variables have valid values, and throws an error if any of them are
 * missing or have invalid values.
 */
export const validateEnvironmentVariables = (): void => {
    const env = envConfigs;

    assertEnvVariable(env.PORT, 'PORT', value => !isNaN(value));
    assertEnvVariable(env.DB_HOST, 'DB_HOST');
    assertEnvVariable(env.DB_NAME, 'DB_NAME');
    assertEnvVariable(env.DB_USER, 'DB_USER');
    assertEnvVariable(env.DB_PASSWORD, 'DB_PASSWORD');
    assertEnvVariable(env.ENCRYPTION_SECRET, 'ENCRYPTION_SECRET')
    assertEnvVariable(env.ENCRYPTION_ALGORITHM, 'ENCRYPTION_ALGORITHM');
    assertEnvVariable(env.LOGGING_LEVEL, 'LOGGING_LEVEL');
    assertEnvVariable(env.JWT_SECRET, 'JWT_SECRET')
    assertEnvVariable(env.JWT_EXPIRY, 'JWT_EXPIRY')
    if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'production') {
        throw new Error('Invalid NODE_ENV value');
    }
    if (isNaN(env.DB_PORT) || env.DB_PORT <= 0 || env.DB_PORT >= 65536) {
        throw new Error('Invalid DB_PORT. It should be between 1 and 65535.');
    }
    if (isNaN(env.DB_MAX_RETRIES) || env.DB_MAX_RETRIES < 0) {
        throw new Error('Invalid DB_MAX_RETRIES. It should be a positive integer.');
    }
    if (isNaN(env.DB_RETRY_INTERVAL) || env.DB_RETRY_INTERVAL < 0) {
        throw new Error('Invalid DB_RETRY_INTERVAL. It should be a positive integer.');
    }
    if (isNaN(env.ENCRYPTION_IV_LENGTH) || env.ENCRYPTION_IV_LENGTH <= 0) {
        throw new Error('Invalid ENCRYPTION_IV_LENGTH. It should be a positive integer.');
    }
    if (isNaN(env.PAGINATION_DEFAULT_LIMIT) || env.PAGINATION_DEFAULT_LIMIT <= 0) {
        throw new Error('Invalid PAGINATION_DEFAULT_LIMIT. It should be a positive integer.');
    }
    if (isNaN(env.PAGINATION_DEFAULT_PAGE) || env.PAGINATION_DEFAULT_PAGE <= 0) {
        throw new Error('Invalid PAGINATION_DEFAULT_PAGE. It should be a positive integer.');
    }
};
