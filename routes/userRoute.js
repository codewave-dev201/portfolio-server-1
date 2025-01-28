const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    removeFromWishlist,
    addToWishlist
} = require('../controllers/userController');

const  { authenticateUser } = require('../middlewares/userAuthMiddleware');

const router = express.Router();

router.get("/profile", authenticateUser, getUserProfile);
router.put("/update", authenticateUser, updateUserProfile );
router.post("/wishList", authenticateUser, addToWishlist);
router.delete("/remove/wishList", authenticateUser, removeFromWishlist);

module.exports = router;