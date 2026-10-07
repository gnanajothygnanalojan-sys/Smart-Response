const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
    {
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

        skills: {
            type: String,
            required: true,
            trim: true
        },

        availability: {
            type: String,
            enum: ["Available", "Unavailable", "On Duty"],
            default: "Available"
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);