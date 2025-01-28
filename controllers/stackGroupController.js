const StackContent = require("../models/StackGroupSchema");
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
