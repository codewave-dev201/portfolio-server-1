const express = require('express');
const router = express.Router();

const { addService, editService, getServices } = require('../controllers/serviceController');
const upload = require('../middlewares/multerMiddleware');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/service', upload.single('imageFile'), protectAdmin, addService);
router.put('/updateService/:id', upload.single('imageFile'), protectAdmin, editService);
// router.delete('/:id', protectAdmin, deleteService); // Uncomment if deleteService is added
router.get('/', getServices);

module.exports = router;
