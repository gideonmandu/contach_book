import mongoose from 'mongoose';

interface Address {
    street?: string;
    city?: string;
    county?: string;
    country?: string;
    postalCode?: string;
}

interface SocialLinks {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
}

interface ImportantDates {
    dateOfBirth?: Date;
    dateOfAnniversary?: Date;
}

interface WorkInfo {
    company?: string;
    jobTitle?: string;
    department?: string;
}

export interface Contact extends mongoose.Document {
    firstName: string;
    middleName?: string;
    lastName?: string;
    nickName?: string;
    phoneNumber: string;
    email?: string;
    address?: Address;
    importantDates?: ImportantDates;
    WorkInfo?: WorkInfo;
    notes?: string;
    profilePhoto?: string;
    website?: string;
    socialLinks?: SocialLinks;
}

const ContactSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true, },
    lastName: { type: String, trim: true, },
    nickName: { type: String, trim: true, },
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    address: {
            street: { type: String, trim: true, },
            city: { type: String, trim: true, },
            county: { type: String, trim: true, },
            country: { type: String, trim: true, },
            postalCode: { type: String, trim: true, },
    },
    importantDates: {
        dateOfBirth: { type: String, required: false, },
        dateOfAnniversary: { type: String, required: false, },
    
    },
    workInfo: {
            company: { type: String, trim: true, },
            jobTitle: { type: String, trim: true, },
            department: { type: String, trim: true, },
        
    },
    notes: { type: String, trim: true, },
    profilePhoto: { type: String, trim: true, },
    website: { type: String, trim: true, },
    socialLinks: {
        facebook: { type: String, trim: true, },
        twitter: { type: String, trim: true, },
        linkedin: { type: String, trim: true, },
        instagram: { type: String, trim: true, },
    },
});


const ContactModel = mongoose.model<Contact>('Contact', ContactSchema);

export default ContactModel;
