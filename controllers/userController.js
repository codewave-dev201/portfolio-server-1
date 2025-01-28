// const express = require('express');
const User = require('../models/UserSchema');

const getUserProfile = async (req, res) => {

   try {

    const userId = req.user.id;
    
    const user = await User.findById(userId).select("-password");

    if(!user) {
        res.status(404).json({
            message: "User not found",
            success: false
        });
    }

    res.status(200).json({
        message: "User profile fetched successfully",
        data: user
    });

   } catch (error) {
    res.status(500).json({
        message: "Error fetching user profile",
        details: error.message
    })
   }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const updates = req.body;

        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating profile', details: error.message });
    }
};

const addToWishlist = async (req, res) => {
    try {

        const userId = req.user.id; 
        const { productId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.wishlist.some(item => item.productId.toString() === productId)) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        user.wishlist.push({ productId });
        await user.save();

        res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding to wishlist', details: error.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { productId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(item => item.productId.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while removing from wishlist', details: error.message });
    }
};


module.exports = {
    getUserProfile,
    updateUserProfile,
    removeFromWishlist,
    addToWishlist
};

