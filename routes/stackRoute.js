const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerMiddleware'); // Ensure middleware is set up for image upload
const { addStack, editStack, getStacks } = require('../controllers/stackController');
const { protectAdmin } = require('../middlewares/authMiddleware');


router.post('/stack', upload.single('imageFile'), protectAdmin, addStack); // Add a new stack
router.put('/stack/:id', upload.single('imageFile'), protectAdmin, editStack); // Update an existing stack
router.get('/stack', getStacks); // Get all stacks

module.exports = router;
