const Responder = require("../models/Responder");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// CREATE RESPONDER
const createResponder = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            department,
            password
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !department ||
            !password
        ) {
            return res.status(400).json({
                message: "Please provide all responder details"
            });
        }

        // Check whether email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists"
            });
        }

        const existingResponder = await Responder.findOne({
            email: email.toLowerCase()
        });

        if (existingResponder) {
            return res.status(400).json({
                message: "A responder with this email already exists"
            });
        }

        // Create login account
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            role: "responder",
            status: "active",
            availability: "Available"
        });

        // Create responder profile
        const responder = await Responder.create({
            user: user._id,
            name,
            email: email.toLowerCase(),
            phone,
            department,
            availability: "Available",
            status: "Active"
        });

        res.status(201).json({
            message: "Responder and login account created successfully",
            responder
        });

    } catch (error) {

        console.error(
            "Create responder error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating responder"
        });
    }
};


// GET ALL ACTIVE RESPONDERS
const getResponders = async (req, res) => {
    try {

        const responders = await Responder.find({
            status: "Active"
        })
        .populate(
            "user",
            "name email phone role status"
        )
        .sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Responders retrieved successfully",
            responders
        });

    } catch (error) {

        console.error(
            "Get responders error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while retrieving responders"
        });
    }
};


// GET SINGLE RESPONDER
const getResponderById = async (req, res) => {
    try {

        const responder =
            await Responder.findById(req.params.id)
            .populate(
                "user",
                "name email phone role status"
            );

        if (!responder) {
            return res.status(404).json({
                message: "Responder not found"
            });
        }

        res.status(200).json({
            responder
        });

    } catch (error) {

        console.error(
            "Get responder error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while retrieving responder"
        });
    }
};


// UPDATE RESPONDER
const updateResponder = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            department,
            availability,
            status
        } = req.body;

        const responder =
            await Responder.findById(req.params.id);

        if (!responder) {
            return res.status(404).json({
                message: "Responder not found"
            });
        }

        if (name !== undefined) {
            responder.name = name;
        }

        if (email !== undefined) {
            responder.email = email.toLowerCase();
        }

        if (phone !== undefined) {
            responder.phone = phone;
        }

        if (department !== undefined) {
            responder.department = department;
        }

        if (availability !== undefined) {
            responder.availability = availability;
        }

        if (status !== undefined) {
            responder.status = status;
        }

        await responder.save();

        // Update linked User account too
        if (responder.user) {

            const user =
                await User.findById(responder.user);

            if (user) {

                user.name = responder.name;
                user.email = responder.email;
                user.phone = responder.phone;

                if (responder.status === "Inactive") {
                    user.status = "inactive";
                } else {
                    user.status = "active";
                }

                await user.save();
            }
        }

        res.status(200).json({
            message: "Responder updated successfully",
            responder
        });

    } catch (error) {

        console.error(
            "Update responder error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while updating responder"
        });
    }
};


// DEACTIVATE RESPONDER
const deleteResponder = async (req, res) => {
    try {

        const responder =
            await Responder.findById(req.params.id);

        if (!responder) {
            return res.status(404).json({
                message: "Responder not found"
            });
        }

        responder.status = "Inactive";
        responder.availability = "Unavailable";

        await responder.save();

        // Deactivate login account too
        if (responder.user) {

            await User.findByIdAndUpdate(
                responder.user,
                {
                    status: "inactive"
                }
            );
        }

        res.status(200).json({
            message: "Responder deactivated successfully"
        });

    } catch (error) {

        console.error(
            "Delete responder error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while deactivating responder"
        });
    }
};


const getMyResponderProfile = async (req, res) => {
    try {

        const responder = await Responder.findOne({
            user: req.user.id
        }).populate(
            "user",
            "name email phone role status"
        );

        if (!responder) {
            return res.status(404).json({
                message: "Responder profile not found"
            });
        }

        res.status(200).json({
            responder
        });

    } catch (error) {

        console.error(
            "Get my responder profile error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while retrieving responder profile"
        });

    }
};

module.exports = {
    createResponder,
    getResponders,
    getResponderById,
    updateResponder,
    deleteResponder,
    getMyResponderProfile
};