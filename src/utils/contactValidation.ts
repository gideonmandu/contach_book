import Joi from 'joi';


const phoneRegex: RegExp = /^\d{2}-\d{3}-\d{3}-\d{4}$/;

export const contactValidationSchema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().optional().allow('').default(''),
    lastName: Joi.string().optional().allow('').default(''),
    nickName: Joi.string().optional().allow('').default(''),
    phoneNumber: Joi.string().pattern(phoneRegex).required(),  // Assuming a 10-digit phone number.
    email: Joi.string().email().optional().allow('').default(''),
    address: Joi.object({
        street: Joi.string().optional().allow('').default(''),
        city: Joi.string().optional().allow('').default(''),
        county: Joi.string().optional().allow('').default(''),
        country: Joi.string().optional().allow('').default(''),
        postalCode: Joi.string().optional().allow('').default('')
    }).optional(),
    importantDates: Joi.object({
        dateOfBirth: Joi.date().optional(),
        dateOfAnniversary: Joi.date().optional()
    }).optional(),
    workInfo: Joi.object({
        company: Joi.string().optional().allow('').default(''),
        jobTitle: Joi.string().optional().allow('').default(''),
        department: Joi.string().optional().allow('').default('')
    }).optional(),
    notes: Joi.string().optional().allow('').default(''),
    profilePhoto: Joi.string().uri().optional().allow('').default(''),  // Assuming profilePhoto is a URL.
    website: Joi.string().uri().optional().allow('').default(''),
    socialLinks: Joi.object({
        facebook: Joi.string().uri().optional().allow('').default(''),  // Assuming links are URLs.
        twitter: Joi.string().uri().optional().allow('').default(''),
        linkedin: Joi.string().uri().optional().allow('').default(''),
        instagram: Joi.string().uri().optional().allow('').default('')
    }).optional()
});
