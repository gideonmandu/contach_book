describe('Configuration Loading', () => {

    let envConfigs;

    beforeEach(() => {
        // Clear all environment variables before each test to ensure isolation
        process.env = Object.create(null);
        // Clear the cache for the configuration module to ensure it's reloaded in each test
        delete require.cache[require.resolve('.../../../src/config/configs')];
    });

    it('should load default values when environment variables are not set', () => {
        envConfigs = require('.../../../src/config/configs').envConfigs;
        
        expect(envConfigs.PORT).toBe(Number(process.env.PORT));
        expect(envConfigs.NODE_ENV).toBe(process.env.NODE_ENV);
        expect(envConfigs.DB_HOST).toBe('mongo');
    });
});
