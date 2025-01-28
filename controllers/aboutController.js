const About = require('../models/AboutModel'); // Changed from HomeModel to AboutModel
const cloudinary = require('cloudinary').v2; // Cloudinary remains if needed for other uses
// const upload = require('../middlewares/multerMiddleware');
const addAbout = async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            phone,
            email,
            age,
            nickname,
            town,
            languages,
            yearsOfExperience,
            completedProjects,
            happyCustomers,
            awardsWon
        } = req.body;
        const cvUrl = req.file.path; 

        if (!firstName || !lastName || !phone || !email || !age || !languages || !yearsOfExperience || !completedProjects || !happyCustomers || !awardsWon || !cvUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newAbout = new About({
            firstName,
            lastName,
            phone,
            email,
            age,
            nickname,
            town,
            languages,
            yearsOfExperience,
            completedProjects,
            happyCustomers,
            awardsWon,
            cvUrl,
        });

        await newAbout.save();

        res.status(200).json({ message: "New about information has been added successfully", about: newAbout });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const editAbout = async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            phone,
            email,
            age,
            nickname,
            town,
            languages,
            yearsOfExperience,
            completedProjects,
            happyCustomers,
            awardsWon
        } = req.body;


        const aboutId = req.params.id;
        const cvUrl = req.file;

        const About = await About.findById(aboutId);

        if (cvFile) {
            const result = await cloudinary.uploader.upload(imageFile.path);
            about.cvUrl = result.secure_url;
        }

        about.firstName = firstName || about.firstName;
        about.lastName = lastName || about.lastName;
        about.phone = phone || about.phone;
        about.email = email || about.email;
        about.age = age || about.age;
        about.nickname = nickname || about.nickname;
        about.town = town || about.town;
        about.languages = languages || about.languages;
        about.yearsOfExperience = yearsOfExperience || about.yearsOfExperience;
        about.completedProjects = completedProjects || about.completedProjects;
        about.happyCustomers = happyCustomers || about.happyCustomers;
        about.awardsWon = awardsWon || about.awardsWon;

        await about.save();
        return res.status(200).json({ message: 'About information updated successfully', about });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while updating the about information' });
    }
};

const getAbout = async (req, res) => {
    try {
        const about = await About.find();
        return res.status(200).json({ about });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching about information' });
    }
};

module.exports = {
    addAbout,
    editAbout,
    getAbout
};
