const mongoose = require('mongoose');

const HomeModel = new mongoose.Schema(
    {
        welcomeText: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100,
        },
        name: {
            type: String,
            required: true,
            unique: true,
            maxlength: 100,
        },
        homeText: {
            type: String,
            required: true,
            unique: true,
        },
        facebook: {
            type: String,
            required: true,
            unique: true,
        },
        github: {
            type: String,
            required: true,
            unique: true,
        },
        linkedIn: {
            type: String,
            required: true,
            unique: true,
        },
        instagram: {
            type: String,
            required: true,
            unique: true,
        },
        btnText: {
            type: String,
            required: true,
            unique: true,
        },
        imageUrl: {
            type: String,
            match: [/^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/, 'Invalid image URL'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

HomeModel.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Home = mongoose.model('Home', HomeModel);

module.exports = Home;
