const mongoose = require('mongoose');

// Define the schema for User
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        phoneNumber: {
            type: String,
            required: true,
            // match: [/^\d{10}$/, 'Please provide a valid phone number'],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        address: {
            street: String,
            city: String,
            postalCode: String,
            country: String,
        },
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        orderHistory: [
            {
                orderId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Order',
                },
                products: [
                    {
                        productId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'Product',
                        },
                        quantity: Number,
                        price: Number,
                    },
                ],
                orderDate: { type: Date, default: Date.now },
                totalAmount: Number,
                shippingStatus: {
                    type: String,
                    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
                    default: 'Pending',
                },
                paymentStatus: {
                    type: String,
                    enum: ['Pending', 'Completed', 'Failed'],
                    default: 'Pending',
                },
            },
        ],
        wishlist: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        // profilePicture: {
        //     type: String, 
        //     default: 'defaultProfilePicUrl', 
        // },
        loginAttempts: {
            type: Number,
            default: 0,
            select: false,
        },
        lockUntil: {
            type: Date,
            select: false,
        },
        otp: {
            type: String,
            select: false, 
        },
        otpExpiry: {
            type: Date,
            select: false, 
        },
        role: {
            type: String,
            enum: ['user', 'admin'], 
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
