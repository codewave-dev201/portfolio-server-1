const express = require('express');
const upload = require('../middlewares/multerMiddleware');
const { 
    addStackContent,
    getStackContent,
    updateStackContent
} = require('../controllers/stackGroupController');
const { protectAdmin } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/addStack', upload.array("images", 2), protectAdmin, addStackContent);
router.get('/stack/:id', getStackContent);
router.put('/updateStack/:id',  upload.array("images", 2), protectAdmin, updateStackContent);


module.exports = router;
