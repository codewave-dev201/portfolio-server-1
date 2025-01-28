const Service = require('../models/ServiceModel');
const cloudinary = require('cloudinary').v2;

const addService = async (req, res) => {
    try {
        const { service, serviceDesc } = req.body;

        const imageUrl = req.file.path;
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        if (!service || !serviceDesc || !imageUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newService = new Service({
            service,
            serviceDesc,
            imageUrl,
        });

        await newService.save();

        res.status(200).json({ message: "New service has been added successfully", service: newService });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const editService = async (req, res) => {
    try {
        const { service, serviceDesc } = req.body;
        const serviceId = req.params.id;
        const imageFile = req.file;

        const existingService = await Service.findById(serviceId);

        if (!existingService) return res.status(404).json({ message: 'Service not found' });

        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path);
            existingService.imageUrl = result.secure_url;
        }

        existingService.service = service || existingService.service;
        existingService.serviceDesc = serviceDesc || existingService.serviceDesc;

        await existingService.save();
        return res.status(200).json({ message: 'Service updated successfully', service: existingService });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while updating the service' });
    }
};

const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        return res.status(200).json({ services });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching services' });
    }
};

module.exports = {
    addService,
    editService,
    getServices,
};


