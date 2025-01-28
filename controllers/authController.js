const bcrypt = require('bcryptjs');
const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');
const generateOtp = require('../utilities/otpGenerator');
const {
    sendUserRegistrationEmail,
    sendResendOtpEmail,
    sendForgotPasswordOtpEmail

 } = require('../config/nodemailerConfig');

// const nodemailer = require('nodemailer');

const generateJWT = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1hr' });
};


// function to handle otp verification 
const isAccountLocked = (user) => {
    if (user.lockUntil && user.lockUntil > Date.now()) {
        return true;
    }
    return false;
}


const registerUser = async (req, res) => {

    const {firstName, lastName, email, phoneNumber,  password, address} = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with the credentials already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        const newUser = new User({
            firstName,
            lastName, 
            email,
            phoneNumber,
            password: hashedPassword,
            address,
            otp,
            otpExpiry,
            verified: false
        });

        await newUser.save();

        // await sendEmail(
        //     email,
        //     'Verify Your Account',
        //     otp,
        //     firstName,
        //     'registration'
        // );

        // await sendMail(email, 'Verify Your Account - Didi\'s Fashion', sendUserRegistrationEmail(user.firstName, otp));
        await sendUserRegistrationEmail(email, firstName, otp);
       
        res.status(200).json({
            message: 'Registration successful. OTP has been sent to your email for verification.',
        });

    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: "Error during registration",
            success: false
        })
    }
}


const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email }).select('+otp +otpExpiry');
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP provided",
                success: false
            });
        }
        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP provided",
                success: false
            });
        }

        user.isActive = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({
            message: "Your Account has been Activated successfully. Pls proceed to login",
            success: true
        });

    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: "Error verifying OTP! pls try again"
        })
    }
}

// const resendOtp = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Check if an OTP already exists and hasn't expired
//         if (user.otp && user.otpExpiry > Date.now()) {
//             const timeRemaining = Math.ceil((user.otpExpiry - Date.now()) / 1000);
//             return res.status(400).json({
//                 success: false,
//                 message: `An OTP already exists. Please wait ${timeRemaining} seconds before requesting a new OTP.`,
//             });
//         }

//         // Generate new OTP and set expiry
//         const otp = generateOtp();
//         user.otp = otp;
//         user.otpExpiry = Date.now() + 15 * 60 * 1000; 
//         await user.save();

//         // await sendEmail(
//         //     email,
//         //     'Verify Your Account',
//         //     otp,
//         //     userName,
//         //     'resendOtp'
//         // );

//         await sendResendOtpEmail(email, otp);

//         // await sendMail(email, 'Your New OTP - Didi\'s Fashion', resendOtpTemplate(user.firstName, otp));

//         res.status(200).json({ success: true, message: 'A new OTP has been sent to your email.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Clear the old OTP before generating a new one
        user.otp = null;
        user.otpExpiry = null;

        // Generate new OTP and set expiry
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();

        // Send the new OTP email
        await sendResendOtpEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'A new OTP has been sent to your email.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email }).select("+password +loginAttempts +lockUntil");
        if (!user) return res.status(400).json({
            message: "Invalid credentials",
            success: false
        });

        if (isAccountLocked (user)) {
            return res.status(403).json({
                message: "Account is locked due to multiple failed login attempts! Pls try again later"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 60 * 1000;
            }

            await user.save();
            return res.status(400).json({
                message: "Invalid credentials provided",
                success: false
            });
        }

        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        const token = generateJWT(user._id, user.role);

        res.status(200).json({
            message: "Login successful",
            success: true,
            data: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error during login! pls try again",
            success: false
        });
    }
}


// Request OTP for Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate OTP and set expiry
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();

        await sendForgotPasswordOtpEmail(email, otp);

        res.status(200).json({ success: true, message: 'OTP for password change has been sent to your email' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify OTP and Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if OTP is valid
        if (!user.otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired or is invalid' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    registerUser, 
    verifyOTP, 
    loginUser,
    resendOtp,
    forgotPassword,
    resetPassword
};