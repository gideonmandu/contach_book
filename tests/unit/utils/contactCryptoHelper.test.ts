import { encryptContact, decryptContact, transformContact } from '../../../src/utils/contactCryptoHelper';
import * as encryptionModule from '../../../src/utils/encryption';
import logger from '../../../src/config/logger';

jest.mock('../../../src/config/logger', () => ({
    debug: jest.fn(),
}));

describe('Contact Transformation', () => {
    const mockLogger = logger.debug as jest.MockedFunction<typeof logger.debug>;
    
    let encryptSpy: jest.SpyInstance;
    let decryptSpy: jest.SpyInstance;

    beforeEach(() => {
        encryptSpy = jest.spyOn(encryptionModule, 'encrypt').mockImplementation(value => `encrypted-${value}`);
        decryptSpy = jest.spyOn(encryptionModule, 'decrypt').mockImplementation(value => value.replace('encrypted-', ''));

        mockLogger.mockClear();
    });

    afterEach(() => {
        encryptSpy.mockRestore();
        decryptSpy.mockRestore();
    });


    it('should transform a contact using a given transformation function', () => {
        const mockTransformationFn = jest.fn((value: string) => `transformed-${value}`);
        const contact = {
            firstName: 'John',
            address: {
                street: 'Main St',
                city: 'Sample City'
            }
        };

        const transformedContact = transformContact(contact, mockTransformationFn);

        expect(mockTransformationFn).toHaveBeenCalledTimes(3);
        expect(transformedContact.firstName).toBe('transformed-John');
        expect(transformedContact.address.street).toBe('transformed-Main St');
    });

    it('should encrypt a contact', () => {
        const contact = {
            firstName: 'John',
            address: {
                street: 'Main St'
            }
        };

        const encryptedContact = encryptContact(contact);

        expect(encryptSpy).toHaveBeenCalledTimes(2); // Ensure encryption function is called
        expect(encryptedContact.firstName).toBe('encrypted-John');
        expect(encryptedContact.address.street).toBe('encrypted-Main St');
        expect(mockLogger).toHaveBeenCalledWith('Encrypting contact');
    });

    it('should decrypt a contact', () => {
        const encryptedContact = {
            firstName: 'encrypted-John',
            address: {
                street: 'encrypted-Main St'
            }
        };

        const decryptedContact = decryptContact(encryptedContact);

        expect(decryptSpy).toHaveBeenCalledTimes(2); // Ensure decryption function is called
        expect(decryptedContact.firstName).toBe('John');
        expect(decryptedContact.address.street).toBe('Main St');
        expect(mockLogger).toHaveBeenCalledWith('Decrypting contact');
    });
});
