const express = require('express');
const router = express.Router();

const { addAbout, editAbout, getAbout } = require('../controllers/aboutController'); // Updated to About
const upload = require('../middlewares/multerMiddleware');
const { protectAdmin } = require('../middlewares/authMiddleware'); // ProtectAdmin remains

router.post('/about', upload.single('cvFile'), protectAdmin, addAbout); // Removed upload middleware
router.put('/updateAbout/:id', protectAdmin, editAbout); // Removed upload middleware
router.get('/about', getAbout);

module.exports = router;
