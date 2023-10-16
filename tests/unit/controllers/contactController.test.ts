import request from 'supertest';
import express from 'express';
import { createContact, getContacts, getContact, updateContact, deleteContact } from '../../../src/controllers/contactController';
import Contact from '../../../src/models/contact';
import { generateMockContact, generateMockContacts, generateMockUpdateData } from '../../utils/mockGenerators';

// Mock the dependencies
jest.mock('../../../src/models/contact');
jest.mock('../../../src/config/logger');

const app = express();
app.use(express.json());
app.post('/contact/', createContact);
app.get('/contacts/', getContacts);
app.get('/contact/:id', getContact);
app.put('/contact/:id', updateContact);
app.delete('/contact/:id', deleteContact);


describe('createContact', () => {
    it('should create a contact and return 201 status', async () => {
        (Contact as jest.Mocked<typeof Contact>).prototype.save.mockResolvedValueOnce({ _id: 'some_id' });

        const response = await request(app)
            .post('/contact/')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '64-990-611-3752'
                // Add other fields if necessary
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Contact saved');
    });

    it('should handle validation error', async () => {
        (Contact as jest.Mocked<typeof Contact>).prototype.save.mockResolvedValueOnce({ _id: 'some_id' });

        const response = await request(app)
            .post('/contact/')
            .send({
                lastName: 'Doe',
                phoneNumber: '64-990-611-3752'
                // Add other fields if necessary
            });

        expect(response.status).toBe(422);
        expect(response.body.message).toBe('\"firstName\" is required');
    });

});


describe('getContacts', () => {
    it('should fetch contacts with pagination', async () => {
        // Mock database response
        (Contact.find as jest.Mock).mockResolvedValueOnce(generateMockContacts(11));

        const response = await request(app).get('/contacts/?limit=10&page=1');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.contacts).toHaveLength(10);  // or whatever your mock length is
    });

    it('should handle no contacts found', async () => {
        // Mock database response
        (Contact.find as jest.Mock).mockResolvedValueOnce([]);

        const response = await request(app).get('/contacts/');

        expect(response.status).toBe(404);
        expect(response.body.contacts).toHaveLength(0);
    });
});

describe('getContact', () => {
    it('should fetch a specific contact by ID', async () => {
        const id = 'some_id';
        (Contact.findById as jest.Mock).mockResolvedValueOnce(generateMockContact(id));

        const response = await request(app).get(`/contact/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        // Check other fields if necessary
    });

    it('should handle contact not found', async () => {
        (Contact.findById as jest.Mock).mockResolvedValueOnce(null);

        const response = await request(app).get('/contact/some_invalid_id');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });
});

describe('updateContact', () => {
    it('should update a contact successfully', async () => {
        const id = 'some_id';
        (Contact.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(generateMockContact(id));

        const response = await request(app).put('/contact/some_id').send(generateMockUpdateData());

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        // Check other fields if necessary
    });

    it('should handle contact not found', async () => {
        (Contact.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

        const response = await request(app).put('/contact/some_invalid_id').send(generateMockUpdateData());

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    // Add test for validation error
    it('should handle validation error', async () => {
        (Contact.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

        const response = await request(app).put('/contact/some_invalid_id').send({
            lastName: 'Doe',
            phoneNumber: '64-990-611-3752'
            // Add other fields if necessary
        });

        expect(response.status).toBe(422);
        expect(response.body.message).toBe('\"firstName\" is required');
    });
});

describe('deleteContact', () => {
    it('should delete a contact successfully', async () => {
        const id = 'some_id';
        (Contact.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(generateMockContact(id));

        const response = await request(app).delete(`/contact/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should handle contact not found', async () => {
        (Contact.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

        const response = await request(app).delete('/contact/some_invalid_id');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });
});

afterEach(() => {
    jest.clearAllMocks();
});
