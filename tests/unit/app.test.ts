import request from 'supertest';
import { Server, AddressInfo } from 'net';
import app from '../../src/app';


// 1. Import modules.
import * as dbConfig from '../../src/config/db';
import * as envValidator from '../../src/utils/validateEnv';

// 2. Mock modules.
jest.mock('../../src/config/db');
jest.mock('../../src/utils/validateEnv');

const mockedConnectDB = dbConfig.connectDB as jest.MockedFunction<typeof dbConfig.connectDB>;
const mockedValidateEnvironmentVariables = envValidator.validateEnvironmentVariables as jest.MockedFunction<typeof envValidator.validateEnvironmentVariables>;

// 3. Set up any before hooks.
beforeEach(() => {
  mockedConnectDB.mockResolvedValue();
  mockedValidateEnvironmentVariables.mockImplementation(() => {});
});

// We'll maintain a reference to the server here
let server: Server | null = null;

describe('Server setup', () => {
  beforeAll(() => {
    server = app.listen(0); // This will make the server listen on an available port
    const address = server.address() as AddressInfo;
    console.log(`Server started for testing on port ${address.port}`);
  });

  afterAll((done) => {
    server!.close(done); // Use '!' to assure TypeScript that server is not null here
  });

  it('should set up heath check routes', async () => {
    // Increase timeout for this test
    jest.setTimeout(10000);

    const res = await request(server!).get('/');
    expect(res.status).toBe(200); // Ensure it returns 200
  });

});