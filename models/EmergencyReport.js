const mongoose = require("mongoose");

const emergencyReportSchema = new mongoose.Schema(
    {
        citizen: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        emergencyType: {
            type: String,
            enum: [
                "Accident",
                "Fire",
                "Flood",
                "Medical Emergency",
                "Other Disaster"
            ],
            required: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Reported",
                "Under Review",
                "Assigned",
                "In Progress",
                "Resolved",
                "Closed"
            ],
            default: "Reported"
        },

        assignedResponder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Responder",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "EmergencyReport",
    emergencyReportSchema
);