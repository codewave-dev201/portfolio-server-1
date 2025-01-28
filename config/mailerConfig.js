const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

// Email Templates
const templates = {
    forgotPassword: (otp) => `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Forgot Password OTP</h1>
            <p>Your OTP to reset your password is:</p>
            <h2>${otp}</h2>
            <p>This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email.</p>
        </body>
        </html>
    `,
    resendOtp: (otp) => `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Resend OTP</h1>
            <p>Your OTP for verification is:</p>
            <h2>${otp}</h2>
            <p>This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email.</p>
        </body>
        </html>
    `,
    userRegistration: (userName) => `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Welcome to Didi's Fashion, ${userName}!</h1>
            <p>Thank you for registering with us. We’re thrilled to have you onboard. Explore our latest collections today!</p>
        </body>
        </html>
    `,
    adminRegistration: (adminName) => `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Welcome, ${adminName}!</h1>
            <p>Your admin account has been successfully created. Log in to manage the platform efficiently.</p>
        </body>
        </html>
    `,
};

// OTP Generator
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Email Sender Function
const sendMail = async ({ to, subject, template, otp, name }) => {
    let html;

    // Choose the correct template
    switch (template) {
        case 'forgotPassword':
            html = templates.forgotPassword(otp);
            break;
        case 'resendOtp':
            html = templates.resendOtp(otp);
            break;
        case 'userRegistration':
            html = templates.userRegistration(name);
            break;
        case 'adminRegistration':
            html = templates.adminRegistration(name);
            break;
        default:
            throw new Error('Invalid email template specified.');
    }

    // Send email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};

module.exports = {
    generateOtp,
    sendMail,
};
