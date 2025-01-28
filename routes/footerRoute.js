const express = require('express');
const { addFooter, editFooter, getFooter } = require('../controllers/footerController');
const { protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to add footer details
router.post('/add-footer', protectAdmin, addFooter);

// Route to edit footer details
router.put('/edit/:id', protectAdmin, editFooter);

// Route to get all footer details
router.get('/footer', getFooter);

module.exports = router;
