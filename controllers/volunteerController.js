const Volunteer = require("../models/Volunteer");

// CREATE VOLUNTEER
const createVolunteer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            skills,
            availability
        } = req.body;

        if (!name || !email || !phone || !skills) {
            return res.status(400).json({
                message: "Please provide name, email, phone and skills"
            });
        }

        const existingVolunteer = await Volunteer.findOne({
            email
        });

        if (existingVolunteer) {
            return res.status(400).json({
                message: "A volunteer with this email already exists"
            });
        }

        const volunteer = await Volunteer.create({
            name,
            email,
            phone,
            skills,
            availability: availability || "Available"
        });

        res.status(201).json({
            message: "Volunteer created successfully",
            volunteer
        });

    } catch (error) {

        console.error(
            "Create volunteer error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating volunteer"
        });
    }
};


// GET ALL VOLUNTEERS
const getVolunteers = async (req, res) => {
    try {

        const volunteers = await Volunteer.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Volunteers retrieved successfully",
            volunteers
        });

    } catch (error) {

        console.error(
            "Get volunteers error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while retrieving volunteers"
        });
    }
};


// GET ONE VOLUNTEER
const getVolunteerById = async (req, res) => {
    try {

        const volunteer = await Volunteer.findById(
            req.params.id
        );

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found"
            });
        }

        res.status(200).json({
            volunteer
        });

    } catch (error) {

        console.error(
            "Get volunteer error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while retrieving volunteer"
        });
    }
};


// UPDATE VOLUNTEER
const updateVolunteer = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            skills,
            availability,
            status
        } = req.body;

        const volunteer = await Volunteer.findById(
            req.params.id
        );

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found"
            });
        }

        if (name !== undefined) {
            volunteer.name = name;
        }

        if (email !== undefined) {
            volunteer.email = email;
        }

        if (phone !== undefined) {
            volunteer.phone = phone;
        }

        if (skills !== undefined) {
            volunteer.skills = skills;
        }

        if (availability !== undefined) {
            volunteer.availability = availability;
        }

        if (status !== undefined) {
            volunteer.status = status;
        }

        await volunteer.save();

        res.status(200).json({
            message: "Volunteer updated successfully",
            volunteer
        });

    } catch (error) {

        console.error(
            "Update volunteer error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while updating volunteer"
        });
    }
};


// DEACTIVATE VOLUNTEER
const deleteVolunteer = async (req, res) => {
    try {

        const volunteer = await Volunteer.findById(
            req.params.id
        );

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found"
            });
        }

        volunteer.status = "Inactive";
        volunteer.availability = "Unavailable";

        await volunteer.save();

        res.status(200).json({
            message: "Volunteer deactivated successfully",
            volunteer
        });

    } catch (error) {

        console.error(
            "Delete volunteer error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while deactivating volunteer"
        });
    }
};


module.exports = {
    createVolunteer,
    getVolunteers,
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer
};