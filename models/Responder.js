const mongoose = require("mongoose");

const responderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            sparse: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        availability: {
            type: String,
            enum: [
                "Available",
                "Unavailable",
                "On Duty"
            ],
            default: "Available"
        },

        status: {
            type: String,
            enum: [
                "Active",
                "Inactive"
            ],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Responder",
    responderSchema
);