const express = require('express');
const {
    registerUser,
    verifyOTP,
    loginUser,
    resendOtp,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/forgotPassword", forgotPassword);
router.post("/newOtp", resendOtp);
router.post("/resetPassword", resetPassword);

module.exports = router;