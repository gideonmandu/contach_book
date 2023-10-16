import logger from '../config/logger';
import { decrypt, encrypt } from './encryption';

const keysToEncryptOrDecrypt = [
    'firstName', 'middleName', 'lastName', 'nickName',
    'phoneNumber', 'email',
    'address.street', 'address.city', 'address.county', 'address.country', 'address.postalCode',
    'importantDates.dateOfBirth', 'importantDates.dateOfAnniversary',
    'notes'
];

/**
 * The function `transformContact` takes a contact object and a transformation
 * function, and applies the transformation function to specified keys in the
 * contact object.
 * @param contact - The `contact` parameter is an object that represents a contact.
 * It can have any number of properties, where each property is a key-value pair.
 * The values can be of any type, but for the purpose of this function, we are only
 * interested in properties whose values are strings.
 * @param transformationFn - The `transformationFn` parameter is a function that
 * takes a string as input and returns a transformed string. This function is used
 * to transform the values of certain keys in the `contact` object.
 * @returns the transformed contact object.
 */
export function transformContact(contact: Record<string, any>, transformationFn: (value: string) => string): Record<string, any> {
    logger.debug('Transforming contact');
    for (const key of keysToEncryptOrDecrypt) {
        const keys = key.split('.');
        if (keys.length === 1 && typeof contact[keys[0]] === 'string') {
            contact[keys[0]] = transformationFn(contact[keys[0]]);
        } else if (
            keys.length === 2 &&
            contact[keys[0]] &&
            typeof contact[keys[0]] === 'object' &&
            typeof contact[keys[0]][keys[1]] === 'string'
        ) {
            contact[keys[0]][keys[1]] = transformationFn(contact[keys[0]][keys[1]]);
        }
    }
    return contact;
}

/**
 * The function encryptContact takes a contact object and returns a new object with
 * encrypted contact information.
 * @param contact - A contact object that contains information about a person.
 * @returns a transformed contact object with encrypted values.
 */
export function encryptContact(contact: Record<string, any>): Record<string, any> {
    logger.debug('Encrypting contact');
    return transformContact(contact, encrypt);
}

/**
 * The function decrypts an encrypted contact object by transforming it using a
 * decryption function.
 * @param encryptedContact - A record object containing encrypted contact
 * information.
 * @returns a decrypted contact, which is a record (object) with string keys and
 * any values.
 */
export function decryptContact(encryptedContact: Record<string, any>): Record<string, any> {
    logger.debug('Decrypting contact');
    return transformContact(encryptedContact, decrypt);
}