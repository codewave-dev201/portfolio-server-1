const express = require('express');
const router = express.Router();

const { addProject, editProject, getProjects } = require('../controllers/projectController');
const upload = require('../middlewares/multerMiddleware');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/project', upload.single('imageFile'), protectAdmin, addProject);
router.put('/updateProject/:id', upload.single('imageFile'), protectAdmin, editProject);
router.get('/', getProjects);

module.exports = router;
