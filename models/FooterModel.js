const mongoose = require('mongoose');

const FooterModel = new mongoose.Schema(
    {
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
        linkedin: {
            type: String,
            required: true,
            unique: true,
        },
        instagram: {
            type: String,
            required: true,
            unique: true,
        },
        whatsapp: {
            type: String,
            required: true,
            unique: true,
        },
        twitter: {
            type: String,
            required: true,
            unique: true,
        },
        tiktok: {
            type: String,
            required: true,
            unique: true,
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

FooterModel.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Footer = mongoose.model('Footer', FooterModel);

module.exports = Footer;
