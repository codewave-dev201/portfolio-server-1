const mongoose = require('mongoose');

const ServiceModel = new mongoose.Schema(
    {
        service: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        serviceDesc: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            match: [/^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/, 'Invalid image URL'],
        },
    },
    { timestamps: true }
);

ServiceModel.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Service = mongoose.model('Service', ServiceModel);

module.exports = Service;
