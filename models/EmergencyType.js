const mongoose = require("mongoose");

const emergencyTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "EmergencyType",
    emergencyTypeSchema
);