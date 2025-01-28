const mongoose = require('mongoose');

const StackModel = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
            match: [/^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/, 'Invalid image URL'],
        },
    },
    { timestamps: true } // Automatically includes `createdAt` and `updatedAt`
);

// Remove unnecessary `pre` middleware since there are no fields to manually update
const Stack = mongoose.model('Stack', StackModel);

module.exports = Stack;
