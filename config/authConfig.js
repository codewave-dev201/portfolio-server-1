const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT Token
const generateToken = (adminId, role) => {
    return jwt.sign(
        { id: adminId, role },
        process.env.JWT_SECRET,
        { expiresIn: '1hr' } // Token valid for 1 day
    );
};

module.exports = {
    generateOtp,
    generateToken,
};