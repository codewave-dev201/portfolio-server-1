const Footer = require('../models/FooterModel');

const addFooter = async (req, res) => {
    try {
        const { 
            facebook, 
            instagram, 
            github, 
            whatsapp, 
            linkedin, 
            twitter, 
            tiktok 
        } = req.body;

        console.log("Request Body:", req.body);

        if (!facebook || !instagram || !github || !whatsapp || !linkedin || !twitter || !tiktok) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newFooter = new Footer({
            facebook,
            instagram,
            github,
            whatsapp,
            linkedin,
            twitter,
            tiktok,
        });

        await newFooter.save();

        res.status(200).json({ message: "Footer details added successfully", footer: newFooter });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const editFooter = async (req, res) => {
    try {
        const { 
            facebook, 
            instagram, 
            github, 
            whatsapp, 
            linkedin, 
            twitter, 
            tiktok 
        } = req.body;
        const footerId = req.params.id;

        const footer = await Footer.findById(footerId);

        if (!footer) {
            return res.status(404).json({ message: 'Footer details not found' });
        }

        footer.facebook = facebook || footer.facebook;
        footer.instagram = instagram || footer.instagram;
        footer.github = github || footer.github;
        footer.whatsapp = whatsapp || footer.whatsapp;
        footer.linkedin = linkedin || footer.linkedin;
        footer.twitter = twitter || footer.twitter;
        footer.tiktok = tiktok || footer.tiktok;

        await footer.save();
        return res.status(200).json({ message: 'Footer details updated successfully', footer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while updating footer details' });
    }
};

const getFooter = async (req, res) => {
    try {
        const footer = await Footer.find();
        return res.status(200).json({ footer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching footer details' });
    }
};

module.exports = {
    addFooter,
    editFooter,
    getFooter,
};
