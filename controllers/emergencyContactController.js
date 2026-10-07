const EmergencyContact = require("../models/EmergencyContact");

// CREATE
const createEmergencyContact = async (req, res) => {
    try {
        const {
            name,
            service,
            phone,
            description
        } = req.body;

        if (!name || !service || !phone) {
            return res.status(400).json({
                message: "Please provide name, service and phone"
            });
        }

        const contact = await EmergencyContact.create({
            name,
            service,
            phone,
            description
        });

        res.status(201).json({
            message: "Emergency contact created successfully",
            contact
        });

    } catch (error) {
        console.error(
            "Create emergency contact error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating emergency contact"
        });
    }
};


// READ
const getEmergencyContacts = async (req, res) => {
    try {
        const emergencyContacts = await EmergencyContact.find({
            status: "Active"
        }).sort({ createdAt: -1 });

        res.status(200).json({
            emergencyContacts
        });

    } catch (error) {
        console.error(
            "Get emergency contacts error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while retrieving emergency contacts"
        });
    }
};


// READ ONE
const getEmergencyContactById = async (req, res) => {
    try {
        const contact = await EmergencyContact.findById(
            req.params.id
        );

        if (!contact) {
            return res.status(404).json({
                message: "Emergency contact not found"
            });
        }

        res.status(200).json({
            contact
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while retrieving emergency contact"
        });
    }
};


// UPDATE
const updateEmergencyContact = async (req, res) => {
    try {
        const {
            name,
            service,
            phone,
            description,
            status
        } = req.body;

        const contact = await EmergencyContact.findById(
            req.params.id
        );

        if (!contact) {
            return res.status(404).json({
                message: "Emergency contact not found"
            });
        }

        if (name !== undefined) {
            contact.name = name;
        }

        if (service !== undefined) {
            contact.service = service;
        }

        if (phone !== undefined) {
            contact.phone = phone;
        }

        if (description !== undefined) {
            contact.description = description;
        }

        if (status !== undefined) {
            contact.status = status;
        }

        await contact.save();

        res.status(200).json({
            message: "Emergency contact updated successfully",
            contact
        });

    } catch (error) {
        console.error(
            "Update emergency contact error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while updating emergency contact"
        });
    }
};


// DELETE
const deleteEmergencyContact = async (req, res) => {
    try {
        const contact = await EmergencyContact.findById(
            req.params.id
        );

        if (!contact) {
            return res.status(404).json({
                message: "Emergency contact not found"
            });
        }

        contact.status = "Inactive";

        await contact.save();

        res.status(200).json({
            message: "Emergency contact deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete emergency contact error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while deleting emergency contact"
        });
    }
};


module.exports = {
    createEmergencyContact,
    getEmergencyContacts,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact
};