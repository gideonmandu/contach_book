import { contactValidationSchema } from '../../../src/utils/contactValidation';

describe('Contact Validation Schema', () => {

    describe('Valid Inputs', () => {

        it('should validate a complete contact', () => {
            const contact = {
                firstName: 'John',
                phoneNumber: '01-234-567-8901',
                email: 'john@example.com',
                address: {
                    street: '123 Main St',
                    city: 'Sample City'
                },
                profilePhoto: 'https://example.com/photo.jpg',
                website: 'https://john.doe',
                socialLinks: {
                    facebook: 'https://facebook.com/john.doe',
                    twitter: 'https://twitter.com/john_doe',
                    linkedin: 'https://linkedin.com/in/john_doe',
                }
            };

            const { error } = contactValidationSchema.validate(contact);
            expect(error).toBeUndefined();
        });

    });

    describe('Invalid Inputs', () => {

        it('should invalidate a contact without a first name', () => {
            const contact = {
                phoneNumber: '01-234-567-8901'
            };

            const { error } = contactValidationSchema.validate(contact);
            expect(error?.details[0].message).toEqual('"firstName" is required');
        });

        it('should invalidate a phone number not matching the pattern', () => {
            const contact = {
                firstName: 'John',
                phoneNumber: '12345678901'
            };

            const { error } = contactValidationSchema.validate(contact);
            expect(error?.details[0].message).toEqual('"phoneNumber" with value "12345678901" fails to match the required pattern: /^\\d{2}-\\d{3}-\\d{3}-\\d{4}$/');
        });

        it('should invalidate an email that is not in correct format', () => {
            const contact = {
                firstName: 'John',
                phoneNumber: '01-234-567-8901',
                email: 'invalid-email'
            };

            const { error } = contactValidationSchema.validate(contact);
            expect(error?.details[0].message).toEqual('"email" must be a valid email');
        });

    });

});
