const express = require('express');
const router = express.Router();
const { 
    addContactDetails,
    editContactDetails,
    getContactDetails,
} = require('../controllers/contactDetailsController');

const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/add-details', protectAdmin, addContactDetails);
router.put('/update-details/:id', protectAdmin, editContactDetails);
router.get('/get-details', getContactDetails);

module.exports = router;