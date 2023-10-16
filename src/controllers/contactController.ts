import express from 'express';
import Contact from '../models/contact';
import logger from '../config/logger';
import { contactValidationSchema } from '../utils/contactValidation';
import { decryptContact, encryptContact } from '../utils/contactCryptoHelper';
import { envConfigs } from '../config/configs';

// Handle errors
/**
 * The function handles an erroneous response by setting the status code, message,
 * and sending a JSON response.
 * @param {number} status - The `status` parameter is a number that represents the
 * HTTP status code to be sent in the response. It indicates the status of the
 * request, such as 200 for a successful request or 404 for a resource not found.
 * @param {string} message - The `message` parameter is a string that represents
 * the error message that will be sent back in the response.
 * @param res - The `res` parameter is the response object that is used to send the
 * response back to the client. It is an instance of the `express.Response` class,
 * which provides methods for setting the response status code, headers, and body.
 */
const handleErroneousResponse = (status: number, message: string, res: express.Response) => {
    res.status(status).json({ success: false, message: message });
}

// Create contact
/**
 * The function creates a contact by validating the request body, encrypting the
 * contact data, saving it to the database, and returning a success response.
 * @param req - The `req` parameter is an object that represents the HTTP request
 * made to the server. It contains information such as the request headers, request
 * body, request method, request URL, and other relevant details.
 * @param res - The `res` parameter is an instance of the `express.Response`
 * object. It represents the HTTP response that will be sent back to the client. It
 * is used to send the response status, headers, and body to the client.
 * @returns a JSON response with the following properties:
 * - success: a boolean value indicating whether the contact was saved successfully
 * - message: a string message indicating the status of the operation
 * - contact: the saved contact object
 */
export const createContact = async (req: express.Request, res: express.Response) => {
    try {
        logger.info(`Creating contact`);
        const payload = req.body;
        const { error } = contactValidationSchema.validate(payload);
    
        if (error) {
            logger.warn(`Validation error ${error.details[0].message}`);
            return handleErroneousResponse(422, error.details[0].message, res);
        }
        // encrypting data
        const encryptedContactData = encryptContact(payload);
        const contact = new Contact(encryptedContactData);
        await contact.save();

        logger.info(`Contact for ${payload.firstName} saved successfully.`);

        res.status(201).json({ success: true, message: 'Contact saved', contact });
    } catch (error) {
        logger.error(`Error creating contact: ${error instanceof Error ? error.message : error}`);
        handleErroneousResponse(500, 'Internal Server Error', res);
    }
};

// get all contacts
/**
 * The `getContacts` function retrieves a paginated list of contacts, decrypts
 * their phone numbers, and returns the contacts along with pagination information.
 * @param req - The `req` parameter is an object that represents the HTTP request
 * made to the server. It contains information such as the request headers, request
 * method, request URL, request body, query parameters, and more.
 * @param res - The `res` parameter is an instance of the `express.Response`
 * object. It represents the HTTP response that will be sent back to the client. It
 * is used to send the response data, such as JSON, HTML, or other content, back to
 * the client.
 */
