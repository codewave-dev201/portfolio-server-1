const Projects = require('../models/ProjectModel');
const cloudinary = require('cloudinary').v2;

const addProject = async (req, res) => {
    try {
        const { title, description, previewLink } = req.body;
        const imageUrl = req.file.path;

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        if (!title || !description || !previewLink || !imageUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newProject = new Projects({
            title,
            description,
            previewLink,
            imageUrl,
        });

        await newProject.save();

        res.status(200).json({ message: "New project has been added successfully", project: newProject });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const editProject = async (req, res) => {
    try {
        const { title, description, previewLink } = req.body;
        const projectId = req.params.id;
        const imageFile = req.file;

        const project = await Projects.findById(projectId);

        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path);
            project.imageUrl = result.secure_url;
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.previewLink = previewLink || project.previewLink;

        await project.save();
        return res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while updating the project' });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Projects.find();
        return res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching projects' });
    }
};

module.exports = {
    addProject,
    editProject,
    getProjects,
};
