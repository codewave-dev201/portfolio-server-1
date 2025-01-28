const Home = require('../models/HomeModel');
const cloudinary = require('cloudinary').v2;
// const cloudinary = require('../config/cloudinary');

const addHome = async (req, res) => {
    try {
        const { 
            welcomeText,
            name,
            homeText, 
            facebook, 
            github,
            linkedIn,
            instagram,
            btnText
        } = req.body;

        const imageUrl = req.file.path; 
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file); 

        if (!welcomeText || !name || !homeText || !imageUrl || !facebook || !github || !linkedIn || !instagram || !btnText) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newHome = new Home({
            welcomeText,
            name,
            imageUrl, 
            homeText, 
            facebook, 
            github,
            linkedIn,
            instagram,
            btnText
        });

        await newHome.save();

        res.status(200).json({ message: "New home has been added successfully", home: newHome });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const editHome = async (req, res) => {
    try {
        const { 
            welcomeText, 
            name, 
            homeText, 
            facebook, 
            github, 
            linkedIn, 
            instagram, 
            btnText 
        } = req.body;
        const homeId = req.params.id;
        const imageFile = req.file;

        const home = await Home.findById(homeId);

        if (!home) return res.status(404).json({ message: 'Home not found' });

        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path);
            home.imageUrl = result.secure_url;
        }

        home.welcomeText = welcomeText || home.welcomeText;
        home.name = name || home.name;
        home.homeText = homeText || home.homeText;
        home.facebook = facebook || home.facebook;
        home.github = github || home.github;
        home.linkedIn = linkedIn || home.linkedIn;
        home.instagram = instagram || home.instagram;
        home.btnText = btnText || home.btnText;

        await home.save();
        return res.status(200).json({ message: 'Home updated successfully', home });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while updating the home' });
    }
};

// const deleteHome = async (req, res) => {
//     try {
//         const homeId = req.params.id; 
//         const home = await Home.findById(homeId); 

//         if (!home) {
//             return res.status(404).json({ message: 'Home not found' });
//         }

//         await Home.findByIdAndDelete(homeId);
//         return res.status(200).json({ message: 'Home deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting home:', error);
//         return res.status(500).json({ error: error.message || 'Server error while deleting the home' });
//     }
// };

const getHome = async (req, res) => {
    try {
        const home = await Home.find();
        return res.status(200).json({ home });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching homes' });
    }
};

module.exports = {
    addHome,
    editHome,
    // deleteHome,
    getHome
};
