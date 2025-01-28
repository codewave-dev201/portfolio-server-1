const mongoose = require('mongoose');

const ContactDetailsModel = new mongoose.Schema(
    {
        header: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        phoneNumber: {
            type: String,
            required: true,
            // trim: true,
        },
        whatsappNumber: {
            type: String,
            required: true,
            // trim: true,
            // match: [/^\\+?[0-9]{10,15}$/, 'Invalid WhatsApp number format'],
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        address: {
            type: String,
            required: true,
            // trim: true,
        },
        // mapUrl: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },
    },
    { timestamps: true }
);

const ContactDetails = mongoose.model('ContactDetails', ContactDetailsModel);

module.exports = ContactDetails;
