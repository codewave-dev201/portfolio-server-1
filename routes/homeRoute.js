const express = require('express');
const router = express.Router();

const {addHome, editHome, getHome} = require('../controllers/homeController');
const upload = require('../middlewares/multerMiddleware');
const{ protectAdmin} = require('../middlewares/authMiddleware');

router.post('/home', upload.single('imageFile'), protectAdmin, addHome);
router.put('/updateHome/:id', upload.single('imageFile'), protectAdmin, editHome);
// router.delete('/:id', protectAdmin, deleteHome);
router.get('/', getHome);


module.exports = router;