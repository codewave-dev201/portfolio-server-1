const mongoose = require('mongoose');

const StackGroupSchema = new mongoose.Schema(
    {
        stackHeader: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        stackContent: {
            type: String,
            required: true,
            trim: true,
        },
        images: [
            {
                url: {
                    type: String,
                    match: [
                        /^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/,
                        'Invalid image URL',
                    ],
                },
                // view: {
                //     type: String,
                //     trim: true,
                // },
            },
        ],
    },
    { timestamps: true }
);

const StackGroup = mongoose.model('StackGroup', StackGroupSchema);

module.exports = StackGroup;
