const express = require('express');
const { registerAdmin, verifyOTP, loginAdmin, getAdminDashboard } = require('../controllers/adminController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/admin/register", registerAdmin);
router.post("/admin/verify-otp", verifyOTP);
router.post("/admin/login", loginAdmin);
router.get("/admin/dashboard", protectAdmin, getAdminDashboard);

module.exports = router;


