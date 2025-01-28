const Stack = require('../models/StackModel'); // Updated to use StackModel
const cloudinary = require('cloudinary').v2;

// Add a new stack
const addStack = async (req, res) => {
    try {
        const imageUrl = req.file.path; // Extract the file path from the uploaded file

        console.log("Uploaded File:", req.file);

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const newStack = new Stack({
            imageUrl,
        });

        await newStack.save();

        res.status(200).json({ message: "New stack has been added successfully", stack: newStack });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

// Edit an existing stack
const editStack = async (req, res) => {
    try {
        const stackId = req.params.id; // ID of the stack to be updated
        const imageFile = req.file; // New image file from the request

        const existingStack = await Stack.findById(stackId);

        if (!existingStack) {
            return res.status(404).json({ message: 'Stack not found' });
        }

        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image', // Ensure the file is treated as an image
                folder: 'stack_images', // Optional folder organization
            });
            existingStack.imageUrl = result.secure_url; // Update image URL
        }

        await existingStack.save();
        return res.status(200).json({ message: 'Stack updated successfully', stack: existingStack });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while updating the stack' });
    }
};

// Get all stacks
const getStacks = async (req, res) => {
    try {
        const stacks = await Stack.find(); // Retrieve all stacks
        return res.status(200).json({ stacks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching stacks' });
    }
};

module.exports = {
    addStack,
    editStack,
    getStacks,
};
