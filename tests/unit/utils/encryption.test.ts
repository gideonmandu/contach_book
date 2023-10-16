import { encrypt, decrypt } from '../../../src/utils/encryption';

describe('Encryption Utility', () => {
    let originalText = "Hello, world!";

    test('encrypt should return a string', () => {
        const encryptedText = encrypt(originalText);
        expect(typeof encryptedText).toBe('string');
    });

    test('decrypt should return the original text', () => {
        const encryptedText = encrypt(originalText);
        const decryptedText = decrypt(encryptedText);
        expect(decryptedText).toBe(originalText);
    });

    test('decrypt should throw an error for malformed input', () => {
        const malformedInput = "12345678:abcdefg";
        expect(() => decrypt(malformedInput)).toThrow("Decryption failed");
    });
});
