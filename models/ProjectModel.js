const mongoose = require('mongoose');

const ProjectModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        previewLink: {
            type: String,
            required: true,
            // match: [/^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/, 'Invalid URL format'],
        },
        imageUrl: {
            type: String,
            required: true,
            match: [/^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/, 'Invalid image URL format'],
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

ProjectModel.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Projects = mongoose.model('Projects', ProjectModel);

module.exports = Projects;
