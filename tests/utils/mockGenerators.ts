import mongoose, { Document, Schema, ObjectId } from 'mongoose';
import { faker } from '@faker-js/faker';

interface Address {
    street: string;
    city: string;
    county: string;
    country: string;
    postalCode: string;
}

interface ImportantDates {
    dateOfBirth: string;
    dateOfAnniversary: string;
}

interface WorkInfo {
    company: string;
    jobTitle: string;
    department: string;
}

interface SocialLinks {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
}

// Extend the Contact interface with mongoose.Document for _id, __v, etc.
interface ContactDocument extends Document {
    address: Address;
    importantDates: ImportantDates;
    workInfo: WorkInfo;
    socialLinks: SocialLinks;
    firstName: string;
    middleName: string;
    lastName: string;
    nickName: string;
    phoneNumber: string;
    email: string;
    notes: string;
    profilePhoto: string;
    website: string;
}

const ContactSchema = new Schema<ContactDocument>({
    address: {
        street: String,
        city: String,
        county: String,
        country: String,
        postalCode: String
    },
    importantDates: {
        dateOfBirth: String,
        dateOfAnniversary: String
    },
    workInfo: {
        company: String,
        jobTitle: String,
        department: String
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String
    },
    firstName: String,
    middleName: String,
    lastName: String,
    nickName: String,
    phoneNumber: String,
    email: String,
    notes: String,
    profilePhoto: String,
    website: String
});

const ContactModel = mongoose.model<ContactDocument>('Contact', ContactSchema);

export const generateMockContact = (
    id: undefined | string = undefined
): ContactDocument => {
    let mockContact: ContactDocument;
    if (id) {
        mockContact = new ContactModel({
            _id: id,
            address: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                county: faker.location.state(),
                country: faker.location.country(),
                postalCode: faker.location.zipCode(),
            },
            importantDates: {
                dateOfBirth: faker.date.past().toString(),
                dateOfAnniversary: faker.date.future().toString(),
            },
            workInfo: {
                company: faker.company.name(),
                jobTitle: faker.person.jobTitle(),
                department: faker.commerce.department(),
            },
            socialLinks: {
                facebook: faker.internet.url(),
                twitter: faker.internet.url(),
                linkedin: faker.internet.url(),
                instagram: faker.internet.url(),
            },
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            nickName: faker.person.fullName(),
            phoneNumber: "28-258-344-5868" || faker.phone.number(),
            email: faker.internet.email(),
            notes: faker.lorem.sentence(),
            profilePhoto: faker.image.url(),
            website: faker.internet.url()
        });
    } else {
        mockContact = new ContactModel({
            address: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                county: faker.location.state(),
                country: faker.location.country(),
                postalCode: faker.location.zipCode(),
            },
            importantDates: {
                dateOfBirth: faker.date.past().toString(),
                dateOfAnniversary: faker.date.future().toString(),
            },
            workInfo: {
                company: faker.company.name(),
                jobTitle: faker.person.jobTitle(),
                department: faker.commerce.department(),
            },
            socialLinks: {
                facebook: faker.internet.url(),
                twitter: faker.internet.url(),
                linkedin: faker.internet.url(),
                instagram: faker.internet.url(),
            },
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            nickName: faker.person.fullName(),
            phoneNumber: "28-258-344-5868" || faker.phone.number(),
            email: faker.internet.email(),
            notes: faker.lorem.sentence(),
            profilePhoto: faker.image.url(),
            website: faker.internet.url()
        });
    }
    return mockContact;
};


export const generateMockContacts = (count: number): ContactDocument[] => {
    return Array(count).fill(null).map(() => generateMockContact());
}

export const generateMockUpdateData = () => {
    return {
        address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            county: faker.location.state(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode(),
        },
        importantDates: {
            dateOfBirth: faker.date.past().toString(),
            dateOfAnniversary: faker.date.future().toString(),
        },
        workInfo: {
            company: faker.company.name(),
            jobTitle: faker.person.jobTitle(),
            department: faker.commerce.department(),
        },
        socialLinks: {
            facebook: faker.internet.url(),
            twitter: faker.internet.url(),
            linkedin: faker.internet.url(),
            instagram: faker.internet.url(),
        },
        firstName: faker.person.firstName(),
        middleName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        nickName: faker.person.fullName(),
        phoneNumber: "28-258-344-5868" || faker.phone.number(),
        email: faker.internet.email(),
        notes: faker.lorem.sentence(),
        profilePhoto: faker.image.url(),
        website: faker.internet.url()
    }
}