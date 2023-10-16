import crypto from 'crypto';
import { envConfigs } from '../config/configs';

const algorithm =  envConfigs.ENCRYPTION_ALGORITHM;
const secretKey = envConfigs.ENCRYPTION_SECRET;
const ivLength = envConfigs.ENCRYPTION_IV_LENGTH;

// In encryption.ts (right after importing crypto)
if (!secretKey || secretKey.length !== 32) {
    throw new Error('Invalid encryption secret key.');
}


/**
 * The `encrypt` function takes a string as input, encrypts it using a specified
 * algorithm and secret key, and returns the encrypted text along with the
 * initialization vector (IV) in a specific format.
 * @param {string} text - The `text` parameter is the string that you want to
 * encrypt.
 * @returns a string that consists of the initialization vector (iv) and the
 * encrypted text, separated by a colon.
 */
export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * The `decrypt` function takes in an encrypted text, splits it into parts, and
 * uses a decipher to decrypt the text using a secret key and initialization vector
 * (IV).
 * @param {string} text - The `text` parameter is a string that represents the
 * encrypted text that you want to decrypt.
 * @returns The decrypted text as a string.
 */
export const decrypt = (text: string): string => {
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts.shift()!, 'hex');
        const encryptedText = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
        return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString();
    } catch (error) {
        throw new Error("Decryption failed");
    }
};
