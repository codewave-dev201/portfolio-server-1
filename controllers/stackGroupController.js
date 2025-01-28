// const StackGroup = require('../models/StackGroupSchema');
// const cloudinary = require('cloudinary').v2;

// // Add a new StackGroup
// const addStackGroup = async (req, res) => {
//     try {
//         const { stackHeader, stackContent } = req.body;

       

//         const imageUrlOne = req.file.path; 
//         const imageUrlTwo = req.file.path; 
//         console.log("Request Body:", req.body);
//         console.log("Uploaded File:", req.file); 
//             // const imageTwo = req.files?.imageTwo ? req.files.imageTwo[0].path : null;

//             // if (!imageOne || !imageTwo) {
//             // return res.status(400).json({ error: 'Both images are required' });
//             // }

//             if (!stackHeader || !stackContent || !imageUrlOne || !imageUrlTwo) {
//                 return res.status(400).json({ error: 'All fields, including images, are required' });
//             }
        
        
//         const newStackGroup = new StackGroup({
//             stackHeader,
//             stackContent,
//             imageUrlOne,
//             imageUrlTwo,
//         });

//         await newStackGroup.save();

//         res.status(200).json({ message: 'Stack group added successfully', stackGroup: newStackGroup });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// };

// // Edit an existing StackGroup
// const editStackGroup = async (req, res) => {
//     try {
//         const { stackHeader, stackContent } = req.body;
//         const stackGroupId = req.params.id;

//         const stackGroup = await StackGroup.findById(stackGroupId);

//         if (!stackGroup) {
//             return res.status(404).json({ error: 'Stack group not found' });
//         }

//         if (req.files) {
//             if (req.files.imageOne) {
//                 const imageOneResult = await cloudinary.uploader.upload(req.files.imageOne.path, { folder: 'stackGroup_images' });
//                 stackGroup.imageOneUrl = imageOneResult.secure_url;
//             }

//             if (req.files.imageTwo) {
//                 const imageTwoResult = await cloudinary.uploader.upload(req.files.imageTwo.path, { folder: 'stackGroup_images' });
//                 stackGroup.imageTwoUrl = imageTwoResult.secure_url;
//             }
//         }

//         stackGroup.stackHeader = stackHeader || stackGroup.stackHeader;
//         stackGroup.stackContent = stackContent || stackGroup.stackContent;

//         await stackGroup.save();

//         res.status(200).json({ message: 'Stack group updated successfully', stackGroup });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// };

// // Get all StackGroups
// const getStackGroups = async (req, res) => {
//     try {
//         const stackGroups = await StackGroup.find();
//         res.status(200).json({ stackGroups });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching stack groups');
//     }
// };

// // Delete a StackGroup
// const deleteStackGroup = async (req, res) => {
//     try {
//         const stackGroupId = req.params.id;
//         const stackGroup = await StackGroup.findByIdAndDelete(stackGroupId);

//         if (!stackGroup) {
//             return res.status(404).json({ error: 'Stack group not found' });
//         }

//         res.status(200).json({ message: 'Stack group deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// };

// module.exports = {
//     addStackGroup,
//     editStackGroup,
//     getStackGroups,
//     deleteStackGroup,
// };


const StackContent = require("../models/stackGroupSchema");
const cloudinary = require("../config/cloudinaryConfig");

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  return cloudinary.uploader.upload(filePath, { folder });
};

// **1. Add StackContent**
const addStackContent = async (req, res) => {
  try {
    const { stackHeader, stackContent } = req.body;

    // Handle image uploads
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, "stack_content");
        uploadedImages.push({
          url: result.secure_url,
        //   view: file.originalname.split(".")[0], // View name (e.g., front, back)
        });
      }
    }

    // Create new StackContent
    const newStackContent = new StackContent({
      stackHeader,
      stackContent,
      images: uploadedImages,
    });

    const savedStackContent = await newStackContent.save();
    return res.status(201).json({
      message: "StackContent added successfully.",
      stackContent: savedStackContent,
    });
  } catch (error) {
    console.error("Error adding stackContent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// **2. Get StackContent by ID**
const getStackContent = async (req, res) => {
  try {
    const stackContent = await StackContent.findById(req.params.id);
    if (!stackContent) return res.status(404).json({ error: "StackContent not found" });
    return res.status(200).json({ stackContent });
  } catch (error) {
    console.error("Error fetching stackContent", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// **3. Update StackContent**
const updateStackContent = async (req, res) => {
  try {
    const { stackHeader, stackContent } = req.body;

    const stackContentItem = await StackContent.findById(req.params.id);
    if (!stackContentItem) return res.status(404).json({ error: "StackContent not found" });

    // Handle image uploads (if new images are provided)
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, "stack_content");
        uploadedImages.push({
          url: result.secure_url,
          view: file.originalname.split(".")[0], // View name
        });
      }

      stackContentItem.images = uploadedImages; // Replace images
    }

    // Update other fields
    stackContentItem.stackHeader = stackHeader || stackContentItem.stackHeader;
    stackContentItem.stackContent = stackContent || stackContentItem.stackContent;

    const updatedStackContent = await stackContentItem.save();
    return res.status(200).json({
      message: "StackContent updated successfully.",
      stackContent: updatedStackContent,
    });
  } catch (error) {
    console.error("Error updating stackContent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addStackContent,
  getStackContent,
  updateStackContent,
};
