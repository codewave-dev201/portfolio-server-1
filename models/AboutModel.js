const mongoose = require('mongoose');

const AboutModel = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            match: [/^\d{10,15}$/, 'Invalid phone number'], // Adjust pattern as needed
        },
        email: {
            type: String,
            required: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        },
        age: {
            type: Number,
            required: true,
        },
        nickname: {
            type: String,
            trim: true,
        },
        town: {
            type: String,
            trim: true,
        },
        languages: {
            type: String,
            // type: [String], // Array of strings for multiple languages
            required: true,
        },
        yearsOfExperience: {
            type: Number,
            required: true,
        },
        completedProjects: {
            type: String,
            required: true,
        },
        happyCustomers: {
            type: String,
            required: true,
        },
        awardsWon: {
            type: String,
            required: true,
        },
        cvUrl: {
            type: String,
            match: [/^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/, 'Invalid image URL'],
        },
    },
    { timestamps: true }
);

AboutModel.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const About = mongoose.model('About', AboutModel);

module.exports = About;
