const ContactDetails = require('../models/ContactDetailsModel');
const cloudinary = require('cloudinary').v2;

const addContactDetails = async (req, res) => {
    try {
        const { header, content, phoneNumber, whatsappNumber, email, address} = req.body;

        // const imageUrl = req.file?.path;
        // console.log("Request Body:", req.body);
        // console.log("Uploaded File:", req.file);

        if (!header || !content || !phoneNumber || !whatsappNumber || !email || !address ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContactDetails = new ContactDetails({
            header,
            content,
            phoneNumber,
            whatsappNumber,
            email,
            address,
            // mapUrl,
            // imageUrl,
        });

        await newContactDetails.save();

        res.status(200).json({ message: "New contact details have been added successfully", contactDetails: newContactDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const editContactDetails = async (req, res) => {
    try {
        const { header, content, phoneNumber, whatsappNumber, email, address, mapUrl } = req.body;
        const contactDetailsId = req.params.id;
        // const imageFile = req.file;

        const existingContactDetails = await ContactDetails.findById(contactDetailsId);

        if (!existingContactDetails) {
            return res.status(404).json({ message: 'Contact details not found' });
        }

        // if (imageFile) {
        //     const result = await cloudinary.uploader.upload(imageFile.path);
        //     existingContactDetails.imageUrl = result.secure_url;
        // }

        existingContactDetails.header = header || existingContactDetails.header;
        existingContactDetails.content = content || existingContactDetails.content;
        existingContactDetails.phoneNumber = phoneNumber || existingContactDetails.phoneNumber;
        existingContactDetails.whatsappNumber = whatsappNumber || existingContactDetails.whatsappNumber;
        existingContactDetails.email = email || existingContactDetails.email;
        existingContactDetails.address = address || existingContactDetails.address;
        // existingContactDetails.mapUrl = mapUrl || existingContactDetails.mapUrl;

        await existingContactDetails.save();
        return res.status(200).json({ message: 'Contact details updated successfully', contactDetails: existingContactDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while updating the contact details' });
    }
};

const getContactDetails = async (req, res) => {
    try {
        const contactDetails = await ContactDetails.find();
        return res.status(200).json({ contactDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching contact details' });
    }
};

module.exports = {
    addContactDetails,
    editContactDetails,
    getContactDetails,
};