export const getContacts = async (req: express.Request, res: express.Response) => {
    try {
        // Get the pagination query parameters
        const limit = parseInt(req.query.limit as string, 10) || envConfigs.PAGINATION_DEFAULT_LIMIT; 
        const page = parseInt(req.query.page as string, 10) || envConfigs.PAGINATION_DEFAULT_PAGE;

        const skip = (page - 1) * limit;

        const encryptedContacts = await Contact.find({}).skip(skip).limit(limit);

        // Decrypt the data before sending
        const decryptedContacts = encryptedContacts.map(contact => decryptContact(contact));

        // Get the total number of contacts for pagination info
        const totalContacts = await Contact.countDocuments({});
        const totalPages = Math.ceil(totalContacts / limit);

        let nextPageUrl = null;
        if (page < totalPages) {
            nextPageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}?limit=${limit}&page=${page + 1}`;
        }

        res.json({
            success: true,
            contacts: decryptedContacts,
            pagination: {
                currentPage: page,
                totalPages,
                totalContacts,
                nextPage: nextPageUrl
            }
        });
    } catch (error) {
        logger.error(`Error fetching contacts: ${error instanceof Error ? error.message : error}`);
        handleErroneousResponse(500, 'Internal Server Error', res);
    }
}

// Get a specific contact
/**
 * The function `getContact` retrieves a contact by its ID, decrypts it, and sends
 * it as a response.
 * @param req - The `req` parameter is an object that represents the HTTP request
 * made by the client. It contains information such as the request method, request
 * headers, request parameters, request body, etc.
 * @param res - The `res` parameter is the response object in Express.js. It is
 * used to send the HTTP response back to the client.
 * @returns a JSON response with the decrypted contact object. The response has a
 * "success" property set to true and a "contact" property containing the decrypted
 * contact data.
 */
export const getContact = async (req: express.Request, res: express.Response) => {
    try {
        const encryptedContact = await Contact.findById(req.params.id);

        if (!encryptedContact) {
            logger.warn(`Contact not found.`);
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        // Decrypt the data before sending
        const contact = decryptContact(encryptedContact);

        res.json({ success: true, contact });
    } catch (error) {
        logger.error(`Error fetching contact: ${error instanceof Error ? error.message : error}`);
        handleErroneousResponse(500, 'Internal Server Error', res);
    }
};

// Update a contact
/**
 * The `updateContact` function updates a contact record in a database, encrypts
 * the data, and returns the updated contact.
 * @param req - The `req` parameter is an object that represents the HTTP request
 * made to the server. It contains information such as the request headers, request
 * body, request method, request URL, and other relevant details.
 * @param res - The `res` parameter is the response object in Express.js. It is
 * used to send the HTTP response back to the client.
 * @returns a JSON response. If there is a validation error, it returns a response
 * with status code 422 and an error message. If the contact is not found, it
 * returns a response with status code 404 and a message indicating that the
 * contact was not found. If the contact is successfully updated, it returns a
 * response with status code 200 and the updated contact object. If there
 */
export const updateContact = async (req: express.Request, res: express.Response) => {
    try {
        const { error } = contactValidationSchema.validate(req.body);
    
        if (error) {
            logger.warn(`Validation error ${error.details[0].message}`);
            return handleErroneousResponse(422, error.details[0].message, res);
        }

        // Encrypt the data
        const contact = await Contact.findByIdAndUpdate(req.params.id, {
            ...encryptContact(req.body)
        }, { new: true });

        if (!contact) {
            logger.warn(`Contact not found.`);
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        logger.info(`Contact updated successfully.`);

        res.json({ success: true, contact });
    } catch (error) {
        logger.error(`Error updating contact: ${error instanceof Error ? error.message : error}`);
        handleErroneousResponse(500, 'Internal Server Error', res);
    }
};

// Delete a contact
/**
 * The function `deleteContact` is an asynchronous function that deletes a contact
 * from the database and returns a success message if the deletion is successful,
 * or an error message if there is an error.
 * @param req - The `req` parameter is an object that represents the HTTP request
 * made by the client. It contains information such as the request method, request
 * headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object in Express.js. It is
 * used to send the response back to the client.
 * @returns a JSON response with the following properties:
 * - success: a boolean indicating whether the contact was successfully deleted or
 * not.
 * - message: a string message indicating the result of the deletion.
 */
export const deleteContact = async (req: express.Request, res: express.Response) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            logger.warn(`Contact not found.`);
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        logger.info(`Contact deleted successfully.`);
        res.json({ success: true, message: 'Contact deleted' });
    } catch (error) {
        logger.error(`Error deleting contact: ${error instanceof Error ? error.message : error}`);
        handleErroneousResponse(500, 'Internal Server Error', res);
    }
};
