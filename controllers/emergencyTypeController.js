const EmergencyType = require("../models/EmergencyType");

// CREATE
const createEmergencyType = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Please provide name and description"
            });
        }

        const existingType = await EmergencyType.findOne({ name });

        if (existingType) {
            return res.status(400).json({
                message: "Emergency type already exists"
            });
        }

        const emergencyType = await EmergencyType.create({
            name,
            description
        });

        res.status(201).json({
            message: "Emergency type created successfully",
            emergencyType
        });

    } catch (error) {
        console.error("Create emergency type error:", error.message);

        res.status(500).json({
            message: "Server error while creating emergency type"
        });
    }
};


// READ
const getEmergencyTypes = async (req, res) => {
    try {
        const emergencyTypes = await EmergencyType.find({
            status: "Active"
        }).sort({ createdAt: -1 });

        res.status(200).json({
            emergencyTypes
        });

    } catch (error) {
        console.error("Get emergency types error:", error.message);

        res.status(500).json({
            message: "Server error while retrieving emergency types"
        });
    }
};


// READ ONE
const getEmergencyTypeById = async (req, res) => {
    try {
        const emergencyType = await EmergencyType.findById(
            req.params.id
        );

        if (!emergencyType) {
            return res.status(404).json({
                message: "Emergency type not found"
            });
        }

        res.status(200).json({
            emergencyType
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while retrieving emergency type"
        });
    }
};


// UPDATE
const updateEmergencyType = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const emergencyType = await EmergencyType.findById(
            req.params.id
        );

        if (!emergencyType) {
            return res.status(404).json({
                message: "Emergency type not found"
            });
        }

        if (name !== undefined) {
            emergencyType.name = name;
        }

        if (description !== undefined) {
            emergencyType.description = description;
        }

        if (status !== undefined) {
            emergencyType.status = status;
        }

        await emergencyType.save();

        res.status(200).json({
            message: "Emergency type updated successfully",
            emergencyType
        });

    } catch (error) {
        console.error("Update emergency type error:", error.message);

        res.status(500).json({
            message: "Server error while updating emergency type"
        });
    }
};


// DELETE
const deleteEmergencyType = async (req, res) => {
    try {
        const emergencyType = await EmergencyType.findById(
            req.params.id
        );

        if (!emergencyType) {
            return res.status(404).json({
                message: "Emergency type not found"
            });
        }

        emergencyType.status = "Inactive";

        await emergencyType.save();

        res.status(200).json({
            message: "Emergency type deleted successfully"
        });

    } catch (error) {
        console.error("Delete emergency type error:", error.message);

        res.status(500).json({
            message: "Server error while deleting emergency type"
        });
    }
};


module.exports = {
    createEmergencyType,
    getEmergencyTypes,
    getEmergencyTypeById,
    updateEmergencyType,
    deleteEmergencyType
};